#!/usr/bin/env python3
"""Simple email relay for Cloudflare Worker -> Gmail SMTP"""
import http.server
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header

SMTP_HOST = "smtp-relay.brevo.com"
SMTP_PORT = 587
# SMTP credentials loaded from environment variables:
#   BREVO_SMTP_USER, BREVO_SMTP_PASSWORD
SMTP_USER = os.environ.get("BREVO_SMTP_USER", "fliptheair@gmail.com")
SMTP_PASS = os.environ.get("BREVO_SMTP_PASSWORD", "")
FROM_EMAIL = "notifications@apposight.com"
TO_EMAIL = "fliptheair@gmail.com"

class RelayHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")
            return

        name = data.get("name", "Unknown")
        email = data.get("email", "No email")
        message = data.get("message", "")
        phone = data.get("phone", "")
        subject = data.get("subject", "Website Contact Form")

        # Build email
        msg = MIMEMultipart("alternative")
        msg["From"] = f"AppoSight Website <{FROM_EMAIL}>"
        msg["To"] = TO_EMAIL
        msg["Subject"] = f"[AppoSight] {subject} from {name}"

        html = f"""
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
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
        </body>
        </html>
        """
        msg.attach(MIMEText(html, "html"))

        try:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
                server.sendmail(FROM_EMAIL, TO_EMAIL, msg.as_string())
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "sent"}).encode())
        except Exception as e:
            self.send_error(500, f"SMTP error: {e}")

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "relay running"}).encode())

    def log_message(self, format, *args):
        print(f"[RELAY] {args[0]}")

if __name__ == "__main__":
    server = http.server.HTTPServer(("127.0.0.1", 8787), RelayHandler)
    print("Email relay listening on :8787")
    server.serve_forever()
