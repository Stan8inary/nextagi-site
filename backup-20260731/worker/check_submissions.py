#!/usr/bin/env python3
"""Check KV for new contact form submissions and send Gmail notifications"""
import json
import os
import smtplib
import subprocess
import sys
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = "smtp-relay.brevo.com"
SMTP_PORT = 587
# SMTP credentials loaded from environment variables
SMTP_USER = os.environ.get("BREVO_SMTP_USER", "fliptheair@gmail.com")
SMTP_PASS = os.environ.get("BREVO_SMTP_PASSWORD", "")
FROM_EMAIL = "notifications@apposight.com"
TO_EMAIL = "fliptheair@gmail.com"
WORKDIR = "/home/nextagi/public_html/worker"
CF_TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")

def kv_get(key):
    """Get a key from Workers KV"""
    result = subprocess.run(
        ["wrangler", "kv", "key", "get", key, "--binding", "CONTACT_FORMS", "--text", "--remote"],
        capture_output=True, text=True, cwd=WORKDIR,
        env={"CLOUDFLARE_API_TOKEN": CF_TOKEN, "PATH": "/home/nextagi/.npm-global/bin:/home/nextagi/.local/bin:/usr/bin:/bin"}
    )
    return result.stdout.strip()

def kv_put(key, value):
    """Put a key in Workers KV"""
    subprocess.run(
        ["wrangler", "kv", "key", "put", key, "--binding", "CONTACT_FORMS", "--remote", "--", value],
        capture_output=True, text=True, cwd=WORKDIR,
        env={"CLOUDFLARE_API_TOKEN": CF_TOKEN, "PATH": "/home/nextagi/.npm-global/bin:/home/nextagi/.local/bin:/usr/bin:/bin"}
    )

def send_email(name, email, message, phone="", subject="Website Inquiry"):
    """Send Gmail notification"""
    msg = MIMEMultipart("alternative")
    msg["From"] = f"AppoSight Website <{FROM_EMAIL}>"
    msg["To"] = TO_EMAIL
    msg["Subject"] = f"[AppoSight] {subject} from {name}"

    html = f"""
    <html><body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1d1d1f; border-bottom: 2px solid #2997ff; padding-bottom: 10px;">
            New Contact Form Submission
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #86868b; width: 100px;"><strong>Name:</strong></td>
                <td style="padding: 8px 0;">{name}</td></tr>
            <tr><td style="padding: 8px 0; color: #86868b;"><strong>Email:</strong></td>
                <td style="padding: 8px 0;"><a href="mailto:{email}">{email}</a></td></tr>
            {f'<tr><td style="padding: 8px 0; color: #86868b;"><strong>Phone:</strong></td><td style="padding: 8px 0;">{phone}</td></tr>' if phone else ''}
            <tr><td style="padding: 8px 0; color: #86868b;"><strong>Message:</strong></td>
                <td style="padding: 8px 0; white-space: pre-wrap;">{message}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #86868b; font-size: 12px;">Sent from AppoSight website contact form</p>
    </body></html>
    """
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(FROM_EMAIL, TO_EMAIL, msg.as_string())
    return True

def main():
    # Get submissions list
    list_raw = kv_get("submissions_list")
    if not list_raw:
        print("No submissions found")
        return 0

    try:
        submissions = json.loads(list_raw)
    except json.JSONDecodeError:
        print("Failed to parse submissions list")
        return 1

    # Get already-emailed IDs
    emailed_raw = kv_get("emailed_ids")
    try:
        emailed_ids = set(json.loads(emailed_raw)) if emailed_raw else set()
    except json.JSONDecodeError:
        emailed_ids = set()

    sent_count = 0
    for sub_summary in submissions:
        sub_id = sub_summary.get("id", "")
        if sub_id in emailed_ids:
            continue

        # Fetch full submission details from KV
        full_sub_raw = kv_get(sub_id)
        if not full_sub_raw:
            print(f"Could not fetch details for {sub_id}")
            continue

        try:
            full_sub = json.loads(full_sub_raw)
        except json.JSONDecodeError:
            print(f"Failed to parse submission {sub_id}")
            continue

        # Send email for this submission
        try:
            send_email(
                name=full_sub.get("name", "Unknown"),
                email=full_sub.get("email", "N/A"),
                message=full_sub.get("message", ""),
                phone=full_sub.get("phone", ""),
                subject=full_sub.get("subject", "Website Inquiry")
            )
            emailed_ids.add(sub_id)
            sent_count += 1
            print(f"Sent email for submission {sub_id} from {full_sub.get('name')}")
        except Exception as e:
            print(f"Failed to send email for {sub_id}: {e}")

    # Update emailed IDs
    if sent_count > 0:
        kv_put("emailed_ids", json.dumps(list(emailed_ids)))
        print(f"Sent {sent_count} email(s), updated tracked IDs")
    else:
        print("No new submissions to email")

    return 0

if __name__ == "__main__":
    sys.exit(main())
