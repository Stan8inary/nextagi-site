const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AppoSight</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --black: #1d1d1f;
            --gray: #86868b;
            --light-gray: #f5f5f7;
            --white: #ffffff;
            --blue: #2997ff;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: var(--black);
            background: var(--white);
            overflow-x: hidden;
        }

        /* Navigation */
        nav {
            position: fixed;
            top: 0;
            width: 100%;
            padding: 14px 40px;
            background: rgba(255,255,255,0.8);
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
            z-index: 100;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 21px;
            font-weight: 600;
            letter-spacing: -0.5px;
        }

        .logo svg {
            height: 32px;
        }

        /* Hexagon logo animation */
        @keyframes hexRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .hex-logo {
            animation: hexRotate 20s linear infinite;
            transform-origin: center;
        }

        .nav-links a {
            color: var(--black);
            text-decoration: none;
            margin-left: 28px;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.3s;
        }

        .nav-links a:hover { opacity: 1; }

        /* Hero Section */
        .hero {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: var(--black);
            color: var(--white);
            padding: 0 20px;
            position: relative;
            overflow: hidden;
        }

        /* Animated background grid */
        .hero::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image:
                linear-gradient(rgba(41,151,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(41,151,255,0.03) 1px, transparent 1px);
            background-size: 60px 60px;
            animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(60px, 60px); }
        }

        .hero h1 {
            font-size: clamp(48px, 10vw, 96px);
            font-weight: 700;
            letter-spacing: -3px;
            line-height: 1.05;
            margin-bottom: 16px;
            position: relative;
            z-index: 1;
        }

        .hero .subtitle {
            font-size: clamp(20px, 3vw, 28px);
            color: var(--gray);
            font-weight: 400;
            margin-bottom: 32px;
            position: relative;
            z-index: 1;
        }

        .hero .cta-links a {
            color: var(--blue);
            text-decoration: none;
            font-size: 21px;
            margin: 0 16px;
            position: relative;
            z-index: 1;
        }

        .hero .cta-links a:after {
            content: " >";
        }

        /* Sections */
        .section {
            padding: 120px 40px;
            text-align: center;
        }

        .section-dark {
            background: var(--black);
            color: var(--white);
        }

        .section-light {
            background: var(--light-gray);
            color: var(--black);
        }

        .section h2 {
            font-size: clamp(40px, 7vw, 72px);
            font-weight: 700;
            letter-spacing: -2px;
            line-height: 1.1;
            margin-bottom: 16px;
        }

        .section p {
            font-size: clamp(18px, 2.5vw, 24px);
            color: var(--gray);
            max-width: 600px;
            margin: 0 auto 40px;
            line-height: 1.4;
        }

        /* Feature Grid */
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 60px auto 0;
            padding: 0 20px;
        }

        .card {
            background: var(--white);
            border-radius: 24px;
            padding: 50px 30px;
            text-align: left;
            transition: transform 0.3s ease;
        }

        .section-dark .card {
            background: #2d2d2f;
        }

        .card:hover {
            transform: scale(1.02);
        }

        .card-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }

        .card h3 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .card p {
            font-size: 17px;
            color: var(--gray);
            margin: 0;
            max-width: none;
            line-height: 1.5;
        }

        /* Big Statement */
        .statement {
            padding: 160px 40px;
            text-align: center;
            background: var(--white);
        }

        .statement h2 {
            font-size: clamp(48px, 8vw, 80px);
            font-weight: 700;
            letter-spacing: -3px;
            line-height: 1.1;
            max-width: 900px;
            margin: 0 auto;
        }

        .statement h2 span {
            color: var(--gray);
        }

        /* About Section */
        .about-content {
            max-width: 800px;
            margin: 40px auto 0;
            text-align: left;
        }

        .about-content p {
            font-size: 21px;
            line-height: 1.6;
            color: var(--gray);
            margin-bottom: 20px;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            margin-top: 60px;
        }

        .stat {
            text-align: center;
        }

        .stat-number {
            font-size: 56px;
            font-weight: 700;
            letter-spacing: -2px;
            color: var(--black);
        }

        .section-dark .stat-number {
            color: var(--white);
        }

        .stat-label {
            font-size: 14px;
            color: var(--gray);
            margin-top: 8px;
        }

        /* Contact Section */
        /* Terminal animation */
        .pentest-terminal {
            max-width: 700px;
            margin: 2rem auto 3rem;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            font-family: 'Courier New', monospace;
        }

        .terminal-header {
            background: #1a1a2e;
            padding: 10px 15px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.85rem;
            color: #888;
        }

        .terminal-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
        }

        .terminal-dot.red { background: #ff5f56; }
        .terminal-dot.yellow { background: #ffbd2e; }
        .terminal-dot.green { background: #27c93f; }

        .terminal-body {
            background: #0a0a1a;
            padding: 20px;
            min-height: 200px;
        }

        .terminal-line {
            margin: 4px 0;
            font-size: 0.85rem;
            line-height: 1.6;
            opacity: 0;
            animation: terminalFadeIn 0.3s ease forwards;
        }

        .terminal-line:nth-child(1) { animation-delay: 0.2s; }
        .terminal-line:nth-child(2) { animation-delay: 0.8s; }
        .terminal-line:nth-child(3) { animation-delay: 1.4s; }
        .terminal-line:nth-child(4) { animation-delay: 2.0s; }
        .terminal-line:nth-child(5) { animation-delay: 2.6s; }
        .terminal-line:nth-child(6) { animation-delay: 3.2s; }
        .terminal-line:nth-child(7) { animation-delay: 3.8s; }
        .terminal-line:nth-child(8) { animation-delay: 4.4s; }
        .terminal-line:nth-child(9) { animation-delay: 5.0s; }
        .terminal-line:nth-child(10) { animation-delay: 5.6s; }
        .terminal-line:nth-child(11) { animation-delay: 6.2s; }
        .terminal-line:nth-child(12) { animation-delay: 6.8s; }
        .terminal-line:nth-child(13) { animation-delay: 7.4s; }
        .terminal-line:nth-child(14) { animation-delay: 8.0s; }

        .terminal-line .prompt {
            color: #00ff88;
        }

        .terminal-line .command {
            color: #00d4ff;
        }

        .terminal-line .output {
            color: #aaa;
        }

        .terminal-line .output.success {
            color: #00ff88;
        }

        @keyframes terminalFadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .contact-section {
            padding: 120px 40px;
            background: var(--white);
            text-align: center;
        }

        .contact-section h2 {
            font-size: clamp(40px, 7vw, 72px);
            font-weight: 700;
            letter-spacing: -2px;
            line-height: 1.1;
            margin-bottom: 16px;
        }

        .contact-section h2 span {
            color: var(--gray);
        }

        .contact-subtitle {
            font-size: clamp(18px, 2.5vw, 24px);
            color: var(--gray);
            max-width: 600px;
            margin: 0 auto 60px;
            line-height: 1.4;
        }

        .contact-form {
            max-width: 620px;
            margin: 0 auto;
            text-align: left;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-group label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: var(--black);
            margin-bottom: 8px;
        }

        .form-group label .optional {
            color: var(--gray);
            font-weight: 400;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 16px 20px;
            font-size: 17px;
            font-family: inherit;
            border: 1px solid #d2d2d7;
            border-radius: 12px;
            background: var(--light-gray);
            color: var(--black);
            transition: border-color 0.3s, box-shadow 0.3s;
            outline: none;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--blue);
            box-shadow: 0 0 0 4px rgba(41,151,255,0.1);
            background: var(--white);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
            color: #c7c7cc;
        }

        .form-group textarea {
            min-height: 160px;
            resize: vertical;
            line-height: 1.5;
        }

        .form-submit {
            text-align: center;
            margin-top: 32px;
        }

        .form-submit button {
            display: inline-block;
            padding: 16px 48px;
            font-size: 17px;
            font-weight: 500;
            font-family: inherit;
            color: var(--white);
            background: var(--blue);
            border: none;
            border-radius: 980px;
            cursor: pointer;
            transition: background 0.3s, transform 0.1s;
        }

        .form-submit button:hover {
            background: #0077ed;
        }

        .form-submit button:active {
            transform: scale(0.98);
        }

        .form-submit button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .form-message {
            text-align: center;
            margin-top: 24px;
            font-size: 17px;
            min-height: 24px;
        }

        .form-message.success {
            color: #34c759;
        }

        .form-message.error {
            color: #ff3b30;
        }

        /* Footer */
        footer {
            background: var(--light-gray);
            padding: 40px;
            text-align: center;
            font-size: 12px;
            color: var(--gray);
            border-top: 1px solid #d2d2d7;
        }

        /* Animations */
        .fade-in {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Glow effect */
        .glow {
            position: absolute;
            width: 600px;
            height: 600px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(41,151,255,0.08) 0%, transparent 70%);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
        }

        /* Responsive */
        @media (max-width: 600px) {
            .form-row {
                grid-template-columns: 1fr;
                gap: 0;
            }

            nav {
                padding: 14px 20px;
            }

            .section, .contact-section {
                padding: 80px 20px;
            }
        }
    </style>
</head>
<body>
    <nav>
        <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5" class="hex-logo"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
        </div>
        <div class="nav-links">
            <a href="#about">About</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#pentest">Pentest</a>
            <a href="#contact">Contact</a>
        </div>
    </nav>

    <section class="hero">
        <div class="glow"></div>
        <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width: 80px; height: 80px; margin-bottom: 2rem; position: relative; z-index: 1;">
            <polygon points="60,10 105,35 105,85 60,110 15,85 15,35" fill="none" stroke="#2997ff" stroke-width="3" class="hex-logo"/>
            <polygon points="60,30 87,45 87,75 60,90 33,75 33,45" fill="#2997ff" opacity="0.2"/>
            <polygon points="60,50 73,57 73,73 60,80 47,73 47,57" fill="#2997ff" opacity="0.4"/>
        </svg>
        <h1 class="fade-in">Intelligence,<br>Reimagined.</h1>
        <p class="subtitle fade-in">Building the future of autonomous AI systems.</p>
        <div class="cta-links fade-in">
            <a href="#about">Explore</a>
            <a href="#contact">Connect</a>
        </div>
    </section>

    <section class="statement fade-in" id="about">
        <h2>Where <span>artificial intelligence</span> meets real-world impact.</h2>
    </section>

    <section class="section section-dark" id="capabilities">
        <h2 class="fade-in">Capabilities</h2>
        <p class="fade-in">End-to-end AI infrastructure, from research to production.</p>
        <div class="grid">
            <div class="card fade-in">
                <div class="card-icon">&#x1f9e0;</div>
                <h3>LLM Fine-tuning</h3>
                <p>Custom models trained on your data. LoRA, QLoRA, full fine-tuning with Unsloth and Axolotl.</p>
            </div>
            <div class="card fade-in">
                <div class="card-icon">&#x1f916;</div>
                <h3>AI Agents</h3>
                <p>Autonomous agents that plan, reason, and execute complex workflows.</p>
            </div>
            <div class="card fade-in">
                <div class="card-icon">&#x26a1;</div>
                <h3>Infrastructure</h3>
                <p>High-performance serving with vLLM, local inference, and scalable deployment.</p>
            </div>
            <div class="card fade-in">
                <div class="card-icon">&#x1f50a;</div>
                <h3>Audio &amp; TTS</h3>
                <p>Text-to-speech, audio generation, and multilingual voice synthesis.</p>
            </div>
            <div class="card fade-in">
                <div class="card-icon">&#x1f4ca;</div>
                <h3>Evaluation</h3>
                <p>Rigorous benchmarking and evaluation of language models across tasks.</p>
            </div>
            <div class="card fade-in">
                <div class="card-icon">&#x1f512;</div>
                <h3>Security</h3>
                <p>Enterprise-grade infrastructure with automated backups and monitoring.</p>
            </div>
        </div>
    </section>

    <section class="section section-light">
        <h2 class="fade-in">Built for Scale</h2>
        <p class="fade-in">From local experiments to production systems. Every layer designed for performance.</p>
    </section>

    <section class="section section-dark" id="pentest">
        <h2 class="fade-in">AI Penetration Testing</h2>
        <p class="fade-in">Autonomous red team operations powered by AI agents.</p>
        <div class="pentest-terminal fade-in">
            <div class="terminal-header">
                <span class="terminal-dot red"></span>
                <span class="terminal-dot yellow"></span>
                <span class="terminal-dot green"></span>
                <span>ai-pentest-agent</span>
            </div>
            <div class="terminal-body" id="terminalBody">
                <div class="terminal-line"><span class="prompt">agent@apposight:~$</span> <span class="command" id="cmd0">recon --target target.com --scan full</span></div>
                <div class="terminal-line"><span class="output">[+] Scanning 1000 ports on target.com...</span></div>
                <div class="terminal-line"><span class="output">[+] Open ports: 22, 80, 443, 8080, 3306</span></div>
                <div class="terminal-line"><span class="prompt">agent@apposight:~$</span> <span class="command" id="cmd1">fingerprint --ports 22,80,443,8080,3306</span></div>
                <div class="terminal-line"><span class="output">[+] SSH 22: OpenSSH 8.9 (Ubuntu 22.04)</span></div>
                <div class="terminal-line"><span class="output">[+] HTTP 80: Apache 2.4.54</span></div>
                <div class="terminal-line"><span class="output">[+] HTTPS 443: Nginx 1.18.0</span></div>
                <div class="terminal-line"><span class="output">[+] HTTP 8080: Tomcat 9.0.65</span></div>
                <div class="terminal-line"><span class="output">[+] MySQL 3306: 8.0.32</span></div>
                <div class="terminal-line"><span class="prompt">agent@apposight:~$</span> <span class="command" id="cmd2">exploit --chain --depth 3</span></div>
                <div class="terminal-line"><span class="output">[+] CVE-2023-44487: Path traversal on Tomcat</span></div>
                <div class="terminal-line"><span class="output">[+] Lateral movement: SSH key found → DB server</span></div>
                <div class="terminal-line"><span class="output">[+] Privilege escalation: kernel exploit → root</span></div>
                <div class="terminal-line"><span class="output success">[✓] Assessment complete. 3 critical, 5 high findings.</span></div>
            </div>
        </div>
        <div class="grid">
            <div class="card fade-in">
                <div class="card-icon">&#x1f50d;</div>
                <h3>Automated Recon</h3>
                <p>Subdomain enumeration, port scanning, and service fingerprinting with AI-driven target prioritization.</p>
            </div>
            <div class="card fade-in">
                <div class="card-icon">&#x1f4a5;</div>
                <h3>Exploit Chaining</h3>
                <p>AI agents that chain vulnerabilities together to achieve deeper access and demonstrate real-world impact.</p>
            </div>
            <div class="card fade-in">
                <div class="card-icon">&#x1f4cb;</div>
                <h3>Report Generation</h3>
                <p>Automated vulnerability reports with risk scoring, remediation guidance, and executive summaries.</p>
            </div>
            <div class="card fade-in">
                <div class="card-icon">&#x1f50d;</div>
                <h3>Continuous Monitoring</h3>
                <p>Ongoing threat detection and security posture assessment with real-time alerting.</p>
            </div>
        </div>
    </section>

    <section class="contact-section fade-in" id="contact">
        <h2>Let's build the <span>future together.</span></h2>
        <p class="contact-subtitle">Have a project in mind? We'd love to hear from you.</p>

        <form class="contact-form" id="contactForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Your name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="you@example.com" required>
                </div>
            </div>
            <div class="form-group">
                <label for="phone">Phone <span class="optional">(optional)</span></label>
                <input type="tel" id="phone" name="phone" placeholder="+1 (555) 000-0000">
            </div>
            <div class="form-group">
                <label for="message">Business Inquiry</label>
                <textarea id="message" name="message" placeholder="Tell us about your project, goals, or how we can help..." required></textarea>
            </div>
            <div class="form-submit">
                <button type="submit" id="submitBtn">Send Inquiry</button>
            </div>
            <div class="form-message" id="formMessage"></div>
        </form>
    </section>

    <footer>
        <p>Copyright &copy; 2026 AppoSight. All rights reserved.</p>
    </footer>

    <script>
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

        // Fallback: make all elements visible after 2s if observer didn't trigger
        setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
        }, 2000);

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Contact form handler
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const formMessage = document.getElementById('formMessage');

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic client-side validation
            if (!name || !email || !message) {
                formMessage.textContent = 'Please fill in all required fields.';
                formMessage.className = 'form-message error';
                return;
            }

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formMessage.textContent = '';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, message })
                });

                const data = await response.json();

                if (response.ok) {
                    form.reset();
                    formMessage.textContent = "Thank you! We'll get back to you soon.";
                    formMessage.className = 'form-message success';
                } else {
                    formMessage.textContent = data.error || 'Something went wrong. Please try again.';
                    formMessage.className = 'form-message error';
                }
            } catch (err) {
                formMessage.textContent = 'Network error. Please try again later.';
                formMessage.className = 'form-message error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Inquiry';
            }
        });
    </script>
    <!-- Cloudflare Web Analytics -->
    <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "26761d7f00d14fd9a5df247edbbc65df"}'></script>
    <!-- End Cloudflare Web Analytics -->
</body>
</html>`;
const ADMIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AppoSight Admin - Inquiries</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f7; color: #1d1d1f; padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; }
        h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .subtitle { color: #86868b; font-size: 14px; margin-bottom: 24px; }
        .card { background: #fff; border-radius: 12px; padding: 20px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .card-name { font-weight: 600; font-size: 17px; }
        .card-time { color: #86868b; font-size: 13px; }
        .card-email { color: #2997ff; font-size: 14px; margin-bottom: 4px; }
        .card-phone { color: #86868b; font-size: 13px; margin-bottom: 8px; }
        .card-message { background: #f5f5f7; border-radius: 8px; padding: 12px; font-size: 14px; line-height: 1.5; white-space: pre-wrap; }
        .card-actions { margin-top: 12px; display: flex; gap: 8px; }
        .btn { padding: 6px 14px; border-radius: 6px; border: none; font-size: 13px; cursor: pointer; font-weight: 500; }
        .btn-delete { background: #ff3b30; color: #fff; }
        .btn-delete:hover { background: #d63026; }
        .btn-expand { background: #e8e8ed; color: #1d1d1f; }
        .empty { text-align: center; padding: 60px 20px; color: #86868b; }
        .stats { display: flex; gap: 16px; margin-bottom: 24px; }
        .stat-card { background: #fff; border-radius: 12px; padding: 16px 24px; flex: 1; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .stat-num { font-size: 32px; font-weight: 700; }
        .stat-label { font-size: 13px; color: #86868b; margin-top: 4px; }
        .loading { text-align: center; padding: 40px; color: #86868b; }
        .error { background: #fff; border-radius: 12px; padding: 20px; text-align: center; color: #ff3b30; }
        .toast { position: fixed; bottom: 20px; right: 20px; background: #1d1d1f; color: #fff; padding: 12px 20px; border-radius: 8px; font-size: 14px; opacity: 0; transition: opacity 0.3s; }
        .toast.show { opacity: 1; }
    </style>
</head>
<body>
    <div class="container">
        <h1>AppoSight Admin</h1>
        <p class="subtitle">Contact Form Inquiries</p>
        <div class="stats" id="stats"></div>
        <div id="list">
            <div class="loading">Loading inquiries...</div>
        </div>
    </div>
    <div class="toast" id="toast"></div>
    <script>
        const AUTH = btoa('admin:' + atob(sessionStorage.getItem('admin_pw') || 'PLACEHOLDER').replace('PLACEHOLDER',''));
        async function loadSubmissions() {
            try {
                const res = await fetch('/api/admin/submissions', {
                    headers: { 'Authorization': 'Basic ' + sessionStorage.getItem('admin_token') }
                });
                if (res.status === 401) { sessionStorage.removeItem('admin_token'); location.reload(); return; }
                const data = await res.json();
                render(data.submissions || []);
            } catch (e) {
                document.getElementById('list').innerHTML = '<div class="error">Failed to load submissions: ' + e.message + '</div>';
            }
        }
        function render(submissions) {
            const now = new Date();
            const today = submissions.filter(s => new Date(s.timestamp).toDateString() === now.toDateString()).length;
            document.getElementById('stats').innerHTML =
                '<div class="stat-card"><div class="stat-num">' + submissions.length + '</div><div class="stat-label">Total</div></div>' +
                '<div class="stat-card"><div class="stat-num">' + today + '</div><div class="stat-label">Today</div></div>';
            if (submissions.length === 0) {
                document.getElementById('list').innerHTML = '<div class="empty">No inquiries yet.<br>They will appear here when visitors submit the contact form.</div>';
                return;
            }
            const html = submissions.slice().reverse().map(s => {
                const ts = new Date(s.timestamp);
                const ago = timeAgo(ts);
                return '<div class="card" id="sub-' + s.id + '">' +
                    '<div class="card-header"><span class="card-name">' + esc(s.name) + '</span><span class="card-time">' + ago + '</span></div>' +
                    '<div class="card-email">' + esc(s.email) + '</div>' +
                    (s.phone ? '<div class="card-phone">' + esc(s.phone) + '</div>' : '') +
                    '<div class="card-actions">' +
                        '<button class="btn btn-expand" onclick="viewDetail(\'' + s.id + '\')">View Details</button>' +
                        '<button class="btn btn-delete" onclick="deleteSub(\'' + s.id + '\')">Delete</button>' +
                    '</div>' +
                    '<div id="detail-' + s.id + '" style="display:none;margin-top:12px;"></div>' +
                '</div>';
            }).join('');
            document.getElementById('list').innerHTML = html;
        }
        async function viewDetail(id) {
            const el = document.getElementById('detail-' + id);
            if (el.style.display === 'block') { el.style.display = 'none'; return; }
            el.style.display = 'block';
            el.innerHTML = 'Loading...';
            try {
                const res = await fetch('/api/admin/submissions/' + id, {
                    headers: { 'Authorization': 'Basic ' + sessionStorage.getItem('admin_token') }
                });
                const sub = await res.json();
                el.innerHTML = '<div class="card-message">' + esc(sub.message || '') + '</div>' +
                    '<div style="margin-top:8px;font-size:12px;color:#86868b;">IP: ' + (sub.ip||'') + ' | ID: ' + sub.id + '</div>';
            } catch(e) { el.innerHTML = '<div style="color:#ff3b30">Error loading details</div>'; }
        }
        async function deleteSub(id) {
            if (!confirm('Delete this inquiry?')) return;
            try {
                await fetch('/api/admin/submissions/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Basic ' + sessionStorage.getItem('admin_token') }
                });
                document.getElementById('sub-' + id).remove();
                showToast('Deleted');
            } catch(e) { showToast('Delete failed'); }
        }
        function timeAgo(d) {
            const s = Math.floor((Date.now() - d) / 1000);
            if (s < 60) return s + 's ago';
            if (s < 3600) return Math.floor(s/60) + 'm ago';
            if (s < 86400) return Math.floor(s/3600) + 'h ago';
            return Math.floor(s/86400) + 'd ago';
        }
        function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
        function showToast(msg) {
            const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 2000);
        }
        // Handle basic auth prompt
        if (!sessionStorage.getItem('admin_token')) {
            const pw = prompt('Admin password:');
            if (pw === null) { document.body.innerHTML = '<div class="empty">Access denied.</div>'; }
            else { sessionStorage.setItem('admin_token', 'Basic ' + btoa('admin:' + pw)); }
        }
        loadSubmissions();
    </script>
</body>
</html>`;

// --- Helper functions ---

function sanitize(input) {
    if (typeof input !== 'string') return '';
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checkAdminAuth(request, env) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return false;
    }
    const adminPassword = env.ADMIN_PASSWORD || 'apposight2026';
    try {
        const decoded = atob(authHeader.slice(6));
        const [user, pass] = decoded.split(':');
        return user === 'admin' && pass === adminPassword;
    } catch {
        return false;
    }
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Handle API endpoint for contact form
        if (url.pathname === '/api/contact' && request.method === 'POST') {
            return handleContactForm(request, env);
        }

        // Handle admin dashboard
        if (url.pathname === '/admin/' || url.pathname === '/admin') {
            return new Response(ADMIN_HTML, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-store',
                },
            });
        }

        // Handle admin API endpoints
        if (url.pathname.startsWith('/api/admin/')) {
            return handleAdminAPI(request, url, env);
        }

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }

        // Serve HTML for all other routes
        return new Response(HTML_CONTENT, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'bypass',
            },
        });
    },
};

async function handleContactForm(request, env) {
    try {
        const body = await request.json();
        const { name, email, phone, message } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return jsonResponse(
                { error: 'Missing required fields: name, email, and message are required.' },
                400
            );
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return jsonResponse({ error: 'Invalid email address.' }, 400);
        }

        // Sanitize inputs
        const sanitizedName = sanitize(name);
        const sanitizedEmail = sanitize(email);
        const sanitizedPhone = sanitize(phone);
        const sanitizedMessage = sanitize(message);

        // Rate limiting check
        if (env.RATE_LIMIT) {
            const rateKey = `contact_rate:${request.headers.get('cf-connecting-ip') || 'unknown'}`;
            const rateLimitStr = await env.RATE_LIMIT.get(rateKey) || '0';
            const rateLimit = parseInt(rateLimitStr, 10) || 0;
            if (rateLimit >= 10) {
                return jsonResponse({ error: 'Too many requests. Please try again later.' }, 429);
            }
            await env.RATE_LIMIT.put(rateKey, String(rateLimit + 1), { expirationTtl: 1800 });
        }

        // Store submission in KV
        const submissionId = crypto.randomUUID();
        const timestamp = new Date().toISOString();

        const submission = {
            id: submissionId,
            timestamp,
            name: sanitizedName,
            email: sanitizedEmail,
            phone: sanitizedPhone || null,
            message: sanitizedMessage,
            ip: request.headers.get('cf-connecting-ip') || 'unknown',
            user_agent: request.headers.get('user-agent') || 'unknown'
        };

        if (env.CONTACT_FORMS) {
            await env.CONTACT_FORMS.put(submissionId, JSON.stringify(submission));
            const submissionsListRaw = await env.CONTACT_FORMS.get('submissions_list') || '[]';
            const submissionsList = JSON.parse(submissionsListRaw);
            submissionsList.push({
                id: submissionId,
                timestamp,
                name: sanitizedName,
                email: sanitizedEmail
            });
            await env.CONTACT_FORMS.put('submissions_list', JSON.stringify(submissionsList));
        }

        console.log(`New contact from ${sanitizedName} <${sanitizedEmail}> - ID ${submissionId}`);

        // Send email notification to admin via Brevo
        await sendBrevoNotification({
            name: sanitizedName,
            email: sanitizedEmail,
            phone: sanitizedPhone || null,
            message: sanitizedMessage,
        }, env);

        // Send auto-reply to the inquirer
        await sendAutoReply({
            name: sanitizedName,
            email: sanitizedEmail,
        }, env);

        return jsonResponse({
            success: true,
            message: 'Inquiry received successfully.',
            submission_id: submissionId
        });

    } catch (err) {
        console.error('Contact form error:', err);
        return jsonResponse({ error: 'Internal server error. Please try again later.' }, 500);
    }
}

// Send email notification via Brevo API
async function sendBrevoNotification(submission, env) {
    const brevoApiKey = env.BREVO_API_KEY;
    if (!brevoApiKey) {
        console.warn('BREVO_API_KEY not set - email notification skipped');
        return;
    }

    try {
        const phoneLine = submission.phone ? `\nPhone: ${submission.phone}` : '';

        await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': brevoApiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: {
                    name: 'AppoSight Contact Form',
                    email: 'stanley@apposight.com'
                },
                to: [{
                    email: 'apposight@apposight.com',
                    name: 'AppoSight'
                }],
                cc: [{
                    email: 'fliptheair@gmail.com',
                    name: 'Xuning'
                }],
                subject: `New Contact Inquiry from ${submission.name}`,
                htmlContent: `
                    <html>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #1d1d1f; border-bottom: 2px solid #2997ff; padding-bottom: 10px;">
                            New Contact Form Submission
                        </h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px 0; color: #86868b; width: 100px;"><strong>Name:</strong></td>
                                <td style="padding: 8px 0;">${submission.name}</td></tr>
                            <tr><td style="padding: 8px 0; color: #86868b;"><strong>Email:</strong></td>
                                <td style="padding: 8px 0;"><a href="mailto:${submission.email}">${submission.email}</a></td></tr>
                            ${submission.phone ? `<tr><td style="padding: 8px 0; color: #86868b;"><strong>Phone:</strong></td>
                                <td style="padding: 8px 0;">${submission.phone}</td></tr>` : ''}
                            <tr><td style="padding: 8px 0; color: #86868b;"><strong>Message:</strong></td>
                                <td style="padding: 8px 0; white-space: pre-wrap;">${submission.message.replace(/\n/g, '<br>')}</td></tr>
                        </table>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #86868b; font-size: 12px;">Submitted via AppoSight contact form</p>
                    </body>
                    </html>
                `,
            }),
        });
    } catch (err) {
        console.error('Failed to send Brevo notification:', err);
        // Don't fail the form submission if email fails
    }
}

// Send auto-reply to the inquirer via Brevo API
async function sendAutoReply(submission, env) {
    const brevoApiKey = env.BREVO_API_KEY;
    if (!brevoApiKey) {
        console.warn('BREVO_API_KEY not set - auto-reply skipped');
        return;
    }

    try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': brevoApiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: {
                    name: 'AppoSight',
                    email: 'stanley@apposight.com'
                },
                to: [{
                    email: submission.email,
                    name: submission.name
                }],
                subject: 'Thank you for contacting AppoSight',
                htmlContent: `
                    <html>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #1d1d1f; border-bottom: 2px solid #2997ff; padding-bottom: 10px;">
                            Thank You, ${submission.name}!
                        </h2>
                        <p style="color: #86868b; font-size: 16px; line-height: 1.6;">
                            We've received your inquiry and appreciate you reaching out to us.
                        </p>
                        <p style="color: #86868b; font-size: 16px; line-height: 1.6;">
                            Our team will review your message and get back to you within 24-48 hours.
                        </p>
                        <p style="color: #86868b; font-size: 16px; line-height: 1.6;">
                            In the meantime, feel free to explore our capabilities at
                            <a href="https://apposight.com" style="color: #2997ff; text-decoration: none;">apposight.com</a>.
                        </p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #86868b; font-size: 12px;">
                            Best regards,<br>
                            <strong style="color: #1d1d1f;">The AppoSight Team</strong>
                        </p>
                    </body>
                    </html>
                `,
            }),
        });
        console.log(`Auto-reply sent to ${submission.name} <${submission.email}>`);
    } catch (err) {
        console.error('Failed to send auto-reply:', err);
        // Don't fail the form submission if auto-reply fails
    }
}

// Admin API handlers
async function handleAdminAPI(request, url, env) {
    const path = url.pathname;

    // List submissions
    if (path === '/api/admin/submissions' && request.method === 'GET') {
        if (!checkAdminAuth(request, env)) {
            return new Response('Unauthorized', {
                status: 401,
                headers: { 'WWW-Authenticate': 'Basic realm="Admin"' }
            });
        }

        try {
            const listRaw = await env.CONTACT_FORMS.get('submissions_list') || '[]';
            const submissions = JSON.parse(listRaw);
            return jsonResponse({ submissions, count: submissions.length });
        } catch (err) {
            return jsonResponse({ error: 'Failed to load submissions' }, 500);
        }
    }

    // Get single submission
    if (path.startsWith('/api/admin/submissions/') && request.method === 'GET') {
        if (!checkAdminAuth(request, env)) {
            return new Response('Unauthorized', {
                status: 401,
                headers: { 'WWW-Authenticate': 'Basic realm="Admin"' }
            });
        }

        const submissionId = path.split('/').pop();
        try {
            const raw = await env.CONTACT_FORMS.get(submissionId);
            if (!raw) {
                return jsonResponse({ error: 'Submission not found' }, 404);
            }
            return jsonResponse(JSON.parse(raw));
        } catch (err) {
            return jsonResponse({ error: 'Failed to load submission' }, 500);
        }
    }

    // Delete submission
    if (path.startsWith('/api/admin/submissions/') && request.method === 'DELETE') {
        if (!checkAdminAuth(request, env)) {
            return new Response('Unauthorized', {
                status: 401,
                headers: { 'WWW-Authenticate': 'Basic realm="Admin"' }
            });
        }

        const submissionId = path.split('/').pop();
        try {
            await env.CONTACT_FORMS.delete(submissionId);
            // Also remove from list
            const listRaw = await env.CONTACT_FORMS.get('submissions_list') || '[]';
            const submissions = JSON.parse(listRaw);
            const filtered = submissions.filter(s => s.id !== submissionId);
            await env.CONTACT_FORMS.put('submissions_list', JSON.stringify(filtered));
            return jsonResponse({ success: true, deleted: submissionId });
        } catch (err) {
            return jsonResponse({ error: 'Failed to delete submission' }, 500);
        }
    }

    return jsonResponse({ error: 'Admin endpoint not found' }, 404);
}

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });
}
