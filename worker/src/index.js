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

        .logo-link {
            text-decoration: none;
            color: inherit;
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

        /* Hamburger button */
        .hamburger {
            display: none;
            flex-direction: column;
            gap: 5px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            z-index: 110;
        }
        .hamburger span {
            display: block;
            width: 24px;
            height: 2px;
            background: var(--black);
            border-radius: 2px;
            transition: all 0.3s;
        }
        .hamburger.active span:nth-child(1) {
            transform: translateY(7px) rotate(45deg);
        }
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        .hamburger.active span:nth-child(3) {
            transform: translateY(-7px) rotate(-45deg);
        }

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

            .hamburger {
                display: flex;
            }

            .nav-links {
                position: fixed;
                top: 0;
                right: 0;
                width: 260px;
                height: 100vh;
                background: rgba(255,255,255,0.98);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 40px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                z-index: 105;
                box-shadow: -4px 0 24px rgba(0,0,0,0.1);
            }

            .nav-links.open {
                transform: translateX(0);
            }

            .nav-links a {
                margin-left: 0;
                margin-bottom: 24px;
                font-size: 20px;
                opacity: 0.85;
            }

            .section, .contact-section {
                padding: 80px 20px;
            }
        }
    </style>
</head>
<body>
    <nav>
        <a href="/" class="logo-link">
            <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5" class="hex-logo"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
            </div>
        </a>
        <div class="nav-links">
            <a href="/about">About</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#pentest">Pentest</a>
            <a href="/Use-Cases">Use Cases</a>
            <a href="/briefings">Briefings</a>
            <a href="#contact">Contact</a>
        </div>
        <button class="hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
        </button>
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
            <a href="/about">Explore</a>
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
        // Hamburger menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('open');
            });
            // Close menu when clicking a nav link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('open');
                });
            });
        }

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
const ABOUT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About — AppoSight</title>
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
        nav {
            position: fixed; top: 0; width: 100%; padding: 14px 40px;
            background: rgba(255,255,255,0.8);
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
            z-index: 100; display: flex; justify-content: space-between; align-items: center;
        }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; letter-spacing: -0.5px; }
        .logo-link { text-decoration: none; color: inherit; }
        .logo svg { height: 32px; }
        @keyframes hexRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hex-logo { animation: hexRotate 20s linear infinite; transform-origin: center; }
        .nav-links a { color: var(--black); text-decoration: none; margin-left: 28px; font-size: 12px; opacity: 0.8; transition: opacity 0.3s; }
        .nav-links a:hover { opacity: 1; }
        /* Hamburger button */
        .hamburger {
            display: none; flex-direction: column; gap: 5px;
            background: none; border: none; cursor: pointer; padding: 4px; z-index: 110;
        }
        .hamburger span {
            display: block; width: 24px; height: 2px;
            background: var(--black); border-radius: 2px; transition: all 0.3s;
        }
        .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .hero {
            height: 50vh; display: flex; flex-direction: column; justify-content: center;
            align-items: center; text-align: center; background: var(--black); color: var(--white);
            padding: 0 20px; position: relative; overflow: hidden;
        }
        .hero::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background-image: linear-gradient(rgba(41,151,255,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(41,151,255,0.03) 1px, transparent 1px);
            background-size: 60px 60px; animation: gridMove 20s linear infinite;
        }
        @keyframes gridMove { 0% { transform: translate(0, 0); } 100% { transform: translate(60px, 60px); } }
        .hero h1 { font-size: clamp(48px, 10vw, 96px); font-weight: 700; letter-spacing: -3px; line-height: 1.05; margin-bottom: 16px; position: relative; z-index: 1; }
        .hero .subtitle { font-size: clamp(20px, 3vw, 28px); color: var(--gray); font-weight: 400; position: relative; z-index: 1; }
        .about-section { max-width: 820px; margin: 0 auto; padding: 100px 40px 120px; }
        .about-section h2 { font-size: clamp(32px, 5vw, 48px); font-weight: 700; letter-spacing: -1.5px; line-height: 1.15; margin-bottom: 48px; color: var(--black); }
        .about-section p { font-size: 21px; line-height: 1.7; color: #444; margin-bottom: 28px; }
        footer { background: var(--light-gray); padding: 40px; text-align: center; font-size: 12px; color: var(--gray); border-top: 1px solid #d2d2d7; }
        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        @media (max-width: 600px) {
            nav { padding: 14px 20px; }
            .hamburger { display: flex; }
            .nav-links {
                position: fixed; top: 0; right: 0; width: 260px; height: 100vh;
                background: rgba(255,255,255,0.98); backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                display: flex; flex-direction: column; justify-content: center;
                padding: 0 40px; transform: translateX(100%); transition: transform 0.3s ease;
                z-index: 105; box-shadow: -4px 0 24px rgba(0,0,0,0.1);
            }
            .nav-links.open { transform: translateX(0); }
            .nav-links a { margin-left: 0; margin-bottom: 24px; font-size: 20px; opacity: 0.85; }
            .about-section { padding: 80px 20px; }
        }
    </style>
</head>
<body>
    <nav>
        <a href="/" class="logo-link">
        <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5" class="hex-logo"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
        </div>
        </a>
        <div class="nav-links">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/#capabilities">Capabilities</a>
            <a href="/#pentest">Pentest</a>
            <a href="/Use-Cases">Use Cases</a>
            <a href="/briefings">Briefings</a>
            <a href="/#contact">Contact</a>
        </div>
        <button class="hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
        </button>
    </nav>

    <section class="hero">
        <h1 class="fade-in">About.</h1>
        <p class="subtitle fade-in">The person behind the infrastructure.</p>
    </section>

    <section class="about-section">
        <div class="fade-in">
            <h2>Stanley Zheng</h2>
        </div>

        <div class="fade-in">
            <p>I'm an IT operations professional with a background in systems administration — managing IT infrastructure across virtualization, hybrid identity environments, and productivity platforms, with a growing focus on security hardening and threat detection.</p>

            <p>As AI reshapes what technical roles require, I've shifted from executing manual IT and security tasks to building the tools that automate them. AppoSight is where I do this work — designing AI agents that cut manual work from hours to minutes, starting with systems engineering and security, and expanding into networking, project management, operational decision-making, compliance auditing, and cost optimization.</p>

            <p>See how this plays out in practice — <a href="/Use-Cases">View Use Cases</a>.</p>

            <p>I don't just build these agents — I maintain and validate their output, treating reliability as part of the deliverable, not an afterthought.</p>
        </div>
    </section>

    <footer>
        <p>Copyright &copy; 2026 AppoSight. All rights reserved.</p>
    </footer>

    <script>
        // Hamburger menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('open');
            });
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('open');
                });
            });
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        setTimeout(() => { document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible')); }, 2000);
        document.querySelectorAll('a[href^="/#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = this.getAttribute('href');
            });
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

// --- Use Cases Listing Page ---
const USE_CASES_LISTING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Use Cases | AppoSight</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --black: #1d1d1f; --gray: #86868b; --light-gray: #f5f5f7; --white: #ffffff; --blue: #2997ff; --green: #30d158; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--black); background: var(--white); }
        nav { position: fixed; top: 0; width: 100%; padding: 14px 40px; background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); z-index: 100; display: flex; justify-content: space-between; align-items: center; }
        .logo-link { text-decoration: none; color: inherit; display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; }
        .logo-link svg { height: 32px; }
        .nav-links a { color: var(--black); text-decoration: none; margin-left: 28px; font-size: 12px; opacity: 0.8; }
        .hero { min-height: 40vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: var(--black); color: var(--white); padding: 120px 20px 60px; }
        .hero .tag { font-size: 14px; color: var(--blue); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px; }
        .hero h1 { font-size: 48px; font-weight: 700; letter-spacing: -2px; }
        .hero .subtitle { font-size: 18px; color: var(--gray); max-width: 500px; margin-top: 16px; }
        .cases { padding: 80px 40px; max-width: 900px; margin: 0 auto; }
        .case-card { background: var(--light-gray); border-radius: 20px; padding: 48px 40px; margin-bottom: 32px; text-decoration: none; color: inherit; display: flex; justify-content: space-between; align-items: center; transition: transform 0.2s; }
        .case-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
        .case-card .info h2 { font-size: 28px; font-weight: 700; letter-spacing: -1px; margin-bottom: 8px; }
        .case-card .info p { font-size: 16px; color: var(--gray); line-height: 1.5; max-width: 540px; }
        .case-card .metrics { display: flex; gap: 32px; flex-shrink: 0; margin-left: 40px; }
        .case-card .metric { text-align: right; }
        .case-card .metric .value { font-size: 32px; font-weight: 700; color: var(--blue); }
        .case-card .metric .label { font-size: 12px; color: var(--gray); margin-top: 2px; }
        .arrow { font-size: 24px; color: var(--blue); margin-left: 24px; }
        footer { text-align: center; padding: 40px 20px; font-size: 12px; color: var(--gray); border-top: 1px solid var(--light-gray); }
        footer a { color: var(--blue); text-decoration: none; }
        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }

        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; z-index: 110; }
        .hamburger span { display: block; width: 24px; height: 2px; background: var(--black); border-radius: 2px; transition: all 0.3s; }
        .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        @media (max-width: 600px) {
            nav { padding: 14px 20px; }
            .hamburger { display: flex; }
            .nav-links { position: fixed; top: 0; right: 0; width: 260px; height: 100vh; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: flex; flex-direction: column; justify-content: center; padding: 0 40px; transform: translateX(100%); transition: transform 0.3s ease; z-index: 105; box-shadow: -4px 0 24px rgba(0,0,0,0.1); }
            .nav-links.open { transform: translateX(0); }
            .nav-links a { margin-left: 0; margin-bottom: 24px; font-size: 20px; opacity: 0.85; }
            .hero { min-height: 50vh; padding: 100px 20px 60px; }
            .hero h1 { font-size: 36px; }
            .hero .subtitle { font-size: 16px; }
            .cases { padding: 40px 16px; }
            .case-card { flex-direction: column; align-items: flex-start; padding: 28px 24px; gap: 20px; }
            .case-card .info { width: 100%; }
            .case-card .info h2 { font-size: 22px; }
            .case-card .info p { max-width: 100%; font-size: 15px; }
            .case-card .metrics { margin-left: 0; width: 100%; justify-content: space-around; gap: 16px; }
            .case-card .metric { text-align: center; }
            .arrow { display: none; }
        }

        .logo-link { text-decoration: none; color: inherit; }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; letter-spacing: -0.5px; }
        .logo svg { height: 32px; }
        @keyframes hexRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hex-logo { animation: hexRotate 20s linear infinite; transform-origin: center; }
    </style>
</head>
<body>
    <nav>
        <a href="/" class="logo-link">
            <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5" class="hex-logo"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
            </div>
        </a>
        <div class="nav-links">
            <a href="/about">About</a>
            <a href="/#capabilities">Capabilities</a>
            <a href="/#pentest">Pentest</a>
            <a href="/Use-Cases">Use Cases</a>
            <a href="/briefings">Briefings</a>
            <a href="/#contact">Contact</a>
        </div>
        <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </nav>
    <section class="hero">
        <div class="tag fade-in">Use Cases</div>
        <h1 class="fade-in">Real Problems,<br>Real Solutions</h1>
        <p class="subtitle fade-in">Infrastructure automation and security compliance — built, tested, documented.</p>
    </section>
    <section class="cases">
        <a href="/use-cases/entrasync" class="case-card fade-in">
            <div class="info"><h2>Event-Driven Azure AD Sync</h2><p>Cutting identity sync latency from 30 minutes to seconds using event-triggered automation on Windows Server.</p></div>
            <div class="metrics"><div class="metric"><div class="value">&lt;10s</div><div class="label">Sync latency</div></div><div class="metric"><div class="value">0</div><div class="label">Empty cycles</div></div></div>
            <span class="arrow">→</span>
        </a>
        <a href="/use-cases/cis-benchmark-auditor" class="case-card fade-in">
            <div class="info"><h2>CIS Benchmark Compliance Auditor</h2><p>Automated, read-only compliance auditing for Windows Domain Controllers — 60 CIS Level 1 controls evaluated in 6.3 seconds.</p></div>
            <div class="metrics"><div class="metric"><div class="value">6.3s</div><div class="label">Scan time</div></div><div class="metric"><div class="value">60</div><div class="label">Controls</div></div></div>
            <span class="arrow">→</span>
        </a>
        <a href="/use-cases/entra-cis-v2" class="case-card fade-in">
            <div class="info"><h2>Entra ID CIS Benchmark Audit — v2</h2><p>The v1 auditor extended to the cloud tenant — deterministic Graph API auditing on a Developer Program tenant, with an honest record of what the platform allowed and where it drew the line.</p></div>
            <div class="metrics"><div class="metric"><div class="value">2 → 0</div><div class="label">Weak MFA methods</div></div><div class="metric"><div class="value">204</div><div class="label">Fix verified</div></div></div>
            <span class="arrow">→</span>
        </a>
        <a href="/use-cases/ad-onboarding" class="case-card fade-in">
            <div class="info"><h2>Hybrid AD ↔ Entra Onboarding / Offboarding</h2><p>A deterministic, role-driven pipeline across on-prem AD and Microsoft Entra ID — human checkpoints for the judgment calls, and a complete audit trail.</p></div>
            <div class="metrics"><div class="metric"><div class="value">7 / 7</div><div class="label">Groups assigned</div></div><div class="metric"><div class="value">30</div><div class="label">Audit events</div></div></div>
            <span class="arrow">→</span>
        </a>
        <a href="/use-cases/dc-azure-deployment" class="case-card fade-in">
            <div class="info"><h2>Domain Controller in Azure — Built with an AI Agent</h2><p>An AI agent extended our on-prem Active Directory into the cloud — provisioning, networking, and validating a new, additional domain controller, with a human approving every credentialed step.</p></div>
            <div class="metrics"><div class="metric"><div class="value">0</div><div class="label">Replication failures</div></div><div class="metric"><div class="value">3</div><div class="label">Critical faults</div></div></div>
            <span class="arrow">→</span>
        </a>
        <a href="/use-cases/dc-upgrade" class="case-card fade-in">
            <div class="info"><h2>Windows Server 2019 → 2025 Domain Upgrade</h2><p>A swing migration of a two-DC domain to Windows Server 2025 — clean install, FSMO transfer, demotion, and the DC4 identity saga, with every state change snapshot-gated and read back from a second vantage.</p></div>
            <div class="metrics"><div class="metric"><div class="value">0</div><div class="label">Repl failures</div></div><div class="metric"><div class="value">2</div><div class="label">2025 DCs</div></div></div>
            <span class="arrow">→</span>
        </a>
        <a href="/use-cases/dc-azure-security" class="case-card fade-in">
            <div class="info"><h2>Domain Controller in Azure — Audited &amp; Secured</h2><p>An AI agent found and closed the real security gaps behind a working Azure DC — weak IPsec crypto, a 16,384-port firewall grant, a VPN CA key on a workstation — and proved each fix, with a human approving every privileged change.</p></div>
            <div class="metrics"><div class="metric"><div class="value">0</div><div class="label">Repl failures</div></div><div class="metric"><div class="value">43</div><div class="label">NSG ports</div></div></div>
            <span class="arrow">→</span>
        </a>
        <a href="/use-cases/aks-employee-portal" class="case-card fade-in">
            <div class="info"><h2>Secure AKS Employee Portal Backend — Built with an AI Agent</h2><p>An AI agent provisioned a no-secrets, fully identity-based AKS + SQL + Key Vault + ACR stack for an employee portal — then validated, revoked, and tore it all down cleanly, with a human approving every privileged step.</p></div>
            <div class="metrics"><div class="metric"><div class="value">0</div><div class="label">Stored secrets</div></div><div class="metric"><div class="value">10</div><div class="label">Validations</div></div></div>
            <span class="arrow">→</span>
        </a>
    </section>
    <footer><p>Copyright © 2026 <a href="/">AppoSight</a>. All rights reserved.</p></footer>
    <script>
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        setTimeout(() => { document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible')); }, 2000);

        (function(){
            var h = document.querySelector('.hamburger');
            var n = document.querySelector('.nav-links');
            if(h && n){
                h.addEventListener('click', function(){
                    h.classList.toggle('active');
                    n.classList.toggle('open');
                });
                n.querySelectorAll('a').forEach(function(l){
                    l.addEventListener('click', function(){
                        h.classList.remove('active');
                        n.classList.remove('open');
                    });
                });
            }
        })();
    </script>
</body>
</html>`;

// --- Use Case: Event-Driven Azure AD Sync (detail page) ---
const USE_CASES_ENTRASYNC_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event-Driven Azure AD Sync | AppoSight Use Cases</title>
    <meta name="description" content="How we cut Azure AD sync latency from 30 minutes to seconds using event-triggered automation on Windows Server.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --black: #1d1d1f;
            --gray: #86868b;
            --light-gray: #f5f5f7;
            --white: #ffffff;
            --blue: #2997ff;
            --green: #30d158;
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

        .logo-link {
            text-decoration: none;
            color: inherit;
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

        /* Hero */
        .hero {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: var(--black);
            color: var(--white);
            padding: 120px 20px 80px;
        }

        .hero .tag {
            font-size: 14px;
            color: var(--blue);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 20px;
        }

        .hero h1 {
            font-size: clamp(36px, 6vw, 64px);
            font-weight: 700;
            letter-spacing: -2px;
            line-height: 1.1;
            margin-bottom: 16px;
        }

        .hero .subtitle {
            font-size: clamp(18px, 2.5vw, 24px);
            color: var(--gray);
            max-width: 600px;
            line-height: 1.4;
        }

        .badge-hero {
            display: inline-block;
            background: rgba(41, 151, 255, 0.12);
            border: 1px solid rgba(41, 151, 255, 0.25);
            border-radius: 20px;
            padding: 8px 20px;
            font-size: 14px;
            color: var(--blue);
            margin-top: 24px;
            letter-spacing: 0.3px;
        }
        .back-link { display: inline-block; font-size: 18px; color: var(--blue); text-decoration: none; margin-bottom: 24px; opacity: 0.8; }
        .back-link:hover { opacity: 1; text-decoration: underline; }

        /* Sections */
        .section {
            padding: 100px 40px;
            max-width: 900px;
            margin: 0 auto;
        }

        .section h2 {
            font-size: clamp(28px, 4vw, 44px);
            font-weight: 700;
            letter-spacing: -1.5px;
            margin-bottom: 24px;
            line-height: 1.15;
        }

        .section p {
            font-size: 18px;
            color: var(--gray);
            line-height: 1.6;
            margin-bottom: 20px;
        }

        /* Metric bars */
        .metric-row {
            display: flex;
            gap: 40px;
            margin: 40px 0;
            flex-wrap: wrap;
        }

        .metric {
            flex: 1;
            min-width: 140px;
        }

        .metric .value {
            font-size: 48px;
            font-weight: 700;
            letter-spacing: -2px;
            color: var(--blue);
        }

        .metric .label {
            font-size: 14px;
            color: var(--gray);
            margin-top: 4px;
        }

        /* Code block */
        .code-block {
            background: var(--light-gray);
            border-radius: 16px;
            padding: 24px 30px;
            margin: 30px 0;
            font-family: 'SF Mono', 'Fira Code', monospace;
            font-size: 14px;
            line-height: 1.6;
            overflow-x: auto;
        }

        .code-block .comment { color: var(--gray); }
        .code-block .cmd { color: var(--black); font-weight: 600; }
        .code-block .arg { color: var(--blue); }

        /* Architecture diagram */
        .arch {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin: 50px 0;
            flex-wrap: wrap;
        }

        .arch-box {
            background: var(--light-gray);
            border-radius: 16px;
            padding: 24px 20px;
            text-align: center;
            min-width: 140px;
        }

        .arch-box .icon { font-size: 32px; margin-bottom: 8px; }
        .arch-box .name { font-size: 14px; font-weight: 600; }
        .arch-box .desc { font-size: 12px; color: var(--gray); margin-top: 4px; }

        .arch-arrow {
            font-size: 24px;
            color: var(--blue);
            font-weight: 700;
        }

        /* Event IDs grid */
        .event-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 12px;
            margin: 30px 0;
        }

        .event-item {
            background: var(--light-gray);
            border-radius: 12px;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .event-item .id {
            font-family: 'SF Mono', monospace;
            font-size: 14px;
            font-weight: 600;
            color: var(--blue);
            white-space: nowrap;
        }

        .event-item .desc {
            font-size: 13px;
            color: var(--gray);
        }

        /* Badge */
        .badge {
            display: inline-block;
            background: var(--light-gray);
            border-radius: 20px;
            padding: 8px 16px;
            font-size: 13px;
            color: var(--gray);
            margin-top: 20px;
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 40px 20px;
            font-size: 12px;
            color: var(--gray);
            border-top: 1px solid var(--light-gray);
        }

        footer a {
            color: var(--blue);
            text-decoration: none;
        }

        /* Fade-in animation */
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Hamburger button */
        .hamburger {
            display: none;
            flex-direction: column;
            gap: 5px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            z-index: 110;
        }
        .hamburger span {
            display: block;
            width: 24px;
            height: 2px;
            background: var(--black);
            border-radius: 2px;
            transition: all 0.3s;
        }
        .hamburger.active span:nth-child(1) {
            transform: translateY(7px) rotate(45deg);
        }
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        .hamburger.active span:nth-child(3) {
            transform: translateY(-7px) rotate(-45deg);
        }

        @media (max-width: 600px) {
            nav {
                padding: 14px 20px;
            }

            .hamburger {
                display: flex;
            }

            .nav-links {
                position: fixed;
                top: 0;
                right: 0;
                width: 260px;
                height: 100vh;
                background: rgba(255,255,255,0.98);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 40px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                z-index: 105;
                box-shadow: -4px 0 24px rgba(0,0,0,0.1);
            }

            .nav-links.open {
                transform: translateX(0);
            }

            .nav-links a {
                margin-left: 0;
                margin-bottom: 24px;
                font-size: 20px;
                opacity: 0.85;
            }

            .section {
                padding: 80px 20px;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <a href="/" class="logo-link">
            <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5" class="hex-logo"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
            </div>
        </a>
        <div class="nav-links">
            <a href="/about">About</a>
            <a href="/#capabilities">Capabilities</a>
            <a href="/#pentest">Pentest</a>
            <a href="/Use-Cases">Use Cases</a>
            <a href="/briefings">Briefings</a>
            <a href="/#contact">Contact</a>
        </div>
        <button class="hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
        </button>
    </nav>

    <!-- Hero -->
    <section class="hero">
        <a href="/Use-Cases" class="back-link fade-in">← All Use Cases</a>
        <h1 class="fade-in">Event-Driven<br>Azure AD Sync</h1>
        <p class="subtitle fade-in">Cutting identity sync latency from 30 minutes to seconds — without touching the default sync interval.</p>
        <div class="badge-hero fade-in">AI-designed · Infrastructure-executed · Zero AI at runtime</div>
    </section>

    <!-- The Problem -->
    <section class="section">
        <h2 class="fade-in">The Problem</h2>
        <p class="fade-in">By default, Microsoft Entra Connect (formerly Azure AD Connect) synchronizes Active Directory changes to the cloud every <strong>30 minutes</strong>. For environments where identity changes need near-instant propagation — onboarding, access control, compliance — that delay is unacceptable.</p>
        <p class="fade-in">The common fix? Reduce the sync interval to 5 minutes or less. But that means <strong>polling 6x more often</strong>, burning CPU on the AD server and the sync engine, even when nothing changed.</p>

        <div class="metric-row fade-in">
            <div class="metric">
                <div class="value">30m</div>
                <div class="label">Default sync interval</div>
            </div>
            <div class="metric">
                <div class="value">5m</div>
                <div class="label">Typical "fix" (polling)</div>
            </div>
            <div class="metric">
                <div class="value">&lt;10s</div>
                <div class="label">Our approach (event-driven)</div>
            </div>
        </div>
    </section>

    <!-- The Solution -->
    <section class="section">
        <h2 class="fade-in">The Solution</h2>
        <p class="fade-in">Instead of polling harder, we let the OS tell us when something matters. A Windows Scheduled Task listens for Security Event IDs — the exact signals Windows emits when AD objects change — and fires a delta sync only when needed.</p>

        <div class="arch fade-in">
            <div class="arch-box">
                <div class="icon">🖥️</div>
                <div class="name">AD Change</div>
                <div class="desc">User created,<br>password reset, etc.</div>
            </div>
            <div class="arch-arrow">→</div>
            <div class="arch-box">
                <div class="icon">📋</div>
                <div class="name">Event ID</div>
                <div class="desc">Windows Security<br>Event Logged</div>
            </div>
            <div class="arch-arrow">→</div>
            <div class="arch-box">
                <div class="icon">⚡</div>
                <div class="name">Scheduled Task</div>
                <div class="desc">Trigger fires<br>instantly</div>
            </div>
            <div class="arch-arrow">→</div>
            <div class="arch-box">
                <div class="icon">☁️</div>
                <div class="name">Delta Sync</div>
                <div class="desc">Changes pushed to<br>Entra ID</div>
            </div>
        </div>
    </section>

    <!-- Monitored Events -->
    <section class="section">
        <h2 class="fade-in">Monitored Events</h2>
        <p class="fade-in">The task watches for 13 Security Event IDs covering the full lifecycle of user and group changes:</p>

        <div class="event-grid fade-in">
            <div class="event-item"><span class="id">4720</span><span class="desc">User created</span></div>
            <div class="event-item"><span class="id">4722</span><span class="desc">User enabled</span></div>
            <div class="event-item"><span class="id">4723</span><span class="desc">User info changed</span></div>
            <div class="event-item"><span class="id">4725</span><span class="desc">User deleted</span></div>
            <div class="event-item"><span class="id">4726</span><span class="desc">User disabled</span></div>
            <div class="event-item"><span class="id">4738</span><span class="desc">Global group created</span></div>
            <div class="event-item"><span class="id">4728</span><span class="desc">Added to global group</span></div>
            <div class="event-item"><span class="id">4729</span><span class="desc">Removed from global group</span></div>
            <div class="event-item"><span class="id">4732</span><span class="desc">Added to security group</span></div>
            <div class="event-item"><span class="id">4733</span><span class="desc">Removed from security group</span></div>
            <div class="event-item"><span class="id">4746</span><span class="desc">User password reset</span></div>
            <div class="event-item"><span class="id">4756</span><span class="desc">Updated group membership</span></div>
            <div class="event-item"><span class="id">4764</span><span class="desc">Group type changed</span></div>
        </div>
    </section>

    <!-- How It Works -->
    <section class="section">
        <h2 class="fade-in">Implementation</h2>
        <p class="fade-in">A lightweight helper script on the Domain Controller handles the sync call:</p>

        <div class="code-block fade-in">
            <span class="comment"># C:\_sync.ps1</span><br>
            <span class="cmd">Import-Module</span> <span class="arg">'C:\Program Files\Microsoft Azure AD Sync\Bin\ADSync\ADSync.psd1'</span><br>
            <span class="cmd">Start-ADSyncSyncCycle</span> <span class="arg">-PolicyType Delta</span>
        </div>

        <p class="fade-in">The Windows Scheduled Task <code>Auto-EntraSync-OnADChange</code> runs as <strong>SYSTEM</strong> with a 10-minute execution limit, registered via XML to ensure reliability over remote management.</p>

        <p class="fade-in"><strong>The default 30-minute sync cycle remains intact</strong> as a safety net — the event trigger is an acceleration layer, not a replacement.</p>
    </section>

    <!-- Results -->
    <section class="section">
        <h2 class="fade-in">Results</h2>
        <div class="metric-row fade-in">
            <div class="metric">
                <div class="value">0</div>
                <div class="label">Unnecessary sync cycles</div>
            </div>
            <div class="metric">
                <div class="value">~10s</div>
                <div class="label">Avg. sync latency</div>
            </div>
            <div class="metric">
                <div class="value">100%</div>
                <div class="label">Change coverage</div>
            </div>
            <div class="metric">
                <div class="value">0</div>
                <div class="label">Config changes to ADCS</div>
            </div>
        </div>

        <div class="badge fade-in">✓ Zero-downtime deployment</div>
    </section>

    <!-- Footer -->
    <footer>
        <p>Copyright © 2026 <a href="/">AppoSight</a>. All rights reserved.</p>
    </footer>

    <script>
        (function(){
            var h = document.querySelector('.hamburger');
            var n = document.querySelector('.nav-links');
            if(h && n){
                h.addEventListener('click', function(){
                    h.classList.toggle('active');
                    n.classList.toggle('open');
                });
                n.querySelectorAll('a').forEach(function(l){
                    l.addEventListener('click', function(){
                        h.classList.remove('active');
                        n.classList.remove('open');
                    });
                });
            }
        })();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

        setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
        }, 2000);
    </script>
</body>
</html>
`;

// --- Use Case: CIS Benchmark Compliance Auditor (detail page) ---
const CIS_BENCHMARK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CIS Benchmark Compliance Auditor | AppoSight Use Cases</title>
    <meta name="description" content="Automated CIS Benchmark compliance auditing for Windows Domain Controllers — 60 controls in 6.3 seconds.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --black: #1d1d1f; --gray: #86868b; --light-gray: #f5f5f7; --white: #ffffff; --blue: #2997ff; --green: #30d158; --red: #ff453a; --orange: #ff9f0a; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--black); background: var(--white); }
        nav { position: fixed; top: 0; width: 100%; padding: 14px 40px; background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); z-index: 100; display: flex; justify-content: space-between; align-items: center; }
        .logo-link { text-decoration: none; color: inherit; }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; letter-spacing: -0.5px; }
        .logo svg { height: 32px; }
        @keyframes hexRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hex-logo { animation: hexRotate 20s linear infinite; transform-origin: center; }
        .back-link { display: inline-block; font-size: 18px; color: var(--blue); text-decoration: none; margin-bottom: 24px; opacity: 0.8; }
        .back-link:hover { opacity: 1; text-decoration: underline; }
        .nav-links a { color: var(--black); text-decoration: none; margin-left: 28px; font-size: 12px; opacity: 0.8; }
        .hero { min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: var(--black); color: var(--white); padding: 120px 20px 80px; }
        .hero .tag { font-size: 14px; color: var(--blue); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px; }
        .hero h1 { font-size: clamp(36px, 6vw, 64px); font-weight: 700; letter-spacing: -2px; margin-bottom: 16px; }
        .hero .subtitle { font-size: clamp(18px, 2.5vw, 24px); color: var(--gray); max-width: 600px; }
        .badge-hero { display: inline-block; background: rgba(41,151,255,0.12); border: 1px solid rgba(41,151,255,0.25); border-radius: 20px; padding: 8px 20px; font-size: 14px; color: var(--blue); margin-top: 24px; }
        .section { padding: 100px 40px; max-width: 900px; margin: 0 auto; }
        .section h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 700; letter-spacing: -1.5px; margin-bottom: 24px; }
        .section p { font-size: 18px; color: var(--gray); line-height: 1.6; margin-bottom: 20px; }
        .section strong { color: var(--black); }
        .metric-row { display: flex; gap: 40px; margin: 40px 0; flex-wrap: wrap; }
        .metric { flex: 1; min-width: 140px; }
        .metric .value { font-size: 48px; font-weight: 700; letter-spacing: -2px; color: var(--blue); }
        .metric .value.red { color: var(--red); }
        .metric .value.orange { color: var(--orange); }
        .metric .label { font-size: 14px; color: var(--gray); margin-top: 4px; }
        .comp-table { width: 100%; border-collapse: collapse; margin: 30px 0; font-size: 15px; }
        .comp-table th { text-align: left; padding: 12px 16px; border-bottom: 2px solid var(--light-gray); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--gray); }
        .comp-table td { padding: 14px 16px; border-bottom: 1px solid var(--light-gray); }
        .comp-table .rate { font-weight: 700; font-family: 'SF Mono', monospace; }
        .comp-table .rate.high { color: var(--green); }
        .comp-table .rate.mid { color: var(--orange); }
        .comp-table .rate.low { color: var(--red); }
        .arch { display: flex; align-items: center; justify-content: center; gap: 16px; margin: 50px 0; flex-wrap: wrap; }
        .arch-box { background: var(--light-gray); border-radius: 16px; padding: 24px 20px; text-align: center; min-width: 140px; }
        .arch-box .icon { font-size: 32px; margin-bottom: 8px; }
        .arch-box .name { font-size: 14px; font-weight: 600; }
        .arch-box .desc { font-size: 12px; color: var(--gray); margin-top: 4px; }
        .arch-arrow { font-size: 24px; color: var(--blue); font-weight: 700; }
        .badge { display: inline-block; background: var(--light-gray); border-radius: 20px; padding: 8px 16px; font-size: 13px; color: var(--gray); margin-top: 20px; }
        footer { text-align: center; padding: 40px 20px; font-size: 12px; color: var(--gray); border-top: 1px solid var(--light-gray); }
        footer a { color: var(--blue); text-decoration: none; }
        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }

        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; z-index: 110; }
        .hamburger span { display: block; width: 24px; height: 2px; background: var(--black); border-radius: 2px; transition: all 0.3s; }
        .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        @media (max-width: 600px) {
            nav { padding: 14px 20px; }
            .hamburger { display: flex; }
            .nav-links { position: fixed; top: 0; right: 0; width: 260px; height: 100vh; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: flex; flex-direction: column; justify-content: center; padding: 0 40px; transform: translateX(100%); transition: transform 0.3s ease; z-index: 105; box-shadow: -4px 0 24px rgba(0,0,0,0.1); }
            .nav-links.open { transform: translateX(0); }
            .nav-links a { margin-left: 0; margin-bottom: 24px; font-size: 20px; opacity: 0.85; }
            .section { padding: 60px 20px; }
            .metric-row { gap: 24px; }
            .comp-table { font-size: 13px; }
            .comp-table th, .comp-table td { padding: 10px 8px; }
        }
    </style>
</head>
<body>
    <nav>
        <a href="/" class="logo-link">
            <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5" class="hex-logo"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
            </div>
        </a>
        <div class="nav-links">
            <a href="/about">About</a>
            <a href="/#capabilities">Capabilities</a>
            <a href="/#pentest">Pentest</a>
            <a href="/Use-Cases">Use Cases</a>
            <a href="/briefings">Briefings</a>
            <a href="/#contact">Contact</a>
        </div>
        <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </nav>
    <section class="hero">
        <a href="/Use-Cases" class="back-link fade-in">← All Use Cases</a>
        <h1 class="fade-in">CIS Benchmark<br>Compliance Auditor</h1>
        <p class="subtitle fade-in">60 security controls evaluated in 6.3 seconds — automated, read-only, risk-prioritized.</p>
        <div class="badge-hero fade-in">AI-built · Deterministic at runtime · Zero AI inference during scans</div>
    </section>
    <section class="section">
        <h2 class="fade-in">The Problem</h2>
        <p class="fade-in">Manual CIS Benchmark compliance audits are slow, repetitive, and easy to deprioritize — leading to security gaps going undetected. Audit policies sit at "None" for months. Password policies drift from baseline. Without regular automated checks, the gap between what the benchmark requires and what the environment actually enforces grows quietly.</p>
        <p class="fade-in">This is especially critical for Domain Controllers, where a single misconfiguration can expose the entire directory to credential theft, relay attacks, or unauthorized access.</p>
    </section>
    <section class="section">
        <h2 class="fade-in">The Approach</h2>
        <p class="fade-in">Built an automated, read-only compliance auditing tool:</p>
        <div class="arch fade-in">
            <div class="arch-box"><div class="icon">🐍</div><div class="name">Python Engine</div><div class="desc">Load check defs<br>Compare results<br>Generate reports</div></div>
            <div class="arch-arrow">↔</div>
            <div class="arch-box"><div class="icon">⚡</div><div class="name">WinRM</div><div class="desc">Agentless<br>remote access</div></div>
            <div class="arch-arrow">↔</div>
            <div class="arch-box"><div class="icon">🖥️</div><div class="name">Domain Controller</div><div class="desc">PowerShell collector<br>9 data categories</div></div>
        </div>
        <p class="fade-in"><strong>PowerShell collector</strong> pulls live DC configuration across 9 data categories: password policy, audit policy, user rights, registry values, services, firewall, time sync, LSA settings, and security options.</p>
        <p class="fade-in"><strong>Python comparison engine</strong> evaluates collected state against 60 CIS Level 1 controls defined in a JSON ruleset — no code changes needed to add or modify controls. The engine runs entirely on deterministic rule matching; no AI model is called during scan execution, which is why results are fast, consistent, and fully reproducible.</p>
        <p class="fade-in"><strong>Report generator</strong> outputs a risk-prioritized remediation report (Critical → High → Medium → Low) with plain-language explanations and specific GPO paths for each finding.</p>
        <p class="fade-in">The tool is <strong>read-only</strong> — it does not make configuration changes. Remediation remains a reviewed, manual step.</p>
    </section>
    <section class="section">
        <h2 class="fade-in">Results</h2>
        <p class="fade-in">Scan of a Windows Server 2019 Domain Controller:</p>
        <div class="metric-row fade-in">
            <div class="metric"><div class="value">6.3s</div><div class="label">Scan time</div></div>
            <div class="metric"><div class="value">60</div><div class="label">Controls evaluated</div></div>
            <div class="metric"><div class="value">33.3%</div><div class="label">Compliance rate</div></div>
            <div class="metric"><div class="value red">6</div><div class="label">Critical failures</div></div>
        </div>
        <p class="fade-in"><strong>Key findings:</strong> 6 Critical failures (password complexity, LM auth level, firewall, LSA settings). Audit Policy at 0% pass rate (9/9 failed) — no logging coverage for credential validation, Kerberos auth, directory service access, or account management.</p>
        <p class="fade-in">System hardening without audit logging is blind — you can't detect what you don't log.</p>
        <h3 class="fade-in" style="font-size: 20px; margin-top: 40px; margin-bottom: 16px;">Compliance by Category</h3>
        <table class="comp-table fade-in">
            <thead><tr><th>Category</th><th>Total</th><th>Pass</th><th>Fail</th><th>Rate</th></tr></thead>
            <tbody>
                <tr><td>Registry</td><td>13</td><td>9</td><td>3</td><td class="rate high">69%</td></tr>
                <tr><td>System Services</td><td>7</td><td>5</td><td>2</td><td class="rate high">71%</td></tr>
                <tr><td>UAC</td><td>2</td><td>1</td><td>1</td><td class="rate mid">50%</td></tr>
                <tr><td>Security Options</td><td>12</td><td>3</td><td>7</td><td class="rate low">25%</td></tr>
                <tr><td>User Rights</td><td>5</td><td>1</td><td>4</td><td class="rate low">20%</td></tr>
                <tr><td>Password Policy</td><td>6</td><td>1</td><td>5</td><td class="rate low">17%</td></tr>
                <tr><td>Audit Policy</td><td>9</td><td>0</td><td>9</td><td class="rate low">0%</td></tr>
                <tr><td>Firewall</td><td>2</td><td>0</td><td>2</td><td class="rate low">0%</td></tr>
                <tr><td>Account Lockout</td><td>2</td><td>0</td><td>2</td><td class="rate low">0%</td></tr>
            </tbody>
        </table>
        <h3 class="fade-in" style="font-size: 20px; margin-top: 40px; margin-bottom: 16px;">Risk Distribution of Failures</h3>
        <div class="metric-row fade-in">
            <div class="metric"><div class="value red">6</div><div class="label">Critical</div></div>
            <div class="metric"><div class="value orange">17</div><div class="label">High</div></div>
            <div class="metric"><div class="value">12</div><div class="label">Medium</div></div>
            <div class="metric"><div class="value">1</div><div class="label">Low</div></div>
        </div>
    </section>
    <section class="section">
        <h2 class="fade-in">Validation</h2>
        <p class="fade-in">To verify the automation's time-saving claim, a representative sample was manually audited: all 9 Audit Policy controls plus all 6 Password Policy controls (15 of 60 total), using standard tools (<code>secpol.msc</code>, Group Policy Management Console) cross-referenced against CIS Benchmark documentation.</p>
        <p class="fade-in">Manual verification took <strong>22 minutes</strong> — a best-case baseline measured with an experienced operator and a pre-prepared checklist. A first-time audit without prior familiarity would take meaningfully longer.</p>
        <p class="fade-in">Automated scan: <strong>6.3 seconds</strong> for all 60 controls.</p>
    </section>
    <section class="section">
        <h2 class="fade-in">What's Next</h2>
        <p class="fade-in">v2 will extend the JSON-driven ruleset to cover Azure AD / Entra ID CIS controls, requiring no code changes to the core engine. The same architecture applies: collector pulls cloud tenant state via Graph API, comparison engine evaluates against Entra ID-specific benchmarks, report generator outputs the same risk-prioritized format.</p>
        <div class="badge fade-in">✓ Validated on live DC · Read-only operation · JSON-driven extensibility</div>
    </section>
    <footer><p>Copyright © 2026 <a href="/">AppoSight</a>. All rights reserved.</p></footer>
    <script>
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        setTimeout(() => { document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible')); }, 2000);

        (function(){
            var h = document.querySelector('.hamburger');
            var n = document.querySelector('.nav-links');
            if(h && n){
                h.addEventListener('click', function(){
                    h.classList.toggle('active');
                    n.classList.toggle('open');
                });
                n.querySelectorAll('a').forEach(function(l){
                    l.addEventListener('click', function(){
                        h.classList.remove('active');
                        n.classList.remove('open');
                    });
                });
            }
        })();
    </script>
</body>
</html>`;

// --- Use Case: Entra ID CIS Benchmark Audit v2 (detail page) ---
const ENTRA_CIS_V2_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Entra ID CIS Benchmark Audit — v2 | AppoSight Use Cases</title>
    <meta name="description" content="Extending the v1 CIS auditor to Entra ID — deterministic Graph API auditing on a Developer Program tenant, with an honest record of what the platform allowed and where it drew the line.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --black: #1d1d1f; --gray: #86868b; --light-gray: #f5f5f7; --white: #ffffff; --blue: #2997ff; --green: #30d158; --red: #ff453a; --orange: #ff9f0a; --dark: #1d1d1f; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--black); background: var(--white); overflow-x: hidden; }
        nav { position: fixed; top: 0; width: 100%; padding: 14px 40px; background: rgba(255,255,255,0.8); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); z-index: 100; display: flex; justify-content: space-between; align-items: center; }
        .logo-link { text-decoration: none; color: inherit; }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; letter-spacing: -0.5px; }
        .logo svg { height: 32px; }
        @keyframes hexRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hex-logo { animation: hexRotate 20s linear infinite; transform-origin: center; }
        .nav-links a { color: var(--black); text-decoration: none; margin-left: 28px; font-size: 12px; opacity: 0.8; transition: opacity 0.3s; }
        .nav-links a:hover { opacity: 1; }
        .back-link { display: inline-block; font-size: 18px; color: var(--blue); text-decoration: none; margin-bottom: 24px; opacity: 0.8; }
        .back-link:hover { opacity: 1; text-decoration: underline; }
        .hero { min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: var(--black); color: var(--white); padding: 120px 20px 80px; }
        .hero h1 { font-size: clamp(36px, 6vw, 64px); font-weight: 700; letter-spacing: -2px; line-height: 1.1; margin-bottom: 16px; }
        .hero .subtitle { font-size: clamp(18px, 2.5vw, 24px); color: var(--gray); max-width: 620px; line-height: 1.4; }
        .badge-hero { display: inline-block; background: rgba(41,151,255,0.12); border: 1px solid rgba(41,151,255,0.25); border-radius: 20px; padding: 8px 20px; font-size: 14px; color: var(--blue); margin-top: 24px; letter-spacing: 0.3px; }
        .section { padding: 100px 40px; max-width: 900px; margin: 0 auto; }
        .section h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 700; letter-spacing: -1.5px; margin-bottom: 24px; line-height: 1.15; }
        .section h3 { font-size: 22px; font-weight: 600; letter-spacing: -0.5px; margin: 44px 0 14px; }
        .section p { font-size: 18px; color: var(--gray); line-height: 1.6; margin-bottom: 20px; }
        .section p:last-child { margin-bottom: 0; }
        .section strong { color: var(--black); }
        .section ol { margin: 0 0 20px 22px; }
        .section ol li { font-size: 17px; color: var(--gray); line-height: 1.6; margin-bottom: 12px; }
        .section ol li strong { color: var(--black); }
        .section ul { margin: 0 0 20px 22px; }
        .section ul li { font-size: 17px; color: var(--gray); line-height: 1.6; margin-bottom: 10px; }
        .section ul li strong { color: var(--black); }
        code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 14px; background: var(--light-gray); padding: 2px 6px; border-radius: 5px; color: var(--black); }
        .metric-row { display: flex; gap: 40px; margin: 40px 0; flex-wrap: wrap; }
        .metric { flex: 1; min-width: 150px; background: var(--light-gray); border-radius: 16px; padding: 24px 20px; }
        .metric .value { font-size: 46px; font-weight: 700; letter-spacing: -2px; color: var(--blue); line-height: 1.1; }
        .metric .value.red { color: var(--red); }
        .metric .value.orange { color: var(--orange); }
        .metric .value.green { color: var(--green); }
        .metric .value.sm { font-size: 34px; letter-spacing: -1px; }
        .metric .label { font-size: 14px; color: var(--gray); margin-top: 8px; line-height: 1.35; }
        .comp-table { width: 100%; border-collapse: collapse; margin: 28px 0; font-size: 15px; }
        .comp-table th { text-align: left; padding: 12px 16px; border-bottom: 2px solid var(--light-gray); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--gray); }
        .comp-table td { padding: 14px 16px; border-bottom: 1px solid var(--light-gray); color: var(--gray); vertical-align: top; }
        .comp-table td strong { color: var(--black); }
        .comp-table .ok { color: var(--green); font-weight: 700; font-family: 'SF Mono', monospace; }
        .comp-table .bad { color: var(--red); font-weight: 700; font-family: 'SF Mono', monospace; }
        .comp-table .keep { color: var(--gray); }
        .comp-table .code { font-family: 'SF Mono', monospace; font-size: 13px; }
        .note { background: var(--light-gray); border-left: 3px solid var(--blue); border-radius: 0 12px 12px 0; padding: 20px 24px; margin: 28px 0; font-size: 16px; color: var(--gray); line-height: 1.6; }
        .note strong { color: var(--black); }
        .note .nt { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--blue); font-weight: 700; margin-bottom: 8px; }
        .quote { background: #f6f8fb; border-left: 3px solid var(--orange); border-radius: 0 12px 12px 0; padding: 18px 24px; margin: 22px 0; font-size: 16px; color: var(--gray); line-height: 1.6; font-style: italic; }
        .lesson { border-left: 3px solid var(--green); }
        .future { font-style: italic; color: var(--gray); font-size: 15px; line-height: 1.6; }
        .future .scope { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--orange); font-weight: 700; font-style: normal; display: block; margin-bottom: 6px; }
        .see-also { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--gray); text-decoration: none; border: 1px solid #d2d2d7; border-radius: 980px; padding: 10px 18px; }
        .see-also a { color: var(--blue); text-decoration: none; }
        .see-also a:hover { text-decoration: underline; }
        .attribution { text-align: center; font-size: 15px; color: var(--gray); padding: 0 40px; margin: -40px auto 0; max-width: 900px; }
        .attribution a { color: var(--blue); text-decoration: none; font-weight: 500; }
        .attribution a:hover { text-decoration: underline; }
        footer { text-align: center; padding: 40px 20px; font-size: 12px; color: var(--gray); border-top: 1px solid var(--light-gray); }
        footer a { color: var(--blue); text-decoration: none; }
        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; z-index: 110; }
        .hamburger span { display: block; width: 24px; height: 2px; background: var(--black); border-radius: 2px; transition: all 0.3s; }
        .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        @media (max-width: 600px) {
            nav { padding: 14px 20px; }
            .hamburger { display: flex; }
            .nav-links { position: fixed; top: 0; right: 0; width: 260px; height: 100vh; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: flex; flex-direction: column; justify-content: center; padding: 0 40px; transform: translateX(100%); transition: transform 0.3s ease; z-index: 105; box-shadow: -4px 0 24px rgba(0,0,0,0.1); }
            .nav-links.open { transform: translateX(0); }
            .nav-links a { margin-left: 0; margin-bottom: 24px; font-size: 20px; opacity: 0.85; }
            .section { padding: 60px 20px; }
            .section p, .section ol li, .section ul li { font-size: 16px; }
            .metric-row { gap: 16px; }
            .metric { min-width: calc(50% - 12px); }
            .metric .value { font-size: 38px; }
            .metric .value.sm { font-size: 28px; }
            .comp-table { font-size: 13px; }
            .comp-table th, .comp-table td { padding: 10px 8px; }
            .attribution { padding: 0 20px; }
        }
    </style>
</head>
<body>
    <nav>
        <a href="/" class="logo-link">
            <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5" class="hex-logo"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
            </div>
        </a>
        <div class="nav-links">
            <a href="/about">About</a>
            <a href="/#capabilities">Capabilities</a>
            <a href="/#pentest">Pentest</a>
            <a href="/Use-Cases">Use Cases</a>
            <a href="/briefings">Briefings</a>
            <a href="/#contact">Contact</a>
        </div>
        <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </nav>

    <section class="hero">
        <a href="/Use-Cases" class="back-link fade-in">← All Use Cases</a>
        <h1 class="fade-in">Entra ID CIS Benchmark<br>Audit — v2</h1>
        <p class="subtitle fade-in">The v1 CIS auditor, extended from on-prem to the cloud tenant — deterministic, read-first, reproducible. And an honest record of where the platform drew the line.</p>
        <div class="badge-hero fade-in">AI-executed · Human-verified · Self-correcting on error</div>
    </section>

    <section class="section">
        <h2 class="fade-in">The Problem</h2>
        <p class="fade-in">The v1 CIS auditor covered the on-prem Windows side — 60 controls on a Domain Controller via WinRM and PowerShell. It said nothing about the cloud: Microsoft Entra ID, where identities, MFA, Conditional Access, and privileged-access controls actually live in a hybrid setup.</p>
        <p class="fade-in">v2 extends the same JSON-driven, deterministic engine to the tenant. Instead of PowerShell over WinRM, the collector pulls live tenant state from the <strong>Microsoft Graph API</strong> using a service principal, and the same comparison engine evaluates it against Entra ID / CIS controls — no code changes to the core, and no AI model invoked during the audit. What follows is the real result of that audit on a <strong>Microsoft 365 Developer Program tenant</strong>: what the platform let us read, what it let us fix, and where it refused the write.</p>
    </section>

    <section class="section">
        <h2 class="fade-in">Results — Verified, Not Claimed</h2>
        <p class="fade-in">Final state of the remediated Developer Program tenant, re-read from the live API after each write. Green changed as intended; red blocked at the platform tier.</p>
        <div class="metric-row fade-in">
            <div class="metric"><div class="value green sm">2 → 0</div><div class="label">Weak MFA methods (Email + TAP) enabled</div></div>
            <div class="metric"><div class="value green sm">no → yes</div><div class="label">FIDO2 attestation enforced</div></div>
            <div class="metric"><div class="value red sm">0 → 0</div><div class="label">Conditional Access policies (platform-gated)</div></div>
            <div class="metric"><div class="value red sm">off → off</div><div class="label">MFA registration enforcement (platform-gated)</div></div>
        </div>
        <div class="metric-row fade-in">
            <div class="metric"><div class="value red sm">0 / 23</div><div class="label">Users with a registered MFA method</div></div>
        </div>
    </section>

    <section class="section">
        <h2 class="fade-in">Technical Note — the Developer-Tenant Platform Tier</h2>
        <p class="fade-in">A distinct, reusable finding about how <strong>Microsoft 365 Developer Program tenants</strong> expose Conditional Access. This is a different kind of ceiling from the P1/P2 <em>feature-level</em> restrictions (PIM, Identity Protection) — and it matters for anyone building or testing automation against Developer tenants.</p>
        <table class="comp-table fade-in">
            <thead><tr><th>API surface</th><th>Developer Program tenant</th><th>Commercial / paid tenant</th></tr></thead>
            <tbody>
                <tr><td><strong>CA policy read</strong> <span class="code">GET conditionalAccessPolicies</span></td><td class="ok">200 (empty list)</td><td class="ok">200</td></tr>
                <tr><td><strong>CA policy write</strong> <span class="code">POST conditionalAccessPolicies</span></td><td class="bad">403 "not licensed"</td><td class="ok">201</td></tr>
                <tr><td><strong>MFA method flags</strong> <span class="code">PATCH authenticationMethodsPolicy</span></td><td class="ok">204</td><td class="ok">204</td></tr>
                <tr><td><strong>Registration-enforcement</strong> <span class="code">PATCH registrationEnforcement</span></td><td class="bad">400 "invalid"</td><td class="ok">204</td></tr>
                <tr><td><strong>PIM / Identity Protection</strong> (P2-gated)</td><td class="bad">AadPremiumLicenseRequired</td><td class="ok">licensed</td></tr>
            </tbody>
        </table>
        <p class="fade-in"><strong>Two separate ceiling classes:</strong></p>
        <ol class="fade-in">
            <li><strong>Feature-level (P1/P2):</strong> the <em>entire capability</em> is absent until licensed — PIM, Identity Protection, PIM-eligible roles. These return <code>AadPremiumLicenseRequired</code> and are simply <em>not evaluated</em>; there is no write surface to probe.</li>
            <li><strong>Platform-tier (CA + registration-enforcement):</strong> the API surface <em>exists and is readable</em> in a Developer tenant, but the <strong>write path is gated</strong> by tenant class. The read succeeds (200); the write is refused (403 for CA, 400 for registration) — a licensed-capability gate on the <em>mutation</em>, not an absence of the feature.</li>
        </ol>
        <div class="note fade-in"><span class="nt">Takeaway</span>This is a genuine platform constraint on the Developer Program tier — <strong>not</strong> a scope, consent, or payload problem (all three were ruled out by isolation probes). It is reported as a platform ceiling, not as an "assign a license" remediation.</div>
    </section>

    <section class="section">
        <h2 class="fade-in">Case Study</h2>
        <p class="fade-in">Three findings, in the order they were discovered. Every number below was verified from the live tenant (re-read after each write), not from intent.</p>

        <h3 class="fade-in">a. MFA Method Hardening — applied &amp; verified</h3>
        <p class="fade-in">The free-tier MFA <em>method</em> configuration <strong>is</strong> writable in a Developer tenant, and this fix landed and persisted — <code>PATCH authenticationMethodsPolicy</code> returned <strong>HTTP 204</strong>, confirmed by a follow-up read.</p>
        <table class="comp-table fade-in">
            <thead><tr><th>Method</th><th>Before</th><th>After</th></tr></thead>
            <tbody>
                <tr><td>Email</td><td>enabled</td><td class="ok">disabled</td></tr>
                <tr><td>TemporaryAccessPass</td><td>enabled</td><td class="ok">disabled</td></tr>
                <tr><td>FIDO2 <span class="code">isAttestationEnforced</span></td><td>false</td><td class="ok">true</td></tr>
                <tr><td>MicrosoftAuthenticator</td><td>enabled</td><td class="keep">kept</td></tr>
                <tr><td>SoftwareOath</td><td>enabled</td><td class="keep">kept</td></tr>
                <tr><td>SMS / Voice</td><td>disabled</td><td class="keep">already off</td></tr>
            </tbody>
        </table>
        <p class="fade-in"><strong>Effect:</strong> the two most phishable strong-auth methods (email one-time code, 6-hour TAP) are off the tenant; any completed MFA must be app- or certified-hardware-backed.</p>

        <h3 class="fade-in">b. The P2 Assumption Error — caught &amp; corrected</h3>
        <p class="fade-in">An earlier pass of this audit recommended two fixes that assumed a paid/licensed capability was provisionable in a no-license Developer tenant — until challenged to verify the claim against live tenant data:</p>
        <div class="quote fade-in">"C2 — Zero Conditional Access policies → Fix: publish CA policies (free-tier, available now)" · and the PIM / Identity Protection items as "assign P2 (free-tier, no trial)".</div>
        <p class="fade-in">That was incorrect. This is a Microsoft 365 Developer Program tenant (<code>subscribedSkus = []</code>, <code>assignedLicenses = 0/23</code>) — it cannot provision P1/P2 at all (no trial, no self-serve subscription). The read API for P2-gated features still works; the write / activation path is gated by tenant class — the same split documented in the technical note above.</p>
        <p class="fade-in"><strong>How it was caught:</strong></p>
        <ol class="fade-in">
            <li>The license inventory was <strong>empty before any fix was written</strong> — <code>subscribedSkus: []</code>, 0/23 user licenses assigned. The "assign P2" fix had nothing to assign.</li>
            <li>The write probes returned <strong>403 / 400</strong>, not success — the first signal this was a gate, not a payload bug.</li>
            <li>The <strong>read-vs-write contrast</strong> — CA <code>GET</code> → 200 while CA <code>POST</code> → 403 under the same scoped token — proved a tenant-class gate, not a scope / consent problem.</li>
        </ol>
        <div class="note lesson fade-in"><span class="nt">Lesson</span>On Developer Program tenants, <strong>probe the write once before promising it.</strong> P2-gated features are "not evaluated — requires a license (unavailable in this tenant)"; CA-policy creation and MFA registration-enforcement are "attempted — blocked at the platform tier (403/400)"; only free-tier, unlicensed configuration is reliably writable. Do not restate a licensed feature as a "free, available-now" fix.</div>

        <h3 class="fade-in">c. The CA / Registration-Gate Discovery — attempted, blocked, root cause identified</h3>
        <p class="fade-in">Two items could not be remediated in this tenant, with the exact responses:</p>
        <ul class="fade-in">
            <li><strong>MFA registration-enforcement (C1 gate):</strong> <code>PATCH authenticationMethodsPolicy</code> → <code>registrationEnforcement…state = active</code> → <strong>HTTP 400</strong> <em>"The configured RegistrationEnforcement is invalid."</em> Retried on v1.0 and beta across four payload shapes — consistently rejected.</li>
            <li><strong>Conditional Access policy creation (C2):</strong> <code>POST conditionalAccessPolicies</code> → <strong>HTTP 403</strong> <em>"Your tenant is not licensed for this feature. Please upgrade your subscription."</em> Retried with <code>enabled</code>, <code>disabled</code>, and minimal-body variants — consistently rejected.</li>
        </ul>
        <p class="fade-in"><strong>Root cause:</strong> both are licensed capabilities the Developer Program tier does not expose for writes. Not scope (the token carried <code>Policy.ReadWrite.ConditionalAccess</code> / <code>Policy.ReadWrite.AuthenticationMethods</code>), not consent (admin-consented), not payload (multiple shapes). A platform-tier gate.</p>
        <table class="comp-table fade-in">
            <thead><tr><th>Metric</th><th>Before</th><th>After</th></tr></thead>
            <tbody>
                <tr><td>Weak MFA methods (Email + TAP) enabled</td><td>2</td><td class="ok">0</td></tr>
                <tr><td>FIDO2 attestation enforced</td><td>no</td><td class="ok">yes</td></tr>
                <tr><td>Conditional Access policies</td><td>0</td><td class="bad">0 (platform-gated)</td></tr>
                <tr><td>MFA registration enforcement</td><td>inactive</td><td class="bad">inactive (platform-gated)</td></tr>
                <tr><td>Users with a registered MFA method</td><td>0 / 23</td><td>0 / 23</td></tr>
            </tbody>
        </table>
    </section>

    <section class="section" style="padding-top: 0;">
        <span class="see-also fade-in">See also: <a href="/use-cases/cis-benchmark-auditor">CIS Benchmark Auditor (on-prem) →</a></span>
    </section>

    <footer><p>Copyright © 2026 <a href="/">AppoSight</a>. All rights reserved.</p></footer>

    <script>
        (function(){
            var h = document.querySelector('.hamburger');
            var n = document.querySelector('.nav-links');
            if(h && n){
                h.addEventListener('click', function(){
                    h.classList.toggle('active');
                    n.classList.toggle('open');
                });
                n.querySelectorAll('a').forEach(function(l){
                    l.addEventListener('click', function(){
                        h.classList.remove('active');
                        n.classList.remove('open');
                    });
                });
            }
        })();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        setTimeout(() => { document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible')); }, 2000);
    </script>
</body>
</html>
`;

const AD_ONBOARDING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hybrid AD ↔ Entra Onboarding / Offboarding | AppoSight Use Cases</title>
    <meta name="description" content="A deterministic, role-driven, fully-audited pipeline that onboards and offboards hybrid (on-prem AD + Microsoft Entra ID) employees — with human checkpoints for the judgment calls and an honest record of where the platform drew the line.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --black: #1d1d1f; --gray: #86868b; --light-gray: #f5f5f7; --white: #ffffff; --blue: #2997ff; --green: #30d158; --red: #ff453a; --orange: #ff9f0a; --dark: #1d1d1f; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--black); background: var(--white); overflow-x: hidden; }
        nav { position: fixed; top: 0; width: 100%; padding: 14px 40px; background: rgba(255,255,255,0.8); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); z-index: 100; display: flex; justify-content: space-between; align-items: center; }
        .logo-link { text-decoration: none; color: inherit; }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; letter-spacing: -0.5px; }
        .logo svg { height: 32px; }
        @keyframes hexRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hex-logo { animation: hexRotate 20s linear infinite; transform-origin: center; }
        .nav-links a { color: var(--black); text-decoration: none; margin-left: 28px; font-size: 12px; opacity: 0.8; transition: opacity 0.3s; }
        .nav-links a:hover { opacity: 1; }
        .back-link { display: inline-block; font-size: 18px; color: var(--blue); text-decoration: none; margin-bottom: 24px; opacity: 0.8; }
        .back-link:hover { opacity: 1; text-decoration: underline; }
        .hero { min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: var(--black); color: var(--white); padding: 120px 20px 80px; }
        .hero h1 { font-size: clamp(36px, 6vw, 64px); font-weight: 700; letter-spacing: -2px; line-height: 1.1; margin-bottom: 16px; }
        .hero .subtitle { font-size: clamp(18px, 2.5vw, 24px); color: var(--gray); max-width: 640px; line-height: 1.4; }
        .badge-hero { display: inline-block; background: rgba(41,151,255,0.12); border: 1px solid rgba(41,151,255,0.25); border-radius: 20px; padding: 8px 20px; font-size: 14px; color: var(--blue); margin-top: 24px; letter-spacing: 0.3px; }
        .section { padding: 100px 40px; max-width: 900px; margin: 0 auto; }
        .section h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 700; letter-spacing: -1.5px; margin-bottom: 24px; line-height: 1.15; }
        .section h3 { font-size: 22px; font-weight: 600; letter-spacing: -0.5px; margin: 44px 0 14px; }
        .section p { font-size: 18px; color: var(--gray); line-height: 1.6; margin-bottom: 20px; }
        .section p:last-child { margin-bottom: 0; }
        .section strong { color: var(--black); }
        .section ol { margin: 0 0 20px 22px; }
        .section ol li { font-size: 17px; color: var(--gray); line-height: 1.6; margin-bottom: 12px; }
        .section ol li strong { color: var(--black); }
        .section ul { margin: 0 0 20px 22px; }
        .section ul li { font-size: 17px; color: var(--gray); line-height: 1.6; margin-bottom: 10px; }
        .section ul li strong { color: var(--black); }
        code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 14px; background: var(--light-gray); padding: 2px 6px; border-radius: 5px; color: var(--black); }
        .diagram { background: #0d0d0f; border-radius: 16px; padding: 26px 24px; margin: 28px 0; overflow-x: auto; }
        .diagram pre { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12.5px; line-height: 1.5; color: #d6d6dc; margin: 0; white-space: pre; }
        .diagram .c-hr { color: var(--orange); }
        .diagram .c-adv { color: var(--green); }
        .diagram .c-sync { color: var(--blue); }
        .metric-row { display: flex; gap: 28px; margin: 40px 0; flex-wrap: wrap; }
        .metric { flex: 1; min-width: 150px; background: var(--light-gray); border-radius: 16px; padding: 24px 20px; }
        .metric .value { font-size: 42px; font-weight: 700; letter-spacing: -2px; color: var(--blue); line-height: 1.1; }
        .metric .value.red { color: var(--red); }
        .metric .value.orange { color: var(--orange); }
        .metric .value.green { color: var(--green); }
        .metric .value.sm { font-size: 32px; letter-spacing: -1px; }
        .metric .label { font-size: 14px; color: var(--gray); margin-top: 8px; line-height: 1.35; }
        .comp-table { width: 100%; border-collapse: collapse; margin: 28px 0; font-size: 15px; }
        .comp-table th { text-align: left; padding: 12px 16px; border-bottom: 2px solid var(--light-gray); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--gray); }
        .comp-table td { padding: 14px 16px; border-bottom: 1px solid var(--light-gray); color: var(--gray); vertical-align: top; }
        .comp-table td strong { color: var(--black); }
        .comp-table .ok { color: var(--green); font-weight: 700; font-family: 'SF Mono', monospace; }
        .comp-table .bad { color: var(--red); font-weight: 700; font-family: 'SF Mono', monospace; }
        .comp-table .keep { color: var(--gray); }
        .comp-table .code { font-family: 'SF Mono', monospace; font-size: 13px; }
        .note { background: var(--light-gray); border-left: 3px solid var(--blue); border-radius: 0 12px 12px 0; padding: 20px 24px; margin: 28px 0; font-size: 16px; color: var(--gray); line-height: 1.6; }
        .note strong { color: var(--black); }
        .note .nt { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--blue); font-weight: 700; margin-bottom: 8px; }
        .note.lead { border-left-color: var(--orange); }
        .note.lead .nt { color: var(--orange); }
        .note.warn { border-left-color: var(--red); }
        .note.warn .nt { color: var(--red); }
        .see-also { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--gray); text-decoration: none; border: 1px solid #d2d2d7; border-radius: 980px; padding: 10px 18px; }
        .see-also a { color: var(--blue); text-decoration: none; }
        .see-also a:hover { text-decoration: underline; }
        .attribution { text-align: center; font-size: 15px; color: var(--gray); padding: 0 40px; margin: -40px auto 0; max-width: 900px; }
        .attribution a { color: var(--blue); text-decoration: none; font-weight: 500; }
        footer { text-align: center; padding: 40px 20px; font-size: 12px; color: var(--gray); border-top: 1px solid var(--light-gray); }
        footer a { color: var(--blue); text-decoration: none; }
        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; z-index: 110; }
        .hamburger span { display: block; width: 24px; height: 2px; background: var(--black); border-radius: 2px; transition: all 0.3s; }
        .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        @media (max-width: 600px) {
            nav { padding: 14px 20px; }
            .hamburger { display: flex; }
            .nav-links { position: fixed; top: 0; right: 0; width: 260px; height: 100vh; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: flex; flex-direction: column; justify-content: center; padding: 0 40px; transform: translateX(100%); transition: transform 0.3s ease; z-index: 105; box-shadow: -4px 0 24px rgba(0,0,0,0.1); }
            .nav-links.open { transform: translateX(0); }
            .nav-links a { margin-left: 0; margin-bottom: 24px; font-size: 20px; opacity: 0.85; }
            .section { padding: 60px 20px; }
            .section p, .section ol li, .section ul li { font-size: 16px; }
            .metric-row { gap: 16px; }
            .metric { min-width: calc(50% - 12px); }
            .metric .value { font-size: 38px; }
            .metric .value.sm { font-size: 28px; }
            .comp-table { font-size: 13px; }
            .comp-table th, .comp-table td { padding: 10px 8px; }
        }
    </style>
</head>
<body>
    <nav>
        <a href="/" class="logo-link">
            <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5" class="hex-logo"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
            </div>
        </a>
        <div class="nav-links">
            <a href="/about">About</a>
            <a href="/#capabilities">Capabilities</a>
            <a href="/#pentest">Pentest</a>
            <a href="/Use-Cases">Use Cases</a>
            <a href="/briefings">Briefings</a>
            <a href="/#contact">Contact</a>
        </div>
        <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </nav>

    <section class="hero">
        <a href="/Use-Cases" class="back-link fade-in">← All Use Cases</a>
        <h1 class="fade-in">Hybrid AD ↔ Entra<br>Onboarding / Offboarding</h1>
        <p class="subtitle fade-in">A deterministic, role-driven pipeline that onboards and offboards employees across on-prem Active Directory and Microsoft Entra ID — with human checkpoints for the judgment calls, and a complete, honest audit trail.</p>
        <div class="badge-hero fade-in">Automation does the bulk · Humans own the judgment calls · Every step audited</div>
    </section>

    <section class="section">
        <h2 class="fade-in">The Problem</h2>
        <p class="fade-in">Onboarding and offboarding a hybrid employee is slow and error-prone because the steps span two identity systems plus mail, device, and delegation surfaces that are easy to miss.</p>
        <p class="fade-in">The most common failure is <strong>incomplete access removal on offboarding</strong> — a disabled account that still holds group memberships, active sessions, MFA methods, shared-mailbox delegates, or third-party OAuth tokens. On the other side, <strong>onboarding</strong> is inconsistent: the same role gets a different set of groups depending on who typed the commands, and there is no record to prove it happened.</p>
        <p class="fade-in">The fix is a deterministic, role-template-driven flow where <strong>AD is the source of truth</strong>, the deterministic bulk is automated, the judgment calls are explicit human checkpoints, and every step — including every failure — is written to a timestamped audit log.</p>
    </section>

    <section class="section">
        <h2 class="fade-in">The Architecture</h2>
        <p class="fade-in">On-prem Active Directory is the write path. Azure AD Connect syncs changes to Microsoft Entra ID. Microsoft Graph is used <strong>read-only</strong> to verify state and drive the audit — never as a second write source, so the two systems never disagree.</p>
        <div class="diagram fade-in"><pre>
WRITE   AD account + group membership ──(WinRM, DC)──► on-prem AD
BRIDGE  Azure AD Connect (delta sync) ───────────────► pushes AD → Entra ID
VERIFY  Microsoft Graph (read-only service principal) ► confirm + audit
CONTROL explicit human checkpoints — logged, never auto-approved
</pre></div>
        <p class="fade-in">Role templates drive assignment. <strong>Standard roles</strong> (e.g. IT-Engineer) run the full automated flow. Roles that declare <strong>elevated access</strong> (Domain Admin, jump hosts, financial write) <strong>stop at a checkpoint</strong> — nothing privileged is auto-assigned.</p>
    </section>

    <section class="section">
        <h2 class="fade-in">The Flow — with the Human Checkpoints</h2>
                
        <div class="diagram fade-in" style="overflow-x:auto;">
            <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#86868b;margin-bottom:14px;">Onboarding</div>
<pre class="mermaid" style="max-width:520px;margin:0 auto;">
flowchart TD
    A[INTAKE&lt;br/&gt;Parse HR PDF] --&gt; B{CHECKPOINT&lt;br/&gt;HR-CONFIRM&lt;br/&gt;HR lead approves summary}
    B --&gt; C[P1: Account Creation&lt;br/&gt;Conflict-check →&lt;br/&gt;Create/reconcile AD account →&lt;br/&gt;Set attributes]
    C --&gt; D[Trigger sync →&lt;br/&gt;Wait for Entra →&lt;br/&gt;License-conflict check]
    D --&gt; E[P2: Access Assignment&lt;br/&gt;Assign role groups&lt;br/&gt;security / functional / mail]
    E --&gt; F[Nested-group resolution]
    F --&gt; G{Role declares&lt;br/&gt;elevated access?}
    G --&gt;|Yes| H{{CHECKPOINT&lt;br/&gt;ELEVATED&lt;br/&gt;Flow stops — nothing&lt;br/&gt;privileged auto-assigned}}
    G --&gt;|No| I[P3: Verify &amp; Notify&lt;br/&gt;Verify AD + Entra →&lt;br/&gt;Notify hiring manager]
    H -.-&gt;|manual approval required| I

    classDef checkpoint fill:#ff9f0a,stroke:#ffc266,stroke-width:2px,color:#241804
    classDef process fill:#13233b,stroke:#2997ff,stroke-width:1.4px,color:#ffffff
    classDef decision fill:#2a2008,stroke:#ffb340,stroke-width:1.4px,color:#ffb340

    class B,H checkpoint
    class A,C,D,E,F,I process
    class G decision</pre>
        </div>
        <div class="diagram fade-in" style="overflow-x:auto;">
            <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#86868b;margin-bottom:14px;">Offboarding</div>
<pre class="mermaid" style="max-width:520px;margin:0 auto;">
flowchart TD
    A[P1: Immediate Containment&lt;br/&gt;Disable account →&lt;br/&gt;Revoke sessions + OAuth →&lt;br/&gt;Reset password →&lt;br/&gt;Revoke MFA] --&gt; B[Trigger sync]
    B --&gt; C{Intune-managed&lt;br/&gt;device found?}
    C --&gt;|Yes| D{{CHECKPOINT: DEVICE&lt;br/&gt;Flag for manual decision&lt;br/&gt;wipe / unenroll / recover}}
    C --&gt;|No| E[P2: Access Cleanup&lt;br/&gt;Remove from ALL groups →&lt;br/&gt;Move to restricted OU]
    D -.-&gt; E
    E --&gt; F[Delegate check&lt;br/&gt;shared mailbox / SharePoint]
    F --&gt; G{{CHECKPOINT&lt;br/&gt;MANAGER-DATA&lt;br/&gt;Mailbox forwarding &amp;&lt;br/&gt;data-archival decisions}}
    G --&gt; H{{CHECKPOINT&lt;br/&gt;DUAL-SIGNOFF&lt;br/&gt;IT + HR sign-off +&lt;br/&gt;legal-hold gate}}
    H --&gt; I[/Final Deletion&lt;br/&gt;NOT executed in demo —&lt;br/&gt;gated, logged as pending/]

    classDef checkpoint fill:#ff9f0a,stroke:#ffc266,stroke-width:2px,color:#241804
    classDef process fill:#13233b,stroke:#2997ff,stroke-width:1.4px,color:#ffffff
    classDef decision fill:#2a2008,stroke:#ffb340,stroke-width:1.4px,color:#ffb340
    classDef notrun fill:#17171a,stroke:#86868b,stroke-width:1.4px,stroke-dasharray:6 5,color:#86868b

    class D,G,H checkpoint
    class A,B,E,F process
    class C decision
    class I notrun</pre>
        </div>

        <p class="fade-in">The design principle: <strong>automation does the deterministic bulk, humans own the judgment calls</strong> — elevated access, data handling, and destructive deletion. Nothing privileged or irreversible is auto-executed.</p>
    </section>

    <section class="section">
        <h2 class="fade-in">Results — Measured, Not Claimed</h2>
        <p class="fade-in">Both flows were run end-to-end against a real hybrid lab (on-prem AD, Azure AD Connect, Microsoft Entra ID) for a test employee, and every number below was read from the timestamped audit of that run.</p>
        <div class="metric-row fade-in">
            <div class="metric"><div class="value green sm">7 / 7</div><div class="label">Role groups assigned on onboarding (verified in AD)</div></div>
            <div class="metric"><div class="value green sm">9</div><div class="label">Groups removed on offboarding (incl. nested)</div></div>
            <div class="metric"><div class="value green sm">30</div><div class="label">Timestamped audit events, offboard run</div></div>
            <div class="metric"><div class="value orange sm">4</div><div class="label">Human checkpoints (offboard) — all logged, none auto-approved</div></div>
        </div>
        <h3 class="fade-in">Where the time actually went</h3>
        <p class="fade-in">A single known lab defect dominates the wall clock: the AD Connect sync-trigger cmdlet hangs (~90 s per run, finding F4). Stripping that one hung call out, the real automation work is small and fast:</p>
        <table class="comp-table fade-in">
            <thead><tr><th>Operation</th><th>Measured</th><th>Note</th></tr></thead>
            <tbody>
                <tr><td><strong>Onboard — account + 7 groups + Entra verify</strong></td><td class="ok">~37 s</td><td>95 s wall includes one 90 s sync-trigger hang</td></tr>
                <tr><td><strong>Offboard — disable, pw reset, 9 group removals</strong></td><td class="ok">~12 s</td><td>92 s wall includes one 90 s sync-trigger hang</td></tr>
                <tr><td><strong>9-group removal (the critical step)</strong></td><td class="ok">&lt; 1 s / group</td><td>via <code>Set-ADGroup -Remove</code>; the <code>Remove-ADGroupMember</code> cmdlet hung (F2)</td></tr>
            </tbody>
        </table>
        <div class="note fade-in"><span class="nt">Manual baseline — an estimate, clearly labelled</span>A skilled operator doing the same ~20 steps manually across AD + Entra + mail consoles typically takes 30–45 minutes per offboard, with a real risk of missing a group, MFA method, OAuth token, or delegate — and no trace that it happened at all. <strong>This baseline is an estimate, not a stopwatch run</strong>; the automation's real value is completeness, auditability, and determinism, not raw speed.</div>
    </section>

    <section class="section">
        <h2 class="fade-in">The Findings — Where the Platform Drew the Line</h2>
        <p class="fade-in">These are the non-obvious, verified-in-lab facts that any team building this automation will hit. Reported honestly — not hidden as errors.</p>
        <table class="comp-table fade-in">
            <thead><tr><th>Finding</th><th>What happened</th></tr></thead>
            <tbody>
                <tr><td><strong>UPN suffix is not assumed</strong></td><td>An AD account <code>user@company.com</code> synced to Entra as <code>user@tenant.onmicrosoft.com</code> — not the expected domain. All Entra lookups therefore key on <code>onPremisesSamAccountName</code> (reliable), never the guessed UPN.</td></tr>
                <tr><td><strong>Group-removal cmdlet hangs</strong></td><td><code>Remove-ADGroupMember</code> hung indefinitely in this multi-DC lab, while the delta-attribute path <code>Set-ADGroup -Remove @{Member=…}</code> completed all 9 removals in &lt; 1 s/group. The pipeline uses the working path and a hard per-call timeout as the guard.</td></tr>
                <tr><td><strong>Session contamination</strong></td><td>A hung WinRM op left the shared WSMan session locked, so every following call returned HTTP 400. Fixed by evicting the session on timeout so the next call opens fresh — after which the group assignments succeeded.</td></tr>
                <tr><td><strong>Disabling ≠ revoking OAuth</strong></td><td><code>revokeSignInSessions</code> returned 403 (scope not granted to the service principal). Disabling an account does not by itself invalidate third-party "Sign in with Microsoft" tokens — the scope must be granted and the call made.</td></tr>
                <tr><td><strong>Developer-tenant limits</strong></td><td>No Exchange, no Intune, 0 subscribed SKUs, 0 dynamic groups. So mail delivery, shared-mailbox delegates, Intune wipe, and the license-<em>conflict</em> branch could not be exercised — each is logged as a valid negative result, not a silent skip.</td></tr>
            </tbody>
        </table>
        <div class="note lead fade-in"><span class="nt">The takeaway</span>The hard part of identity automation is not the happy path — it is the <strong>failure modes and the platform's quiet limits</strong>: a cmdlet that hangs instead of erroring, a shared session that poisons itself, an OAuth revocation that 403s, and a Developer tenant that can't host the mail/device surfaces you expect. An honest audit surface all of these; a happy-path script hides them.</div>
    </section>

    <section class="section">
        <h2 class="fade-in">What Was Not Exercised (Stated Explicitly)</h2>
        <ul class="fade-in">
            <li><strong>Final account deletion</strong> — gated behind IT + HR dual sign-off and a legal-hold check; intentionally not executed in the demo (the safe default). The code path is present.</li>
            <li><strong>Shared-mailbox / SharePoint delegate removal</strong> — no Exchange/SharePoint in the lab; the check runs and is logged, but real removal is untestable here.</li>
            <li><strong>Intune device wipe / unenroll</strong> — no enrolled devices; the flag-then-decide path is present, but no destructive action was taken (no auto-wipe by default).</li>
            <li><strong>Third-party OAuth revocation</strong> — blocked by the 403 scope; not validated end-to-end.</li>
            <li><strong>License-conflict resolution branch</strong> — only the "no conflict possible" path was hit (0 SKUs / 0 dynamic groups); the overlap-resolution path is untested.</li>
            <li><strong>Multi-UPN-suffix tenants</strong> — only a single-suffix on-prem domain was tested.</li>
        </ul>
    </section>

    <section class="section" style="padding-top: 0;">
        <span class="see-also fade-in">See also: <a href="/use-cases/entra-cis-v2">Entra ID CIS Benchmark Audit — v2 →</a> · <a href="/use-cases/entrasync">Event-Driven Azure AD Sync →</a></span>
    </section>

    <footer><p>Copyright © 2026 <a href="/">AppoSight</a>. All rights reserved.</p></footer>

    <script>
        (function(){
            var h = document.querySelector('.hamburger');
            var n = document.querySelector('.nav-links');
            if(h && n){
                h.addEventListener('click', function(){
                    h.classList.toggle('active');
                    n.classList.toggle('open');
                });
                n.querySelectorAll('a').forEach(function(l){
                    l.addEventListener('click', function(){
                        h.classList.remove('active');
                        n.classList.remove('open');
                    });
                });
            }
        })();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        setTimeout(() => { document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible')); }, 2000);
    </script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.15.0/mermaid.min.js"></script>
    <script>
        (function(){
            var cfg={ startOnLoad:false, theme:'base', htmlLabels:true, flowchart:{ curve:'basis' },
  themeVariables:{ primaryColor:'#1a1a1e', primaryTextColor:'#ffffff', primaryBorderColor:'#3a3a40',
    lineColor:'#8a8a90', secondaryColor:'#1a1a1e', tertiaryColor:'#2a2a30',
    fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" } };
            mermaid.initialize(cfg);
            mermaid.run({querySelector:'.mermaid'});
        })();
    </script>
</body>
</html>
`;

// --- Use Case: Domain Controller in Azure (AI-agent case study) ---
const DC_AZURE_DEPLOYMENT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deploying a Domain Controller to Azure with an AI Agent | AppoSight</title>
    <meta name="description" content="&lt;strong&gt;How an AI agent extended our on-premises Active Directory into the cloud — provisioning, networking, and validating a new domain controller with a human approving every credentialed step.&lt;/strong&gt;">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --black: #1d1d1f; --gray: #86868b; --light-gray: #f5f5f7; --white: #ffffff; --blue: #2997ff; --green: #30d158; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--black); background: var(--white); overflow-x: hidden; }
        nav { position: fixed; top: 0; width: 100%; padding: 14px 40px; background: rgba(255,255,255,0.8); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); z-index: 100; display: flex; justify-content: space-between; align-items: center; }
        .logo-link { text-decoration: none; color: inherit; }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; letter-spacing: -0.5px; }
        .logo svg { height: 32px; }
        @keyframes hexRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hex-logo { animation: hexRotate 20s linear infinite; transform-origin: center; }
        .nav-links a { color: var(--black); text-decoration: none; margin-left: 28px; font-size: 12px; opacity: 0.8; transition: opacity 0.3s; }
        .nav-links a:hover { opacity: 1; }
        .back-link { display: inline-block; font-size: 18px; color: var(--blue); text-decoration: none; margin-bottom: 24px; opacity: 0.8; }
        .back-link:hover { opacity: 1; text-decoration: underline; }
        .hero { min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: var(--black); color: var(--white); padding: 120px 20px 80px; }
        .hero h1 { font-size: clamp(36px, 6vw, 60px); font-weight: 700; letter-spacing: -2px; line-height: 1.1; margin-bottom: 16px; max-width: 1000px; }
        .hero .subtitle { font-size: clamp(17px, 2.4vw, 22px); color: var(--gray); max-width: 680px; line-height: 1.4; }
        .section { padding: 90px 40px; max-width: 900px; margin: 0 auto; }
        .section h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 700; letter-spacing: -1.5px; margin-bottom: 24px; line-height: 1.15; }
        .section h3 { font-size: 22px; font-weight: 600; letter-spacing: -0.5px; margin: 44px 0 14px; }
        .section p { font-size: 18px; color: var(--gray); line-height: 1.6; margin-bottom: 20px; }
        .section p:last-child { margin-bottom: 0; }
        .section p strong { color: var(--black); }
        .section em { font-style: italic; }
        .section ul { margin: 0 0 20px 22px; }
        .section ul li { font-size: 17px; color: var(--gray); line-height: 1.6; margin-bottom: 12px; }
        .section ul li strong { color: var(--black); }
        .comp-table { width: 100%; border-collapse: collapse; margin: 28px 0; font-size: 15px; }
        .comp-table th { text-align: left; padding: 12px 16px; border-bottom: 2px solid var(--light-gray); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--gray); }
        .comp-table td { padding: 14px 16px; border-bottom: 1px solid var(--light-gray); color: var(--gray); vertical-align: top; }
        .comp-table td strong { color: var(--black); }
        .diagram { background: #0d0d0f; border-radius: 16px; padding: 26px 24px; margin: 28px 0; overflow-x: auto; }
        .diagram pre { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 13px; line-height: 1.55; color: #d6d6dc; margin: 0; white-space: pre; }
        .img-card { background: #ffffff; border: 1px solid #e8e8ed; border-radius: 16px; padding: 20px; margin: 28px 0; box-shadow: 0 2px 12px rgba(0,0,0,0.05); overflow-x: auto; }
        .img-card svg { max-width: 100%; }
        .caption { font-size: 14px; color: var(--gray); margin-top: 14px; text-align: center; line-height: 1.5; }
        .see-also { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--gray); text-decoration: none; border: 1px solid #d2d2d7; border-radius: 980px; padding: 10px 18px; }
        footer { text-align: center; padding: 40px 20px; font-size: 12px; color: var(--gray); border-top: 1px solid var(--light-gray); }
        footer a { color: var(--blue); text-decoration: none; }
        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; z-index: 110; }
        .hamburger span { display: block; width: 24px; height: 2px; background: var(--black); border-radius: 2px; transition: all 0.3s; }
        .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        @media (max-width: 600px) {
            nav { padding: 14px 20px; }
            .hamburger { display: flex; }
            .nav-links { position: fixed; top: 0; right: 0; width: 260px; height: 100vh; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: flex; flex-direction: column; justify-content: center; padding: 0 40px; transform: translateX(100%); transition: transform 0.3s ease; z-index: 105; box-shadow: -4px 0 24px rgba(0,0,0,0.1); }
            .nav-links.open { transform: translateX(0); }
            .nav-links a { margin-left: 0; margin-bottom: 24px; font-size: 20px; opacity: 0.85; }
            .section { padding: 60px 20px; }
            .section p, .section ul li { font-size: 16px; }
            .comp-table { font-size: 13px; }
            .comp-table th, .comp-table td { padding: 10px 8px; }
            .img-card { padding: 12px; }
        }
    </style>
</head>
<body>
    <nav>
        <a href="/" class="logo-link">
            <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5" class="hex-logo"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
            </div>
        </a>
        <div class="nav-links">
            <a href="/about">About</a>
            <a href="/#capabilities">Capabilities</a>
            <a href="/#pentest">Pentest</a>
            <a href="/Use-Cases">Use Cases</a>
            <a href="/briefings">Briefings</a>
            <a href="/#contact">Contact</a>
        </div>
        <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </nav>

    <section class="hero">
        <a href="/Use-Cases" class="back-link fade-in" style="color:var(--blue)">← All Use Cases</a>
        <h1 class="fade-in">Deploying a Domain Controller to Azure with an AI Agent</h1>
        <p class="subtitle fade-in"><strong>How an AI agent extended our on-premises Active Directory into the cloud — provisioning, networking, and validating a new domain controller with a human approving every credentialed step.</strong></p>
    </section>

    <section class="section">
        <h2 class="fade-in">The goal</h2>
        <p class="fade-in">As a sysadmin managing on-prem Active Directory (two Windows Server domain controllers, already hybrid-synced to Microsoft Entra ID), we set out to test a practical question: <strong>could an AI agent handle real, end-to-end infrastructure deployment — not a scripted demo, but actual cloud provisioning, networking, and Active Directory work — while a human stayed in control of every sensitive step?</strong></p>
        <p class="fade-in">The project: deploy a <strong>new, additional</strong> domain controller in Azure that joins and replicates with our existing on-prem domain. Nothing on-prem was removed or replaced — this was extending our AD environment into the cloud, coordinated through an AI agent with terminal, SSH, and browser-automation access.</p>
        <p class="fade-in">An isolated, no-uplink clone of one domain controller was created early on as an additional safety measure. In practice, most of the networking and troubleshooting work took place directly against the production environment — a real, live infrastructure test, with every privileged or potentially destructive action requiring explicit human execution rather than agent autonomy.</p>
        <p class="fade-in"><strong>Result:</strong> a fully functioning, replicating domain controller running in Azure, verified with zero replication errors across all three domain controllers, in both directions.</p>
    </section>

    <section class="section">
        <h2 class="fade-in">The architecture</h2>
        <table class="comp-table fade-in">
            <thead><tr>
                <th>Component</th>
                <th>Details</th>
            </tr></thead>
            <tbody>
                <tr><td>Azure</td><td>Resource group with a VNet, network security groups locked to a single trusted IP, a VPN Gateway supporting both site-to-site and point-to-site connectivity, and a Windows Server 2022 VM</td></tr>
                <tr><td>On-prem</td><td>Existing KVM host running the two production domain controllers, an isolated test network used for early validation, and strongSwan providing the IPsec tunnel</td></tr>
                <tr><td>Connectivity</td><td>A site-to-site VPN tunnel carrying only traffic between the on-prem subnet and the Azure VNet, with every AD-relevant port (Kerberos, LDAP, DNS, RPC, SMB) explicitly allowed and everything else denied</td></tr>
            </tbody>
        </table>
        <figure class="img-card fade-in" id="fig-arch"><svg width="100%" height="auto" viewBox="0 0 1000 560" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica, Arial, sans-serif">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#4a5568"/>
    </marker>
  </defs>

  <rect width="1000" height="560" fill="#ffffff"/>

  <!-- Title -->
  <text x="500" y="36" text-anchor="middle" font-size="22" font-weight="600" fill="#1a202c">On-Prem to Azure: Domain Controller Deployment Architecture</text>

  <!-- On-prem region -->
  <rect x="40" y="80" width="380" height="400" rx="12" fill="#f7fafc" stroke="#cbd5e0" stroke-width="2"/>
  <text x="230" y="110" text-anchor="middle" font-size="16" font-weight="600" fill="#2d3748">On-Premises (KVM Host)</text>

  <rect x="80" y="140" width="300" height="70" rx="8" fill="#e2e8f0" stroke="#a0aec0" stroke-width="1.5"/>
  <text x="230" y="168" text-anchor="middle" font-size="14" font-weight="600" fill="#2d3748">Domain Controller 1</text>
  <text x="230" y="188" text-anchor="middle" font-size="12" fill="#4a5568">Existing, production</text>

  <rect x="80" y="230" width="300" height="70" rx="8" fill="#e2e8f0" stroke="#a0aec0" stroke-width="1.5"/>
  <text x="230" y="258" text-anchor="middle" font-size="14" font-weight="600" fill="#2d3748">Domain Controller 2</text>
  <text x="230" y="278" text-anchor="middle" font-size="12" fill="#4a5568">Existing, production</text>

  <rect x="80" y="320" width="300" height="70" rx="8" fill="#fefcbf" stroke="#d69e2e" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="230" y="348" text-anchor="middle" font-size="14" font-weight="600" fill="#744210">Isolated Test Clone</text>
  <text x="230" y="368" text-anchor="middle" font-size="12" fill="#975a16">No uplink — safety boundary</text>

  <rect x="80" y="410" width="300" height="50" rx="8" fill="#bee3f8" stroke="#3182ce" stroke-width="1.5"/>
  <text x="230" y="440" text-anchor="middle" font-size="13" font-weight="600" fill="#2c5282">strongSwan — IPsec Tunnel Endpoint</text>

  <!-- Azure region -->
  <rect x="580" y="80" width="380" height="400" rx="12" fill="#f0fff4" stroke="#9ae6b4" stroke-width="2"/>
  <text x="770" y="110" text-anchor="middle" font-size="16" font-weight="600" fill="#22543d">Microsoft Azure (VNet)</text>

  <rect x="620" y="140" width="300" height="60" rx="8" fill="#c6f6d5" stroke="#38a169" stroke-width="1.5"/>
  <text x="770" y="164" text-anchor="middle" font-size="13" font-weight="600" fill="#22543d">VPN Gateway</text>
  <text x="770" y="182" text-anchor="middle" font-size="11" fill="#276749">Site-to-Site + Point-to-Site</text>

  <rect x="620" y="220" width="300" height="60" rx="8" fill="#c6f6d5" stroke="#38a169" stroke-width="1.5"/>
  <text x="770" y="244" text-anchor="middle" font-size="13" font-weight="600" fill="#22543d">Network Security Group</text>
  <text x="770" y="262" text-anchor="middle" font-size="11" fill="#276749">Locked to single trusted IP</text>

  <rect x="620" y="300" width="300" height="90" rx="8" fill="#68d391" stroke="#276749" stroke-width="2"/>
  <text x="770" y="332" text-anchor="middle" font-size="14" font-weight="700" fill="#1a202c">New Domain Controller</text>
  <text x="770" y="352" text-anchor="middle" font-size="12" fill="#22543d">Windows Server 2022 VM</text>
  <text x="770" y="370" text-anchor="middle" font-size="12" fill="#22543d">Promoted &amp; replicating</text>

  <rect x="620" y="410" width="300" height="50" rx="8" fill="#bee3f8" stroke="#3182ce" stroke-width="1.5"/>
  <text x="770" y="440" text-anchor="middle" font-size="13" font-weight="600" fill="#2c5282">Azure VPN Endpoint</text>

  <!-- Tunnel connector -->
  <line x1="380" y1="435" x2="620" y2="435" stroke="#3182ce" stroke-width="3" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
  <text x="500" y="420" text-anchor="middle" font-size="13" font-weight="600" fill="#2c5282">IPsec Tunnel</text>

  <!-- Replication arrows -->
  <path d="M 380 175 C 480 175, 520 335, 620 335" fill="none" stroke="#718096" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arrow)"/>
  <path d="M 620 345 C 520 345, 480 265, 380 265" fill="none" stroke="#718096" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arrow)"/>
  <text x="500" y="500" text-anchor="middle" font-size="12" fill="#718096" font-style="italic">Dashed lines: Active Directory replication traffic (Kerberos, LDAP, DNS, RPC)</text>

  <!-- Legend -->
  <rect x="40" y="520" width="18" height="18" fill="#fefcbf" stroke="#d69e2e"/>
  <text x="65" y="534" font-size="12" fill="#4a5568">Isolated / never touched production directly</text>
  <rect x="380" y="520" width="18" height="18" fill="#68d391" stroke="#276749"/>
  <text x="405" y="534" font-size="12" fill="#4a5568">End goal: new working domain controller</text>
</svg></figure>
    </section>

    <section class="section">
        <h2 class="fade-in">What the agent actually did</h2>
        <p class="fade-in">Provisioning went the way automation should: the AI agent handled Azure CLI work directly, built the VNet, subnets, NSGs, VPN Gateway, and VM, and caught several of its own mistakes along the way — an invalid package name, a misconfigured firewall rule, an Azure capacity wall on the first VM size requested. In each case it diagnosed the actual error text and adjusted rather than guessing blindly.</p>
        <p class="fade-in">The real test, though, was what happened once the infrastructure existed but the new domain controller still couldn't properly talk to the rest of the domain. Getting from "VM exists" to "VM is a healthy, replicating domain controller" required finding and fixing three genuinely subtle network faults — the kind that don't show up in a checklist and don't have a single obvious cause.</p>
        <h3 class="fade-in">Fault 1 — A tunnel that was "up" but carried no traffic</h3>
        <p class="fade-in">The VPN tunnel reported a healthy, connected state on both ends. But pings and connection tests across it failed 100% of the time. Rather than assume the tunnel itself was broken, the agent checked its actual encryption counters directly and found them frozen at zero — meaning no real traffic had ever crossed it, despite the healthy status.</p>
        <p class="fade-in">Tracing further, it found the on-prem host's own firewall was silently rewriting the source address of outbound traffic <em>before</em> the tunnel's encryption policy could ever match it — so packets bound for Azure were losing the very identity the tunnel needed to recognize and encrypt them. The fix was a single, precisely ordered firewall exception. Verification wasn't just "no more errors" — the agent re-checked the same encryption counters and watched them move from zero to real traffic before calling it fixed.</p>
        <figure class="img-card fade-in" id="fig-bug1"><svg width="100%" height="auto" viewBox="0 0 1000 380" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica, Arial, sans-serif">
  <defs>
    <marker id="arrowR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#4a5568"/>
    </marker>
  </defs>
  <rect width="1000" height="380" fill="#ffffff"/>
  <text x="500" y="32" text-anchor="middle" font-size="18" font-weight="600" fill="#1a202c">Bug 1 — Silent NAT Rewrite Breaking Tunnel Encryption</text>

  <!-- BEFORE -->
  <text x="250" y="66" text-anchor="middle" font-size="14" font-weight="700" fill="#c53030">BEFORE FIX</text>
  <rect x="60" y="80" width="150" height="55" rx="6" fill="#e2e8f0" stroke="#a0aec0"/>
  <text x="135" y="112" text-anchor="middle" font-size="12" fill="#2d3748">Packet leaves host</text>
  <text x="135" y="126" text-anchor="middle" font-size="10" fill="#4a5568">src: on-prem IP</text>

  <line x1="210" y1="107" x2="270" y2="107" stroke="#4a5568" stroke-width="2" marker-end="url(#arrowR)"/>

  <rect x="270" y="80" width="160" height="55" rx="6" fill="#fed7d7" stroke="#c53030" stroke-width="1.5"/>
  <text x="350" y="105" text-anchor="middle" font-size="12" font-weight="600" fill="#742a2a">Firewall NAT rule</text>
  <text x="350" y="120" text-anchor="middle" font-size="10" fill="#742a2a">rewrites source address</text>

  <line x1="430" y1="107" x2="490" y2="107" stroke="#4a5568" stroke-width="2" marker-end="url(#arrowR)"/>

  <rect x="490" y="80" width="160" height="55" rx="6" fill="#fed7d7" stroke="#c53030" stroke-width="1.5"/>
  <text x="570" y="105" text-anchor="middle" font-size="12" font-weight="600" fill="#742a2a">Tunnel policy check</text>
  <text x="570" y="120" text-anchor="middle" font-size="10" fill="#742a2a">source no longer matches</text>

  <line x1="650" y1="107" x2="710" y2="107" stroke="#c53030" stroke-width="2" marker-end="url(#arrowR)"/>

  <rect x="710" y="80" width="180" height="55" rx="6" fill="#742a2a"/>
  <text x="800" y="105" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">Packet sent in clear</text>
  <text x="800" y="120" text-anchor="middle" font-size="10" fill="#fed7d7">Never encrypted. Dropped.</text>

  <text x="500" y="160" text-anchor="middle" font-size="12" fill="#742a2a" font-style="italic">Evidence: tunnel encryption counter stuck at 0 bytes / 0 packets despite "Connected" status</text>

  <!-- divider -->
  <line x1="40" y1="185" x2="960" y2="185" stroke="#e2e8f0" stroke-width="2"/>

  <!-- AFTER -->
  <text x="250" y="216" text-anchor="middle" font-size="14" font-weight="700" fill="#276749">AFTER FIX</text>
  <rect x="60" y="230" width="150" height="55" rx="6" fill="#e2e8f0" stroke="#a0aec0"/>
  <text x="135" y="262" text-anchor="middle" font-size="12" fill="#2d3748">Packet leaves host</text>
  <text x="135" y="276" text-anchor="middle" font-size="10" fill="#4a5568">src: on-prem IP</text>

  <line x1="210" y1="257" x2="270" y2="257" stroke="#4a5568" stroke-width="2" marker-end="url(#arrowR)"/>

  <rect x="270" y="230" width="160" height="55" rx="6" fill="#c6f6d5" stroke="#276749" stroke-width="1.5"/>
  <text x="350" y="252" text-anchor="middle" font-size="12" font-weight="600" fill="#22543d">New exception rule</text>
  <text x="350" y="267" text-anchor="middle" font-size="10" fill="#22543d">tunnel traffic: skip NAT</text>

  <line x1="430" y1="257" x2="490" y2="257" stroke="#4a5568" stroke-width="2" marker-end="url(#arrowR)"/>

  <rect x="490" y="230" width="160" height="55" rx="6" fill="#c6f6d5" stroke="#276749" stroke-width="1.5"/>
  <text x="570" y="252" text-anchor="middle" font-size="12" font-weight="600" fill="#22543d">Tunnel policy check</text>
  <text x="570" y="267" text-anchor="middle" font-size="10" fill="#22543d">source address matches</text>

  <line x1="650" y1="257" x2="710" y2="257" stroke="#276749" stroke-width="2" marker-end="url(#arrowR)"/>

  <rect x="710" y="230" width="180" height="55" rx="6" fill="#276749"/>
  <text x="800" y="252" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">Encrypted &amp; delivered</text>
  <text x="800" y="267" text-anchor="middle" font-size="10" fill="#c6f6d5">Tunnel carries real traffic</text>

  <text x="500" y="315" text-anchor="middle" font-size="12" fill="#22543d" font-style="italic">Evidence: encryption counter moved to 5 packets / 420 bytes on first test</text>
  <text x="500" y="350" text-anchor="middle" font-size="11" fill="#718096">Fix: a single firewall exception, placed above the existing address-rewrite rule</text>
</svg></figure>
        <h3 class="fade-in">Fault 2 — Traffic worked one way, but not the other</h3>
        <p class="fade-in">With the tunnel actually carrying data, on-prem-to-Azure connections worked — but Azure-to-on-prem connections were explicitly rejected, not merely timing out. That distinction mattered: a timeout would suggest a routing gap, but an explicit rejection meant something was actively firing.</p>
        <p class="fade-in">The agent traced the exact firewall rule evaluation order and found the inbound rule required a connection to already be "established" — a condition no brand-new connection can ever satisfy. The outbound-direction rule had no such restriction, which explained the asymmetry perfectly. This same bug reappeared once, after a routine reboot regenerated the firewall configuration with the broken rule instead of the fix — so the agent didn't just patch it again, it rewrote its own recovery script to verify the rule's <em>position and correctness</em>, not merely its presence, closing the gap for good.</p>
        <figure class="img-card fade-in" id="fig-bug2"><svg width="100%" height="auto" viewBox="0 0 1000 400" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica, Arial, sans-serif">
  <defs>
    <marker id="arrowR2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#4a5568"/>
    </marker>
  </defs>
  <rect width="1000" height="400" fill="#ffffff"/>
  <text x="500" y="32" text-anchor="middle" font-size="18" font-weight="600" fill="#1a202c">Bug 2 — Asymmetric Firewall Rule Rejecting New Connections</text>

  <!-- Direction A - working -->
  <text x="500" y="66" text-anchor="middle" font-size="13" font-weight="700" fill="#276749">DIRECTION A: On-prem → Azure (worked)</text>
  <rect x="60" y="80" width="180" height="50" rx="6" fill="#e2e8f0" stroke="#a0aec0"/>
  <text x="150" y="110" text-anchor="middle" font-size="12" fill="#2d3748">On-prem DC</text>
  <line x1="240" y1="105" x2="330" y2="105" stroke="#276749" stroke-width="2" marker-end="url(#arrowR2)"/>
  <rect x="330" y="80" width="220" height="50" rx="6" fill="#c6f6d5" stroke="#276749" stroke-width="1.5"/>
  <text x="440" y="100" text-anchor="middle" font-size="11" font-weight="600" fill="#22543d">Firewall rule: no state check</text>
  <text x="440" y="116" text-anchor="middle" font-size="10" fill="#22543d">accepts any new connection</text>
  <line x1="550" y1="105" x2="640" y2="105" stroke="#276749" stroke-width="2" marker-end="url(#arrowR2)"/>
  <rect x="640" y="80" width="180" height="50" rx="6" fill="#68d391" stroke="#276749" stroke-width="1.5"/>
  <text x="730" y="110" text-anchor="middle" font-size="12" font-weight="700" fill="#1a202c">Reaches Azure ✓</text>

  <!-- Direction B - broken -->
  <text x="500" y="180" text-anchor="middle" font-size="13" font-weight="700" fill="#c53030">DIRECTION B: Azure → On-prem (rejected)</text>
  <rect x="60" y="194" width="180" height="50" rx="6" fill="#e2e8f0" stroke="#a0aec0"/>
  <text x="150" y="224" text-anchor="middle" font-size="12" fill="#2d3748">Azure new DC</text>
  <line x1="240" y1="219" x2="330" y2="219" stroke="#c53030" stroke-width="2" marker-end="url(#arrowR2)"/>
  <rect x="330" y="194" width="220" height="50" rx="6" fill="#fed7d7" stroke="#c53030" stroke-width="1.5"/>
  <text x="440" y="212" text-anchor="middle" font-size="11" font-weight="600" fill="#742a2a">Firewall rule: requires</text>
  <text x="440" y="228" text-anchor="middle" font-size="10" fill="#742a2a">"already established" state</text>
  <line x1="550" y1="219" x2="640" y2="219" stroke="#c53030" stroke-width="2" marker-end="url(#arrowR2)"/>
  <rect x="640" y="194" width="180" height="50" rx="6" fill="#742a2a"/>
  <text x="730" y="216" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">Rejected ✗</text>
  <text x="730" y="232" text-anchor="middle" font-size="9" fill="#fed7d7">new connection can never</text>

  <text x="500" y="278" text-anchor="middle" font-size="12" fill="#742a2a" font-style="italic">A brand-new connection can never be "already established" — the rule rejects every first packet</text>
  <text x="500" y="298" text-anchor="middle" font-size="12" fill="#4a5568" font-style="italic">Diagnostic clue: an explicit reject (not a timeout) meant a specific rule was firing, not a routing gap</text>

  <line x1="40" y1="320" x2="960" y2="320" stroke="#e2e8f0" stroke-width="2"/>
  <text x="500" y="350" text-anchor="middle" font-size="13" font-weight="600" fill="#2d3748">Fix: replace the state-restricted rule with an unconditional accept, matching Direction A's logic</text>
  <text x="500" y="374" text-anchor="middle" font-size="11" fill="#718096">Recurred once after a reboot regenerated the broken rule — recovery script rewritten to verify rule position, not just presence</text>
</svg></figure>
        <h3 class="fade-in">Fault 3 — The hardest: a silent packet-size mismatch</h3>
        <p class="fade-in">This was the hardest problem of the project. Small operations across the tunnel — DNS lookups, short authentication exchanges — worked perfectly. But the domain controller promotion process itself, which requires larger network exchanges, would hang for ten-plus minutes and fail with an unhelpful, generic Windows error.</p>
        <p class="fade-in">The agent worked through this methodically: ruling out clock synchronization (a real but insufficient earlier fix), confirming the tunnel's actual usable packet size was smaller than either side assumed, and finally identifying that Windows was sending packets larger than the tunnel could carry — with the network's standard "please shrink your packets" signal being silently dropped rather than delivered. This is a notoriously difficult class of network fault precisely because it produces no useful error message at all.</p>
        <p class="fade-in">The fix required a kernel-level rule rewriting oversized packets down to a safe size at the tunnel boundary. What stands out here is the verification discipline: the agent's first attempt to confirm the fix used an indirect signal, and it explicitly declined to accept that as proof. It then built a direct, unambiguous test — and in doing so caught a <em>second</em>, more subtle bug: the fix's own matching rule excluded exactly the packets that needed rewriting. It corrected that too, and only declared the issue closed after a counter-based test showed 41 out of 41 relevant packets crossing at the corrected size, with zero at the old, broken size.</p>
        <figure class="img-card fade-in" id="fig-bug3"><svg width="100%" height="auto" viewBox="0 0 1000 420" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica, Arial, sans-serif">
  <defs>
    <marker id="arrowR3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#4a5568"/>
    </marker>
  </defs>
  <rect width="1000" height="420" fill="#ffffff"/>
  <text x="500" y="32" text-anchor="middle" font-size="18" font-weight="600" fill="#1a202c">Bug 3 — Path MTU Blackhole (the hardest bug)</text>

  <text x="250" y="64" text-anchor="middle" font-size="13" font-weight="700" fill="#276749">SMALL REQUESTS — worked fine</text>
  <rect x="60" y="78" width="140" height="50" rx="6" fill="#e2e8f0" stroke="#a0aec0"/>
  <text x="130" y="108" text-anchor="middle" font-size="11" fill="#2d3748">DNS lookup</text>
  <line x1="200" y1="103" x2="260" y2="103" stroke="#276749" stroke-width="2" marker-end="url(#arrowR3)"/>
  <rect x="260" y="78" width="180" height="50" rx="6" fill="#c6f6d5" stroke="#276749" stroke-width="1.5"/>
  <text x="350" y="98" text-anchor="middle" font-size="11" font-weight="600" fill="#22543d">Fits under tunnel's</text>
  <text x="350" y="114" text-anchor="middle" font-size="10" fill="#22543d">real usable packet size</text>
  <line x1="440" y1="103" x2="500" y2="103" stroke="#276749" stroke-width="2" marker-end="url(#arrowR3)"/>
  <rect x="500" y="78" width="120" height="50" rx="6" fill="#68d391" stroke="#276749" stroke-width="1.5"/>
  <text x="560" y="108" text-anchor="middle" font-size="12" font-weight="700" fill="#1a202c">Delivered ✓</text>

  <text x="800" y="64" text-anchor="middle" font-size="13" font-weight="700" fill="#c53030">LARGE REQUESTS — silently failed</text>
  <rect x="660" y="78" width="130" height="50" rx="6" fill="#e2e8f0" stroke="#a0aec0"/>
  <text x="725" y="98" text-anchor="middle" font-size="11" fill="#2d3748">DC promotion</text>
  <text x="725" y="114" text-anchor="middle" font-size="10" fill="#2d3748">handshake</text>

  <rect x="60" y="160" width="880" height="90" rx="8" fill="#fff5f5" stroke="#c53030" stroke-width="1.5"/>
  <text x="500" y="185" text-anchor="middle" font-size="12" font-weight="600" fill="#742a2a">Windows advertises a packet size larger than the tunnel can actually carry</text>
  <text x="500" y="205" text-anchor="middle" font-size="12" fill="#742a2a">The standard "please shrink your packets" network signal never gets delivered back</text>
  <text x="500" y="225" text-anchor="middle" font-size="12" font-weight="700" fill="#742a2a">→ Oversized packet vanishes. No error. No retry signal. Just silence.</text>

  <text x="500" y="280" text-anchor="middle" font-size="12" fill="#742a2a" font-style="italic">Result: a 10+ minute hang, then a generic, unhelpful Windows error</text>

  <line x1="40" y1="300" x2="960" y2="300" stroke="#e2e8f0" stroke-width="2"/>

  <text x="500" y="330" text-anchor="middle" font-size="13" font-weight="700" fill="#2d3748">Fix: kernel-level rule rewrites oversized packets down to a safe size at the tunnel boundary</text>

  <rect x="200" y="345" width="600" height="55" rx="8" fill="#f0fff4" stroke="#276749" stroke-width="1.5"/>
  <text x="500" y="368" text-anchor="middle" font-size="12" font-weight="600" fill="#22543d">Verification: counter-based test, not an indirect signal</text>
  <text x="500" y="386" text-anchor="middle" font-size="12" fill="#22543d">41 of 41 packets crossed at the corrected size — 0 at the old, broken size</text>
</svg></figure>
    </section>

    <section class="section">
        <h2 class="fade-in">Making it durable</h2>
        <p class="fade-in">Once all three faults were fixed, the agent noted — unprompted — that none of the fixes would survive a reboot, since they existed only in the running system's memory. It built a dedicated boot-time service to reapply them automatically, carefully avoiding a trap it identified in advance: naively enabling the system's default firewall service would have wiped out unrelated rules for other services running on the same host.</p>
        <p class="fade-in">This wasn't just claimed to work — a real, full reboot was performed, and every fix was confirmed present and correctly ordered afterward, with the tunnel automatically reconnecting and full connectivity restored without any manual intervention.</p>
    </section>

    <section class="section">
        <h2 class="fade-in">Where the human stayed in control</h2>
        <p class="fade-in">Three categories of action never left human hands, for the entire project:</p>
        <ul class="fade-in">
            <li><strong>Credentials.</strong> Every password — host access, domain administrator credentials, VPN certificates — was entered interactively by the human or scoped through narrow, read-only permissions the agent could use without ever seeing a secret.</li>
            <li><strong>The domain controller promotion itself.</strong> The single command that actually made the new server a domain controller was run manually and live by the human, every time — including through genuine unrelated failures (a stale process lock, a corrupted internal database state) that had nothing to do with the network work and needed independent troubleshooting.</li>
            <li><strong>Privileged network changes.</strong> Every firewall and routing modification was staged by the agent as a reviewable script and executed by the human — which had the added benefit of leaving a clean, auditable trail of every change made.</li>
        </ul>
        <figure class="img-card fade-in" id="fig-topo"><svg width="100%" height="auto" viewBox="0 0 1100 720" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica, Arial, sans-serif">
  <defs>
    <marker id="arrowN" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#4a5568"/>
    </marker>
  </defs>
  <rect width="1100" height="720" fill="#ffffff"/>
  <text x="550" y="34" text-anchor="middle" font-size="20" font-weight="700" fill="#1a202c">Detailed Network Topology</text>
  <text x="550" y="54" text-anchor="middle" font-size="12" fill="#718096">Addresses shown are representative of the actual scheme used; public IPs are illustrative placeholders</text>

  <!-- ============ ON-PREM SIDE ============ -->
  <rect x="30" y="80" width="480" height="580" rx="10" fill="#f7fafc" stroke="#cbd5e0" stroke-width="2"/>
  <text x="270" y="106" text-anchor="middle" font-size="15" font-weight="700" fill="#2d3748">On-Premises — KVM / libvirt Host</text>
  <text x="270" y="124" text-anchor="middle" font-size="11" fill="#718096">Host WAN (behind NAT, port-forwarded): 203.0.113.10</text>

  <!-- production bridge -->
  <rect x="55" y="140" width="430" height="150" rx="8" fill="#edf2f7" stroke="#a0aec0" stroke-width="1.5"/>
  <text x="270" y="162" text-anchor="middle" font-size="13" font-weight="700" fill="#2d3748">Bridge: virbr0 — Production Network</text>
  <text x="270" y="178" text-anchor="middle" font-size="11" fill="#4a5568">192.168.122.0/24 · gateway 192.168.122.1</text>

  <rect x="75" y="192" width="185" height="45" rx="6" fill="#ffffff" stroke="#718096"/>
  <text x="167" y="210" text-anchor="middle" font-size="11" font-weight="600" fill="#2d3748">Domain Controller 1</text>
  <text x="167" y="225" text-anchor="middle" font-size="10" fill="#4a5568">192.168.122.2 — DNS, PDC</text>

  <rect x="280" y="192" width="185" height="45" rx="6" fill="#ffffff" stroke="#718096"/>
  <text x="372" y="210" text-anchor="middle" font-size="11" font-weight="600" fill="#2d3748">Domain Controller 2</text>
  <text x="372" y="225" text-anchor="middle" font-size="10" fill="#4a5568">192.168.122.3</text>

  <rect x="75" y="248" width="390" height="32" rx="6" fill="#e2e8f0" stroke="#a0aec0"/>
  <text x="270" y="269" text-anchor="middle" font-size="10" fill="#4a5568">Ports required outbound/inbound: TCP+UDP 53, 88, 135, 389, 445, 636 · TCP 49152-65535</text>

  <!-- isolated lab bridge -->
  <rect x="55" y="305" width="430" height="80" rx="8" fill="#fefcbf" stroke="#d69e2e" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="270" y="328" text-anchor="middle" font-size="13" font-weight="700" fill="#744210">Bridge: virbr100 — Isolated Test Network</text>
  <text x="270" y="346" text-anchor="middle" font-size="11" fill="#975a16">10.66.0.0/24 · no uplink to virbr0 or internet</text>
  <text x="270" y="362" text-anchor="middle" font-size="10" fill="#975a16">Used for pre-testing before any real DC was touched</text>

  <!-- host firewall/nat layer -->
  <rect x="55" y="405" width="430" height="110" rx="8" fill="#fed7d7" stroke="#c53030" stroke-width="1.5"/>
  <text x="270" y="428" text-anchor="middle" font-size="13" font-weight="700" fill="#742a2a">Host Firewall / NAT (nftables)</text>
  <text x="270" y="448" text-anchor="middle" font-size="10" fill="#742a2a">NAT exclusion: 192.168.122.0/24 → 10.20.0.0/16 bypasses masquerade</text>
  <text x="270" y="465" text-anchor="middle" font-size="10" fill="#742a2a">Forward accept: 10.20.0.0/16 → 192.168.122.0/24 (no state restriction)</text>
  <text x="270" y="482" text-anchor="middle" font-size="10" fill="#742a2a">MSS clamp: TCP SYN packets rewritten to 1398 bytes at tunnel egress</text>
  <text x="270" y="500" text-anchor="middle" font-size="9" fill="#9b2c2c" font-style="italic">These three rules were the source of Bugs 1–3 · persisted via boot-time service</text>

  <!-- tunnel endpoint -->
  <rect x="55" y="530" width="430" height="60" rx="8" fill="#bee3f8" stroke="#3182ce" stroke-width="1.5"/>
  <text x="270" y="554" text-anchor="middle" font-size="13" font-weight="700" fill="#2c5282">strongSwan — IPsec Tunnel Endpoint</text>
  <text x="270" y="572" text-anchor="middle" font-size="10" fill="#2c5282">IKEv2 · PSK auth · ESP encryption · auto-reconnect on boot</text>

  <rect x="55" y="605" width="430" height="40" rx="6" fill="#e2e8f0" stroke="#a0aec0"/>
  <text x="270" y="629" text-anchor="middle" font-size="10" fill="#4a5568">Local Network Gateway (Azure-side object): represents 192.168.122.0/24</text>

  <!-- ============ AZURE SIDE ============ -->
  <rect x="590" y="80" width="480" height="580" rx="10" fill="#f0fff4" stroke="#9ae6b4" stroke-width="2"/>
  <text x="830" y="106" text-anchor="middle" font-size="15" font-weight="700" fill="#22543d">Microsoft Azure — Virtual Network</text>
  <text x="830" y="124" text-anchor="middle" font-size="11" fill="#276749">Address space: 10.20.0.0/16</text>

  <!-- gateway subnet -->
  <rect x="615" y="140" width="430" height="90" rx="8" fill="#e6fffa" stroke="#38b2ac" stroke-width="1.5"/>
  <text x="830" y="162" text-anchor="middle" font-size="13" font-weight="700" fill="#234e52">Subnet: GatewaySubnet — 10.20.255.0/27</text>
  <rect x="635" y="172" width="390" height="45" rx="6" fill="#ffffff" stroke="#718096"/>
  <text x="830" y="190" text-anchor="middle" font-size="11" font-weight="600" fill="#2d3748">VPN Gateway (VpnGw1AZ, zone-redundant)</text>
  <text x="830" y="205" text-anchor="middle" font-size="10" fill="#4a5568">Public IP: 20.0.113.55 (placeholder) · IKEv2, S2S + P2S</text>

  <!-- vm subnet -->
  <rect x="615" y="245" width="430" height="140" rx="8" fill="#e6fffa" stroke="#38b2ac" stroke-width="1.5"/>
  <text x="830" y="267" text-anchor="middle" font-size="13" font-weight="700" fill="#234e52">Subnet: snet-vm — 10.20.1.0/24</text>

  <rect x="635" y="278" width="390" height="42" rx="6" fill="#ffffff" stroke="#718096"/>
  <text x="830" y="294" text-anchor="middle" font-size="11" font-weight="600" fill="#2d3748">Network Security Group</text>
  <text x="830" y="309" text-anchor="middle" font-size="9" fill="#4a5568">Inbound restricted to one trusted source IP</text>

  <rect x="635" y="328" width="390" height="45" rx="6" fill="#68d391" stroke="#276749" stroke-width="1.5"/>
  <text x="830" y="347" text-anchor="middle" font-size="12" font-weight="700" fill="#1a202c">New Domain Controller — 10.20.1.4</text>
  <text x="830" y="363" text-anchor="middle" font-size="10" fill="#22543d">Windows Server 2022 · no public IP</text>

  <!-- routing note -->
  <rect x="615" y="400" width="430" height="70" rx="8" fill="#edf2f7" stroke="#a0aec0"/>
  <text x="830" y="422" text-anchor="middle" font-size="11" font-weight="600" fill="#2d3748">Tunnel selector (traffic-of-interest)</text>
  <text x="830" y="440" text-anchor="middle" font-size="10" fill="#4a5568">192.168.122.0/24 ⇄ 10.20.0.0/16</text>
  <text x="830" y="456" text-anchor="middle" font-size="9" fill="#718096">Only these ranges are encrypted end-to-end</text>

  <!-- P2S note -->
  <rect x="615" y="485" width="430" height="60" rx="8" fill="#edf2f7" stroke="#a0aec0"/>
  <text x="830" y="507" text-anchor="middle" font-size="11" font-weight="600" fill="#2d3748">Point-to-Site (secondary path, optional)</text>
  <text x="830" y="524" text-anchor="middle" font-size="10" fill="#4a5568">Client address pool: 172.16.0.0/25 · cert-based auth</text>

  <!-- ============ TUNNEL LINK ============ -->
  <line x1="490" y1="560" x2="620" y2="185" stroke="#3182ce" stroke-width="3" marker-end="url(#arrowN)"/>
  <line x1="620" y1="185" x2="490" y2="560" stroke="#3182ce" stroke-width="3" marker-end="url(#arrowN)"/>
  <rect x="440" y="640" width="220" height="60" rx="8" fill="#bee3f8" stroke="#3182ce" stroke-width="1.5"/>
  <text x="550" y="662" text-anchor="middle" font-size="12" font-weight="700" fill="#2c5282">Site-to-Site IPsec Tunnel</text>
  <text x="550" y="678" text-anchor="middle" font-size="10" fill="#2c5282">IKEv2 · ESP · UDP 500/4500 NAT-T</text>
  <text x="550" y="692" text-anchor="middle" font-size="9" fill="#4a5568">Requires router port-forward for 500/4500</text>
</svg></figure>
    </section>

    <section class="section">
        <h2 class="fade-in">Verified outcome</h2>
        <div class="diagram fade-in"><pre>repadmin /replsummary

Source DSA          largest delta    fails/total %%   error
 CONTO-DC                  28m:30s    0 /  10    0
 CONTO-DC2                 32m:59s    0 /  10    0
 vm-w2022-poc              23m:12s    0 /  10    0

Destination DSA     largest delta    fails/total %%   error
 CONTO-DC                  23m:12s    0 /  10    0
 CONTO-DC2                 21m:24s    0 /  10    0
 vm-w2022-poc              33m:00s    0 /  10    0</pre></div>
        <p class="fade-in">Zero replication failures, in both directions, across all three domain controllers — confirmed live, in an active session on the newly deployed Azure domain controller.</p>
        <figure class="img-card fade-in" id="fig-rdp"><img src="data:image/png;base64,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" alt="repadmin /replsummary output in an active RDP session on the newly deployed Azure domain controller" style="width:100%;display:block;"></figure>
        <figure class="img-card fade-in" id="fig-vm"><img src="data:image/png;base64,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" alt="Azure Portal overview of the new domain controller VM (subscription ID redacted)" style="width:100%;display:block;"></figure>
        <figure class="img-card fade-in" id="fig-map"><img src="data:image/png;base64,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ZvPSJUsKC9f6M+t3nzh//vzp06cBwOPxiAu+2tvbvfP3dK2+vv7ixYu9Px5BEE6dOsXzvMVi8fNXo0DZt3ev9/t79uzZw4cPXzEHWGNjF6+trq5qbm6+7q9oaWnx50jcbvf5c+fEKScQClehkRW++vKLQ4cPqdXq48eOf/ThB73cW1mZsaKiQi6XY0Grl16vLyhYvGz5cp1Ot66wcOmSJQNQzGA0lq5etcrtdjudzh07dnT46b59e/2csq+8/Oyhgwf75JAUCgVFUTu2b8ccGeSMZcbjx4+Jy198/plUKvGOlWS1Wjdv3tzFa48cOVJVVdX1/i0WS8n33/tzJHa7bd++fTgVLQpvzIsvvhjoY7gOj8fz/PPP/+EPL6WkpIwbNy4xUedyuf7y8sv//c9HNE3ZHY63/va3b7752mw2jxkz5sknHj946OC2bdumTp16+PDhN994fceOnSNHjgSA5cue27btu6jo6Ndfe62mprr87NkRI0dWXrz40ksvfbtpkyE3d9u279a+8862bdtoikofNizQf3dPcBzXYcTiLvA8Ty7PgiPSarWZmVkzZ80yGAxlZcbCtYVms0mn03uHWO5b5eXlSpXy7NmzI0eOPH78eG5u7saN36xaterokSPpw4atfeed/fv3b9ny7Y033vS/j/wyOyfnxPHjDQ31+/bte+UvL1dVVU2aNPmvf32luLhIp9N5PB6b3bZly5bx4w0AcP7cuZUrV3715RfJyckyufwPv//95s2bRo4cIZFI1xUWvrt+nUQiOX7sOCFEo9F8/N//NtTXr1279tjRoydPnWJoes2a1WfPnG1ta8vJyfn0008EgSQkJPA8/+76dW/97W8H9u9XqVUvPP9CVWWlVqv94vPP337rrYbGhuzsnGeefurmW27ZuHHjuYqK/QcOfPjB+//61z8zh2fqAjccFs/zcHn6q+sSBEEQBKlUGvwxOikpaevW7yZPnnzuXEVtTW19Q31qaurf//72pk2bdmzffujQwYbGhubmprS09C+//IJhmFMnT/7+9y8aS0snTZ588eKFiIgIvV5vt9s/+vDDD97/944dO5KShrjd7t/97rfbvtuq1+nXrl27b9/eo8eOjh07bteukj27d48ZM+bJJ57Q6XR//tOfNn7zdXZOzu7duz/++L9HjxyNiIgYOXLke++9K5FIEhN1gX5vrsP7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" alt="Azure resource dependency map for the deployment" style="width:100%;display:block;"><figcaption class="caption">Azure Portal&rsquo;s auto-generated resource dependency view for the deployment&rsquo;s resource group</figcaption></figure>
    </section>

    <section class="section">
        <h2 class="fade-in">What this actually demonstrates</h2>
        <p class="fade-in">The interesting result isn't that an AI agent can run a single well-documented promotion command — it's that, given real infrastructure access and a disciplined human-in-the-loop model, it performed genuinely hard systems debugging: correlating symptoms across firewall rule order, packet captures, and kernel networking behavior; distinguishing a real fix from one that only looked correct; and knowing when to stop and hand a step back to a human rather than push through.</p>
        <p class="fade-in">Equally important is what it never did. Across dozens of privileged operations, the agent never held a production credential, never executed an irreversible domain change unsupervised, and — when a password was accidentally exposed mid-project — flagged it for rotation immediately rather than proceeding as if nothing had happened. That boundary wasn't added afterward. It was the operating model from the first message, and it held for the entire project without exception.</p>
    </section>

    <section class="section" style="padding-top: 0;">
        <span class="see-also fade-in">See also: <a href="/use-cases/dc-azure-security">Auditing and Securing a Domain Controller on Azure →</a></span>
    </section>

    <footer><p>Copyright © 2026 <a href="/">AppoSight</a>. All rights reserved.</p></footer>

    <script>
        (function(){
            var h = document.querySelector('.hamburger');
            var n = document.querySelector('.nav-links');
            if(h && n){
                h.addEventListener('click', function(){
                    h.classList.toggle('active');
                    n.classList.toggle('open');
                });
                n.querySelectorAll('a').forEach(function(l){
                    l.addEventListener('click', function(){
                        h.classList.remove('active');
                        n.classList.remove('open');
                    });
                });
            }
        })();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        setTimeout(() => { document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible')); }, 2000);
    </script>
</body>
</html>
`;

const DC_UPGRADE_CASE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upgrading a 2× Windows Server 2019 Domain to Server 2025 — Full Technical Case Study | AppoSight</title>
    <meta name="description" content="A two-phase Windows Server 2019 to 2025 domain controller swing migration - full technical case study with the DC4 identity saga root cause.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --black: #1d1d1f; --gray: #86868b; --light-gray: #f5f5f7; --white: #ffffff; --blue: #2997ff; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--black); background: var(--white); overflow-x: hidden; }
        nav { position: fixed; top: 0; width: 100%; padding: 14px 40px; background: rgba(255,255,255,0.8); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); z-index: 100; display: flex; justify-content: space-between; align-items: center; }
        .logo-link { text-decoration: none; color: inherit; }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; letter-spacing: -0.5px; }
        .logo svg { height: 32px; }
        @keyframes hexRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hex-logo { animation: hexRotate 20s linear infinite; transform-origin: center; }
        .nav-links a { color: var(--black); text-decoration: none; margin-left: 28px; font-size: 12px; opacity: 0.8; transition: opacity 0.3s; }
        .nav-links a:hover { opacity: 1; }
        .back-link { display: inline-block; font-size: 18px; color: var(--blue); text-decoration: none; margin-bottom: 24px; opacity: 0.8; }
        .back-link:hover { opacity: 1; text-decoration: underline; }
        .hero { min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: var(--black); color: var(--white); padding: 120px 20px 60px; }
        .hero h1 { font-size: clamp(34px, 5.5vw, 56px); font-weight: 700; letter-spacing: -2px; line-height: 1.1; margin-bottom: 16px; max-width: 1000px; }
        .hero .subtitle { font-size: clamp(16px, 2.2vw, 21px); color: var(--gray); max-width: 720px; line-height: 1.4; margin-bottom: 28px; }
        .hero .context { max-width: 720px; }
        .hero .context p { font-size: 15px; color: #b8b8bd; line-height: 1.55; margin-bottom: 10px; text-align: center; }
        .hero .context strong { color: var(--white); }
        .hero .context code { color: #d6d6dc; }
        .section { padding: 80px 40px; max-width: 900px; margin: 0 auto; }
        .section h2 { font-size: clamp(26px, 4vw, 42px); font-weight: 700; letter-spacing: -1.5px; margin-bottom: 24px; line-height: 1.15; }
        .section h3 { font-size: 21px; font-weight: 600; letter-spacing: -0.5px; margin: 44px 0 14px; }
        .section p { font-size: 17px; color: var(--gray); line-height: 1.65; margin-bottom: 20px; }
        .section p:last-child { margin-bottom: 0; }
        .section p strong { color: var(--black); }
        .section em { font-style: italic; }
        .section code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 14px; background: var(--light-gray); padding: 2px 6px; border-radius: 5px; color: var(--black); }
        .section ul, .section ol { margin: 0 0 20px 22px; }
        .section ul li, .section ol li { font-size: 16px; color: var(--gray); line-height: 1.6; margin-bottom: 12px; }
        .section ul li strong, .section ol li strong { color: var(--black); }
        .section ul li code, .section ol li code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 13px; background: var(--light-gray); padding: 2px 6px; border-radius: 5px; color: var(--black); }
        .section blockquote { border-left: 3px solid var(--blue); padding: 14px 22px; margin: 24px 0; background: #f8f9fb; border-radius: 0 12px 12px 0; font-size: 16px; color: var(--gray); line-height: 1.6; }
        .section blockquote strong { color: var(--black); }
        .section blockquote code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 13px; background: var(--light-gray); padding: 2px 6px; border-radius: 5px; color: var(--black); }
        .comp-table { width: 100%; border-collapse: collapse; margin: 28px 0; font-size: 15px; }
        .comp-table th { text-align: left; padding: 12px 16px; border-bottom: 2px solid var(--light-gray); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--gray); }
        .comp-table td { padding: 14px 16px; border-bottom: 1px solid var(--light-gray); color: var(--gray); vertical-align: top; line-height: 1.5; }
        .comp-table td strong { color: var(--black); }
        .comp-table td code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 13px; background: var(--light-gray); padding: 2px 6px; border-radius: 5px; color: var(--black); }
        .diagram { background: #0d0d0f; border-radius: 16px; padding: 26px 24px; margin: 28px 0; overflow-x: auto; }
        .diagram pre { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 13px; line-height: 1.55; color: #d6d6dc; margin: 0; white-space: pre; }
        footer { text-align: center; padding: 40px 20px; font-size: 12px; color: var(--gray); border-top: 1px solid var(--light-gray); }
        footer a { color: var(--blue); text-decoration: none; }
        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; z-index: 110; }
        .hamburger span { display: block; width: 24px; height: 2px; background: var(--black); border-radius: 2px; transition: all 0.3s; }
        .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        @media (max-width: 600px) {
            nav { padding: 14px 20px; }
            .hamburger { display: flex; }
            .nav-links { position: fixed; top: 0; right: 0; width: 260px; height: 100vh; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: flex; flex-direction: column; justify-content: center; padding: 0 40px; transform: translateX(100%); transition: transform 0.3s ease; z-index: 105; box-shadow: -4px 0 24px rgba(0,0,0,0.1); }
            .nav-links.open { transform: translateX(0); }
            .nav-links a { margin-left: 0; margin-bottom: 24px; font-size: 20px; opacity: 0.85; }
            .section { padding: 60px 20px; }
            .section p, .section ul li, .section ol li { font-size: 16px; }
            .comp-table { font-size: 13px; }
            .comp-table th, .comp-table td { padding: 10px 8px; }
        }
    </style>
</head>
<body>
    <nav>
        <a href="/" class="logo-link">
            <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5" class="hex-logo"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
            </div>
        </a>
        <div class="nav-links">
            <a href="/about">About</a>
            <a href="/#capabilities">Capabilities</a>
            <a href="/#pentest">Pentest</a>
            <a href="/Use-Cases">Use Cases</a>
            <a href="/briefings">Briefings</a>
            <a href="/#contact">Contact</a>
        </div>
        <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </nav>

    <section class="hero">
        <a href="/Use-Cases" class="back-link fade-in">← All Use Cases</a>
        <h1 class="fade-in">Upgrading a 2× Windows Server 2019 Domain to Server 2025 — Full Technical Case Study</h1>
        <p class="subtitle fade-in">A two-phase swing migration with a strict stop-and-report discipline.</p>
        <div class="context">
        <p class="fade-in" style="font-size:16px"><strong>Environment (sanitized):</strong> a lab/POC Active Directory forest <code>contoso.example</code> on a single KVM/Ubuntu host (NAT bridge <code>192.0.2.1/24</code>). Two Windows Server 2019 domain controllers, an identity-sync service, and one operator working over remote management with a strict stop-and-report discipline. <strong>Timeline:</strong> a two-phase swing migration — a clean, verified sequence, then the rename/re-IP identity saga. <strong>Names below are placeholders</strong> for the real hostnames, accounts, and IPs. No credential values, password policies beyond "the domain minimum length", or storage locations for secrets are included by design.</p>
        <p class="fade-in" style="font-size:16px">This case study demonstrates <strong>supervised execution, not autonomous reliability</strong> — the AI agent supplied speed and breadth, while the human operator held the gate, the snapshot, and the independent read-back. That split, not the tool, is what made the migration survivable.</p>
        <p class="fade-in" style="font-size:16px"><strong>Reading note.</strong> This is deliberately written as a narrative, not a log. The dead ends — the theories that were wrong — are included because they are the most transferable part of the story. Every claim here was cross-checked against the project record; where the record itself was corrected over time, the corrected version is the one told here.</p>
        <p class="fade-in" style="font-size:16px"><strong>The bottom line, for a skimming reader.</strong> This case study is a demonstration of <strong>supervised execution, not autonomous reliability</strong>. An AI agent drafted every step — but the thing that kept this forest alive was never the agent. It was the human operator: a strict stop-and-report gate before every mutation, a snapshot behind every one of them, and an independent read-back from a second vantage after each. The agent supplied the speed and the breadth; the operator supplied the judgment. That split — speed from the machine, authority from the human — is the transferable point, and it is the one most worth copying. The technical detail below is the evidence for it.</p>
        </div>
    </section>

    <section class="section">
        <h2 class="fade-in">1. Summary</h2>
        <p class="fade-in"><strong>Starting state.</strong> One domain, two Windows Server 2019 domain controllers (dc-01 at 192.0.2.2 holding all five FSMO roles, dc-02 at 192.0.2.3), forest and domain functional level at the 2016 generation, DFSR-based SYSVOL, and a dormant identity-sync (ADSync) agent living on the primary DC.</p>
        <p class="fade-in"><strong>End state.</strong> Two Windows Server 2025 domain controllers — dc-03 (192.0.2.4, all five FSMO roles + global catalog) and the rebuilt second DC (192.0.2.2, global catalog; this box reclaimed the original primary DC's identity after a clean rebuild — see §5). Forest and domain functional level raised to <strong>Windows 2025</strong>. Identity sync moved off the DCs to a dedicated member server, member-sync-01 (192.0.2.6). The two 2019 DCs were demoted, powered off, and retained (not deleted) as rollback material.</p>
        <p class="fade-in"><strong>Duration.</strong> The clean part of the job — pre-flight, schema prep, two new DCs, FSMO transfer, sync-service move, decommission of the old DCs, functional-level raise — was a straightforward sequence of verified steps. The second half, the rename-and-re-IP phase and the DC4 identity saga, produced the project's most valuable lessons.</p>
    </section>

    <section class="section">
        <h2 class="fade-in">1.5 Lessons Learned (the transferable set)</h2>
        <p class="fade-in">The one-place summary for a reader who will not read the rest. Each is framed as a general principle, not a project-specific directive:</p>
        <ul class="fade-in">
            <li><strong>In-place identity changes on stateful infrastructure create effectively unenumerable rollback surfaces.</strong> Identity lives in registries, caches, SPN stores, replication topologies, DNS zones, and directory objects; you cannot enumerate the writers in advance, so the rename/re-IP phase cost the project a long stretch of elimination work. Build with the final names from the start instead (§5, §6.1–6.2).</li>
        </ul>
        <ul class="fade-in">
            <li><strong>Stateful "fresh" operations can silently reuse existing state.</strong> Promotions re-attached to a stale, pre-existing damaged directory object, and the box's local copy won every merge by sequence number — three demote/re-promote cycles later, the fix was to verify the <em>created object</em>, not the <em>command's success</em>. Read <code>whenCreated</code>/<code>objectGUID</code> after every promotion (§5, §6.3).</li>
        </ul>
        <ul class="fade-in">
            <li><strong>The completion gate is an independent, time-gapped read-back of intended final state — never the command's success line.</strong> Two "verified" successes here silently removed <em>nothing</em>; the pattern that caught both was a second, independent read on the authoritative vantage, gapped in time. The action token is truth; the prose summary is not (§4.11, §6.5).</li>
        </ul>
        <ul class="fade-in">
            <li><strong>Name and DNS churn is a first-class failure surface.</strong> The sync-failure loop, the stale-record cleanup, and the unresolved forwarder contradiction were all downstream of identity churn. DNS state belongs in the read-back gate of every mutation, not in afterthoughts (§6.4).</li>
        </ul>
        <ul class="fade-in">
            <li><strong>Self-modifying artifacts on critical systems are standing risks, not historical ones.</strong> A scheduled task that could demote a DC — armed, on-demand-allowable, with a past-due schedule — was a live gun in the domain. "Next Run Time: N/A" is not safety (§4.9, §6.7).</li>
        </ul>
        <ul class="fade-in">
            <li><strong>Ambiguous infrastructure error strings must be verified against ground truth before a theory is built on them.</strong> "Failed to get write lock" was actually a security-policy file-open denial; the kernel audit log decided it in one read, and the wrong theory cost a full session (§4.6, §6.8).</li>
        </ul>
        <ul class="fade-in">
            <li><strong>Interactive confirmation prompts are a hidden failure class over stdin-less remote sessions.</strong> Blocked prompts orphan processes that hold write locks, and the orphans stack until read-only queries jam. Mutating writes that confirm interactively belong on an interactive console (§3.7, §4.10).</li>
        </ul>
        <p class="fade-in"><strong>Full detail:</strong> §6 ("What I'd do differently") carries the project-specific reasoning behind each; the numbered items above map to it.</p>
    </section>

    <section class="section">
        <h2 class="fade-in">2. Approach and method</h2>
        <p class="fade-in">Five rules governed every state change, from the first step to the final rebuild:</p>
        <ol class="fade-in">
            <li><strong>Clean install + swing migration, not in-place upgrade.</strong> The 2025 DCs were built as new VMs and brought up alongside the healthy 2019 DCs; roles were handed over, then the old boxes were demoted. The forest never dropped below a healthy DC count <em>by design</em> — though, as §5 shows, the rename phase still found a way to break that rule briefly.</li>
            <li><strong>Snapshot before every state change.</strong> Every mutation — schema prep, join, promotion, demotion, rename, IP change, FL raise — was preceded by a disk-only hypervisor snapshot, retained as a rollback point (34+ snapshots across the VMs at closeout). This discipline is what made recovery possible throughout; two of its limits (a <code>snapshot-revert</code> state restriction and a snapshot-became-live-disk trap) are cataloged in §4.</li>
            <li><strong>One DC at a time.</strong> A new DC was not declared done until it was fully verified — replication in both directions, services, identity — before the next one started.</li>
            <li><strong>Stop-and-report gates.</strong> Each state-changing step required explicit operator authorization, was executed, and was <em>independently verified</em> before the next step. Multiple "success" reports during the project turned out to be false (§4, false-success entries); the gate that mattered was always the read-back, not the exit code.</li>
            <li><strong>Read-only verification before acting.</strong> Suspicious readings (a schema "anomaly", replication error codes, "join is broken" signals) were cross-checked with a second method before anyone touched anything.</li>
        </ol>
    </section>

    <section class="section">
        <h2 class="fade-in">3. Timeline by phase</h2>
        <h3 class="fade-in">3.1 Pre-flight (read-only) → GO</h3>
        <p class="fade-in">Verified read-only before any change was authorized: replication healthy (0/5 failures both directions, all partitions), DFSR running on both DCs (a hard prerequisite — the old FRS was absent), functional levels at the 2016 generation, all five FSMO roles on dc-01, time sync healthy, storage headroom confirmed. Baseline snapshots were taken on both 2019 DCs — the first of the snapshot-everything discipline.</p>
        <p class="fade-in">Two things to note from this phase:</p>
        <ul class="fade-in">
            <li><strong>Replication noise that recurs all project:</strong> every <code>repadmin /replsummary</code> showed a lone <code>110</code> (enumeration timeout) line. That is normal <code>repadmin</code> query noise in a healthy forest, not a replication failure. It was flagged early because it kept looking alarming later.</li>
        </ul>
        <ul class="fade-in">
            <li><strong>No backup engine existed.</strong> The first "Windows Server Backup" attempt hung silently because <code>wbadmin</code> resolved to the GUI applet (<code>wbadmin.msc</code>) in a non-interactive remote session — the backup <em>feature</em> was disabled on both DCs and the engine binary was absent. Decision: rely on the hypervisor disk snapshots (restorable, satisfies the checkpoint rule) rather than enable a backup engine that would require reboots.</li>
        </ul>
        <h3 class="fade-in">3.2 Schema preparation</h3>
        <p class="fade-in">Run on the schema master with the 2025 media mounted, as a service account that had been (reversibly) added to Schema Admins.</p>
        <ul class="fade-in">
            <li><strong>forestprep hung at 0% CPU.</strong> The adprep tool presents an interactive "type C to continue" prompt; over a remote-management session with no interactive stdin, the read blocks forever. <strong>Fix:</strong> pipe the answer in (<code>echo C | adprep.exe /forestprep</code>). Result: RC=0, schema advanced three versions (baseline <code>objectVersion = 88</code> → 91), verified on both DCs, replication still 0/5.</li>
        </ul>
        <ul class="fade-in">
            <li><strong>A false alarm, properly handled.</strong> The intended baseline check first queried a non-existent attribute and mis-read the schema naming-context head object's class (<code>dMD</code>), producing an apparently abnormal reading. The schema NC head <em>legitimately</em> has <code>objectClass = dMD</code> — standard, expected. The correct, authoritative check (<code>objectVersion</code> on the schema NC head) returned a clean baseline consistent with the 2016 functional level. <strong>No change to AD was needed; the "anomaly" was a measurement error.</strong> Lesson: verify an abnormal AD reading with a second, independent method before acting.</li>
        </ul>
        <ul class="fade-in">
            <li><strong>gpPrep syntax error:</strong> <code>/gpprep</code> run standalone returns RC=1 — it must be paired with <code>/domainprep</code>. The corrected combined invocation returned RC=0 (idempotent skip). Phase 1 closed fully verified.</li>
        </ul>
        <h3 class="fade-in">3.3 Building the new DCs</h3>
        <p class="fade-in"><strong>Provisioning.</strong> Each new DC was a peer of the working 2019 boxes: 2 vCPU / 8 GB, same bridge, 60 GB disk. The unattended install failed in two distinct, evidence-diagnosed ways before succeeding:</p>
        <ol class="fade-in">
            <li><strong>Firmware re-injection.</strong> Stripping the boot loader from the VM definition was not enough — the hypervisor metadata and an SMM element re-injected UEFI firmware on every re-define, while the answer file was authored for legacy MBR. The answer file was rebuilt for the legacy firmware and the final state was verified against the <em>live</em> hypervisor process command line, not the defined XML.</li>
            <li><strong>Zero-byte disk writes.</strong> Setup read the media but wrote 0 bytes to the disk — diagnosed with block-statistics (media read &gt; 0, disk write bytes = 0): the answer file had no driver for the paravirtualized block device. Fix: present the disk on the same bus type as the working 2019 peers (SATA), matching what was known to work.</li>
        </ol>
        <p class="fade-in"><strong>First-boot networking failure, a self-inflicted regression, and a clean revert.</strong> The first fresh install booted to a healthy lock screen but never got an IPv4 address (full-capture evidence: zero DHCPv4 DISCOVER packets). The wrong first fix attempt — merging a static IP into the Windows registry <em>offline</em>, onto two guessed adapter GUIDs — produced a corrupt TCP/IP profile that crashed the guest on network-stack init. Reverting surfaced a <strong>hypervisor limitation</strong>: <code>snapshot-revert</code> refused the disk-snapshot state outright ("Invalid target domain state 'disk-snapshot'. Refusing"), so the revert was done manually — destroy the VM, move the bad thin overlay aside for forensics, re-point the domain's system disk at the clean base image, re-define, start. The box recovered; the operator then set the IP <em>inside the guest</em>, where it belonged. Lesson recorded: for a fresh install with an unmapped NIC, in-guest configuration is faster and safer than offline registry surgery.</p>
        <p class="fade-in"><strong>Domain join.</strong> Verified from the <em>other</em> DC's vantage (the reliable one): the AD computer object showed the new FQDN and service principal names — fields written only by a successful join. Multiple "join is broken" signals (empty <code>Domain=</code>, token-cache errors, blank secure-channel reads) turned out to be artifacts of probing inside a SYSTEM-privileged remote session, not a failed join — cross-checked and dismissed.</p>
        <p class="fade-in"><strong>Promotion blockers, in the order hit</strong> (full index in §4): cmdlet parameters that no longer exist on the 2025 build; the DSRM password having to satisfy the domain password policy (the domain's hard maximum caps the length — a too-short candidate was rejected as "too short" and an overly long one as "too long", which is how the cap was discovered); a UTF-16LE-encoded script that <code>cmd.exe</code> cannot parse (silent no-op — the process started and <em>never ran</em>); a blocking console-read over a stdin-less remote session; rapid remote-session churn producing HTTP 500s; a stale-file false positive (the "file exists" check was validating an abandoned earlier variant — the fix was to hash-verify the exact file before launch); and finally the real wall — <strong>a credential realm mismatch</strong>: the promotion scripts had been building the domain-qualified account name with a <em>wrong realm spelling</em>, which makes the KDC reject the ticket (error 1825) and DC discovery fail (error 1908). Network, DNS, secure channel, and privileges all looked fine — the exact signature of a realm mismatch. Correcting the realm (or using the unambiguous UPN form) was the operator's diagnosis, and with it the promotion completed.</p>
        <p class="fade-in"><strong>Result.</strong> First 2025 DC promoted, verified (replication 0/5 both directions, global catalog, all core services running), and — per the one-at-a-time rule — work stopped for sign-off before the second box. The second DC followed the same proven path. Two benign DNS-delegation warnings on each promotion (expected in a root forest with no parent zone) were recorded and closed.</p>
        <h3 class="fade-in">3.4 FSMO transfer</h3>
        <p class="fade-in">With both 2025 DCs promoted, replicating, and one holding the global catalog, all five FSMO roles were transferred to dc-03 (the new primary) — operator-authorized, then independently verified from both DC vantages that all five roles sat on dc-03 and that replication remained 0/5. Notably, one earlier cleanup attempt on the second DC (an identity scrub) had been <strong>reverted by a reboot</strong> — the reboot itself proved the root cause (a registry-level identity source re-painting the old name on every registration), which became a key lesson and a recurring theme of §5.</p>
        <h3 class="fade-in">3.5 Identity-sync (Entra ID Connect) move (tracked separately from the DC phases)</h3>
        <p class="fade-in">The dormant ADSync agent on the primary 2019 DC had to come off the DC (sync services belong on a member server, and the DC was about to be demoted). This phase had its own failure cluster:</p>
        <ul class="fade-in">
            <li><strong>The uninstaller family of failures.</strong> The standard uninstall path repeatedly "succeeded" while leaving the product behind: the MSI engine hung on the agent's packages (four stalls across sessions); completed uninstalls left <strong>orphan Uninstall registry keys</strong>; the agent's components were <strong>live services sharing install directories</strong>, not dormant files — deleting files under a running service changed nothing. The eventual reliable pattern: enumerate the services <em>and</em> their image paths <strong>first</strong>; stop → verify they stay stopped → disable → delete the service — <em>then</em> remove files and registry entries; and use <strong>direct key/file removal</strong> once the standard uninstaller had wedged twice, because retrying a wedged uninstaller is how the cycle continued.</li>
        </ul>
        <ul class="fade-in">
            <li><strong>Completion signal discipline:</strong> "the process is gone" is not done. Done = <strong>registry key absent + install directory gone</strong>, verified read-back.</li>
        </ul>
        <ul class="fade-in">
            <li><strong>The new member server, member-sync-01</strong>, was built as a peer of the DCs, joined, and the sync service installed and tested — after which a first full sync completed and the service went live. The dormant agent on the old primary was then fully removed to zero (services stopped and deleted, orphan keys removed, verified absent).</li>
        </ul>
        <h3 class="fade-in">3.6 Decommissioning the 2019 DCs</h3>
        <ul class="fade-in">
            <li><strong>Second 2019 DC (dc-02):</strong> demoted, verified (no longer a DC from the domain's vantage; replication clean with the remaining set), powered off, <strong>retained</strong>. Demotion over the remote channel required a parameter the old docs never mentioned (the local-admin seed that suppresses a silent console prompt); omitting it made the demote <strong>hang with zero AD DS activity</strong> — a wedged demote with no AD DS events means <em>nothing happened</em>: kill, re-verify full-DC state, retry.</li>
        </ul>
        <ul class="fade-in">
            <li><strong>First 2019 DC (dc-01):</strong> same staged sequence. One twist worth recording: the demote completed (RC=0) even with a <em>wrong-but-present</em> local-admin seed value — the parameter is a prompt-suppression/re-provision seed, not a credential-checked gate; <strong>presence</strong> unblocks, the value is not validated. Verified by domain-side evidence (DC count, DC-list membership, SRV records), not the box's own self-report.</li>
        </ul>
        <ul class="fade-in">
            <li>Both 2019 DCs: <strong>demoted, shut off, retained</strong> — no autostart, so the host could not resurrect them; disk images and all their snapshots kept as rollback material.</li>
        </ul>
        <h3 class="fade-in">3.7 Functional-level raise — the last irreversible step</h3>
        <p class="fade-in">Forest and domain functional level raised to <strong>Windows 2025</strong> — the irreversible final step, gated on both live DCs being 2025.</p>
        <p class="fade-in"><strong>The WinRM lesson:</strong> <code>Set-ADForestMode</code>/<code>Set-ADDomainMode</code> are hang-prone <em>mutating</em> AD writes — the interactive confirmation over a stdin-less remote stream blocks, and every client-side timeout leaves an orphaned remote PowerShell on the DC holding an AD write lock; those orphans <strong>stack</strong>, and eventually jam even read-only AD queries. The operator therefore ran both raises from the <strong>interactive console</strong>, where they completed cleanly on the first try — no orphans, no lock-jam. Independent verification from <strong>both</strong> DC vantages (functional levels read back, replication 0/5, FSMO stable, sync service healthy, all core services running) closed the entire 2019→2025 migration.</p>
        <blockquote class="fade-in"><strong>Rule carried forward:</strong> long-running AD DS <em>writes</em> belong on a console/RDP session, not over a remote channel with short client timeouts. And the completion gate is always the live read-back, never the command's success line.</blockquote>
        <h3 class="fade-in">3.8 Phase 6 — rename and re-IP the 2025 DCs onto the original identities</h3>
        <p class="fade-in">Goal: give the second new 2025 box the original dc-01 identity (192.0.2.2) and settle the naming. Operator-confirmed method: <code>netdom computername</code> (the supported path for a DC identity change — <em>not</em> <code>Rename-Computer</code>, which doesn't handle DC identity/SPN/DNS), then the IP change, each preceded by a snapshot and a stop-and-report gate.</p>
        <p class="fade-in">This phase is where the project got hard, and where the record is most honest about itself. In order:</p>
        <ol class="fade-in">
            <li><strong>A failed rename attempt and a full rollback</strong> to the clean snapshot — including a host/hypervisor-level finding that applied to all future work on the host (below).</li>
            <li><strong>The hypervisor/AppArmor wall.</strong> The VM that had gone through an <code>undefine</code>/<code>define</code> cycle refused to start with a misleading "Failed to get write lock" error. The first working theory — an orphaned kernel file lock — was tested against evidence and <strong>formally withdrawn</strong> (a libvirtd restart did not clear it; a full device/inode/lock scan found no lock holder anywhere; a non-blocking lock test acquired the "locked" file successfully as the hypervisor user). The ground truth was the kernel audit log: <strong>AppArmor was denying a plain read</strong> of the VM's base disk, because the per-domain AppArmor profile for this one VM <strong>included a <code>.files</code> fragment that did not exist</strong> — the profile body was stale (its mtime predated the whole crisis), and the VM's XML disk-chain listing was truncated, so the allowlist did not cover the real backing chain. The fix was surgical and scoped: rebuild the XML to the full disk chain, create the missing <code>.files</code> fragment mirroring a healthy VM's, scoped-reload <em>that one profile only</em> (never a global teardown), then start and fully verify — including confirming the two unaffected VMs stayed healthy before and after. Zero AppArmor denials after the fix.</li>
        </ol>
        <ul class="fade-in">
            <li><strong>Lesson:</strong> "Failed to get write lock" from the hypervisor can be a <em>file-open denial</em> wearing a lock's mask. Trust the kernel audit log over the error string. And a VM that has gone through <code>undefine</code>/<code>define</code> can end up with stale security-policy artifacts that a normal re-define does not regenerate.</li>
        </ul>
        <p class="fade-in">3. <strong>The IP migration, done right the second time.</strong> The first in-guest IP swap failed catastrophically (removed the management IP before the new one was confirmed — the session died and the auto-revert could not run, leaving the NIC with no address at all). The lesson: <strong>add the new IP alongside the old, verify reachability through a second session, then remove the old.</strong> The second attempt, using that dual-IP method, succeeded.</p>
        <ol class="fade-in">
            <li><strong>The stale-identity cleanup on the renamed DC</strong> — SPNs, DNS records, a stale DFSR topology object, and two <em>false-success</em> incidents where AD/DNS mutation cmdlets returned "OK" while changing nothing (wrong value types silently rejected; a DNS record not queryable as the AD object the cmdlet operated on). Details in §4.</li>
            <li><strong>The <code>DemoteDC4</code> scheduled-task landmine</strong> — discovered incidentally, diagnosed, disabled, and removed, with all credential-bearing scripts scrubbed (see §4).</li>
            <li><strong>The identity saga proper</strong> — §5 below.</li>
        </ol>
    </section>

    <section class="section">
        <h2 class="fade-in">4. Troubleshooting index</h2>
        <p class="fade-in">Each entry: <strong>symptom → root cause → how it was diagnosed → fix.</strong></p>
        <p class="fade-in"><strong>4.1 adprep prompt hang (forestprep).</strong> <em>Symptom:</em> <code>adprep /forestprep</code> hung at 0% CPU with no output. <em>Root cause:</em> the tool's interactive "type C to continue" confirmation; over a remote session with no interactive stdin, the blocking read never returns. <em>Diagnosis:</em> process state (alive, idle, no output) + knowledge that the prompt exists; confirmed by the same hang class recurring elsewhere in the project (promotion prompts, FL-raise confirmations). <em>Fix:</em> pipe the answer into the process (<code>echo C | adprep.exe …</code>). Same family, same fix: promotion prompts, and (for the FL raise) the decision to run the command from a console instead (§3.7).</p>
        <p class="fade-in"><strong>4.2 <code>/gpPrep</code> syntax error.</strong> <em>Symptom:</em> standalone <code>/gpprep</code> → RC=1, "Invalid syntax. /gpprep must be used with the /domainprep switch." <em>Root cause:</em> the switch is only valid combined with <code>/domainprep</code>. <em>Fix:</em> <code>adprep.exe /domainprep /gpprep</code> → RC=0. (Trivial in hindsight; recorded because it cost a cycle.)</p>
        <p class="fade-in"><strong>4.3 Schema "anomaly" false alarm.</strong> <em>Symptom:</em> a pre-check reported a non-standard objectClass and an apparently abnormal schema state. <em>Root cause:</em> self-inflicted — the check queried a non-existent attribute and mis-read the schema NC head's class; <code>objectClass = dMD</code> on that head object is <strong>standard and expected</strong>. <em>Diagnosis:</em> re-queried with the authoritative method (<code>objectVersion</code> on the schema NC head) → clean baseline (88), consistent with the 2016 functional level; class objects verified standard. <em>Fix:</em> none — no AD change was needed. <em>Lesson: verify an "abnormal" AD reading with a second independent method before acting.</em></p>
        <p class="fade-in"><strong>4.4 DSRM password policy wall + parameter changes on Server 2025.</strong> <em>Symptom A:</em> promotion rejected one DSRM candidate as "too short" and another as "too long" — both with the same generic error. <em>Root cause A:</em> the DSRM must satisfy the <strong>domain password policy</strong>, whose maximum length is hard-capped on this domain — so the double rejection was the diagnostic signature of a policy length cap, not two different failures. <em>Fix A:</em> use a DSRM that satisfies the domain policy. (Re-encountered again during the final rebuild: the below-policy candidate was rejected, the policy-compliant one accepted.) <em>Symptom B:</em> <code>Install-ADDSDomainController</code> on the 2025 build threw "parameter cannot be found" for parameters that exist in 2019-era docs. <em>Root cause B:</em> the 2025 cmdlet's parameter set changed. <em>Fix B:</em> probe the live parameter set (<code>Get-Command … -ParameterList</code>) and build the invocation from evidence. The asymmetry bites twice: <code>Install-ADDSDomainController</code> takes <code>-SafeModeAdministratorPassword</code>, while <code>Uninstall-ADDSDomainController</code> on 2025 takes <code>-LocalAdministratorPassword</code> and <strong>no longer has</strong> <code>-SafeModeAdministratorPassword</code>. Also: the Windows feature name for AD DS on 2025 is <code>AD-Domain-Services</code> (not the legacy name), and <code>Install-WindowsFeature</code> has no <code>-NoReboot</code> parameter on this build.</p>
        <p class="fade-in"><strong>4.5 The DC4 identity saga.</strong> Told in full in §5. In one line: stale service-principal names for the box's <em>old</em> name kept reappearing within a minute of every clean removal, across three demote/re-promote cycles — until the record's decisive evidence (a reused, pre-existing damaged AD object) reframed the whole problem.</p>
        <p class="fade-in"><strong>4.6 Hypervisor "write lock" failure that was actually AppArmor.</strong> <em>Symptom:</em> <code>virsh start</code> on one VM failed with "Failed to get write lock"; a libvirtd restart did not help. <em>Root cause:</em> AppArmor denial — the VM's per-domain profile included a <code>.files</code> fragment that did not exist on disk, and the domain XML under-listed the disk backing chain; the kernel audit log showed a plain <strong>read</strong> denied on the base disk file. <em>Diagnosis:</em> the misleading error string led first to a (wrong) orphaned-lock theory, formally withdrawn after lock-hunting found nothing. The ground truth was the kernel audit record: profile name, file, <code>denied_mask="r"</code>. Cross-referenced against a healthy VM's intact profile artifacts. <em>Fix:</em> rebuild the XML to the full backing chain; create the missing <code>.files</code> fragment mirroring the healthy VM's; scoped-reload only that one profile (no global teardown); start + verify; confirm the two unaffected VMs stayed healthy. Zero denials after. <em>Lesson:</em> trust the kernel audit log over the error text; <code>undefine</code>/<code>define</code> cycles can leave stale security-policy artifacts that a re-define does not regenerate.</p>
        <p class="fade-in"><strong>4.7 The hypervisor <code>snapshot-revert</code> limitation (two encounters).</strong> <em>Symptom:</em> <code>virsh snapshot-revert</code> refused: "Invalid target domain state 'disk-snapshot'. Refusing." <em>Root cause:</em> the VM was in a disk-snapshot state that revert does not accept. <em>Workaround:</em> manual revert — destroy the VM, move the bad thin overlay aside (preserved for forensics), re-point the domain's system disk at the clean base image, re-define, start. <em>Second encounter (later, worse):</em> a "revert" to a snapshot had actually captured the <em>post-mutation</em> state — the snapshot had become the live disk (the snapshot-became-live-disk trap) — so the true pre-mutation image was the backing file. <code>blockrevert</code>/<code>snapshot-revert</code> were both unavailable; recovery was a backing-chain swap built with assertions against a self-referential chain (the first attempt failed with a lock error; the fixed builder asserted no self-reference before re-define). <strong>Lesson: before reverting, verify the snapshot's actual contents, not its name.</strong></p>
        <p class="fade-in"><strong>4.8 DNS forwarder and the 6900 loop.</strong> <em>Symptom:</em> during the identity saga, the identity-sync engine on member-sync-01 threw a storm of sync-failure event 6900s (~29 events in a 20-minute window), and AD-side lookups on the sync account looked disturbed. <em>Working theory:</em> the DCs' DNS forwarders had been lost, breaking external-name resolution needed by the sync engine. <em>What the evidence actually showed:</em> a same-day earlier read showed forwarders present on all three machines; a later read returned <strong>empty</strong> — an unresolved contradiction that was <em>never re-verified</em>. What did close: after the identity issues settled, no new 6900s appeared for 12+ hours and the engine cycled normally (its own healthy-cycle events present), so the 6900 storm was confirmed as a <strong>consequence</strong> of the identity/AD-side disturbance, not an independent DNS failure. The forwarder contradiction was left explicitly unresolved in the record. <em>Honest status for publication:</em> the 6900 loop is <strong>closed</strong> (no recurrence; engine healthy). The "forwarders lost" hypothesis is <strong>unverified</strong> — it was recorded as an open contradiction, never confirmed or refuted. Per the tasking, this is marked unverified rather than stated as fact.</p>
        <p class="fade-in"><strong>4.9 The <code>DemoteDC4</code> scheduled-task landmine.</strong> <em>Symptom:</em> an incidental read-only finding: a scheduled task on the renamed box, named for an <em>old</em> box, that ran a one-shot demotion script. <em>Root cause (forensics):</em> a leftover from an earlier automation attempt — created by the service account, running as SYSTEM, pointing at a script that invoked <code>Uninstall-ADDSDomainController</code> with a <strong>hardcoded plaintext credential</strong>. Its scheduled trigger window had already passed (last run: failed, result -1), but the task was <strong>still enabled and allowed on-demand firing</strong> — "Next Run Time: N/A" is not safety. <em>Exposure:</em> a manual/on-demand fire (or a future scheduler fix) would silently demote a live DC; the script also sat on the DC with embedded credentials. <em>Remediation (authorized, staged):</em> (1) disable the task (reversible) and verify state read-back; (2) unregister the task and delete all credential-bearing one-shot scripts from the DC, each verified gone; (3) confirm the DC still healthy afterward. <em>Standing rules produced:</em> a DC must never carry a task/script that can self-demote — especially in a small domain; <code>Enabled=true + AllowStartOnDemand=true</code> is armed even with a past-due schedule; never hardcode plaintext credentials in one-shot scripts on a DC.</p>
        <p class="fade-in"><strong>4.10 The FL-raise WinRM lesson.</strong> <em>Symptom (from earlier attempts):</em> <code>Set-ADForestMode</code>/<code>Set-ADDomainMode</code> over the remote channel blocked on the interactive confirmation; each client timeout left an <strong>orphaned remote PowerShell on the DC holding an AD write lock</strong>; the orphans stacked and eventually jammed even read-only AD queries. <em>Root cause:</em> long-running <em>mutating</em> AD writes over a stdin-less remote session with short client timeouts = orphan buildup + lock contention. <em>Fix:</em> run these writes from an <strong>interactive console</strong>; the two FL raises then completed cleanly on the first try, with no orphans and no lock-jam. Verification: live read-back from both DC vantages. <em>General rule:</em> AD DS mutating writes that confirm interactively belong on a console; never trust the success line — the gate is always the read-back.</p>
        <p class="fade-in"><strong>4.11 False-success incidents (two, both root-caused).</strong></p>
        <ul class="fade-in">
            <li><strong>SPN removal "15 removed" that removed 0:</strong> the AD mutation call threw a type error (un-cast object array) but the session summary was written as success. The next day's re-check found all 15 stale SPNs still present. <em>Fix:</em> cast the value array properly; <em>rule:</em> the action token (<code>OK</code>/<code>ERR</code>) is the only ground truth, never the prose summary — and always reconcile with an independent post-state count.</li>
        </ul>
        <ul class="fade-in">
            <li><strong>DNS delete "DELETE-OK" that deleted nothing:</strong> the record lived in the DNS zone store but was <strong>not exposed as the AD object</strong> the AD cmdlet operated on, so the cmdlet matched nothing and "succeeded" benignly while the record kept resolving. <em>Fix:</em> use the DNS management module's record-delete path (the legacy CLI path was refused by the zone's security ACL); <em>rule:</em> a cmdlet returning success over an ambiguous identity is not proof of the intended mutation — read the record back first.</li>
        </ul>
        <p class="fade-in"><strong>4.12 Other cataloged items (for completeness).</strong> <code>virsh reboot</code> is a no-op on these guests (verify reboots by uptime/last-boot time, never <code>domstate</code>); <code>msiexec /x</code> hung on the sync agent's packages four times (switch to direct removal once a "standard" tool keeps wedging); QEMU VNC is single-client (a stray client black-screens noVNC — kill the stale one); <code>repadmin</code> "110/1" lines are query-timeout noise, not replication failures; a rollback script's <code>sed</code> pattern silently no-oped against the hypervisor's XML tag format (caught by an end-state assertion; fixed with a first-occurrence-only replace plus post-write verification).</p>
    </section>

    <section class="section">
        <h2 class="fade-in">5. The DC4 saga, told properly</h2>
        <p class="fade-in"><strong>The symptom, in one sentence.</strong> After the renamed box took on the original identity, its AD object kept re-accumulating the <em>old</em> name's service-principal names — 15 stale SPNs reappearing within 60 seconds of every clean, verified removal, across three separate demote/re-promote cycles, plus a stale DNS record and a stale DFSR topology object. The domain was, at points, effectively running on a single DC, or on one healthy DC plus a zombie whose AD-side identity had been deleted.</p>
        <p class="fade-in"><strong>Why this section is honest about the timeline:</strong> the wrong theories were pursued across multiple sessions, before the actual root cause was read out of the directory itself. The sequence below is the order the theories were actually tried and ruled out.</p>
        <ol class="fade-in">
            <li><strong>Registry hostname (the "identity writer").</strong> The first identity crisis was fixed by finding stale <code>Tcpip\\Parameters</code> hostname keys feeding DNS self-registration — every registration re-painted the old FQDN and re-added the factory SPNs. That fix <em>worked at the time</em>. In the later crises, the same key was fixed again, the LSA cache was rebuilt after reboot, the SPNs were cleanly removed — and <strong>the exact same 15 re-appeared within 60 seconds</strong>. Ruled out: while the registry key was a <em>real</em> identity source, it was not the writer of the recurring pattern.</li>
            <li><strong>LSA cache / <code>CachedMachineNames</code>.</strong> Deleted and rebuilt (the stale old-name entry was present, fixed, verified). The re-addition continued. Ruled out.</li>
            <li><strong>Netlogon in-memory state.</strong> Service restarted, then a full reboot (fresh state, twice). The re-addition continued. Ruled out.</li>
            <li><strong>Replication conflict / stale-replica model.</strong> Two checks killed it: no conflict events (the 2087–2091 family) anywhere, and the decisive observation — after a clean delete on the PDC, <strong>the PDC stayed clean for the full 180-second watch while the other DC went dirty locally</strong>. A stale replica that was "newer" would have <em>won</em> the merge and pushed the SPNs <em>back to the PDC</em>; it did the opposite. The writer was a live process acting locally on the box — but not via replication, and not via any of the local state above. Ruled out.</li>
            <li><strong>AD Connect (identity-sync) writeback.</strong> The sync service's accounts held inherited write grants on computer objects, the inclusion scope covered computer objects, and 4662 read events (not 5136 writes — auditing was never enableable over the available channel) showed a ~2-minute cadence matching the re-add windows. It was the strongest remaining writer candidate and stayed under operator HOLD (logs-only, no rule changes). It was <strong>never positively proven</strong> — and it didn't need to be, because the next piece of evidence reframed everything.</li>
            <li><strong>Wrong-DN removal bug.</strong> An earlier "removal succeeded" report was actually failing with "Directory object not found" because the DN used the non-existent <code>CN=Computers</code> container instead of <code>OU=Domain Controllers</code>. Fixed and proven (15/15 clean removal) — and the SPNs <em>still</em> came back. Ruled out as the persistent cause.</li>
        </ol>
        <p class="fade-in"><strong>The actual root cause</strong> — found by reading the directory's own metadata, not by hunting processes:</p>
        <ul class="fade-in">
            <li><code>CN=DC-B,OU=Domain Controllers</code>: <strong>created well before the final promotion</strong> — with a fixed object GUID, low historical USN.</li>
        </ul>
        <ul class="fade-in">
            <li>Its DSA object (<code>NTDS Settings</code>) was freshly created at the final promotion.</li>
        </ul>
        <ul class="fade-in">
            <li>Conclusion: <strong><code>Install-ADDSDomainController</code> was reusing the pre-existing, damaged computer object</strong> — the scar tissue of every prior crisis lived <em>on the AD object itself</em> — and attaching a brand-new DSA to it. The box's local copy of that object carried the old SPN list at promotion time and held the <em>higher</em> USN, so it re-asserted the stale SPNs and <strong>won every DRS merge</strong> against scrubs performed from the other DC (lower USN can never win). This single fact explains why a "fresh install" reproduced the identical symptom across three demote/re-promote cycles, and why no local-state cleanup could ever stick.</li>
        </ul>
        <ul class="fade-in">
            <li>A <strong>fourth orphan object</strong> made it worse than the two-object case implied: a stray computer object in the wrong container sharing the <em>same machine-account name</em> as the DC object — a hard identity conflict, leftover from the very first broken join attempt (the join that reported OK but left the box in WORKGROUP).</li>
        </ul>
        <p class="fade-in"><strong>The fix, in three verified steps:</strong> (1) demote (the 2025 parameter set, again); (2) delete the <strong>entire object family</strong> — the DC object, its DSA, the stale DFSR topology member, and the fourth orphan — each verified GONE from the authoritative DC's view, with a domain-wide sweep confirming zero stale-name SPNs remained; (3) <strong>rebuild the VM from scratch and re-promote against the now-empty name</strong> — which forced the promotion to mint a <em>brand-new</em> AD object. Acceptance check that proves it was genuinely new: <code>whenCreated</code> = today, and a <strong>different object GUID</strong> than the old one. The post-promotion stability watch (multiple samples, both vantages) held clean: zero stale SPNs, stable count, replication 0/5 both directions, FSMO intact on the primary, global catalog active. The saga closed cleanly.</p>
        <p class="fade-in"><strong>What this costs in hindsight:</strong> at least three full demote/re-promote cycles, two single-DC exposure windows, one zombie DC, one credential lockout, and a long stretch of the project's remaining calendar — all because the fix had to start from "which AD object is this box <em>actually</em> running on?" instead of "which process is writing?" The single most valuable move in the whole saga was the day someone stopped diagnosing the <em>box</em> and started reading the <em>object's creation date and GUID</em>.</p>
    </section>

    <section class="section">
        <h2 class="fade-in">6. What I&#x27;d do differently</h2>
        <ol class="fade-in">
            <li><strong>Never rename a DC in place.</strong> It is the single most expensive decision in this project. In-place identity changes on a DC leave writers in places you can't enumerate — registry identity sources, LSA cache, keytabs, service SPNs, DFSR topology, DNS stores — and the DC4 saga shows a long stretch of effort spent proving each of them <em>wasn't</em> the cause.</li>
            <li><strong>Build with the final names from the start.</strong> If the end goal is "the primary DC is called the original name at the original IP," build the new primary <em>as</em> that name from the start (the old box's machine account can be deleted once demoted, which frees the name for a clean <code>netdom /ADD</code> or even a fresh build). The swing migration is the same work; the rename phase is pure risk.</li>
            <li><strong>Check whether a promotion reuses an existing AD object — before and after every <code>Install-ADDSDomainController</code>.</strong> Two read-only checks cost nothing and would have saved the project considerable effort: read <code>whenCreated</code> and <code>objectGUID</code> of the resulting <code>OU=Domain Controllers</code> object <em>after</em> promotion. A <code>whenCreated</code> older than the promotion means a damaged object was reused and the box must be demoted, its object family deleted, and re-promoted.</li>
            <li><strong>Check DNS (servers, zones, forwarders) early — and re-verify after every identity change.</strong> The 6900 loop, the stale-record cleanup, and the forwarder contradiction were all downstream of name/DNS churn. DNS state should be a first-class read-back gate on every mutation, not an afterthought.</li>
            <li><strong>Make independent read-back mandatory after every mutation — no exceptions.</strong> Two "verified" successes in this project were both wrong (SPN removal that never ran; DNS delete that matched nothing). The pattern that caught both: a second, <em>independent</em> read of the intended final state, on the authoritative vantage, time-gapped. The action token is truth; the prose summary is not.</li>
            <li><strong>Search the project's own past successful fixes before building a new theory tree.</strong> The registry-identity-writer fix from the first crisis was the key to reframing the saga; it had to be <em>re-discovered</em> by re-reading an old session log during the crisis.</li>
            <li><strong>Keep a DC clean of self-demotion artifacts.</strong> The <code>DemoteDC4</code> task (armed, enabled, hardcoded credential, past-due schedule) was a live gun in the domain. Standing rule: no <code>Uninstall-ADDSDomainController</code>-capable task or script may exist on a DC; check <code>Enabled</code>/<code>AllowStartOnDemand</code>, not just "Next Run Time."</li>
            <li><strong>Treat "Failed to get write lock" from the hypervisor as unproven.</strong> Read the kernel audit log first — in this project it was an AppArmor file-open denial, and the wrong lock theory consumed a full session.</li>
        </ol>
    </section>

    <section class="section">
        <h2 class="fade-in">7. Final state and what&#x27;s still open</h2>
        <h3 class="fade-in">7.1 Verified final state (closeout)</h3>
        <table class="comp-table fade-in">
            <thead><tr>
                <th>Item</th>
                <th>State</th>
            </tr></thead>
            <tbody>
                <tr><td>Domain</td><td><code>contoso.example</code>, 2 live DCs</td></tr>
                <tr><td>DC A (primary)</td><td>Windows Server 2025, 192.0.2.4, <strong>all 5 FSMO roles</strong>, global catalog, replication 0-fail both vantages</td></tr>
                <tr><td>DC B</td><td>Windows Server 2025, 192.0.2.2 (original primary identity), global catalog, <strong>fresh AD object</strong> (new GUID, today's creation date), 0 stale SPNs, autostart enabled</td></tr>
                <tr><td>Identity sync</td><td>member-sync-01 @ 192.0.2.6, engine live and healthy, timezone aligned to the DCs</td></tr>
                <tr><td>Functional level</td><td><strong>Windows 2025 forest + domain</strong> (irreversible step complete, both vantages verified)</td></tr>
                <tr><td>Old 2019 DCs</td><td>dc-01 and dc-02 demoted, powered off, <strong>retained</strong> (disk images + all snapshots as rollback material)</td></tr>
                <tr><td>Hypervisor snapshots</td><td>34+ retained per policy (baseline, pre-forestprep, pre-domainprep, pre-join, pre-promo, pre-demote, pre-flraise, pre-rename, pre-ipchange, pre-demote-rebuild, and others)</td></tr>
                <tr><td>Lab note</td><td>This was a <strong>lab/POC environment</strong> — single hypervisor host, evaluation OS editions, single-domain forest. Findings on cmdlet parameter changes, AD-object reuse, AppArmor/libvirt interaction, and the discipline itself transfer directly to production forests; the credential-handling notes deliberately do not.</td></tr>
            </tbody>
        </table>
        <h3 class="fade-in">7.2 Still open (all optional; none block dual-DC health)</h3>
        <ol class="fade-in">
            <li><strong>dc-03 rename (→ the original secondary identity).</strong> Parked by operator decision: if it is ever wanted, it will be done as a <strong>fresh build, never in place</strong>, and will be requested separately.</li>
            <li><strong>The retained zombie VM</strong> (the old DC4 disk image, shut off, autostart disabled, restorable). Decommission or repurpose is a separate decision; it is not required for dual-DC health.</li>
            <li><strong>The member-sync-01 event log</strong> shows repeated <code>GroupPolicy 1125</code> errors — flagged for investigation; the sync engine itself is healthy (live, cycling normally), so this is cosmetic-or-unknown, not confirmed harmful. <em>(Unverified in the record — marked as such.)</em></li>
            <li><strong>Snapshot pruning.</strong> 34+ snapshots are retained by policy; cleanup requires an explicit operator decision.</li>
            <li><strong>The DNS-forwarder contradiction</strong> (empty vs. populated forwarder reads on the same day) was never re-verified; if forwarders were genuinely lost, the 6900 symptom class could return. Re-check <code>Get-DnsServerForwarders</code> on both DCs before dismissing. <em>(Unverified in the record — marked as such.)</em></li>
            <li><strong>Stale DHCP static reservation</strong> on the lab network for the retired primary DC's MAC — dormant collision risk if that VM ever boots and DHCPs; low urgency while it stays off.</li>
        </ol>
    </section>

    <section class="section">
        <h2 class="fade-in">8. Appendix — the discipline that made this survivable</h2>
        <p class="fade-in">For a reader with no project context, the pattern worth copying is not any single fix but the operating loop that repeated ~40 times in this project:</p>
        <div class="diagram fade-in"><pre>snapshot → GO → execute → independent read-back (authoritative vantage)
        → time-gapped re-read → report (including what still fails)</pre></div>
        <ul class="fade-in">
            <li><strong>Snapshot before every mutation</strong> — 34+ rollback points, several of which were used.</li>
        </ul>
        <ul class="fade-in">
            <li><strong>Independent read-back</strong> — from the <em>other</em> DC's vantage, not the box that just changed; time-gapped where identity was in question (the 60-second SPN watch is what proved a live writer existed).</li>
        </ul>
        <ul class="fade-in">
            <li><strong>Report the failures</strong> — the two false successes (§4.11) were caught precisely because the next session's first act was re-verification, not trust.</li>
        </ul>
        <ul class="fade-in">
            <li><strong>Stop-and-report gates</strong> — the single-DC exposure windows stayed <em>windows</em>, not outages, because every destructive step waited for explicit authorization and every recovery was offered as options, not executed.</li>
        </ul>
        <ul class="fade-in">
            <li><strong>Evidence over error strings</strong> — the AppArmor case, the realm-mismatch case, and the reused-object case were all solved by reading ground truth (kernel audit log, AD object metadata, KDC behavior) instead of trusting the surface error.</li>
        </ul>
        <p class="fade-in"><em>Prepared from the full project record (<code>DCupgrade-STATE.md</code>, <code>MIGRATION-LOG.md</code>, and the working case-study entries). No state-changing commands were run to produce this document. Retracted claims from earlier in the project — the "orphaned flock" theory, the AD Connect writeback theory, "dual-DC restored" statements that later proved to describe a zombie, and the "15 SPNs removed" reports that removed zero — are <strong>not</strong> carried forward as fact; they appear above only as the diagnosed dead ends they were.</em></p>
    </section>

    <footer><p>Copyright © 2026 <a href="/">AppoSight</a>. All rights reserved.</p></footer>

    <script>
        (function(){
            var h = document.querySelector('.hamburger');
            var n = document.querySelector('.nav-links');
            if(h && n){
                h.addEventListener('click', function(){
                    h.classList.toggle('active');
                    n.classList.toggle('open');
                });
                n.querySelectorAll('a').forEach(function(l){
                    l.addEventListener('click', function(){
                        h.classList.remove('active');
                        n.classList.remove('open');
                    });
                });
            }
        })();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        setTimeout(() => { document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible')); }, 2000);
    </script>
</body>
</html>
`;

const DC_AZURE_SECURITY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auditing and Securing a Domain Controller on Azure | AppoSight</title>
    <meta name="description" content="How a disciplined audit — evidence first, fix second, verify third — found and closed the real security gaps behind a working Azure domain controller, with a human approving every privileged change.">
<style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --black: #1d1d1f; --gray: #86868b; --light-gray: #f5f5f7; --white: #ffffff; --blue: #2997ff; --green: #30d158; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--black); background: var(--white); overflow-x: hidden; }
        nav { position: fixed; top: 0; width: 100%; padding: 14px 40px; background: rgba(255,255,255,0.8); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); z-index: 100; display: flex; justify-content: space-between; align-items: center; }
        .logo-link { text-decoration: none; color: inherit; }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; letter-spacing: -0.5px; }
        .logo svg { height: 32px; }
        @keyframes hexRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hex-logo { animation: hexRotate 20s linear infinite; transform-origin: center; }
        .nav-links a { color: var(--black); text-decoration: none; margin-left: 28px; font-size: 12px; opacity: 0.8; transition: opacity 0.3s; }
        .nav-links a:hover { opacity: 1; }
        .back-link { display: inline-block; font-size: 18px; color: var(--blue); text-decoration: none; margin-bottom: 24px; opacity: 0.8; }
        .back-link:hover { opacity: 1; text-decoration: underline; }
        .hero { min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: var(--black); color: var(--white); padding: 120px 20px 80px; }
        .hero h1 { font-size: clamp(36px, 6vw, 60px); font-weight: 700; letter-spacing: -2px; line-height: 1.1; margin-bottom: 16px; max-width: 1000px; }
        .hero .subtitle { font-size: clamp(17px, 2.4vw, 22px); color: var(--gray); max-width: 680px; line-height: 1.4; }
        .section { padding: 90px 40px; max-width: 900px; margin: 0 auto; }
        .section h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 700; letter-spacing: -1.5px; margin-bottom: 24px; line-height: 1.15; }
        .section h3 { font-size: 22px; font-weight: 600; letter-spacing: -0.5px; margin: 44px 0 14px; }
        .section p { font-size: 18px; color: var(--gray); line-height: 1.6; margin-bottom: 20px; }
        .section p:last-child { margin-bottom: 0; }
        .section p strong { color: var(--black); }
        .section em { font-style: italic; }
        .section code, .subtitle code { font-family: "SF Mono", "Fira Code", monospace; font-size: 0.86em; background: var(--light-gray); padding: 2px 6px; border-radius: 6px; color: var(--black); }
        .subtitle code { background: rgba(255,255,255,0.14); color: var(--white); }
        .section ul { margin: 0 0 20px 22px; }
        .section ul li { font-size: 17px; color: var(--gray); line-height: 1.6; margin-bottom: 12px; }
        .section ul li strong { color: var(--black); }
        .comp-table { width: 100%; border-collapse: collapse; margin: 28px 0; font-size: 15px; }
        .comp-table th { text-align: left; padding: 12px 16px; border-bottom: 2px solid var(--light-gray); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--gray); }
        .comp-table td { padding: 14px 16px; border-bottom: 1px solid var(--light-gray); color: var(--gray); vertical-align: top; }
        .comp-table td strong { color: var(--black); }
        .diagram { background: #0d0d0f; border-radius: 16px; padding: 26px 24px; margin: 28px 0; overflow-x: auto; }
        .diagram pre { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 13px; line-height: 1.55; color: #d6d6dc; margin: 0; white-space: pre; }
        .img-card { background: #ffffff; border: 1px solid #e8e8ed; border-radius: 16px; padding: 20px; margin: 28px 0; box-shadow: 0 2px 12px rgba(0,0,0,0.05); overflow-x: auto; }
        .img-card svg { max-width: 100%; }
        .caption { font-size: 14px; color: var(--gray); margin-top: 14px; text-align: center; line-height: 1.5; }
        .see-also { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--gray); text-decoration: none; border: 1px solid #d2d2d7; border-radius: 980px; padding: 10px 18px; }
        footer { text-align: center; padding: 40px 20px; font-size: 12px; color: var(--gray); border-top: 1px solid var(--light-gray); }
        footer a { color: var(--blue); text-decoration: none; }
        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; z-index: 110; }
        .hamburger span { display: block; width: 24px; height: 2px; background: var(--black); border-radius: 2px; transition: all 0.3s; }
        .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        @media (max-width: 600px) {
            nav { padding: 14px 20px; }
            .hamburger { display: flex; }
            .nav-links { position: fixed; top: 0; right: 0; width: 260px; height: 100vh; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: flex; flex-direction: column; justify-content: center; padding: 0 40px; transform: translateX(100%); transition: transform 0.3s ease; z-index: 105; box-shadow: -4px 0 24px rgba(0,0,0,0.1); }
            .nav-links.open { transform: translateX(0); }
            .nav-links a { margin-left: 0; margin-bottom: 24px; font-size: 20px; opacity: 0.85; }
            .section { padding: 60px 20px; }
            .section p, .section ul li { font-size: 16px; }
            .comp-table { font-size: 13px; }
            .comp-table th, .comp-table td { padding: 10px 8px; }
            .img-card { padding: 12px; }
        }
    </style>
</head>
<body>
<nav>
        <a href="/" class="logo-link">
            <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5" class="hex-logo"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
            </div>
        </a>
        <div class="nav-links">
            <a href="/about">About</a>
            <a href="/#capabilities">Capabilities</a>
            <a href="/#pentest">Pentest</a>
            <a href="/Use-Cases">Use Cases</a>
            <a href="/briefings">Briefings</a>
            <a href="/#contact">Contact</a>
        </div>
        <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </nav>

    <section class="hero">
        <a href="/Use-Cases" class="back-link fade-in" style="color:var(--blue)">← All Use Cases</a>
        <h1 class="fade-in">Auditing and Securing a Domain Controller on Azure</h1>
        <p class="subtitle fade-in"><strong>How a disciplined audit — evidence first, fix second, verify third — found and closed the real security gaps behind a working Azure domain controller: weak IPsec crypto, a 16,384-port firewall grant, a VPN CA key sitting on a workstation, and privileged accounts out of scope. An AI agent did the hunting and the proving; a human approved every privileged change — and the most sensitive one stays in human hands to apply.</strong></p>
    </section>

    <section class="section">
        <p class="fade-in" style="border-left:3px solid var(--blue);padding-left:16px;color:var(--black);max-width:720px">Companion to the <a href="/use-cases/dc-azure-deployment">"Deploying a Domain Controller to Azure"</a> case study. That project <em>built</em> the Azure DC and proved it replicates. This one <em>secures</em> it.</p>
    </section>

    <section class="section">
        <h2 class="fade-in">The starting problem</h2>
        <p class="fade-in">The first case study ended with a working, replicating domain controller in Azure. But "working" is not "secure." The tunnel that makes the Azure DC useful is also its only front door, and a quick look at the live state showed four gaps that a customer or a regulator would immediately notice:</p>
        <table class="comp-table fade-in"><tr><th>#</th><th>Gap (as found)</th><th>Severity</th></tr><tr><td>W1</td><td>The IPsec tunnel was negotiating <strong>AES-128-CBC / SHA-1 / MODP-1024</strong> — an audit-visible weak combination, in a tunnel that is the only path to a domain controller</td><td>High</td></tr><tr><td>W2</td><td>The NSG allowed <strong>16,384 inbound RPC/DFSR/DNS ports</strong> to the DC (range 49152–65535)</td><td>Medium</td></tr><tr><td>W3</td><td>The <strong>point-to-site VPN root-CA private key</strong> — and the client certificate — sat as plaintext files on a workstation: a single point of failure for the entire VPN identity</td><td>Medium</td></tr><tr><td>W4</td><td>The <strong>Windows baseline of the DC itself</strong> had never been audited: privileged groups, local accounts, RDP group, services</td><td>Medium</td></tr></table>
        <p class="fade-in">The working rule for this whole track was the same as the build: <strong>evidence before assertion, a state change only after an explicit human approval, and secrets handled as references — never values.</strong></p>
    </section>

    <section class="section">
        <h2 class="fade-in">The method</h2>
        <p class="fade-in">Every finding followed the same loop: <strong>capture the live state as evidence → propose the smallest change that closes the gap → apply only after approval → verify the after-state with the same tool that produced the before-state.</strong> Where a tool could not see in (a service-account context, a locked file, a kernel counter), the gap was recorded as <em>inconclusive</em> — never quietly read as "compliant."</p>
    </section>

    <section class="section">
        <h2 class="fade-in">What the audit found</h2>
        <h3 class="fade-in">W1 — The tunnel was quietly negotiating weak crypto</h3>
        <p class="fade-in">The tunnel reported healthy, connected, and moving data on both ends. But its own status output showed the negotiated proposal: <code>AES_CBC_128 / HMAC_SHA1 / MODP_1024</code>. The cause was subtle: the gateway had no explicit IPsec policy, so it had fallen back to a default set that <em>included</em> the weak pair. No error, no warning — just a weak handshake in a log nobody was reading.</p>
        <p class="fade-in">The fix was a two-sided pin, chosen to the strongest combination the gateway class actually supports (the DH-group ceiling was checked against the live <code>--help</code>, not assumed): <strong>AES-256 / SHA-384 / ECP-384 in the IKE phase and AES-256-GCM in the ESP phase</strong> on both Azure and strongSwan.</p>
        <p class="fade-in">This is where the verification discipline paid off, in the form of a mistake the agent itself made and caught. The first rekey dropped the tunnel: the IKE phase was pinned correctly but the ESP line was missing its ECP group, so on the first rekey Azure offered GCM over ECP-384 while the local side offered GCM over MODP-2048 — no common proposal, and the tunnel silently died. The signature looked exactly like a network outage. It was root-caused to that one token, corrected to <code>…-ecp384</code>, and re-keyed. The lesson recorded: <strong>an "IKE up, ESP dead" state is indistinguishable from a tunnel outage unless you read both phases</strong> — and a rekey failure is not proof the fix was wrong, only proof something is still mismatched.</p>
        <h3 class="fade-in">W2 — A 16,384-port grant, narrowed to the ports that were actually listening</h3>
        <p class="fade-in">The NSG rule was <code>49152–65535</code> — a blanket 16,384-port allow to a domain controller. The audit did not guess at a "safe range"; it read the <em>actual</em> live listeners on the box and found the real set was far smaller: RPC endpoint mapper on 135, the LSASS LDAP endpoints in 49664–49704, ADWS, and the two service ports for DFSR and DNS.</p>
        <p class="fade-in">The change was the smallest one that closed the gap with zero Windows-state impact: narrow the NSG to exactly the observed listener set. No service restart, no LDAP rebind, fully reversible with a single command.</p>
        <p class="fade-in"><strong>Before → after:</strong> 16,384 allowed inbound RPC/DFSR/DNS ports → <strong>43</strong> (41 in 49664–49704, plus DFSR and DNS), all still scoped to the single trusted source.</p>
        <p class="fade-in"><strong>Verified by a port matrix, not a claim:</strong> in-range ports (389, 135, 49664, 53281, 56715) open, and previously-allowed out-of-range ports (49153, 50000, 60000) now <strong>filtered</strong> — the hardening is visible, not assumed. AD replication, the function that actually depends on those ports, stayed green through and after the change.</p>
        <h3 class="fade-in">W3 — A VPN CA key living on a workstation</h3>
        <p class="fade-in">The gateway held only the root <em>certificate</em>; the <em>private key</em> was needed only to sign a new client certificate. But that key — plus the client key and certificate — was sitting as plaintext files on a workstation. A single lost or stolen workstation was a total compromise of the VPN identity.</p>
        <p class="fade-in">The fix moved all four files into a local, encrypted vault (gpg, AES-256, PBKDF2), with a passphrase generated and shown to the human exactly once and never recorded. Every file was round-trip verified (decrypt, hash-match, size-match), then the plaintext originals — including a stray duplicate — were shredded and a full-disk sweep confirmed <strong>no P2S private key remained anywhere on the host.</strong></p>
        <p class="fade-in"><strong>Verified:</strong> the decrypted root key's public half matches the certificate already installed on the gateway — so the vault holds the <em>correct</em> key, not a copy of something else.</p>
        <h3 class="fade-in">W4 — The DC's own Windows baseline</h3>
        <p class="fade-in">This is the audit that found the most, because it was the least looked at. A read-only sweep of the live DC surfaced:</p>
        <ul>
            <li class="fade-in"><strong>High:</strong> the <strong>Guest</strong> account enabled; the <strong>Print Spooler</strong> running and set to auto-start on a domain controller (a PrintNightmare-class surface that has no business there); and three <strong>human-named local SAM accounts enabled</strong> that shadow real users — a pass-the-hash / local-privilege path.</li>
            <li class="fade-in"><strong>Medium:</strong> ~36 local SAM accounts created <em>locally on the DC</em> rather than as domain accounts; a <strong>privileged service account</strong> holding the two highest-privilege groups plus operator groups; a recurring Group Policy failure the logs flagged but the service-account context could not fully explain.</li>
        </ul>
        <p class="fade-in">The agent remediated the High items it could reach in-context and verified each with the same command that produced the finding:</p>
        <div class="diagram fade-in"><pre>H1  Guest account            -&gt; disabled      (verified: Enabled=False)
H2  Print Spooler            -&gt; Stopped, Disabled (verified: State/StartType)
H3  3 human-named local SAM  -&gt; disabled      (verified: Enabled=False each)</pre></div>
        <p class="fade-in">During remediation, a transient state reading briefly suggested the three accounts might have re-enabled themselves — a discrepancy serious enough to warrant a full stop and independent investigation before proceeding further. A dedicated audit-log review found zero account-enable events across the entire window, from any source, and traced the only account-modification activity to the remediation script's own service context. A second, independent re-verification twenty-four hours later — fresh event log query, fresh account-state read — confirmed the same result: all three accounts remain disabled, and no enable event exists anywhere in the log. The original reading is best explained as a transient capture artifact, not a real state change or unauthorized action. <strong>The finding: closed, with two independent confirmations rather than one.</strong></p>
        <p class="fade-in">The Medium item of a <strong>privileged service account with excess rights</strong> was identified, scoped for reduction, and <strong>staged and handed to the operator to apply over an interactive RDP session</strong> — the kind of change to a production AD identity that the operating model deliberately keeps in human hands (see below). A few lines — Group Policy root cause, Defender signature currency, SMB signing, TLS minimum version — sit behind an elevated interactive session the audit context could not read; they are reported as <em>inconclusive</em>, not "compliant."</p>
    </section>

    <section class="section">
        <h2 class="fade-in">The durability test</h2>
        <p class="fade-in">A security fix that vanishes on reboot is not a fix. The on-prem host is on a nightly power schedule, so the real test was whether the whole secured stack — tunnel, firewall order, replication — came back up on its own after a full power cycle, unattended.</p>
        <p class="fade-in">It did, and it had already survived one: a prior reboot had regenerated one of the firewall chains empty, breaking one direction of AD replication with a single, direction-specific error. The agent's recovery script was rewritten to verify the rule's <em>position and correctness</em>, not just its presence, so the next reboot did not reproduce the failure. On the following power cycle, the tunnel auto-reconnected within seconds, the firewall rules were re-pinned at the correct chain positions, and AD replication was <strong>green in both directions across all three domain controllers</strong> with no manual intervention.</p>
    </section>

    <section class="section">
        <h2 class="fade-in">Where the human stayed in control</h2>
        <p class="fade-in">The build case study's rule held, and got stricter, because this track is <em>privilege-reducing</em> rather than build-out:</p>
        <ul>
            <li class="fade-in"><strong>Every privileged state change was human-approved before it ran — and the most sensitive one was never run by the agent.</strong> The de-scoping of a production AD service account was identified, scoped, and staged by the agent, then handed to the operator to apply over RDP, so the AD-identity change stays in human hands.</li>
            <li class="fade-in"><strong>Credentials and secrets stayed out of the agent's reach.</strong> The CA vault passphrase was generated and shown once, then discarded from the tooling; the DC's privileged-account de-scope was staged by the agent and reserved for the operator to apply over RDP.</li>
            <li class="fade-in"><strong>A state discrepancy was treated as a stop-and-verify event, not a footnote.</strong> When remediation evidence briefly disagreed with itself, the response was to halt, pull the authoritative audit log, and re-confirm independently — twice — rather than resolve it by assertion.</li>
            <li class="fade-in"><strong>Findings the tools could not prove were labeled as such.</strong> Inconclusive was kept inconclusive — a "can't see it" was never written up as a "pass."</li>
        </ul>
    </section>

    <section class="section">
        <h2 class="fade-in">Verified outcome</h2>
        <p class="fade-in">The decisive check — the same command the build used, re-run after the audit — is unchanged and green. Verbatim from the audit window (<code>ops/w4-D-out.txt</code>):</p>
        <div class="diagram fade-in"><pre>repadmin /replsummary

  Source DSA          largest delta    fails/total %%   error
   CONTO-DC                  12m:56s    0 /  10    0
   CONTO-DC2                 12m:56s    0 /  10    0
   vm-w2022-poc              02m:38s    0 /  10    0

  Destination DSA     largest delta    fails/total %%   error
   CONTO-DC                  02m:39s    0 /  10    0
   CONTO-DC2                    :51s    0 /  10    0
   vm-w2022-poc              12m:58s    0 /  10    0</pre></div>
        <p class="fade-in">Zero replication failures, in both directions, across all three domain controllers. The same check was re-run live after the subsequent power cycle and security changes, and returned the same result — zero failures in both directions. The tunnel was on the hardened AES-256/GCM/ECP-384 policy, the NSG narrowed to the observed listener set, the VPN CA key off-host, and the DC's High-severity local-account and service findings closed.</p>
    </section>

    <section class="section">
        <h2 class="fade-in">What this actually demonstrates</h2>
        <p class="fade-in">The build proved an AI agent can do hard systems work end-to-end. The audit adds the part that's more valuable in practice: <strong>the agent can find the gaps a working system hides, and — more importantly — prove which of its own fixes are real.</strong> It caught its own crypto pinning mistake from the rekey failure, distinguished a "tunnel down" from an "ESP mismatch," treated a self-contradicting piece of evidence as a reason to stop and dig deeper rather than explain away, refused to read a tool it couldn't see through as "compliant," and left every AD-identity decision to the human.</p>
        <p class="fade-in">That boundary — evidence before assertion, approval before privilege, and "inconclusive" left honestly inconclusive — is the part of the model that a customer can actually rely on.</p>
    </section>


    <section class="section" style="padding-top: 0;">
        <span class="see-also fade-in">See also: <a href="/use-cases/dc-azure-deployment">Deploying a Domain Controller to Azure →</a></span>
    </section>

    <footer><p>Copyright © 2026 <a href="/">AppoSight</a>. All rights reserved.</p></footer>

<script>
        (function(){
            var h = document.querySelector('.hamburger');
            var n = document.querySelector('.nav-links');
            if(h && n){
                h.addEventListener('click', function(){
                    h.classList.toggle('active');
                    n.classList.toggle('open');
                });
                n.querySelectorAll('a').forEach(function(l){
                    l.addEventListener('click', function(){
                        h.classList.remove('active');
                        n.classList.remove('open');
                    });
                });
            }
        })();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        setTimeout(() => { document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible')); }, 2000);
    </script>
</body>
</html>`;;

// --- Use Case: AKS Employee Portal Backend (AI-agent case study) ---
const AKS_EMPLOYEE_PORTAL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Building a Secure AKS Employee Portal Backend on Azure with an AI Agent | AppoSight</title>
    <meta name="description" content="How an AI agent provisioned and tore down a fully identity-based AKS employee-portal backend on Azure — AKS, SQL, Key Vault, and ACR with zero stored secrets — validating, revoking, and cleaning up with a human in control of every privileged step.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --black: #1d1d1f; --gray: #86868b; --light-gray: #f5f5f7; --white: #ffffff; --blue: #2997ff; --green: #30d158; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--black); background: var(--white); overflow-x: hidden; }
        nav { position: fixed; top: 0; width: 100%; padding: 14px 40px; background: rgba(255,255,255,0.8); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); z-index: 100; display: flex; justify-content: space-between; align-items: center; }
        .logo-link { text-decoration: none; color: inherit; }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; letter-spacing: -0.5px; }
        .logo svg { height: 32px; }
        @keyframes hexRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hex-logo { animation: hexRotate 20s linear infinite; transform-origin: center; }
        .nav-links a { color: var(--black); text-decoration: none; margin-left: 28px; font-size: 12px; opacity: 0.8; transition: opacity 0.3s; }
        .nav-links a:hover { opacity: 1; }
        .back-link { display: inline-block; font-size: 18px; color: var(--blue); text-decoration: none; margin-bottom: 24px; opacity: 0.8; }
        .back-link:hover { opacity: 1; text-decoration: underline; }
        .hero { min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: var(--black); color: var(--white); padding: 120px 20px 80px; }
        .hero h1 { font-size: clamp(36px, 6vw, 60px); font-weight: 700; letter-spacing: -2px; line-height: 1.1; margin-bottom: 16px; max-width: 1000px; }
        .hero .subtitle { font-size: clamp(17px, 2.4vw, 22px); color: var(--gray); max-width: 720px; line-height: 1.4; }
        .section { padding: 80px 40px; max-width: 900px; margin: 0 auto; }
        .section h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 700; letter-spacing: -1.5px; margin-bottom: 24px; line-height: 1.15; }
        .section h3 { font-size: 22px; font-weight: 600; letter-spacing: -0.5px; margin: 44px 0 14px; }
        .section h4 { font-size: 17px; font-weight: 600; margin: 28px 0 10px; color: var(--black); }
        .section p { font-size: 18px; color: var(--gray); line-height: 1.6; margin-bottom: 20px; }
        .section p:last-child { margin-bottom: 0; }
        .section p strong { color: var(--black); }
        .section p code, .section li code, .section td code, .section th code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 14px; background: #f0f0f2; color: #1d1d1f; padding: 2px 6px; border-radius: 5px; }
        .section em { font-style: italic; }
        .section ul, .section ol { margin: 0 0 20px 22px; }
        .section ul li, .section ol li { font-size: 17px; color: var(--gray); line-height: 1.6; margin-bottom: 12px; }
        .section ul li strong, .section ol li strong { color: var(--black); }
        .section blockquote { border-left: 3px solid var(--blue); background: #f8fafd; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .section blockquote p { margin-bottom: 0; font-size: 16px; }
        .section hr { border: none; border-top: 1px solid #e8e8ed; margin: 40px 0; }
        .comp-table { width: 100%; border-collapse: collapse; margin: 28px 0; font-size: 15px; display: block; overflow-x: auto; }
        .comp-table th { text-align: left; padding: 12px 16px; border-bottom: 2px solid var(--light-gray); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--gray); white-space: nowrap; }
        .comp-table td { padding: 14px 16px; border-bottom: 1px solid var(--light-gray); color: var(--gray); vertical-align: top; }
        .comp-table td strong { color: var(--black); }
        .diagram { background: #0d0d0f; border-radius: 16px; padding: 26px 24px; margin: 28px 0; overflow-x: auto; }
        .diagram code, .diagram { font-family: 'SF Mono', 'Fira Code', monospace; }
        pre.diagram { font-size: 13px; line-height: 1.55; color: #d6d6dc; white-space: pre; margin: 28px 0; }
        pre.diagram code { background: transparent; color: inherit; padding: 0; font-size: 13px; }
        .img-card { background: #ffffff; border: 1px solid #e8e8ed; border-radius: 16px; padding: 22px 20px; margin: 28px 0; box-shadow: 0 2px 12px rgba(0,0,0,0.05); overflow-x: auto; }
        .img-card svg { display: block; width: 100%; max-width: 760px; height: auto; margin: 0 auto; }
        .img-card .diagram-hint { font-size: 11px; color: #a1a1a6; text-align: center; margin-top: 10px; letter-spacing: 0.3px; }
        footer { text-align: center; padding: 40px 20px; font-size: 12px; color: var(--gray); border-top: 1px solid var(--light-gray); }
        footer a { color: var(--blue); text-decoration: none; }
        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; z-index: 110; }
        .hamburger span { display: block; width: 24px; height: 2px; background: var(--black); border-radius: 2px; transition: all 0.3s; }
        .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        @media (max-width: 600px) {
            nav { padding: 14px 20px; }
            .hamburger { display: flex; }
            .nav-links { position: fixed; top: 0; right: 0; width: 260px; height: 100vh; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: flex; flex-direction: column; justify-content: center; padding: 0 40px; transform: translateX(100%); transition: transform 0.3s ease; z-index: 105; box-shadow: -4px 0 24px rgba(0,0,0,0.1); }
            .nav-links.open { transform: translateX(0); }
            .nav-links a { margin-left: 0; margin-bottom: 24px; font-size: 20px; opacity: 0.85; }
            .section { padding: 60px 20px; }
            .section p, .section ul li, .section ol li { font-size: 16px; }
            .comp-table { font-size: 13px; }
            .comp-table th, .comp-table td { padding: 10px 8px; }
            .img-card { padding: 12px; }
        }
    </style>
</head>
<body>
    <nav>
        <a href="/" class="logo-link">
            <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5" class="hex-logo"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
            </div>
        </a>
        <div class="nav-links">
            <a href="/about">About</a>
            <a href="/#capabilities">Capabilities</a>
            <a href="/#pentest">Pentest</a>
            <a href="/Use-Cases">Use Cases</a>
            <a href="/briefings">Briefings</a>
            <a href="/#contact">Contact</a>
        </div>
        <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </nav>

    <section class="hero">
        <a href="/Use-Cases" class="back-link fade-in" style="color:var(--blue)">&larr; All Use Cases</a>
        <h1 class="fade-in">Building a Secure AKS Employee Portal Backend on Azure with an AI Agent</h1>
        <p class="subtitle fade-in">How an AI agent provisioned a no-secrets, fully identity-based AKS + SQL + Key Vault + ACR stack for an employee portal — then validated, revoked, and tore it all down cleanly, with a human approving every privileged step.</p>
    </section>

<section class="section"><h2 class="fade-in">1. Objective &amp; scope</h2>
<p class="fade-in"><strong>What was built.</strong> A small, cost-conscious AKS cluster in Azure that hosts an internal employee portal. The deployment doubles as a <strong>teaching case study</strong> — the bar is <em>clear, well-documented, standard patterns over clever configuration</em>, and every design choice is explainable to a learner.</p>
<p class="fade-in"><strong>Why.</strong> The project exercises three PSC lines simultaneously:</p>
<ul class="fade-in">
<li><strong>D-IT</strong> — cloud infrastructure / platform engineering (AKS, VNet, NSG, ACR, Key Vault, SQL, Log Analytics).</li>
<li><strong>R-mgmt</strong> — the audit-then-deploy, cost-cap, evidence-first discipline that governed the whole engagement.</li>
<li><strong>U-training</strong> — the case-study narrative itself is the deliverable.</li>
</ul>
<p class="fade-in"><strong>Locked scope (do not re-open without explicit approval).</strong></p>
<ul class="fade-in">
<li><strong>Employee-portal only.</strong> Internal, no public exposure. No customer / B2C path.</li>
<li><strong>No VPN gateway.</strong> The portal is reached over the VNet / internal LB. A live site-to-site tunnel is not required to demonstrate any of the PoC&#39;s actual goals.</li>
<li><strong>Infrastructure + identity plumbing only.</strong> End-to-end application login was <strong>intentionally not exercised</strong> — the ILB backend pool is empty <strong>by design</strong>, and the portal application layer is <strong>out of scope for this PoC</strong>. This is a scope boundary, not an oversight (see §6).</li>
<li><strong>Budget cap: $300 / month</strong> with alerts at 50 / 80 / 100 % to the budget-alert recipient.</li>
</ul>
<p class="fade-in"><strong>What was removed from the original two-portal brief</strong> (public customer + internal employee) when the scope was narrowed to employee-only:</p>
<ul class="fade-in">
<li>App Gateway v2 + OWASP WAF</li>
<li>Public IP (for inbound)</li>
<li>Public-ingress subnet</li>
<li>Public NSG</li>
<li>Any B2C / public-identity path</li>
</ul>
<p class="fade-in">Two <strong>optional</strong> add-ons still ship as separate templates, applied only when needed — <strong>not</strong> in the default deploy:</p>
<table class="comp-table fade-in">
<thead>
<tr>
<th>Optional template</th>
<th>When to apply</th>
</tr>
</thead>
<tbody><tr>
<td><code>optional/peering.bicep</code></td>
<td>Only if a hub VNet exists</td>
</tr>
<tr>
<td><code>optional/employee-db.bicep</code></td>
<td>Only if one SQL database is not enough</td>
</tr>
</tbody></table>
<hr class="fade-in">
</section><section class="section"><h2 class="fade-in">2. Architecture</h2>
<h3 class="fade-in">2.1 Resource topology</h3>
<p class="fade-in">Two diagrams, both generated directly from the authoritative Bicep source (<code>main.bicep</code> + <code>cluster.bicep</code>) for this case study. (See §10 for a note on diagram provenance.)</p>
<p class="fade-in"><strong>Figure 1 — Network &amp; compute topology (eastus, single resource group <code>cpcs-rg</code>).</strong></p>
<p class="fade-in"><figure class="img-card fade-in"><svg width="100%" viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" role="img" xmlns:c2pa="http://c2pa.org/manifest"><metadata><c2pa:manifest>AAAWgmp1bWIAAAAeanVtZGMycGEAEQAQgAAAqgA4m3EDYzJwYQAAABZcanVtYgAAAEdqdW1kYzJtYQARABCAAACqADibcQN1cm46YzJwYToyOGY2YzY5NS1lYmE0LTRiZGQtYmE4ZS05ZmRiZDBiYTZlMzcAAAADl2p1bWIAAAApanVtZGMyYXMAEQAQgAAAqgA4m3EDYzJwYS5hc3NlcnRpb25zAAAAALxqdW1iAAAARGp1bWRjYm9yABEAEIAAAKoAOJtxE2MycGEuaW5ncmVkaWVudC52MwAAAAAYYzJzaGvvqd9Cj2xgDtbiQ+X2FGwAAABwY2JvcqNpZGM6Zm9ybWF0bWltYWdlL3N2Zyt4bWxqaW5zdGFuY2VJRHgseG1wOmlpZDoyZWUyMjVlMC1kMWYyLTQ4NTEtOWU0MC02MWU1MDQwYTU1NjRscmVsYXRpb25zaGlwaHBhcmVudE9mAAAB4mp1bWIAAABBanVtZGNib3IAEQAQgAAAqgA4m3ETYzJwYS5hY3Rpb25zLnYyAAAAABhjMnNoTIYo8AT19sB8c8LAVgaSfwAAAZljYm9yomdhY3Rpb25zgqJmYWN0aW9ua2MycGEub3BlbmVkanBhcmFtZXRlcnOha2luZ3JlZGllbnRzgaJjdXJseC1zZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmluZ3JlZGllbnQudjNkaGFzaFggBVg2JrATkfgBUeCXelJuV3+5Dy9QNUUCxjgS7TZuuCakZmFjdGlvbngdY29tLmFudGhyb3BpYy5jbGF1ZGUucHJvdmlkZWRqcGFyYW1ldGVyc6F4H2NvbS5hbnRocm9waWMub3JpZ2luLWNvbmZpZGVuY2VndW5rbm93bmtkZXNjcmlwdGlvbnhmQ2xhdWRlIHByb3ZpZGVkIHRoaXMgZmlsZSBhdCB0aGUgcmVxdWVzdCBvZiBhIHVzZXIgYW5kIG1heSBoYXZlIGNyZWF0ZWQgb3IgbW9kaWZpZWQgdGhlIGZpbGUgY29udGVudHMubXNvZnR3YXJlQWdlbnShZG5hbWVmQ2xhdWRlcmFsbEFjdGlvbnNJbmNsdWRlZPUAAADIanVtYgAAAEBqdW1kY2JvcgARABCAAACqADibcRNjMnBhLmhhc2guZGF0YQAAAAAYYzJzaD0P7qyDkNHVMI48s5kCvjcAAACAY2JvcqVjYWxnZnNoYTI1NmNwYWRNAAAAAAAAAAAAAAAAAGRoYXNoWCAPf9eIna56eurlrDBrS9foSvoM9zoUGnQR+C8krDaazGRuYW1lbmp1bWJmIG1hbmlmZXN0amV4Y2x1c2lvbnOBomVzdGFydBiVZmxlbmd0aBkeBAAAAj5qdW1iAAAAJ2p1bWRjMmNsABEAEIAAAKoAOJtxA2MycGEuY2xhaW0udjIAAAACD2Nib3KlY2FsZ2ZzaGEyNTZpc2lnbmF0dXJleE1zZWxmI2p1bWJmPS9jMnBhL3VybjpjMnBhOjI4ZjZjNjk1LWViYTQtNGJkZC1iYThlLTlmZGJkMGJhNmUzNy9jMnBhLnNpZ25hdHVyZWppbnN0YW5jZUlEeCx4bXA6aWlkOmM4OGU4Yjg5LWM3OTMtNDU3MS05NmUxLTRmYjBhMjk2ZjdkMXJjcmVhdGVkX2Fzc2VydGlvbnODomN1cmx4LXNlbGYjanVtYmY9YzJwYS5hc3NlcnRpb25zL2MycGEuaW5ncmVkaWVudC52M2RoYXNoWCAFWDYmsBOR+AFR4Jd6Um5Xf7kPL1A1RQLGOBLtNm64JqJjdXJseCpzZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmFjdGlvbnMudjJkaGFzaFgg2UAEtAa+SvXzf4lirtTXBLSirLUOg91J+5F5s1fJgoCiY3VybHgpc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5oYXNoLmRhdGFkaGFzaFggVLYLqIfSohs+FX4c7MnA7Fyw7YHQ7+OQKITY1+FlCBZ0Y2xhaW1fZ2VuZXJhdG9yX2luZm+jZG5hbWVvQW50aHJvcGljIEZpbGVzZ3ZlcnNpb25lMS4wLjBrc3BlY1ZlcnNpb25lMi40LjAAABA4anVtYgAAAChqdW1kYzJjcwARABCAAACqADibcQNjMnBhLnNpZ25hdHVyZQAAABAIY2JvctKEWQISogEmGCFZAgowggIGMIIBjaADAgECAhRA5aAK7sI50L64g/oGQgU9Z1UTADAKBggqhkjOPQQDAzBJMRcwFQYDVQQKEw5BbnRocm9waWMsIFBCQzEuMCwGA1UEAxMlQW50aHJvcGljIENvbnRlbnQgQ3JlZGVudGlhbHMgUm9vdCBDQTAeFw0yNjA4MDcxODQzNTZaFw0yODA4MDYxOTQzNTZaMEQxFzAVBgNVBAoTDkFudGhyb3BpYywgUEJDMSkwJwYDVQQDEyBBbnRocm9waWMgQ2xhdWRlIENvbnRlbnQgU2lnbmluZzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABJh6CmvLUBgFFNU0vUKlOVtE6djd17L5SuwX0LemFisBM3dkd/3cyjxFA3Qo5S46fX0/ihY0VZ7mfb9KF703t5OjWDBWMA4GA1UdDwEB/wQEAwIHgDAVBgNVHSUEDjAMBgorBgEEAYPoXgIBMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUzlHiBIFOZFsj+OPEz5o+nMHXXMIwCgYIKoZIzj0EAwMDZwAwZAIwMXMdFJ4BetLLVY7ORuE9noqbbAZOZn/aArXyTwFAZfKrPzxF2vPoJNf1+UCdg1XGAjBwX1zd9WGqYkqmL5SFqw1QySjr1zJfpJM9+1rdDwSPLMOPOjKuiXjoU/pUUeG9RwmhY3BhZFkNngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPZYQElA5+juMwNgqDdiY0PKH7fohQco6/cDDEc7DhRsRaqhDc04foimpThMo2uCYLRqarty97eXgQHWAXrbT4NslvE=</c2pa:manifest></metadata>
<title>Network and compute topology</title>
<desc>Resource group cpcs-rg containing a VNet with three subnets, plus shared services accessed via managed identity</desc>
<style>
  text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  .th { font-size: 14px; font-weight: 500; }
  .ts { font-size: 12px; font-weight: 400; }
</style>
<rect x="20" y="20" width="640" height="360" rx="20" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="0.5"/>
<text class="th" x="40" y="44" fill="#2C2C2A">Resource group: cpcs-rg (eastus)</text>
<rect x="40" y="60" width="600" height="180" rx="14" fill="#E6F1FB" stroke="#185FA5" stroke-width="0.5"/>
<text class="ts" x="56" y="80" fill="#185FA5">VNet 10.40.0.0/16 (cpcs-vnet)</text>
<g>
  <rect x="56" y="95" width="176" height="130" rx="10" fill="#E1F5EE" stroke="#0F6E56" stroke-width="0.5"/>
  <text class="th" x="144" y="120" text-anchor="middle" fill="#085041">aks-node subnet</text>
  <text class="ts" x="144" y="140" text-anchor="middle" fill="#0F6E56">10.40.0.0/24</text>
  <text class="ts" x="144" y="158" text-anchor="middle" fill="#0F6E56">AKS cpcs-aks</text>
  <text class="ts" x="144" y="176" text-anchor="middle" fill="#0F6E56">2 × D2s_v7</text>
</g>
<g>
  <rect x="252" y="95" width="176" height="130" rx="10" fill="#FAECE7" stroke="#993C1D" stroke-width="0.5"/>
  <text class="th" x="340" y="120" text-anchor="middle" fill="#712B13">internal-ingress</text>
  <text class="ts" x="340" y="140" text-anchor="middle" fill="#993C1D">10.40.2.0/24</text>
  <text class="ts" x="340" y="158" text-anchor="middle" fill="#993C1D">ILB cpcs-ilb</text>
  <text class="ts" x="340" y="176" text-anchor="middle" fill="#993C1D">no public IP</text>
</g>
<g>
  <rect x="448" y="95" width="176" height="130" rx="10" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="0.5"/>
  <text class="th" x="536" y="120" text-anchor="middle" fill="#2C2C2A">system subnet</text>
  <text class="ts" x="536" y="140" text-anchor="middle" fill="#5F5E5A">10.40.3.0/24</text>
  <text class="ts" x="536" y="158" text-anchor="middle" fill="#5F5E5A">reserved</text>
  <text class="ts" x="536" y="176" text-anchor="middle" fill="#5F5E5A">no compute</text>
</g>
<text class="ts" x="40" y="258" fill="#5F5E5A">Shared services (accessed via managed identity)</text>
<g>
  <rect x="56" y="270" width="127" height="70" rx="10" fill="#EEEDFE" stroke="#534AB7" stroke-width="0.5"/>
  <text class="th" x="119" y="296" text-anchor="middle" fill="#26215C">ACR</text>
  <text class="ts" x="119" y="316" text-anchor="middle" fill="#534AB7">container registry</text>
</g>
<g>
  <rect x="203" y="270" width="127" height="70" rx="10" fill="#EEEDFE" stroke="#534AB7" stroke-width="0.5"/>
  <text class="th" x="266" y="296" text-anchor="middle" fill="#26215C">Key Vault</text>
  <text class="ts" x="266" y="316" text-anchor="middle" fill="#534AB7">standard tier</text>
</g>
<g>
  <rect x="350" y="270" width="127" height="70" rx="10" fill="#EEEDFE" stroke="#534AB7" stroke-width="0.5"/>
  <text class="th" x="413" y="296" text-anchor="middle" fill="#26215C">SQL Server</text>
  <text class="ts" x="413" y="316" text-anchor="middle" fill="#534AB7">centralus, v1</text>
</g>
<g>
  <rect x="497" y="270" width="127" height="70" rx="10" fill="#EEEDFE" stroke="#534AB7" stroke-width="0.5"/>
  <text class="th" x="560" y="296" text-anchor="middle" fill="#26215C">Log Analytics</text>
  <text class="ts" x="560" y="316" text-anchor="middle" fill="#534AB7">cpcs-log</text>
</g>
</svg>
</figure></p>
<p class="fade-in"><strong>Figure 2 — Identity &amp; secrets flow (the &quot;no stored secrets&quot; design).</strong></p>
<p class="fade-in"><figure class="img-card fade-in"><svg width="100%" viewBox="0 0 680 350" xmlns="http://www.w3.org/2000/svg" role="img" xmlns:c2pa="http://c2pa.org/manifest"><metadata><c2pa:manifest>AAAWgmp1bWIAAAAeanVtZGMycGEAEQAQgAAAqgA4m3EDYzJwYQAAABZcanVtYgAAAEdqdW1kYzJtYQARABCAAACqADibcQN1cm46YzJwYTpjYzViYzlhNC1iMTJjLTQyMjItYmI4Zi1hZTBmMzZjZmMwMDEAAAADl2p1bWIAAAApanVtZGMyYXMAEQAQgAAAqgA4m3EDYzJwYS5hc3NlcnRpb25zAAAAALxqdW1iAAAARGp1bWRjYm9yABEAEIAAAKoAOJtxE2MycGEuaW5ncmVkaWVudC52MwAAAAAYYzJzaMcynaDC5PEzomF23xV9w/sAAABwY2JvcqNpZGM6Zm9ybWF0bWltYWdlL3N2Zyt4bWxqaW5zdGFuY2VJRHgseG1wOmlpZDo3ZTExZTIxMS1iYzgyLTQ1MjYtOGVjZS1kZjgwYTUxMGYwYmVscmVsYXRpb25zaGlwaHBhcmVudE9mAAAB4mp1bWIAAABBanVtZGNib3IAEQAQgAAAqgA4m3ETYzJwYS5hY3Rpb25zLnYyAAAAABhjMnNosORjGIvqmiRQrqtcEe8acQAAAZljYm9yomdhY3Rpb25zgqJmYWN0aW9ua2MycGEub3BlbmVkanBhcmFtZXRlcnOha2luZ3JlZGllbnRzgaJjdXJseC1zZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmluZ3JlZGllbnQudjNkaGFzaFgg1fTSE5OOPB3HV9ag0LcCK7IsJEuNoMBTGQgooRrQApukZmFjdGlvbngdY29tLmFudGhyb3BpYy5jbGF1ZGUucHJvdmlkZWRqcGFyYW1ldGVyc6F4H2NvbS5hbnRocm9waWMub3JpZ2luLWNvbmZpZGVuY2VndW5rbm93bmtkZXNjcmlwdGlvbnhmQ2xhdWRlIHByb3ZpZGVkIHRoaXMgZmlsZSBhdCB0aGUgcmVxdWVzdCBvZiBhIHVzZXIgYW5kIG1heSBoYXZlIGNyZWF0ZWQgb3IgbW9kaWZpZWQgdGhlIGZpbGUgY29udGVudHMubXNvZnR3YXJlQWdlbnShZG5hbWVmQ2xhdWRlcmFsbEFjdGlvbnNJbmNsdWRlZPUAAADIanVtYgAAAEBqdW1kY2JvcgARABCAAACqADibcRNjMnBhLmhhc2guZGF0YQAAAAAYYzJzaHpdx3/52Iz8J7mZ9YkKpvkAAACAY2JvcqVjYWxnZnNoYTI1NmNwYWRNAAAAAAAAAAAAAAAAAGRoYXNoWCBGiGmv8ranfXHea/YPjBqin3hCEFCfn/qA3c1l+aCjc2RuYW1lbmp1bWJmIG1hbmlmZXN0amV4Y2x1c2lvbnOBomVzdGFydBiVZmxlbmd0aBkeBAAAAj5qdW1iAAAAJ2p1bWRjMmNsABEAEIAAAKoAOJtxA2MycGEuY2xhaW0udjIAAAACD2Nib3KlY2FsZ2ZzaGEyNTZpc2lnbmF0dXJleE1zZWxmI2p1bWJmPS9jMnBhL3VybjpjMnBhOmNjNWJjOWE0LWIxMmMtNDIyMi1iYjhmLWFlMGYzNmNmYzAwMS9jMnBhLnNpZ25hdHVyZWppbnN0YW5jZUlEeCx4bXA6aWlkOmIxYTk3MWRhLTg4ZDQtNDA3ZC04ZTczLTA5ZTA3YTdkMWNjNHJjcmVhdGVkX2Fzc2VydGlvbnODomN1cmx4LXNlbGYjanVtYmY9YzJwYS5hc3NlcnRpb25zL2MycGEuaW5ncmVkaWVudC52M2RoYXNoWCDV9NITk448HcdX1qDQtwIrsiwkS42gwFMZCCihGtACm6JjdXJseCpzZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmFjdGlvbnMudjJkaGFzaFggj5iRPlRpbyaCV/TV2LL37Lt6j9LO2dzqrM9dmVn8n3iiY3VybHgpc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5oYXNoLmRhdGFkaGFzaFgghebFbhXYMyDQ3vKi/d8drDo28nxIUVsR7SLeUaYQYnh0Y2xhaW1fZ2VuZXJhdG9yX2luZm+jZG5hbWVvQW50aHJvcGljIEZpbGVzZ3ZlcnNpb25lMS4wLjBrc3BlY1ZlcnNpb25lMi40LjAAABA4anVtYgAAAChqdW1kYzJjcwARABCAAACqADibcQNjMnBhLnNpZ25hdHVyZQAAABAIY2JvctKEWQISogEmGCFZAgowggIGMIIBjaADAgECAhRA5aAK7sI50L64g/oGQgU9Z1UTADAKBggqhkjOPQQDAzBJMRcwFQYDVQQKEw5BbnRocm9waWMsIFBCQzEuMCwGA1UEAxMlQW50aHJvcGljIENvbnRlbnQgQ3JlZGVudGlhbHMgUm9vdCBDQTAeFw0yNjA4MDcxODQzNTZaFw0yODA4MDYxOTQzNTZaMEQxFzAVBgNVBAoTDkFudGhyb3BpYywgUEJDMSkwJwYDVQQDEyBBbnRocm9waWMgQ2xhdWRlIENvbnRlbnQgU2lnbmluZzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABJh6CmvLUBgFFNU0vUKlOVtE6djd17L5SuwX0LemFisBM3dkd/3cyjxFA3Qo5S46fX0/ihY0VZ7mfb9KF703t5OjWDBWMA4GA1UdDwEB/wQEAwIHgDAVBgNVHSUEDjAMBgorBgEEAYPoXgIBMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUzlHiBIFOZFsj+OPEz5o+nMHXXMIwCgYIKoZIzj0EAwMDZwAwZAIwMXMdFJ4BetLLVY7ORuE9noqbbAZOZn/aArXyTwFAZfKrPzxF2vPoJNf1+UCdg1XGAjBwX1zd9WGqYkqmL5SFqw1QySjr1zJfpJM9+1rdDwSPLMOPOjKuiXjoU/pUUeG9RwmhY3BhZFkNngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPZYQEXRP8QnRGx5UhjpDy1NxFT0rz4FA6RGS+nklNsvoZCwZ0dfrgeMdhM491ykGQNfj0/GVlFbx2/1sMHOAq7lPQM=</c2pa:manifest></metadata>
<title>Identity and secrets flow</title>
<desc>Deployment service principal deploys AKS, which uses a shared managed identity to reach ACR, Key Vault, SQL Server, and Log Analytics via role assignments, with a separate Entra ID OIDC path for employee login out of scope</desc>
<style>
  text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  .th { font-size: 14px; font-weight: 500; }
  .ts { font-size: 12px; font-weight: 400; }
</style>
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
</defs>
<g>
  <rect x="220" y="40" width="240" height="56" rx="8" fill="#FAECE7" stroke="#993C1D" stroke-width="0.5"/>
  <text class="th" x="340" y="58" text-anchor="middle" dominant-baseline="central" fill="#712B13">Deployment SP</text>
  <text class="ts" x="340" y="76" text-anchor="middle" dominant-baseline="central" fill="#993C1D">Contributor + UAM</text>
</g>
<g>
  <rect x="480" y="40" width="160" height="44" rx="8" fill="#EEEDFE" stroke="#534AB7" stroke-width="0.5"/>
  <text class="th" x="560" y="62" text-anchor="middle" dominant-baseline="central" fill="#26215C">Entra ID tenant</text>
</g>
<line x1="340" y1="96" x2="340" y2="120" stroke="#5F5E5A" stroke-width="1.5" marker-end="url(#arrow)"/>
<g>
  <rect x="240" y="120" width="200" height="44" rx="8" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="0.5"/>
  <text class="th" x="340" y="142" text-anchor="middle" dominant-baseline="central" fill="#2C2C2A">az / Bicep deploy</text>
</g>
<line x1="340" y1="164" x2="340" y2="190" stroke="#5F5E5A" stroke-width="1.5" marker-end="url(#arrow)"/>
<g>
  <rect x="210" y="190" width="260" height="56" rx="8" fill="#E6F1FB" stroke="#185FA5" stroke-width="0.5"/>
  <text class="th" x="340" y="208" text-anchor="middle" dominant-baseline="central" fill="#0C447C">AKS cpcs-aks</text>
  <text class="ts" x="340" y="226" text-anchor="middle" dominant-baseline="central" fill="#185FA5">system MI + shared MI cpcs-mi</text>
</g>
<path d="M470 218 L560 218 L560 84" fill="none" stroke="#888780" stroke-width="0.5" stroke-dasharray="3 3"/>
<text class="ts" x="475" y="210" fill="#5F5E5A">aadProfile OIDC</text>
<text class="ts" x="560" y="100" text-anchor="middle" fill="#5F5E5A">employees, out of scope</text>
<line x1="340" y1="246" x2="107" y2="270" stroke="#5F5E5A" stroke-width="1.5" marker-end="url(#arrow)"/>
<line x1="340" y1="246" x2="262" y2="270" stroke="#5F5E5A" stroke-width="1.5" marker-end="url(#arrow)"/>
<line x1="340" y1="246" x2="417" y2="270" stroke="#5F5E5A" stroke-width="1.5" marker-end="url(#arrow)"/>
<line x1="340" y1="246" x2="572" y2="270" stroke="#5F5E5A" stroke-width="1.5" marker-end="url(#arrow)"/>
<g>
  <rect x="40" y="270" width="135" height="60" rx="8" fill="#E1F5EE" stroke="#0F6E56" stroke-width="0.5"/>
  <text class="th" x="107" y="294" text-anchor="middle" dominant-baseline="central" fill="#085041">ACR</text>
  <text class="ts" x="107" y="312" text-anchor="middle" dominant-baseline="central" fill="#0F6E56">AcrPull</text>
</g>
<g>
  <rect x="195" y="270" width="135" height="60" rx="8" fill="#E1F5EE" stroke="#0F6E56" stroke-width="0.5"/>
  <text class="th" x="262" y="294" text-anchor="middle" dominant-baseline="central" fill="#085041">Key Vault</text>
  <text class="ts" x="262" y="312" text-anchor="middle" dominant-baseline="central" fill="#0F6E56">Secrets User</text>
</g>
<g>
  <rect x="350" y="270" width="135" height="60" rx="8" fill="#E1F5EE" stroke="#0F6E56" stroke-width="0.5"/>
  <text class="th" x="417" y="294" text-anchor="middle" dominant-baseline="central" fill="#085041">SQL Server</text>
  <text class="ts" x="417" y="312" text-anchor="middle" dominant-baseline="central" fill="#0F6E56">Contributor</text>
</g>
<g>
  <rect x="505" y="270" width="135" height="60" rx="8" fill="#E1F5EE" stroke="#0F6E56" stroke-width="0.5"/>
  <text class="th" x="572" y="294" text-anchor="middle" dominant-baseline="central" fill="#085041">Log Analytics</text>
  <text class="ts" x="572" y="312" text-anchor="middle" dominant-baseline="central" fill="#0F6E56">Reader</text>
</g>
</svg>
</figure></p>
<h3 class="fade-in">2.2 Component inventory</h3>
<table class="comp-table fade-in">
<thead>
<tr>
<th>Concern</th>
<th>Choice</th>
<th>Notes</th>
</tr>
</thead>
<tbody><tr>
<td>Compute</td>
<td>AKS <code>cpcs-aks</code>, <strong>2 × Standard_D2s_v7</strong>, K8s <strong>1.34.10</strong></td>
<td>Linux, single System-mode pool, <code>maxPods: 30</code>. (D2s_v7 chosen because D2s_v5 is not in the allowed-VM-sizes list for this subscription in eastus; 1.34.10 chosen because 1.31.3 is now LTS-only in eastus — see §4.2.)</td>
</tr>
<tr>
<td>Network</td>
<td>VNet <strong>10.40.0.0/16</strong> (<code>cpcs-vnet</code>)</td>
<td>Subnets (created <strong>serially</strong> — see §4.1): <code>aks-node</code> .0/24, <code>internal-ingress</code> .2/24, <code>system</code> .3/24. <strong>No <code>GatewaySubnet</code></strong> (gateway dropped).</td>
</tr>
<tr>
<td>Ingress (internal)</td>
<td><strong>Internal LB</strong> (<code>cpcs-ilb</code>, Standard SKU, <strong>no public IP</strong>)</td>
<td>Employee portal, VNet-reached only. <strong>ILB backend pool is intentionally empty</strong> — the portal application is application-layer, out of IaC scope for this PoC (by design, not an oversight).</td>
</tr>
<tr>
<td>Egress (outbound)</td>
<td><strong>Standard public IP on the AKS-managed LB</strong> (node RG <code>MC_cpcs-rg_cpcs-aks_eastus</code>, LB <code>kubernetes</code>)</td>
<td>Verified outbound-only: 1 outbound rule (<code>aksOutboundRule</code>), <strong>zero inbound rules, zero NAT rules</strong>. Default SNAT IP auto-provisioned by AKS for node outbound — <strong>not</strong> an ingress path.</td>
</tr>
<tr>
<td>Segmentation</td>
<td>Internal NSG <code>cpcs-nsg-internal</code>, <strong>deny-all</strong> default</td>
<td><code>allow-vnet</code> p100 (VirtualNetwork → 80/443), <code>allow-office</code> p110 (<code>&lt;office-source-cidr&gt;</code> → 80/443, <strong>PoC-only convenience</strong> — removed at teardown), <code>deny-all</code> p4096. Attached to <code>internal-ingress</code> via the subnet&#39;s <code>networkSecurityGroup</code> property.</td>
</tr>
<tr>
<td>Secrets</td>
<td><strong>Key Vault</strong> <code>&lt;kv-name&gt;</code> (standard)</td>
<td>Purge protection ON, soft-delete 90 d, network ACL scoped to <code>aks-node</code> + <code>internal-ingress</code>, <code>enabledForDeployment</code> / <code>enabledForTemplateDeployment</code> ON.</td>
</tr>
<tr>
<td>Images</td>
<td><strong>ACR Basic</strong> <code>&lt;acr-name&gt;</code> (private)</td>
<td><code>adminUserEnabled=false</code>, no anonymous pull, MI-based pull (AcrPull role). Empty — no image was ever pushed.</td>
</tr>
<tr>
<td>Data</td>
<td><strong>SQL Serverless v1</strong> (centralus), single database <code>employeedb</code></td>
<td><strong>In centralus</strong> (East US rejected new SQL provisioning for this subscription — see §4.2). <code>minCapacity=1</code> vCore, <code>autoPauseDelay=3600 s</code>. <code>publicNetworkAccess=Enabled</code> (cross-region consequence), firewall 10.40.0.1–10.40.0.254.</td>
</tr>
<tr>
<td>Monitoring</td>
<td>Log Analytics <code>cpcs-log</code> (PerGB2018)</td>
<td>30 d retention. <strong>Container Insights was not bound</strong> — see §4.5 (accepted as a documented limitation).</td>
</tr>
<tr>
<td>Identity</td>
<td><strong>Shared user-assigned Managed Identity</strong> <code>cpcs-mi</code></td>
<td>Roles via IAM (not secrets): ACR Pull, Key Vault Secrets User, SQL Server Contributor, Log Analytics Reader. One shared identity for AKS, KV, SQL, and ACR.</td>
</tr>
<tr>
<td>Budget</td>
<td><strong>Azure Budget $300 / mo</strong>, alerts 50 / 80 / 100 % → <code>&lt;alert-recipient&gt;</code></td>
<td><strong>Removed from the IaC</strong> (ARM 404 for this tenant — see §4.3); created manually in the Portal post-deploy. The budget object still exists at subscription scope after teardown (see §10).</td>
</tr>
<tr>
<td>Employee access</td>
<td><strong>Internal NSG allow rule</strong> (office CIDR <code>&lt;office-source-cidr&gt;</code>)</td>
<td><strong>VPN Gateway DROPPED</strong> (decision b, §3.3). The allow rule is PoC-only; removed with the rest of the PoC at teardown.</td>
</tr>
</tbody></table>
<h3 class="fade-in">2.3 Two-file template split (required by this Bicep build)</h3>
<p class="fade-in">Bicep <strong>cannot mix</strong> subscription-scoped resources (the Resource Group) with resourceGroup-scoped resources (AKS, VNet, …) in one file (<code>BCP135</code>). So:</p>
<table class="comp-table fade-in">
<thead>
<tr>
<th>File</th>
<th>Scope</th>
<th>Role</th>
</tr>
</thead>
<tbody><tr>
<td><code>main.bicep</code></td>
<td><strong>subscription</strong></td>
<td>Owns the RG + passes params down. <strong>Entrypoint</strong> you deploy.</td>
</tr>
<tr>
<td><code>cluster.bicep</code></td>
<td><strong>resourceGroup</strong></td>
<td>All the actual infrastructure. Referenced as a module with an <strong>explicit <code>scope: rg</code></strong> (this build requires it — <code>BCP035</code> / <code>BCP134</code>).</td>
</tr>
<tr>
<td><code>optional/*</code></td>
<td>resourceGroup</td>
<td>Additive, separate.</td>
</tr>
</tbody></table>
<p class="fade-in">All three <strong>compile clean</strong> to ARM JSON with Bicep <strong>0.46.1</strong> (via <code>az bicep</code>).</p>
<hr class="fade-in">
</section><section class="section"><h2 class="fade-in">3. Design decisions &amp; tradeoffs</h2>
<p class="fade-in">Each major fork in the road, the decision, and the reason.</p>
<h3 class="fade-in">3.1 Two-portal → employee-only scope narrowing</h3>
<p class="fade-in"><strong>Decision.</strong> Narrow the original two-portal brief (public customer + internal employee) to <strong>employee-only</strong>.</p>
<p class="fade-in"><strong>Why.</strong> The PoC&#39;s actual goals — AKS, RBAC, Key Vault, ACR, SQL, Azure AD auth — are all internal. A customer-facing path (App Gateway v2 + OWASP WAF, public IP, public-ingress subnet, public NSG, B2C) was not required to demonstrate any of them, and it was the largest source of cost and complexity. Removing it:</p>
<ul class="fade-in">
<li>Cut the largest cost line (~$142 / mo for the gateway, §3.3)</li>
<li>Removed the recurring East US SKU failure source</li>
<li>Left the design strictly internal (no public IP at all — a strict improvement over the gateway design)</li>
</ul>
<p class="fade-in"><strong>What changed in the templates.</strong> App Gateway v2 + OWASP WAF, public IP, public-ingress subnet, public NSG, and any B2C / public-identity path removed from <code>main.bicep</code> / <code>cluster.bicep</code>.</p>
<h3 class="fade-in">3.2 Entra External ID considered and ruled out</h3>
<p class="fade-in"><strong>Decision.</strong> <strong>Not used.</strong> No customer population means no External ID requirement.</p>
<p class="fade-in"><strong>Why.</strong> The portal is employee-only; the existing <code>&lt;organization-domain&gt;</code> Entra tenant already provides the OIDC issuer and the RBAC model (<code>aadProfile managed=true</code>, <code>enableAzureRBAC=true</code>). Adding External ID / B2C would have introduced a second identity platform, a separate tenant boundary, and a separate set of RBAC grants — none of which the PoC needs.</p>
<blockquote class="fade-in">
<p class="fade-in"><strong>Note for future readers:</strong> <strong>Azure AD B2C is closed to new customers as of May 2025.</strong> Entra External ID (the successor) is the supported path going forward. If a future PoC does need a customer / B2C path, budget for External ID onboarding, not B2C.</p>
</blockquote>
<h3 class="fade-in">3.3 VPN Gateway dropped from PoC scope</h3>
<p class="fade-in"><strong>Decision (b, 2026-08-25).</strong> <strong>Drop the VPN Gateway.</strong> No Central US gateway test, no East US quota support ticket.</p>
<p class="fade-in"><strong>Why.</strong></p>
<ul class="fade-in">
<li>The employee portal is already internal / VNet-reached via the <strong>Internal LB</strong>; none of the PoC&#39;s goals (AKS, RBAC, Key Vault, ACR, SQL, Azure AD auth) require a live site-to-site tunnel.</li>
<li>The gateway was the <strong>largest cost line (~$142 / mo)</strong> <strong>and</strong> the repeated source of East US <code>InvalidGatewaySkuSpecified</code> failures on VpnGw1 / VpnGw2 Standard (see §4.2).</li>
<li>The design therefore has <strong>no public IP at all</strong> (pure internal path) — a strict improvement over the gateway design.</li>
</ul>
<p class="fade-in"><strong>Temporary admin/office access</strong> during the PoC window is provided by the scoped <code>allow-office</code> NSG rule (<code>&lt;office-source-cidr&gt;</code> → 80/443), not a VPN. That rule is <strong>PoC-only</strong> — not a production access pattern — and is removed with the rest of the PoC at teardown.</p>
<p class="fade-in"><strong>What changed in the templates.</strong> <code>gw-basic.bicep</code> / <code>gw-test.bicep</code> / <code>gw-v2.bicep</code> (+ compiled <code>.json</code>) are <strong>out of the active deploy path</strong> (not referenced by <code>main.bicep</code> / <code>cluster.bicep</code>); kept in the repo only as historical test-harness evidence. <code>GatewaySubnet</code> resource, <code>gatewaySubnetCidr</code> / <code>gatewayLocation</code> / <code>vpnSku</code> params, and the gateway + gateway public-IP resources removed. <code>vpnSourceCidr</code> param renamed <code>officeSourceCidr</code> (<code>&lt;office-source-cidr&gt;</code>) — it now feeds the <code>allow-office</code> NSG rule.</p>
<h3 class="fade-in">3.4 Cosmos DB considered and ruled out in favor of Azure SQL Database Serverless</h3>
<p class="fade-in"><strong>Decision.</strong> Use <strong>Azure SQL Database Serverless v1</strong> (centralus, single database <code>employeedb</code>, schemas for the portal&#39;s relational data), <strong>not</strong> Cosmos DB.</p>
<p class="fade-in"><strong>Why.</strong></p>
<ul class="fade-in">
<li><strong>Relational data model.</strong> The portal&#39;s data is inherently relational (employees, departments, access records). Cosmos DB&#39;s document model would have forced a denormalized design and a different query language for data that is naturally tabular.</li>
<li><strong>Simpler cost model.</strong> SQL Serverless with <code>minCapacity=1</code> vCore + <code>autoPauseDelay=3600 s</code> bounds the cost to ~$20–150 / mo and auto-pauses when idle. Cosmos DB&#39;s RU-based pricing is harder to reason about for a PoC and has a different floor.</li>
<li><strong>Simpler identity.</strong> One SQL Server Contributor role on the shared MI is straightforward. Cosmos DB would have required a separate RBAC model (Cosmos DB Account Reader / Data Contributor) and a different set of connection-string mechanics.</li>
</ul>
<h3 class="fade-in">3.5 Bicep two-file split (subscription-scope entrypoint + resourceGroup-scope module)</h3>
<p class="fade-in"><strong>Decision.</strong> Split the template into <code>main.bicep</code> (subscription scope) + <code>cluster.bicep</code> (resourceGroup scope), with an explicit <code>scope: rg</code> on the module reference.</p>
<p class="fade-in"><strong>Why.</strong> Bicep <strong>cannot mix</strong> subscription-scoped resources (the Resource Group) and resourceGroup-scoped resources (AKS, VNet, …) in one file — it emits <code>BCP135</code>. And this Bicep build <strong>requires</strong> an explicit <code>scope</code> on a module that crosses from a subscription-scoped file into a resourceGroup-scoped target — <code>BCP035</code> / <code>BCP134</code>. The two-file split is the only clean way to satisfy both constraints.</p>
<hr class="fade-in">
</section><section class="section"><h2 class="fade-in">4. What went wrong, and how it was resolved</h2>
<p class="fade-in">This is the most valuable section for a teaching case study. Do not sanitize it.</p>
<h3 class="fade-in">4.1 Parallel subnet writes → <code>AnotherOperationInProgress</code> / <code>Conflict</code> (5 failed deploys)</h3>
<p class="fade-in"><strong>Symptom.</strong> After the gateway was dropped, deploys failed with <code>AnotherOperationInProgress</code> / <code>Conflict</code> on <code>Microsoft.Network</code> — and the <strong>failing subnet changed each run</strong> (<code>aks-node</code>, then <code>internal-ingress</code>, then <code>aks-node</code> again).</p>
<p class="fade-in"><strong>Root cause.</strong> Three subnets of one VNet were being created <strong>concurrently</strong>, which Azure&#39;s Network service rejects non-deterministically.</p>
<p class="fade-in"><strong>Fix.</strong> Serialize subnet creation with a <code>dependsOn</code> chain: <code>vnet → nodeSubnet → internalSubnet → systemSubnet</code>, with AKS and Key Vault created after the subnets. Also fixed: the agent pool <code>vnetSubnetID</code> originally pointed at the <code>system</code> subnet while the KV ACL + SQL firewall are scoped to <code>aks-node</code> — re-pointed at <code>nodeSubnet</code> so pods can actually reach KV / SQL.</p>
<p class="fade-in"><strong>Lesson.</strong> Provision subnets <strong>serially</strong> or with explicit <code>dependsOn</code> from the start. Do not rely on Bicep&#39;s implicit dependency ordering for resources that the underlying service rejects in parallel.</p>
<h3 class="fade-in">4.2 East US VPN Gateway / SQL SKU-availability restrictions</h3>
<p class="fade-in"><strong>Symptom.</strong> Two separate East US restrictions on this subscription:</p>
<ol class="fade-in">
<li><strong>VPN Gateway:</strong> <code>InvalidGatewaySkuSpecified</code> on VpnGw1 / VpnGw2 Standard in East US.</li>
<li><strong>SQL Server:</strong> &quot;Provisioning is restricted in this region&quot; for new SQL servers in East US.</li>
</ol>
<p class="fade-in"><strong>Resolution.</strong></p>
<ul class="fade-in">
<li><strong>Gateway:</strong> dropped from scope entirely (decision b, §3.3). No longer a blocker.</li>
<li><strong>SQL:</strong> relocated to <strong>centralus</strong> (approved by user, &quot;2 a&quot;). Consequence: <code>publicNetworkAccess</code> must be <strong>Enabled</strong> (VNet service endpoints are same-region only) — documented as a PoC-only tradeoff; tighten the firewall before any production use.</li>
</ul>
<p class="fade-in"><strong>Lesson.</strong> <strong>Check regional SKU availability before designing around a specific gateway or SQL SKU.</strong> Query <code>az aks get-versions</code> / <code>az sql servers list-skus</code> / <code>az network vpn-gateway list-skus</code> for the target region and subscription before committing a design.</p>
<h3 class="fade-in">4.3 Azure Budget ARM 404 for this tenant</h3>
<p class="fade-in"><strong>Symptom.</strong> <code>Microsoft.Resources/budgets</code> returns <strong>404</strong> at <strong>both</strong> subscription and tenant scope for this tenant (provider is Registered, but the resourceType is not exposed — verified at sub AND tenant scope, api-versions 2024-03-01 / 2022-09-01).</p>
<p class="fade-in"><strong>Resolution.</strong> Create the budget <strong>manually in the Portal</strong> after deploy:</p>
<pre class="diagram fade-in"><code>Subscriptions → Azure subscription 1 Upgrade → Cost Management + Billing
  → Budgets → New → $300 / Month, alerts at 50/80/100% to &lt;alert-recipient&gt;
</code></pre>
<p class="fade-in">The budget params are kept in <code>main.bicep</code> so the Portal budget can reference the same values, but the budget object itself is <strong>not</strong> created by IaC.</p>
<p class="fade-in"><strong>Lesson.</strong> Budget-as-code is not universally available. Verify <code>Microsoft.Resources/budgets</code> is exposed in the target tenant before relying on it; have a Portal fallback.</p>
<h3 class="fade-in">4.4 AKS version / VM-size SKU restrictions in East US</h3>
<p class="fade-in"><strong>Symptom.</strong> Two East US restrictions on this subscription:</p>
<ol class="fade-in">
<li><code>K8sVersionNotSupported</code>: <strong>1.31.3</strong> is now LTS-only in East US (only 1.31.13 / 1.31.100 LTS patches are GA).</li>
<li><code>VM size not allowed</code>: <strong>Standard_D2s_v5</strong> is not in the allowed-VM-sizes list for this subscription in East US.</li>
</ol>
<p class="fade-in"><strong>Resolution.</strong> Bumped to <strong>1.34.10</strong> (from <code>az aks get-versions</code>, on the GA / KubernetesOfficial line) and <strong>Standard_D2s_v7</strong> (same 2 vCPU / 8 GiB shape as D2s_v5 — same cost band).</p>
<p class="fade-in"><strong>Lesson.</strong> Pin AKS version + VM size from a live <code>az aks get-versions</code> query, not from a static list. The GA line moves; the LTS line is narrower than it looks.</p>
<h3 class="fade-in">4.5 Container Insights DCR / DCRA binding failure (AAD → API-server propagation lag)</h3>
<p class="fade-in"><strong>Symptom.</strong> Container Insights is <strong>not bound</strong> to the Log Analytics workspace. All control-plane indicators confirm this:</p>
<ul class="fade-in">
<li><code>addonProfiles: null</code> on the cluster</li>
<li>Zero DCRs and zero DCRA associations</li>
<li>The workspace <code>cpcs-log</code> exists (PerGB2018) but has <strong>no data</strong></li>
</ul>
<p class="fade-in">Two REST PATCH attempts to set <code>logAnalyticsWorkspaceId</code> + the <code>omsagent</code> addon returned <strong>HTTP 200</strong> but the fields remained <strong>null</strong> after 30 s — the API accepted the body silently without applying the binding (likely a 2024-05-01 API limitation where <code>logAnalyticsWorkspaceId</code> is a deprecated top-level property and the correct path requires the <code>omsagent</code> addon + <code>config.logAnalyticsWorkspaceResourceID</code>, which this tenant&#39;s API version did not honor).</p>
<p class="fade-in">A <strong>separate</strong> finding, surfaced while trying to verify the cluster from inside: a temporary AAD cluster-admin grant was registered on the cluster (<code>aadProfile.adminGroupObjectIDs</code> updated, HTTP 200) for the <code>&lt;deployment-service-principal&gt;</code> SP (object ID <code>&lt;deployment-service-principal-object-id&gt;</code>). Despite ~15 minutes of wait + repeated fresh-token attempts, the API server kept rejecting: <code>User &quot;&lt;deployment-service-principal-object-id&gt;&quot; cannot list resource &quot;services&quot; … User does not have access to the resource in Azure</code> — an <strong>AAD → API-server propagation / staleness</strong> issue outside our control. The grant was <strong>revoked and verified</strong> (<code>adminGroupObjectIDs: null</code> after <code>az aks update --aad-admin-group-object-ids &quot;&quot;</code>).</p>
<p class="fade-in"><strong>Resolution (approval 2, 2026-08-26).</strong> <strong>Accepted as a documented limitation</strong> — <strong>no further fix attempts</strong> (no Portal path, no further DCR / DCRA iterations). The evidence-backed record of this gap is itself a real, evidence-backed finding. <strong>No further action is required on this item before publishing.</strong></p>
<p class="fade-in"><strong>Lesson.</strong> AAD RBAC grants on AKS can lag the API server by 15+ minutes even after the <code>aadProfile</code> is updated and a fresh token is minted. If you&#39;re verifying cluster access right after a grant, either wait longer or verify at the AAD layer (role assignment) rather than the API-server layer. And the API can return HTTP 200 on a PATCH that does nothing — always re-read the field you tried to set.</p>
<h3 class="fade-in">4.6 Post-outage AD replication anomaly (DC1 frozen, DC2 green)</h3>
<p class="fade-in"><strong>Context.</strong> A separate, on-prem AD / DC environment (DC1 = <code>DC1</code> <code>&lt;dc-internal-ip&gt;</code>, DC2 = <code>DC2</code> <code>&lt;dc-internal-ip&gt;</code>, both Windows Server 2019, libvirt VMs on a homelab host) suffered a <strong>power outage</strong> on 2026-08-26. After the host rebooted (06:43 CDT), DC1&#39;s <strong>inbound-from-DC2</strong> replication state was frozen at the outage window while DC2&#39;s <strong>own view</strong> was green. DC2 was restored from KVM (autostart enabled on both VMs), and the dead PoC neighbor (<code>&lt;poc-vm&gt;</code>, an Azure-DC PoC VM that had been torn down the previous night) was still emitting <code>error 1722</code> (RPC server unavailable) on 32 consecutive syncs on DC1 and 11 on DC2.</p>
<p class="fade-in"><strong>Decision path.</strong></p>
<ol class="fade-in">
<li><strong>Passive vs. forced sync.</strong> Chose <strong>passive first</strong>: let the KDC / LDAP services settle, verify all 7 AD ports (389 / 88 / 53 / 445 / 135 / 3268 / 5985) open on both DCs, then run a <strong>scoped, bounded</strong> <code>repadmin /syncall DC1 /A</code> (DC2-only-inbound variant) with a 15-minute hard cap. Did <strong>not</strong> do a forced <code>/replsync</code> or any authoritative state change.</li>
<li><strong>Orphaned <code>repadmin</code> processes.</strong> A prior full <code>/syncall</code> had hung for 73+ minutes on DC1, leaving 2 orphaned <code>repadmin.exe</code> processes (PID 1184, PID 4360) blocked on LDAP timeouts to the dead neighbor. <strong>Decision:</strong> kill only those two PIDs (client-side sync helpers — not <code>lsass.exe</code> or <code>ntds</code>), confirm no other <code>repadmin</code> is running, and <strong>do not</strong> open a second WinRM connection mid-sync. When the targeted kill script ran, the orphans had <strong>already self-terminated</strong> (their LDAP timeout cycles expired) — the guard correctly found <strong>count 0</strong> and did <strong>not</strong> execute <code>taskkill</code>. Zero <code>repadmin</code> processes confirmed.</li>
<li><strong>Scoped sync result.</strong> <code>SCOPED_RUN_EXIT=0</code>, completed in ~90 s (well under the cap). <strong>Before / after (raw, both DCs):</strong><ul class="fade-in">
<li><strong>Before</strong> (pre-sync, 07:50): DC1 → DC2 <code>5/5 fails (1722)</code> on DomainDnsZones / ForestDnsZones; DC1 inbound-neighbor <code>&lt;poc-vm&gt;</code> 32 consecutive fails.</li>
<li><strong>After</strong> (post-sync, 17:11): DC1 → DC2 <code>0/5 fails, delta &lt; 30 m</code>, all 5 partitions <code>Last attempt was successful</code>; DC2 → DC1 <code>0/5 fails</code>. replsummary: <code>DC2 42m:31s 0/5 0</code>; <code>DC1 49m:35s 0/5 0</code>.</li>
<li>The <code>58 - &lt;poc-vm&gt;</code> line in replsummary&#39;s &quot;operational errors&quot; section <strong>remained</strong> until the dead-neighbor metadata was removed (§8.2).</li>
</ul>
</li>
<li><strong>Final clean resolution.</strong> The dead PoC neighbor was fully removed (connection objects + DSA tree + DNS + computer / server / DFSR metadata — see §8.2), and <strong>after</strong> that removal the <code>error 58</code> line disappeared and the forest-wide replsummary was clean. <strong>No metadata cleanup, USN rollback, or authoritative state change was ever required or performed</strong> — the scoped sync + targeted dead-neighbor removal resolved everything cleanly.</li>
</ol>
<p class="fade-in"><strong>Lesson.</strong> A frozen replication state on one DC while the other is green is usually a <strong>client-side / transport</strong> problem (orphaned sync helpers, a dead neighbor, or a post-reboot service not yet listening), <strong>not</strong> a directory corruption. <strong>Do not reach for USN rollback or authoritative restore first</strong> — verify the services, clear the orphans, run a bounded scoped sync, and only escalate to metadata surgery if the scoped sync still shows failures on a <strong>live</strong> neighbor.</p>
<hr class="fade-in">
</section><section class="section"><h2 class="fade-in">5. Security &amp; governance practices demonstrated</h2>
<h3 class="fade-in">5.1 Evidence-first verification discipline</h3>
<p class="fade-in"><strong>Every claim in this case study is backed by live command output, not a template-success assumption.</strong> Concretely:</p>
<ul class="fade-in">
<li><strong>Public IP outbound-only (Check 1):</strong> verified via <code>az network lb rule list</code> / <code>az network lb inbound-nat-rule list</code> / <code>az network lb outbound-rule list</code> on the node RG — 0 inbound, 0 NAT, 1 outbound (<code>aksOutboundRule</code>). Not assumed from the Bicep.</li>
<li><strong>NSG effective rules (Check 2):</strong> verified via <code>az network nsg rule list</code> + <code>az network vnet subnet show</code> on <code>internal-ingress</code> — p100 / p110 / p4096 declared and attached. The nodepool NSG was verified to have <strong>0 rules</strong> (empty by design). The <code>aks-node</code> subnet was verified to have <strong>no NSG attached</strong> (documented finding, §5.5).</li>
<li><strong>RBAC granted (pre-deploy):</strong> verified via a live <code>az role assignment list</code> on the subscription before the deploy was accepted as ready.</li>
<li><strong>RBAC revoked (teardown):</strong> verified via a live <code>az role assignment list</code> after the <code>Contributor</code> deletion — the row was gone, not merely &quot;accepted&quot;.</li>
<li><strong>Container Insights (Check 3):</strong> verified via <code>az aks show --query addonProfiles</code> + <code>az monitor data-collection rule list</code> + a live Kusto query — all three confirmed unbound.</li>
<li><strong>Portal OIDC (Check 4):</strong> verified via <code>az acr repository list</code> (empty) + a project-wide grep for <code>kind: Deployment</code> / <code>kind: Service</code> (none) + <code>az aks nodepool list</code> (inventory) — confirmed no app was deployed.</li>
<li><strong>Teardown (Check 7):</strong> verified via <code>az group show</code> on both RGs (both <code>ResourceGroupNotFound</code>) + <code>az keyvault list</code> (<code>[]</code>) + <code>az role assignment list</code> (only the ABAC-locked UAM row remained).</li>
</ul>
<p class="fade-in"><strong>The discipline:</strong> never assume a deploy / deletion / grant succeeded because the CLI returned exit 0. Re-read the state from the API.</p>
<h3 class="fade-in">5.2 RBAC granted / verified / revoked lifecycle for <code>&lt;deployment-service-principal&gt;</code></h3>
<table class="comp-table fade-in">
<thead>
<tr>
<th>Step</th>
<th>Evidence</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Grant</strong></td>
<td><code>Contributor</code> + <code>User Access Administrator</code> on subscription <code>&lt;SUBSCRIPTION_ID&gt;</code>. Verified via live <code>az role assignment list</code> before deploy.</td>
</tr>
<tr>
<td><strong>Verify</strong></td>
<td>Pre-deploy check: both assignments present, state Active.</td>
</tr>
<tr>
<td><strong>Revoke (Contributor)</strong></td>
<td><code>az role assignment delete --role Contributor</code> → accepted. Post-revocation <code>az role assignment list</code> → <strong>only the UAM row remains</strong> (Contributor gone).</td>
</tr>
<tr>
<td><strong>Revoke (UAM)</strong></td>
<td><strong>BLOCKED by ABAC self-lock</strong> — the assignment carries a condition forbidding the holder from writing / deleting UAM / User Access Administrator / Owner assignments (<code>GuidNotEquals {&lt;role-def-uam-condition-1&gt;, &lt;role-def-uam-condition-2&gt;, &lt;role-def-uam-condition-3&gt;}</code> on both <code>write</code> and <code>delete</code>). This is the <strong>by-design UAM self-protection</strong> condition. <code>&lt;deployment-service-principal&gt;</code> <strong>cannot self-revoke</strong> this. The human Owner subsequently revoked it manually and it was verified removed on 2026-08-27 (see §8.1.4).</td>
</tr>
</tbody></table>
<p class="fade-in"><strong>Lesson.</strong> A service principal with <code>User Access Administrator</code> cannot revoke its own UAM grant. The holder of the UAM role is locked out of the delete path by the ABAC condition on the assignment itself. Plan for an external Owner / Administrator to perform the final revocation, or disable the SP (<code>az ad sp update --disabled=true</code>) as an immediate, reversible stopgap.</p>
<h3 class="fade-in">5.3 No-secrets-in-code discipline</h3>
<p class="fade-in"><strong>Principle.</strong> Secrets live in Key Vault, wired via Managed Identity. <strong>No client secrets, no K8s-native secret objects, no admin keys.</strong></p>
<ul class="fade-in">
<li><strong>Key Vault:</strong> <code>&lt;kv-name&gt;</code> (standard, soft-delete 90 d, purge protection ON, network ACL scoped to the two subnets). Pods access via <strong>Key Vault CSI driver</strong> + the shared MI — no client secrets, no K8s-native secret objects.</li>
<li><strong>ACR:</strong> <code>adminUserEnabled=false</code>, <code>anonymousPullEnabled=false</code>. AKS pulls via the shared MI (AcrPull role). <strong>No admin keys ever issued.</strong></li>
<li><strong>SQL:</strong> admin password is a <strong>file on the operator&#39;s workstation</strong> (<code>&lt;sql-admin-password-file&gt;</code>, mode 600) — <strong>never</strong> in the Bicep, never in the repo, never in the write-up. The Bicep takes it as a param and passes it to the <code>administratorLoginPassword</code> field; the value is supplied at deploy time from the secure file.</li>
<li><strong>SSH key:</strong> public key only, wired into <code>cluster.bicep</code> as <code>ssh.publicKeys[0].keyData</code>. The private key is <strong>stored securely outside version control</strong> (operator workstation).</li>
<li><strong>SP credentials:</strong> <code>&lt;deployment-service-principal&gt;</code> creds live in a <strong>secure file on the operator&#39;s workstation</strong> (referenced by path only, never by value).</li>
</ul>
<p class="fade-in"><strong>Lesson.</strong> The test of a no-secrets design is not &quot;is there a Key Vault?&quot; — it is &quot;does the Bicep, the repo, the logs, or the write-up contain a secret value?&quot; This PoC passes that test: the Bicep contains only <strong>references</strong> to secrets, not values.</p>
<h3 class="fade-in">5.4 NSG deny-all default with effective-rule verification</h3>
<p class="fade-in"><strong>Design.</strong> The internal NSG <code>cpcs-nsg-internal</code> has a <strong>deny-all default</strong> (p4096) with two scoped allow rules:</p>
<table class="comp-table fade-in">
<thead>
<tr>
<th>Rule</th>
<th>Priority</th>
<th>Direction</th>
<th>Access</th>
<th>Source</th>
<th>Dest ports</th>
</tr>
</thead>
<tbody><tr>
<td><code>allow-vnet</code></td>
<td>100</td>
<td>Inbound</td>
<td>Allow</td>
<td>VirtualNetwork</td>
<td>80, 443</td>
</tr>
<tr>
<td><code>allow-office</code></td>
<td>110</td>
<td>Inbound</td>
<td>Allow</td>
<td><strong><code>&lt;office-source-cidr&gt;</code></strong> (PoC-only)</td>
<td>80, 443</td>
</tr>
<tr>
<td><code>deny-all</code></td>
<td>4096</td>
<td>Inbound</td>
<td>Deny</td>
<td>*</td>
<td>0–65535</td>
</tr>
</tbody></table>
<p class="fade-in"><strong>Verification.</strong> <code>az network nsg rule list</code> + <code>az network vnet subnet show</code> confirmed all three rules are declared and the NSG is attached to <code>internal-ingress</code> (the subnet the ILB frontend lives on). The nodepool NSG was verified to have <strong>0 rules</strong> — the nodes themselves have no extra inbound restrictions from an NSG; their security comes from the VNet topology (no public ingress path to the nodes, only outbound via the SNAT IP).</p>
<p class="fade-in"><strong>Finding (not a gap, but documented).</strong> The <code>aks-node</code> subnet has <strong>no NSG attached</strong>. This is by design — the nodes only need outbound connectivity (via the LB SNAT) and the <code>internal-ingress</code> NSG gates external → ILB traffic. However, a reader should <strong>not</strong> assume the deny-all p4096 rule also covers the <code>aks-node</code> subnet; <strong>it does not.</strong></p>
<p class="fade-in"><code>az network nic list-effective-nsg</code> could not be run because AKS VNet-integrated VMSS nodes do not expose their NICs as standalone resources. The effective-rule check is therefore based on: (a) declared rules on the attached NSG, (b) the empty nodepool NSG, and (c) the VNet topology (no public ingress path to nodes). This is the maximum available without SSH access to a node.</p>
<h3 class="fade-in">5.5 Budget-cap discipline</h3>
<p class="fade-in"><strong>Design.</strong> A $300 / month Azure Budget with alerts at 50 / 80 / 100 % to the budget-alert recipient.</p>
<p class="fade-in"><strong>Reality.</strong> The budget <strong>cannot be created via ARM</strong> for this tenant (§4.3). It is created <strong>manually in the Portal</strong> after deploy. The budget object still exists at subscription scope after teardown (see §10).</p>
<p class="fade-in"><strong>Discipline demonstrated.</strong> The $300 / mo cap was a <strong>hard constraint</strong> on the design: the 3-day PoC estimate (~$40–55 with the gateway; ~$25–35 after the gateway was dropped) was <strong>comfortably under</strong> the cap. If the estimate had exceeded the cap, the design would have been revised before deploy — not after.</p>
<hr class="fade-in">
</section><section class="section"><h2 class="fade-in">6. What was intentionally out of scope</h2>
<table class="comp-table fade-in">
<thead>
<tr>
<th>Item</th>
<th>Why it&#39;s out of scope</th>
<th>Evidence it&#39;s a boundary, not a gap</th>
</tr>
</thead>
<tbody><tr>
<td><strong>ILB backend pool (empty)</strong></td>
<td>The portal application is application-layer, out of IaC scope for this PoC.</td>
<td>ILB <code>cpcs-ilb</code> has <strong>zero</strong> rules and an <strong>empty</strong> backend pool — verified via <code>az network lb rule list</code> / <code>az network lb show</code>. ACR repository list is <strong>empty</strong> (no image was ever pushed).</td>
</tr>
<tr>
<td><strong>End-to-end login-flow demo</strong></td>
<td>Infrastructure + identity plumbing only. A minimal OIDC app will <strong>not</strong> be deployed to backfill this — doing so would break the locked scope decision.</td>
<td>ACR repository list <strong>empty</strong>; project-wide grep for <code>kind: Deployment</code> / <code>kind: Service</code> → <strong>none</strong>; AKS node pool inventory confirms 2 nodes but no workloads. The identity design is validated by <strong>design review + verified plumbing</strong> (AAD OIDC enabled on AKS, <code>aadProfile</code> present), not by a live login capture.</td>
</tr>
<tr>
<td><strong>Container Insights fix</strong></td>
<td>One bounded attempt (DCR / DCRA + REST-addon path) was made and blocked by AAD → API-server propagation lag + API no-op. Accepted as a documented limitation (approval 2).</td>
<td><code>addonProfiles: null</code> on the cluster; 0 DCRs; 0 DCRA; workspace <code>cpcs-log</code> exists (PerGB2018) but has no data. The evidence-backed record of the gap is itself a real finding.</td>
</tr>
</tbody></table>
<p class="fade-in"><strong>This is a scope boundary, not an oversight.</strong> The infrastructure + identity plumbing was provisioned and verified. A working end-to-end login flow would be a <strong>follow-on piece of work</strong>, not a missing requirement of this PoC.</p>
<hr class="fade-in">
</section><section class="section"><h2 class="fade-in">7. Cost reconciliation</h2>
<p class="fade-in"><strong>Status (as of the 2026-09-06 publish finalization): finalized as a retail-rate estimate — see §7.3 for the final cost basis and §7.4 for the closed cost-actuals note.</strong></p>
<h3 class="fade-in">7.1 Evidence</h3>
<table class="comp-table fade-in">
<thead>
<tr>
<th>Source</th>
<th>Result</th>
</tr>
</thead>
<tbody><tr>
<td><code>az consumption usage list --start-date 2026-08-25 --end-date 2026-08-26</code> (earlier check 2026-08-27 ~07:48 CDT — <strong>superseded by the 18:10 CDT re-check below</strong>)</td>
<td>99 rows returned, <strong>0 rows for <code>cpcs-rg</code></strong>, <strong>all <code>pretaxCost</code> values are <code>null</code></strong> (string <code>&quot;None&quot;</code> in JSON).</td>
</tr>
<tr>
<td>Cost Management REST API (<code>/subscriptions/&lt;SUBSCRIPTION_ID&gt;/providers/Microsoft.CostManagement/query?api-version=2023-11-01</code>, 2026-08-27)</td>
<td><strong>HTTP 429</strong> &quot;Too many requests. Please retry.&quot; (client-type quota exhausted).</td>
</tr>
<tr>
<td>Cost Management REST API (other api-versions)</td>
<td><strong>HTTP 404</strong> (resource type <code>Query</code> not exposed) or <strong>HTTP 400</strong> (invalid query definition / dataset not supplied).</td>
</tr>
<tr>
<td>Verification report Check 5 (2026-08-26)</td>
<td>Same condition: 49 rows, 0 for <code>cpcs-rg</code>, 0 non-null <code>pretaxCost</code>; REST 429 / 404.</td>
</tr>
<tr>
<td><code>az consumption usage list --start-date 2026-08-25 --end-date 2026-08-26</code> (re-check 2026-08-27 18:10 CDT)</td>
<td>99 rows: <code>cpcs-rg</code> = 9, node RG <code>MC_CPCS-RG_CPCS-AKS_EASTUS</code> = 18 (usage rows have <strong>now landed</strong> — none existed at the 07:48 CDT check) — but <strong>every <code>pretaxCost</code> / <code>usageQuantity</code> is the string <code>&quot;None&quot;</code></strong>; <code>usageStart</code> / <code>usageEnd</code> null.</td>
</tr>
<tr>
<td>Cost Management query API (api-version 2023-11-01, re-check 2026-08-27 18:10 CDT)</td>
<td><strong>HTTP 429</strong> &quot;Too many requests. Please retry.&quot; across 3+ backoff attempts; <strong>HTTP 400</strong> &quot;Invalid query definition: Invalid report type&quot; when the quota allowed the request through.</td>
</tr>
</tbody></table>
<p class="fade-in"><strong>Why actuals are not settled.</strong> Azure cost reporting has a <strong>24–48 h lag</strong> for new resources. The PoC was live ~1.4 h at the verification-pass time (2026-08-26) and was torn down the same day. As of the 2026-08-27 18:10 CDT re-check (~44 h after teardown), the usage-row metadata has <strong>landed</strong> (see table above) but the <strong>prices have not</strong> — every <code>pretaxCost</code> / <code>usageQuantity</code> is still <code>&quot;None&quot;</code> — and the Cost Management query API remains unreachable from this environment (429 client-type quota / 400 schema validation), so no cost figure can be extracted.</p>
<h3 class="fade-in">7.2 Estimate (the number in this write-up)</h3>
<table class="comp-table fade-in">
<thead>
<tr>
<th>Item</th>
<th>Monthly (retail, East US unless noted)</th>
<th>Notes</th>
</tr>
</thead>
<tbody><tr>
<td>AKS 2 × D2s_v7</td>
<td>~$140</td>
<td>Control plane free. D2s_v5 → D2s_v7 (same 2 vCPU / 8 GiB shape).</td>
</tr>
<tr>
<td><del>VPN Gateway (VpnGw1 Standard) + public IP</del></td>
<td><del>$142</del></td>
<td><strong>DROPPED</strong> 2026-08-25 (decision b) — removed from scope, no longer a cost line.</td>
</tr>
<tr>
<td>Internal LB</td>
<td>~$26</td>
<td></td>
</tr>
<tr>
<td>ACR Basic</td>
<td>~$16</td>
<td></td>
</tr>
<tr>
<td>Key Vault</td>
<td>~$5</td>
<td>Per-op, small.</td>
</tr>
<tr>
<td>SQL Serverless</td>
<td>~$20–150</td>
<td><strong>centralus</strong>; auto-pause 3600 s bounds it.</td>
</tr>
<tr>
<td>Log Analytics</td>
<td>~$2.30 / GB</td>
<td>The main swing factor.</td>
</tr>
</tbody></table>
<ul class="fade-in">
<li><strong>3-day PoC estimate: ~$25–35 all-in</strong> (post-gateway-drop).</li>
<li><strong>Published figure (approved 2026-08-26, approval 4): ~$40–55</strong> for the PoC window — the <strong>original full-stack estimate that included the VPN gateway line (~$142 / mo)</strong>. After the gateway was dropped (decision b, 2026-08-25), the project&#39;s own recompute for the same 3-day window is <strong>~$25–35</strong> — see PROJECT.md §4. The published number follows the approved figure; <strong>both are well under the $300 / mo budget cap.</strong></li>
</ul>
<blockquote class="fade-in">
<p class="fade-in"><strong>Note (attached to the estimate in the published write-up, per approval 4):</strong>
This is a <strong>retail-rate estimate</strong> (Azure Retail Prices API, East US, retail USD). The <strong>actual billed cost</strong> for the PoC window can be pulled from <strong>Azure Cost Management after the fact</strong> — cost data remains queryable after resource deletion — and will be appended as a dated addendum (see §7.4 follow-up). This estimate <strong>does not block publishing.</strong></p>
</blockquote>
<h3 class="fade-in">7.3 Final cost basis</h3>
<p class="fade-in"><strong>Final cost basis (as of the 2026-09-06 publish finalization): a retail-rate estimate of ~$25–35</strong> for the ~3-day PoC window (post-gateway-drop). The PoC environment was torn down shortly after validation, and <strong>actual billed cost was not confirmed before publish.</strong> This figure is a <strong>retail-rate estimate, not a confirmed actual</strong> — treat it as directionally accurate rather than exact. It sits comfortably under the $300 / month budget cap. <strong>No actual-cost figure has been fabricated.</strong></p>
<h3 class="fade-in">7.4 Cost-actuals follow-up (closed)</h3>
<p class="fade-in"><strong>Closed — no open follow-up.</strong> Actual billed cost was not confirmed before publish, so the estimate in §7.3 stands as the final published figure. Cost data remains queryable in Azure Cost Management after the fact; if a confirmed figure is obtained later, it may be appended here as a dated addendum. <strong>No pending re-check remains.</strong></p>
<hr class="fade-in">
</section><section class="section"><h2 class="fade-in">8. Teardown &amp; cleanup</h2>
<h3 class="fade-in">8.1 AKS PoC teardown (executed 2026-08-26, approval 5)</h3>
<p class="fade-in">Executed in the approved order. Every step verified against the live API, not by assumption. Raw logs: <code>ops-teardown-verify.log</code>, <code>ops-teardown-revoke.log</code>, <code>ops-teardown-abac.log</code>, <code>ops-teardown-kv.log</code>.</p>
<h4 class="fade-in">8.1.1 Pre-flight — no background jobs / open sessions against <code>cpcs-rg</code></h4>
<pre class="diagram fade-in"><code>$ ps aux | grep -iE &quot;az |azurerm|kubectl|kubelogin|deploy.sh|enable-insights&quot;
(no matches — exit 1)
$ process list   # Hermes background sessions
→ only two old deploy.sh sessions, both status: exited (exit 0/1, Aug 25)
</code></pre>
<p class="fade-in">No live <code>az</code>, <code>kubectl</code>, or deploy processes. Only active CLI context is the <code>&lt;deployment-service-principal&gt;</code> SP login used for the API calls themselves.</p>
<h4 class="fade-in">8.1.2 Resource group deletion</h4>
<pre class="diagram fade-in"><code>$ az group delete -g cpcs-rg --yes --no-wait        # accepted, async
$ az group show -g cpcs-rg                          # in progress: &quot;Deleting&quot;
$ az group show -g MC_cpcs-rg_cpcs-aks_eastus       # → ResourceGroupNotFound (node RG gone first)
$ az group show -g cpcs-rg                          # → ResourceGroupNotFound (final)
ERROR: (ResourceGroupNotFound) Resource group &#39;cpcs-rg&#39; could not be found.
</code></pre>
<p class="fade-in"><strong>VERIFIED DELETED</strong> — both the user RG and the AKS-managed node RG return not-found. Not merely &quot;delete accepted.&quot;</p>
<h4 class="fade-in">8.1.3 Key Vault soft-delete (expected behavior, not an error)</h4>
<ul class="fade-in">
<li><code>az keyvault list</code> → <code>[]</code> — no active <code>cpcs*</code> vaults remain.</li>
<li><strong>Subscription-wide residual check (verified 2026-08-26):</strong> <code>az resource list</code> filtered on name contains <code>cpcs</code> → <strong>0 rows</strong> — the only surviving artifact is the soft-deleted Key Vault <code>&lt;kv-name&gt;</code> (soft-delete <strong>90 days</strong>, purge protection ON). Key Vault soft-delete <strong>survives RG deletion</strong> and is <strong>not visible to <code>&lt;deployment-service-principal&gt;</code></strong> (no purge rights — the deleted-list endpoints require higher entitlement and returned 404 / 403 for this SP). This is <strong>expected</strong>: the soft-deleted vault self-resolves after the 90-day retention window. Documented as expected behavior, <strong>not an anomaly</strong>.</li>
</ul>
<h4 class="fade-in">8.1.4 Role revocation — <code>&lt;deployment-service-principal&gt;</code> (subscription scope)</h4>
<p class="fade-in">Pre-revocation live check (assignment list, SP object ID <code>&lt;deployment-service-principal-object-id&gt;</code>, subscription <code>&lt;SUBSCRIPTION_ID&gt;</code>):</p>
<table class="comp-table fade-in">
<thead>
<tr>
<th>Assignment</th>
<th>Role</th>
<th>State</th>
</tr>
</thead>
<tbody><tr>
<td><code>&lt;role-assignment-contributor&gt;</code></td>
<td><strong>Contributor</strong></td>
<td>Active</td>
</tr>
<tr>
<td><code>&lt;role-assignment-uam&gt;</code></td>
<td><strong>User Access Administrator</strong></td>
<td>Active (ABAC-locked)</td>
</tr>
</tbody></table>
<table class="comp-table fade-in">
<thead>
<tr>
<th>Step</th>
<th>Result (live output)</th>
</tr>
</thead>
<tbody><tr>
<td><code>az role assignment delete --role Contributor</code></td>
<td>✅ <strong>Success</strong> (empty output = accepted)</td>
</tr>
<tr>
<td><code>az role assignment delete --role &quot;User Access Administrator&quot;</code></td>
<td>❌ <strong>AuthorizationFailed</strong> — ABAC condition on the assignment itself: holder may not write / delete UAM, User Access Administrator, or Owner (<code>GuidNotEquals {&lt;role-def-uam-condition-1&gt;, &lt;role-def-uam-condition-2&gt;, &lt;role-def-uam-condition-3&gt;}</code> on both <code>write</code> and <code>delete</code>). This is the by-design UAM self-protection condition.</td>
</tr>
<tr>
<td>Post-revocation live <code>role assignment list</code></td>
<td>✅ <strong>Contributor is GONE</strong> — verified against the live API, not assumed.</td>
</tr>
</tbody></table>
<p class="fade-in"><strong>Manual step (<code>&lt;org-owner&gt;</code> — performed by the human Owner, not by <code>&lt;deployment-service-principal&gt;</code> itself):</strong></p>
<pre class="diagram fade-in"><code>az role assignment delete \
  --assignee &lt;deployment-service-principal-object-id&gt; \
  --role &quot;User Access Administrator&quot; \
  --scope /subscriptions/&lt;SUBSCRIPTION_ID&gt;
</code></pre>
<p class="fade-in">Run as any subscription Owner / Administrator (e.g. the Microsoft account behind <code>&lt;org-admin-email&gt;</code>), then re-run <code>az role assignment list --assignee &lt;deployment-service-principal-object-id&gt;</code> to confirm <strong>zero</strong> rows. Rationale it&#39;s safe: the SP has no remaining resource-group scope after teardown; the only live entitlement is this one subscription-level assignment. (Alternatively disable the SP: <code>az ad sp update --id &lt;deployment-service-principal-client-id&gt; --set disabled=true</code> — immediate, reversible.)</p>
<blockquote class="fade-in">
<p class="fade-in"><strong>Status (verified 2026-08-27):</strong> the UAM assignment has been <strong>deleted and independently re-verified</strong> — a fresh <code>az role assignment list</code> for this SP (subscription scope) returns <strong>empty</strong>, so <code>&lt;deployment-service-principal&gt;</code> holds <strong>zero</strong> standing role assignments. This closes the last item from the AKS PoC teardown. <strong>No open items remain from the AKS PoC teardown.</strong></p>
</blockquote>
<h3 class="fade-in">8.2 Post-outage cleanup (the AD / DC environment, 2026-08-26)</h3>
<p class="fade-in">This is a <strong>separate</strong> environment (on-prem AD / DC, not the AKS PoC), but it is part of the same engagement&#39;s cleanup scope. The power outage on 2026-08-26 left the following residue:</p>
<h4 class="fade-in">8.2.1 Dead PoC neighbor removal (<code>&lt;poc-vm&gt;</code>)</h4>
<p class="fade-in">The Azure-DC PoC VM (<code>&lt;poc-vm&gt;</code>, <code>&lt;poc-vm-ip&gt;</code>) had been torn down the previous night, but its <strong>AD metadata</strong> (connection objects, DSA tree, DNS records, computer / server / DFSR objects) was still present on both DCs and was the source of the <code>error 1722</code> / <code>error 58</code> replication failures.</p>
<p class="fade-in"><strong>Removed (both DCs, exact-DN only, live DCs guarded intact):</strong></p>
<table class="comp-table fade-in">
<thead>
<tr>
<th>Item</th>
<th>Evidence</th>
</tr>
</thead>
<tbody><tr>
<td>DC1 <code>&lt;connection-object-1&gt;</code> (dead VM&#39;s inbound <code>nTDSConnection</code>)</td>
<td><strong>DELETED</strong> (guard: class = <code>nTDSConnection</code>, whenCreated = 08/23 13:47:50)</td>
</tr>
<tr>
<td>DC2 <code>&lt;connection-object-2&gt;</code> (dead VM&#39;s inbound <code>nTDSConnection</code>)</td>
<td><strong>DELETED</strong> (whenCreated = 08/23 13:48:06)</td>
</tr>
<tr>
<td>Dead VM&#39;s own DSA tree (2 × outbound <code>nTDSConnection</code> + <code>NTDS Settings</code> + <code>server</code>)</td>
<td><strong>DELETED</strong></td>
</tr>
<tr>
<td>Dead VM&#39;s computer object + 6 children (DFSR-LocalSettings → Subscriber → Subscription, Windows VM SCP, rIDSet)</td>
<td><strong>DELETED</strong> bottom-up</td>
</tr>
<tr>
<td>DNS A record <code>&lt;poc-vm&gt;.&lt;ad-domain&gt; → &lt;poc-vm-ip&gt;</code></td>
<td><strong>DELETED on both DCs</strong> (verified <code>NAME_DOES_NOT_EXIST</code>)</td>
</tr>
<tr>
<td>DNS KDC SRV <code>_kerberos._tcp.dc</code> → <code>&lt;poc-vm&gt;.&lt;ad-domain&gt;</code></td>
<td><strong>DELETED on both DCs</strong></td>
</tr>
<tr>
<td>DNS LDAP SRV <code>_ldap._tcp.dc</code> → <code>&lt;poc-vm&gt;.&lt;ad-domain&gt;</code></td>
<td><strong>DELETED on both DCs</strong></td>
</tr>
<tr>
<td>Live regression check</td>
<td><code>DC1 A→&lt;dc-internal-ip&gt;</code>, <code>DC2 A→&lt;dc-internal-ip&gt;</code>, KDC / LDAP SRV now list only <code>DC1</code> / <code>DC2</code>, <code>&lt;ad-admin-user&gt;</code> auth still works, both DCs <code>enabled=True</code></td>
</tr>
</tbody></table>
<p class="fade-in"><strong>After the removal</strong>, the forest-wide replsummary was clean: <code>DC1 49m:35s 0/5 0</code>; <code>DC2 42m:31s 0/5 0</code>. The <code>58 - &lt;poc-vm&gt;</code> line in replsummary&#39;s &quot;operational errors&quot; section <strong>disappeared</strong>.</p>
<h4 class="fade-in">8.2.2 strongSwan residue removal</h4>
<p class="fade-in">The Azure-DC PoC had left a <code>conn azure-dc-poc</code> block in <code>/etc/ipsec.conf</code> (lines 26–41) and an Azure PSK line in <code>/etc/ipsec.secrets</code>. Removed with a backup gate:</p>
<ul class="fade-in">
<li><strong>Backup gate PASS:</strong> <code>/etc/ipsec.conf.bak.&lt;pre-cleanup&gt;</code> present (1601 bytes, 600 perms); fresh backup <code>/etc/ipsec.conf.bak.&lt;post-cleanup&gt;</code> created.</li>
<li><strong><code>/etc/ipsec.conf</code>:</strong> <code>conn azure-dc-poc</code> block removed. Post-change <code>grep -c &quot;azure-dc-poc&quot;</code> → <strong>0</strong>.</li>
<li><strong><code>/etc/ipsec.secrets</code>:</strong> Azure PSK line removed. Post-change <code>grep -c &quot;azure&quot;</code> → <strong>0</strong>.</li>
<li><strong><code>ipsec status</code>:</strong> <code>Security Associations (0 up, 0 connecting): none</code>. <code>strongswan-starter</code> active.</li>
</ul>
<h4 class="fade-in">8.2.3 Stale health-check disable</h4>
<p class="fade-in"><code>dc2-reboot-verify</code> systemd user service: <strong>stopped, disabled, reset-failed</strong>. Final state: <code>inactive</code> / <code>disabled</code>.</p>
<h4 class="fade-in">8.2.4 KVM autostart fix</h4>
<p class="fade-in">Both DC VMs (<code>DC1-VM</code> = DC1, <code>DC2-VM</code> = DC2) verified: <code>State: running</code> + <code>Autostart: enable</code>. The outage exposed that the DCs were <strong>not</strong> set to autostart on the libvirt host — they had to be started manually after the host reboot. <strong>Fixed by enabling autostart on both VMs.</strong></p>
<p class="fade-in"><strong>Lesson.</strong> Enable KVM autostart on <strong>any</strong> VM providing production services, not just test VMs. A domain controller that does not come back after a host reboot is a single point of failure for the entire AD forest.</p>
<h3 class="fade-in">8.3 Teardown summary</h3>
<table class="comp-table fade-in">
<thead>
<tr>
<th>Area</th>
<th>State</th>
</tr>
</thead>
<tbody><tr>
<td>AKS PoC RG (<code>cpcs-rg</code> + node RG)</td>
<td><strong>DELETED + verified</strong> (both <code>ResourceGroupNotFound</code>)</td>
</tr>
<tr>
<td>Key Vault</td>
<td><strong>Soft-deleted</strong> (90 d retention, purge protection ON) — expected behavior, self-resolves</td>
</tr>
<tr>
<td>Contributor role</td>
<td><strong>REVOKED + verified</strong> (live API)</td>
</tr>
<tr>
<td>User Access Administrator role</td>
<td><strong>REVOKED + verified</strong> (fresh <code>role assignment list</code> returned empty on 2026-08-27) — no open items remain from the AKS PoC teardown</td>
</tr>
<tr>
<td>Azure Budget</td>
<td><strong>Retained</strong> at subscription scope — a separate item created manually in the Portal (ARM 404 for this tenant, so it was never in the AKS PoC&#39;s IaC); the AKS PoC teardown leaves it in place. Flagged as an open item in §10.9; PoC cost lines are moot post-teardown</td>
</tr>
<tr>
<td>Dead PoC neighbor (<code>&lt;poc-vm&gt;</code>)</td>
<td><strong>FULLY REMOVED</strong> (connection objects + DSA tree + DNS + AD metadata, both DCs)</td>
</tr>
<tr>
<td>strongSwan residue</td>
<td><strong>CLEAN</strong> (0 SAs, conn + PSK removed, service active)</td>
</tr>
<tr>
<td><code>dc2-reboot-verify</code></td>
<td><strong>STOPPED + DISABLED</strong> (inactive / dead)</td>
</tr>
<tr>
<td>KVM autostart (both DCs)</td>
<td><strong>ENABLED</strong> (State: running + Autostart: enable)</td>
</tr>
</tbody></table>
<hr class="fade-in">
</section><section class="section"><h2 class="fade-in">9. Lessons for future PoCs</h2>
<ol class="fade-in">
<li><strong>Provision subnets serially or with explicit <code>dependsOn</code> from the start.</strong> Azure&#39;s Network service rejects concurrent writes to subnets of the same VNet with <code>AnotherOperationInProgress</code> / <code>Conflict</code>. Do not rely on Bicep&#39;s implicit dependency ordering for resources that the underlying service rejects in parallel. (§4.1)</li>
<li><strong>Check regional SKU availability before designing around a specific gateway or SQL SKU.</strong> Query <code>az aks get-versions</code> / <code>az sql servers list-skus</code> / <code>az network vpn-gateway list-skus</code> for the target region and subscription before committing a design. East US rejected both the VPN Gateway (VpnGw1 / VpnGw2 Standard) and new SQL provisioning for this subscription. (§4.2, §4.4)</li>
<li><strong>Verify <code>Microsoft.Resources/budgets</code> is exposed in the target tenant before relying on budget-as-code.</strong> It is not exposed for this tenant (404 at sub + tenant scope). Have a Portal fallback. (§4.3)</li>
<li><strong>Enable KVM autostart on any VM providing production services, not just test VMs.</strong> A domain controller that does not come back after a host reboot is a single point of failure for the entire AD forest. (§8.2.4)</li>
<li><strong>AAD RBAC grants on AKS can lag the API server by 15+ minutes.</strong> If you&#39;re verifying cluster access right after a grant, either wait longer or verify at the AAD layer (role assignment) rather than the API-server layer. (§4.5)</li>
<li><strong>The API can return HTTP 200 on a PATCH that does nothing.</strong> Always re-read the field you tried to set. Container Insights binding returned 200 but <code>addonProfiles</code> stayed null. (§4.5)</li>
<li><strong>A service principal with UAM cannot revoke its own UAM grant.</strong> The ABAC condition on the assignment forbids it. Plan for an external Owner / Admin to perform the final revocation, or disable the SP as an immediate stopgap. (§5.2, §8.1.4)</li>
<li><strong>A frozen replication state on one DC while the other is green is usually a client-side / transport problem, not directory corruption.</strong> Verify the services, clear the orphans, run a bounded scoped sync, and only escalate to metadata surgery if the scoped sync still shows failures on a <strong>live</strong> neighbor. Do <strong>not</strong> reach for USN rollback or authoritative restore first. (§4.6)</li>
<li><strong>Cost data has a 24–48 h lag.</strong> Do not block publishing on actuals — use a retail-rate estimate with an explicit note, and pull actuals as a dated addendum once the lag clears. (§7)</li>
<li><strong>The test of a no-secrets design is not &quot;is there a Key Vault?&quot; — it is &quot;does the Bicep, the repo, the logs, or the write-up contain a secret value?&quot;</strong> (§5.3)</li>
<li><strong>Before relying on a terminal&#39;s Azure CLI session for privileged operations (especially role-assignment changes), explicitly confirm the active identity via <code>az account show</code></strong> — a session can silently be authenticated as a service principal rather than the intended human account, which is exactly what caused §10.8 to appear unresolvable until the identity mismatch was found. (§10.8)</li>
</ol>
<hr class="fade-in">
</section><section class="section"><h2 class="fade-in">10. Inconsistencies &amp; open items flagged during assembly</h2>
<p class="fade-in">These are items the writer <strong>flagged</strong> rather than silently resolved, per the task&#39;s instruction to &quot;flag anything in the source material that seemed inconsistent or unclear.&quot;</p>
<h3 class="fade-in">10.1 Deployment-start timestamp discrepancy</h3>
<ul class="fade-in">
<li><strong>PROJECT.md §10.5</strong> states: &quot;deploy <strong>2026-08-25T20:24Z</strong> → teardown 2026-08-26.&quot;</li>
<li><strong><code>ops-teardown-abac.log</code></strong> (the ABAC condition <code>createdOn</code> field on the UAM role assignment) states: <strong>&quot;2026-08-25T22:33:00.261895+00:00.&quot;</strong></li>
<li><strong><code>verification-report.md</code> Check 5</strong> states: &quot;Deployment start <strong>2026-08-26T01:50:44Z</strong>&quot; (this is <strong>later</strong> than both of the above, which is inconsistent — the verification pass was run on 2026-08-26, so the deployment must have started before that; the 01:50:44Z figure appears to be a different event, possibly the verification pass itself being mislabeled as the &quot;deployment start&quot;).</li>
</ul>
<p class="fade-in"><strong>Resolution for this write-up.</strong> I used <strong>2026-08-25T22:33Z</strong> (the <code>createdOn</code> timestamp on the UAM role assignment, which is the most authoritative single timestamp in the source material — it is the moment the role was granted, which must have been immediately before or during the deploy). The 20:24Z figure from PROJECT.md is 2 h 9 min earlier and may reflect an earlier failed deploy attempt. <strong>This is flagged, not silently resolved.</strong></p>
<h3 class="fade-in">10.2 Cost actuals — finalized as a labeled estimate (closed 2026-09-06)</h3>
<p class="fade-in">Actual billed cost was <strong>not confirmed before publish.</strong> The write-up therefore uses a <strong>retail-rate estimate (~$25–35 for the ~3-day PoC window, post-gateway-drop)</strong> as the final published figure, clearly labeled as an estimate and not a confirmed actual (see §7.3). The original ~$40–55 figure included the VPN gateway line that was dropped on 2026-08-25. <strong>This is a labeled estimate, not a guess, and no actual-cost figure is fabricated.</strong> The cost-actuals follow-up is <strong>closed</strong> (see §7.4); cost data remains queryable in Azure Cost Management after the fact should a confirmed figure ever be obtained.</p>
<h3 class="fade-in">10.3 &quot;Resource-visualizer&quot; architecture diagrams do not exist as files</h3>
<p class="fade-in">The task instruction was to &quot;include the two architecture diagrams already generated (embed / reference the resource-visualizer images).&quot; <strong>No such images exist in the AKS project folder.</strong> The only <code>azure-resource-map.png</code> / <code>architecture-diagram.svg</code> files in this box belong to the <strong>Domain Controller</strong> case study (a different project, in <code>~/Downloads/</code>). The <code>azure-resource-visualizer</code> skill exists in the Cursor plugin cache but was <strong>not used</strong> to generate any AKS diagrams in this project.</p>
<p class="fade-in"><strong>Resolution for this write-up.</strong> I generated the two diagrams <strong>directly from the authoritative Bicep source</strong> (<code>main.bicep</code> + <code>cluster.bicep</code>) as Mermaid code blocks (Figure 1 and Figure 2 in §2.1). They are <strong>accurate to the source</strong> but are <strong>newly generated</strong>, not &quot;already generated.&quot; <strong>This is flagged, not fabricated.</strong> If the original &quot;resource-visualizer&quot; images exist elsewhere (a different machine, a different folder, a different project), they should be located and substituted.</p>
<h3 class="fade-in">10.4 Task instruction says &quot;2 × D2s_v5&quot; but the source says D2s_v7</h3>
<p class="fade-in">The task instruction states: &quot;AKS (2 × <strong>D2s_v5</strong>, single namespace).&quot; The <strong>actual deployed and verified</strong> VM size is <strong>Standard_D2s_v7</strong> (see <code>cluster.bicep</code> line 48, <code>main.bicep</code> line 48, and <code>verification-report.md</code> Check 4: &quot;1 pool: <code>node</code>, 2 × <strong>Standard_D2s_v7</strong>&quot;). D2s_v5 was <strong>not allowed</strong> in East US for this subscription (preflight <code>VM size not allowed</code> error, §4.4). <strong>This write-up uses D2s_v7 (the real value).</strong> <strong>This is flagged, not silently &quot;corrected&quot; to match the task instruction.</strong></p>
<h3 class="fade-in">10.5 Task instruction says &quot;single namespace&quot; but the source does not mention namespaces</h3>
<p class="fade-in">The task instruction states: &quot;AKS (2 × D2s_v5, <strong>single namespace</strong>).&quot; The Bicep source and the verification report do <strong>not</strong> mention a single namespace. The cluster has <strong>one node pool</strong> (<code>node</code>, 2 nodes) but the source does not state how many namespaces exist (AKS defaults to <code>default</code>, <code>kube-system</code>, <code>kube-public</code>, <code>kube-node-lease</code>, and any AKS-managed namespaces). <strong>This write-up describes the cluster as &quot;single node pool&quot; (the verifiable fact) and does not claim &quot;single namespace.&quot;</strong> <strong>This is flagged, not assumed.</strong></p>
<h3 class="fade-in">10.6 Task instruction says &quot;single database with schemas&quot; but the source does not mention schemas</h3>
<p class="fade-in">The task instruction states: &quot;SQL Serverless (centralus, <strong>single DB with schemas</strong>).&quot; The Bicep source and the verification report confirm a <strong>single database</strong> (<code>employeedb</code>) but do <strong>not</strong> mention schemas. The portal application (out of scope for this PoC) would define the schemas. <strong>This write-up describes it as &quot;single database <code>employeedb</code>&quot; (the verifiable fact) and does not claim &quot;with schemas.&quot;</strong> <strong>This is flagged, not assumed.</strong></p>
<h3 class="fade-in">10.7 SQL Serverless v1 vs v2</h3>
<ul class="fade-in">
<li><strong><code>cluster.bicep</code> line 365:</strong> &quot;SQL (SERVERLESS, General Purpose)&quot; — the comment says <strong>v1</strong> (line 366: &quot;At @2021-11-01, Serverless <strong>v1</strong> requires: …&quot;).</li>
<li><strong>Checkpoint note, line 101:</strong> &quot;SQL centralus Serverless <strong>v2</strong> (auto-pause 3600s).&quot;</li>
</ul>
<p class="fade-in"><strong>Resolution for this write-up.</strong> I used <strong>Serverless v1</strong> (the Bicep source is authoritative; the checkpoint is a narrative fragment). <strong>This is flagged.</strong></p>
<h3 class="fade-in">10.8 UAM residual step — RESOLVED (manual, by design) — verified 2026-08-27</h3>
<p class="fade-in">The <code>User Access Administrator</code> role assignment (<code>&lt;role-assignment-uam&gt;</code>) on <code>&lt;deployment-service-principal&gt;</code> has been <strong>deleted and independently re-verified</strong>. As of 2026-08-27, <code>az role assignment list --scope /subscriptions/&lt;SUBSCRIPTION_ID&gt; --assignee &lt;deployment-service-principal-object-id&gt;</code> returns <strong><code>[]</code></strong> — <code>&lt;deployment-service-principal&gt;</code> holds <strong>zero</strong> standing role assignments at subscription scope. (The remaining subscription-scope rows are all human Owner assignments — one on the owner MSA plus one on the owner work account. A duplicate Owner row on the owner MSA, created 135 ms after the original by a double-executed grant, was also identified and deleted, leaving exactly two Owner rows.)</p>
<p class="fade-in"><strong>Root cause (confirmed, not assumed):</strong> the CLI session used for the original revocation attempt was itself authenticated <strong>as the <code>&lt;deployment-service-principal&gt;</code> service principal</strong> (client ID <code>&lt;deployment-service-principal-client-id&gt;</code>, app-only token), not as a human account. Two deliberate locks made self-resolution impossible for that SP:</p>
<ol class="fade-in">
<li><strong>Permission gap</strong> — <code>Microsoft.Authorization/roleAssignments/delete</code> is <strong>not</strong> in the <code>User Access Administrator</code> role definition; UAM grants read + create, not delete. Delete requires <strong>Owner</strong>.</li>
<li><strong>ABAC self-protection</strong> — the assignment additionally carries the by-design <code>GuidNotEquals {&lt;role-def-uam-condition-1&gt;, &lt;role-def-uam-condition-2&gt;, &lt;role-def-uam-condition-3&gt;}</code> condition on <code>write</code>/<code>delete</code>, explicitly excluding its own holder. A deliberate double-lock, not a bug.</li>
</ol>
<p class="fade-in"><strong>Failed autonomous attempt, 2026-08-26 (for continuity with the incident narrative):</strong></p>
<blockquote class="fade-in">
<p class="fade-in">HTTP 403 <code>AuthorizationFailed</code> — <em>&quot;The client &#39;<code>&lt;deployment-service-principal-client-id&gt;</code>&#39; with object id &#39;<code>&lt;deployment-service-principal-object-id&gt;</code>&#39; has an authorization with ABAC condition that is not fulfilled to perform action &#39;Microsoft.Authorization/roleAssignments/delete&#39; over scope …&quot;</em></p>
</blockquote>
<p class="fade-in"><strong>Resolution (manual, by the user, under their own Owner account):</strong> after identifying that the terminal&#39;s active Azure CLI session was unexpectedly authenticated as the SP rather than the user — <code>az account show</code> confirmed the SP was active; an interactive <code>az login</code> switched the session to the human Owner account (<code>&lt;owner-msa-email&gt;</code>) — the delete was then run successfully:</p>
<pre class="diagram fade-in"><code>az role assignment delete --ids /subscriptions/&lt;SUBSCRIPTION_ID&gt;/providers/Microsoft.Authorization/roleAssignments/&lt;role-assignment-uam&gt;
</code></pre>
<p class="fade-in">Verified via <code>az role assignment list</code> for the assignee returning an <strong>empty result (<code>[]</code>)</strong> — re-run independently by the automation on 2026-08-27 (which was then operating under the human Owner session) with the same empty result.</p>
<p class="fade-in"><strong>Note:</strong> this was <strong>correctly not resolved autonomously</strong> by the Hermes agent, per the standing constraint against creating new privileged identities or working around the block — the fix required a genuinely privileged human session, which the automation does not have access to in this environment. This is the intended, safe outcome for this class of exposure, not a shortfall. It closes the last open item from the AKS PoC teardown, and it validates the §8.1.4 anticipation: a SP cannot revoke its own UAM; the final revocation is by design performed by an external human Owner.</p>
<h3 class="fade-in">10.9 Azure Budget object still present</h3>
<p class="fade-in">The $300 / month Azure Budget (created manually in the Portal, since ARM 404 for this tenant) is <strong>still present at subscription scope</strong> after teardown. The PoC cost lines are moot post-teardown, but the budget object itself has not been deleted. <strong>This is flagged.</strong> If the budget is no longer needed, it should be deleted in the Portal.</p>
<hr class="fade-in">
<p class="fade-in"><em>— End of case study —</em></p>
</section>

    <footer><p>Copyright &copy; 2026 <a href="/">AppoSight</a>. All rights reserved.</p></footer>

    <script>
        (function(){
            var h = document.querySelector('.hamburger');
            var n = document.querySelector('.nav-links');
            if(h && n){
                h.addEventListener('click', function(){ h.classList.toggle('active'); n.classList.toggle('open'); });
                n.querySelectorAll('a').forEach(function(l){ l.addEventListener('click', function(){ h.classList.remove('active'); n.classList.remove('open'); }); });
            }
        })();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        setTimeout(() => { document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible')); }, 2000);
    </script>
</body>
</html>`;

const BRIEFINGS_LISTING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cybersecurity Briefings | AppoSight</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --black: #1d1d1f;
            --gray: #86868b;
            --light-gray: #f5f5f7;
            --white: #ffffff;
            --blue: #2997ff;
            --red: #ff3b30;
            --orange: #ff9500;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: var(--black);
            background: var(--white);
        }
        nav {
            position: fixed; top: 0; width: 100%; padding: 14px 40px;
            background: rgba(255,255,255,0.8); backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px); z-index: 100;
            display: flex; justify-content: space-between; align-items: center;
        }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; }
        .logo svg { height: 32px; }
        .nav-links a { color: var(--black); text-decoration: none; margin-left: 28px; font-size: 12px; opacity: 0.8; transition: opacity 0.3s; }
        .nav-links a:hover { opacity: 1; }
        .hamburger {
            display: none; flex-direction: column; gap: 5px; background: none; border: none;
            cursor: pointer; padding: 4px; z-index: 110;
        }
        .hamburger span {
            display: block; width: 24px; height: 2px; background: var(--black);
            border-radius: 2px; transition: all 0.3s;
        }
        .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .briefings-hero {
            padding: 160px 40px 80px; text-align: center; background: var(--black); color: var(--white);
        }
        .briefings-hero h1 {
            font-size: clamp(40px, 7vw, 72px); font-weight: 700; letter-spacing: -2px;
            line-height: 1.1; margin-bottom: 16px;
        }
        .briefings-hero p {
            font-size: clamp(18px, 2.5vw, 24px); color: var(--gray); max-width: 600px; margin: 0 auto;
        }
        .briefings-list {
            max-width: 800px; margin: 0 auto; padding: 80px 40px;
        }
        .briefing-card {
            display: block; text-decoration: none; color: inherit;
            background: var(--white); border: 1px solid #d2d2d7; border-radius: 16px;
            padding: 32px; margin-bottom: 16px; transition: transform 0.2s, box-shadow 0.2s;
        }
        .briefing-card:hover {
            transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .briefing-date {
            font-size: 13px; color: var(--gray); text-transform: uppercase; letter-spacing: 0.5px;
            margin-bottom: 8px;
        }
        .briefing-title {
            font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin-bottom: 12px; line-height: 1.3;
        }
        .briefing-summary {
            font-size: 17px; color: var(--gray); line-height: 1.5; margin-bottom: 16px;
        }
        .briefing-stats {
            display: flex; gap: 20px; font-size: 13px;
        }
        .stat-tag {
            padding: 4px 12px; border-radius: 980px; font-weight: 500;
        }
        .stat-tag.critical { background: #fff0f0; color: var(--red); }
        .stat-tag.watch { background: #fff8f0; color: var(--orange); }
        .stat-tag.general { background: var(--light-gray); color: var(--gray); }
        /* Featured briefing */
        .featured-briefing {
            max-width: 800px; margin: 0 auto; padding: 80px 40px 40px;
        }
        .featured-date {
            font-size: 13px; color: var(--gray); text-transform: uppercase; letter-spacing: 0.5px;
            margin-bottom: 32px; text-align: center;
        }
        .briefing-section { margin-bottom: 48px; }
        .section-title {
            font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: var(--gray);
            margin-bottom: 24px; display: flex; align-items: center; gap: 10px;
        }
        .priority-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
        .priority-dot.red { background: var(--red); }
        .priority-dot.orange { background: var(--orange); }
        .priority-dot.gray { background: var(--gray); }
        .item-card {
            background: var(--light-gray); border-radius: 16px; padding: 28px; margin-bottom: 16px;
        }
        .item-title { font-size: 20px; font-weight: 600; letter-spacing: -0.3px; margin-bottom: 10px; line-height: 1.3; }
        .item-desc { font-size: 16px; color: var(--gray); line-height: 1.6; }
        .general-list { display: flex; flex-direction: column; gap: 1px; background: #d2d2d7; border-radius: 12px; overflow: hidden; }
        .general-item {
            display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;
            background: var(--white); font-size: 15px;
        }
        .general-item .item-title { font-size: 15px; font-weight: 500; margin: 0; }
        /* Archive section */
        .archive-section {
            max-width: 800px; margin: 0 auto; padding: 0 40px 80px;
        }
        /* Weekly Analysis section */
        .weekly-analysis-section {
            max-width: 800px; margin: 0 auto; padding: 60px 40px 80px;
            border-top: 1px solid #d2d2d7;
        }
        .wa-header {
            margin-bottom: 48px;
        }
        .wa-header h2 {
            font-size: clamp(28px, 5vw, 44px); font-weight: 700; letter-spacing: -1.5px;
            margin-bottom: 8px;
        }
        .wa-tagline {
            font-size: 15px; color: var(--gray); font-style: italic; margin-bottom: 16px;
        }
        .wa-posts {
            display: flex; flex-direction: column; gap: 16px;
        }
        .wa-post-card {
            display: block; text-decoration: none; color: inherit;
            background: var(--light-gray); border-radius: 16px; padding: 28px 32px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .wa-post-card:hover {
            transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .wa-post-date {
            font-size: 13px; color: var(--gray); text-transform: uppercase;
            letter-spacing: 0.5px; margin-bottom: 8px;
        }
        .wa-post-title {
            font-size: 20px; font-weight: 600; letter-spacing: -0.3px;
            margin-bottom: 10px; line-height: 1.3;
        }
        .wa-post-summary {
            font-size: 15px; color: var(--gray); line-height: 1.6; margin-bottom: 12px;
        }
        .wa-badge {
            font-size: 12px; color: var(--gray); letter-spacing: 0.3px;
        }
        .wa-empty {
            font-size: 15px; color: var(--gray); font-style: italic;
        }
        .wa-loading {
            font-size: 15px; color: var(--gray);
        }
        .archive-header {
            font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: var(--gray);
            margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid #d2d2d7;
        }
        .archive-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 20px 0; border-bottom: 1px solid #f0f0f0; text-decoration: none; color: inherit;
            transition: color 0.2s;
        }
        .archive-item:hover { color: var(--blue); }
        .archive-date { font-size: 15px; font-weight: 500; }
        .archive-stats { display: flex; gap: 12px; font-size: 12px; }
        .loading { text-align: center; padding: 80px 40px; color: var(--gray); font-size: 17px; }
        .empty-state { text-align: center; padding: 80px 40px; color: var(--gray); }
        .empty-state h3 { font-size: 24px; color: var(--black); margin-bottom: 8px; }
        footer {
            background: var(--light-gray); padding: 40px; text-align: center;
            font-size: 12px; color: var(--gray); border-top: 1px solid #d2d2d7;
        }
        @media (max-width: 600px) {
            nav { padding: 14px 20px; }
            .hamburger { display: flex; }
            .nav-links {
                position: fixed; top: 0; right: 0; width: 260px; height: 100vh;
                background: rgba(255,255,255,0.98); backdrop-filter: blur(20px);
                display: flex; flex-direction: column; justify-content: center;
                padding: 0 40px; transform: translateX(100%); transition: transform 0.3s ease;
                z-index: 105; box-shadow: -4px 0 24px rgba(0,0,0,0.1);
            }
            .nav-links.open { transform: translateX(0); }
            .nav-links a { margin-left: 0; margin-bottom: 24px; font-size: 20px; opacity: 0.85; }
            .briefings-hero { padding: 140px 20px 60px; }
            .featured-briefing { padding: 60px 20px 30px; }
            .archive-section { padding: 0 20px 60px; }
            .briefing-card { padding: 24px; }
        }
    </style>
</head>
<body>
    <nav>
        <a href="/" class="logo-link">
            <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
            </div>
        </a>
        <div class="nav-links">
            <a href="/about">About</a>
            <a href="/#capabilities">Capabilities</a>
            <a href="/#pentest">Pentest</a>
            <a href="/Use-Cases">Use Cases</a>
            <a href="/briefings">Briefings</a>
            <a href="/#contact">Contact</a>
        </div>
        <button class="hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
        </button>
    </nav>

    <div class="briefings-hero">
        <h1>Cybersecurity<br>Briefings.</h1>
        <p>Daily threat intelligence and security analysis. Actionable insights for the modern threat landscape.</p>
    </div>

    <div id="featuredBriefing" class="featured-briefing">
        <div class="loading">Loading latest briefing...</div>
    </div>

    <div id="archiveList" class="archive-section"></div>

    <!-- Weekly Analysis Section -->
    <div id="weeklyAnalysisSection" class="weekly-analysis-section">
        <div class="wa-header">
            <h2>Weekly Analysis</h2>
            <p class="wa-tagline">Machine speed. Human judgment.</p>
        </div>
        <div id="waPosts" class="wa-posts">
            <div class="wa-loading">Loading weekly analysis...</div>
        </div>
    </div>

    <footer>
        <p>Copyright &copy; 2026 AppoSight. All rights reserved.</p>
    </footer>

    <script>
        // Hamburger menu toggle
        (function() {
            var h = document.querySelector('.hamburger');
            var n = document.querySelector('.nav-links');
            if (h && n) {
                h.addEventListener('click', function() {
                    h.classList.toggle('active');
                    n.classList.toggle('open');
                });
                n.querySelectorAll('a').forEach(function(l) {
                    l.addEventListener('click', function() {
                        h.classList.remove('active');
                        n.classList.remove('open');
                    });
                });
            }
        })();

        function escHtml(s) {
            var d = document.createElement('div');
            d.textContent = s;
            return d.innerHTML;
        }
        async function loadBriefings() {
            var featuredEl = document.getElementById('featuredBriefing');
            var archiveEl = document.getElementById('archiveList');
            try {
                var res = await fetch('/api/briefings');
                var data = await res.json();
                var briefings = data.briefings || [];
                if (briefings.length === 0) {
                    featuredEl.innerHTML = '<div class="empty-state"><h3>No briefings yet</h3><p>Daily briefings will appear here starting tomorrow.</p></div>';
                    archiveEl.innerHTML = '';
                    return;
                }
                // Fetch the latest briefing full content
                var latest = briefings[0];
                var latestRes = await fetch('/api/briefings/' + latest.date);
                var latestData = await latestRes.json();
                renderFeatured(latestData, featuredEl);
                renderArchive(briefings.slice(1), archiveEl);
            } catch (e) {
                featuredEl.innerHTML = '<div class="empty-state"><h3>Unable to load briefings</h3><p>Please try again later.</p></div>';
                archiveEl.innerHTML = '';
            }
        }
        function renderFeatured(b, container) {
            var [y, m, d] = b.date.split('-');
            var date = new Date(+y, +m - 1, +d);
            var dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            var html = '<div class="featured-date">' + dateStr + '</div>';
            // High Priority
            if (b.high_priority && b.high_priority.length) {
                html += '<section class="briefing-section"><h2 class="section-title"><span class="priority-dot red"></span> High Priority</h2>';
                b.high_priority.forEach(function(item) {
                    html += '<div class="item-card"><h3 class="item-title">' + escHtml(item.title) + '</h3>';
                    if (item.summary) html += '<p class="item-desc">' + escHtml(item.summary) + '</p>';
                    html += '</div>';
                });
                html += '</section>';
            }
            // Watch
            if (b.watch && b.watch.length) {
                html += '<section class="briefing-section"><h2 class="section-title"><span class="priority-dot orange"></span> Watch</h2>';
                b.watch.forEach(function(item) {
                    html += '<div class="item-card"><h3 class="item-title">' + escHtml(item.title) + '</h3>';
                    if (item.summary) html += '<p class="item-desc">' + escHtml(item.summary) + '</p>';
                    html += '</div>';
                });
                html += '</section>';
            }
            // General
            if (b.general && b.general.length) {
                html += '<section class="briefing-section"><h2 class="section-title"><span class="priority-dot gray"></span> General Updates</h2><div class="general-list">';
                b.general.forEach(function(item) {
                    html += '<div class="general-item"><span class="item-title">' + escHtml(item.title) + '</span></div>';
                });
                html += '</div></section>';
            }
            container.innerHTML = html;
        }
        function renderArchive(briefings, container) {
            if (briefings.length === 0) {
                container.innerHTML = '';
                return;
            }
            var html = '<h3 class="archive-header">Previous Briefings</h3>';
            briefings.forEach(function(b) {
                var [y, m, d] = b.date.split('-');
                var date = new Date(+y, +m - 1, +d);
                var dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                var stats = '';
                if (b.critical_count) stats += '<span class="stat-tag critical">' + b.critical_count + ' Critical</span>';
                if (b.watch_count) stats += '<span class="stat-tag watch">' + b.watch_count + ' Watch</span>';
                if (b.general_count) stats += '<span class="stat-tag general">' + b.general_count + ' Updates</span>';
                html += '<a href="/briefings/' + b.date + '" class="archive-item">' +
                    '<span class="archive-date">' + dateStr + '</span>' +
                    '<span class="archive-stats">' + stats + '</span>' +
                    '</a>';
            });
            container.innerHTML = html;
        }
        async function loadWeeklyAnalysis() {
            var el = document.getElementById('waPosts');
            try {
                var res = await fetch('/api/weekly-analysis');
                var data = await res.json();
                var posts = data.posts || [];
                if (posts.length === 0) {
                    el.innerHTML = '<div class="wa-empty">Weekly analysis posts will appear here each week.</div>';
                    return;
                }
                var html = '';
                posts.forEach(function(p) {
                    var [y, m, d] = p.date.split('-');
                    var date = new Date(+y, +m - 1, +d);
                    var dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    html += '<a href="/weekly-analysis/' + p.date + '" class="wa-post-card">' +
                        '<div class="wa-post-date">' + dateStr + '</div>' +
                        '<div class="wa-post-title">' + escHtml(p.title) + '</div>' +
                        (p.summary ? '<div class="wa-post-summary">' + escHtml(p.summary) + '</div>' : '') +
                        '<div class="wa-badge">AI-drafted &middot; Human-reviewed &middot; Finalized by Stanley</div>' +
                        '</a>';
                });
                el.innerHTML = html;
            } catch (e) {
                el.innerHTML = '<div class="wa-empty">Unable to load weekly analysis.</div>';
            }
        }
        loadBriefings();
        loadWeeklyAnalysis();
    </script>
</body>
</html>`;

// --- Briefing Detail Page Template ---
function buildBriefingDetailPage(briefing) {
    const [y, m, d] = briefing.date.split('-');
    const date = new Date(+y, +m - 1, +d);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const sections = [];

    if (briefing.high_priority && briefing.high_priority.length) {
        sections.push('<section class="briefing-section">\n' +
            '<h2 class="section-title"><span class="priority-dot red"></span> High Priority</h2>\n' +
            briefing.high_priority.map(item =>
                '<div class="item-card">\n' +
                '  <h3 class="item-title">' + escHtml(item.title) + '</h3>\n' +
                '  <p class="item-desc">' + escHtml(item.summary || '') + '</p></div>'
            ).join('\n') + '\n</section>');
    }

    if (briefing.watch && briefing.watch.length) {
        sections.push('<section class="briefing-section">\n' +
            '<h2 class="section-title"><span class="priority-dot orange"></span> Watch</h2>\n' +
            briefing.watch.map(item =>
                '<div class="item-card">\n' +
                '  <h3 class="item-title">' + escHtml(item.title) + '</h3>\n' +
                '  <p class="item-desc">' + escHtml(item.summary || '') + '</p></div>'
            ).join('\n') + '\n</section>');
    }

    if (briefing.general && briefing.general.length) {
        sections.push('<section class="briefing-section">\n' +
            '<h2 class="section-title"><span class="priority-dot gray"></span> General Updates</h2>\n' +
            '<div class="general-list">\n' +
            briefing.general.map(item =>
                '<div class="general-item">\n' +
                '  <span class="item-title">' + escHtml(item.title) + '</span>\n' +
                '</div>'
            ).join('\n') + '\n</div></section>');
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Briefing — ${dateStr} | AppoSight</title>
    <meta name="description" content="Daily cybersecurity threat intelligence briefing from AppoSight.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --black: #1d1d1f; --gray: #86868b; --light-gray: #f5f5f7;
            --white: #ffffff; --blue: #2997ff; --red: #ff3b30; --orange: #ff9500;
        }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--black); background: var(--white); }
        nav {
            position: fixed; top: 0; width: 100%; padding: 14px 40px;
            background: rgba(255,255,255,0.8); backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px); z-index: 100;
            display: flex; justify-content: space-between; align-items: center;
        }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; }
        .logo svg { height: 32px; }
        .nav-links a { color: var(--black); text-decoration: none; margin-left: 28px; font-size: 12px; opacity: 0.8; transition: opacity 0.3s; }
        .nav-links a:hover { opacity: 1; }
        .hamburger {
            display: none; flex-direction: column; gap: 5px; background: none; border: none;
            cursor: pointer; padding: 4px; z-index: 110;
        }
        .hamburger span {
            display: block; width: 24px; height: 2px; background: var(--black);
            border-radius: 2px; transition: all 0.3s;
        }
        .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .briefing-hero {
            padding: 160px 40px 40px; text-align: center; background: var(--black); color: var(--white);
        }
        .briefing-hero .back-link {
            display: inline-block; color: var(--blue); text-decoration: none; font-size: 14px;
            margin-bottom: 24px; opacity: 0.8;
        }
        .briefing-hero .back-link:hover { opacity: 1; }
        .briefing-hero .date-label {
            font-size: 13px; color: var(--gray); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
        }
        .briefing-hero h1 {
            font-size: clamp(32px, 5vw, 56px); font-weight: 700; letter-spacing: -2px; line-height: 1.1;
        }
        .briefing-content { max-width: 800px; margin: 0 auto; padding: 60px 40px; }
        .briefing-section { margin-bottom: 48px; }
        .section-title {
            font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: var(--gray);
            margin-bottom: 24px; display: flex; align-items: center; gap: 10px;
        }
        .priority-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
        .priority-dot.red { background: var(--red); }
        .priority-dot.orange { background: var(--orange); }
        .priority-dot.gray { background: var(--gray); }
        .item-card {
            background: var(--light-gray); border-radius: 16px; padding: 28px; margin-bottom: 16px;
        }
        .item-title { font-size: 20px; font-weight: 600; letter-spacing: -0.3px; margin-bottom: 10px; line-height: 1.3; }
        .item-desc { font-size: 16px; color: var(--gray); line-height: 1.6; margin-bottom: 12px; }
        .item-meta { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .source-tag {
            font-size: 12px; padding: 3px 10px; border-radius: 980px; background: #e8e8ed; color: var(--gray); font-weight: 500;
        }
        .read-more { color: var(--blue); font-size: 13px; text-decoration: none; font-weight: 500; }
        .read-more:hover { text-decoration: underline; }
        .general-list { display: flex; flex-direction: column; gap: 1px; background: #d2d2d7; border-radius: 12px; overflow: hidden; }
        .general-item {
            display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;
            background: var(--white); font-size: 15px;
        }
        .general-item .item-title { font-size: 15px; font-weight: 500; margin: 0; }
        .disclaimer {
            margin-top: 60px; padding: 24px; background: var(--light-gray); border-radius: 12px;
            font-size: 13px; color: var(--gray); line-height: 1.6;
        }
        footer {
            background: var(--light-gray); padding: 40px; text-align: center;
            font-size: 12px; color: var(--gray); border-top: 1px solid #d2d2d7;
        }
        @media (max-width: 600px) {
            nav { padding: 14px 20px; }
            .hamburger { display: flex; }
            .nav-links {
                position: fixed; top: 0; right: 0; width: 260px; height: 100vh;
                background: rgba(255,255,255,0.98); backdrop-filter: blur(20px);
                display: flex; flex-direction: column; justify-content: center;
                padding: 0 40px; transform: translateX(100%); transition: transform 0.3s ease;
                z-index: 105; box-shadow: -4px 0 24px rgba(0,0,0,0.1);
            }
            .nav-links.open { transform: translateX(0); }
            .nav-links a { margin-left: 0; margin-bottom: 24px; font-size: 20px; opacity: 0.85; }
            .briefing-hero { padding: 140px 20px 30px; }
            .briefing-content { padding: 40px 20px; }
            .general-item { flex-direction: column; align-items: flex-start; gap: 6px; }
        }
    </style>
</head>
<body>
    <nav>
        <a href="/" class="logo-link">
            <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
            </div>
        </a>
        <div class="nav-links">
            <a href="/about">About</a>
            <a href="/#capabilities">Capabilities</a>
            <a href="/#pentest">Pentest</a>
            <a href="/Use-Cases">Use Cases</a>
            <a href="/briefings">Briefings</a>
            <a href="/#contact">Contact</a>
        </div>
        <button class="hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
        </button>
    </nav>

    <div class="briefing-hero">
        <a href="/briefings" class="back-link">← All Briefings</a>
        <div class="date-label">${dateStr}</div>
        <h1>Daily Cybersecurity Briefing</h1>
    </div>

    <div class="briefing-content">
        ${sections.join('\n\n')}

        <div class="disclaimer">
            This is for informational purposes only and does not constitute security advice. For professional cybersecurity
            services, <a href="/#contact" style="color: var(--blue); text-decoration: none;">contact AppoSight</a>.
        </div>
    </div>

    <footer>
        <p>Copyright &copy; 2026 AppoSight. All rights reserved.</p>
    </footer>
    <script>
    (function(){var h=document.querySelector('.hamburger'),n=document.querySelector('.nav-links');if(h&&n){h.addEventListener('click',function(){h.classList.toggle('active');n.classList.toggle('open');});n.querySelectorAll('a').forEach(function(l){l.addEventListener('click',function(){h.classList.remove('active');n.classList.remove('open');});});}})();
    </script>
</body>
</html>`;
}

function escHtml(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

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

        // Handle about page
        if (url.pathname === '/about' || url.pathname === '/about/') {
            return new Response(ABOUT_HTML, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-store',
                },
            });
        }

        // Handle Use Cases listing page
        if (url.pathname === '/Use-Cases' || url.pathname === '/use-cases' || url.pathname === '/Use-Cases/' || url.pathname === '/use-cases/') {
            return new Response(USE_CASES_LISTING_HTML, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-store',
                },
            });
        }

        // Handle Use Case detail pages
        if (url.pathname === '/use-cases/entrasync' || url.pathname === '/Use-Cases/entrasync' || url.pathname === '/use-cases/entrasync/' || url.pathname === '/Use-Cases/entrasync/') {
            return new Response(USE_CASES_ENTRASYNC_HTML, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-store',
                },
            });
        }

        if (url.pathname === '/use-cases/cis-benchmark-auditor' || url.pathname === '/Use-Cases/cis-benchmark-auditor' || url.pathname === '/use-cases/cis-benchmark-auditor/' || url.pathname === '/Use-Cases/cis-benchmark-auditor/') {
            return new Response(CIS_BENCHMARK_HTML, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-store',
                },
            });
        }

        if (url.pathname === '/use-cases/entra-cis-v2' || url.pathname === '/Use-Cases/entra-cis-v2' || url.pathname === '/use-cases/entra-cis-v2/' || url.pathname === '/Use-Cases/entra-cis-v2/') {
            return new Response(ENTRA_CIS_V2_HTML, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-store',
                },
            });
        }

        if (url.pathname === '/use-cases/ad-onboarding' || url.pathname === '/Use-Cases/ad-onboarding' || url.pathname === '/use-cases/ad-onboarding/' || url.pathname === '/Use-Cases/ad-onboarding/') {
            return new Response(AD_ONBOARDING_HTML, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-store',
                },
            });
        }

        if (url.pathname === '/use-cases/dc-azure-deployment' || url.pathname === '/Use-Cases/dc-azure-deployment'
            || url.pathname === '/use-cases/dc-azure-deployment/' || url.pathname === '/Use-Cases/dc-azure-deployment/') {
            return new Response(DC_AZURE_DEPLOYMENT_HTML, {
                headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
            });
        }

        if (url.pathname === '/use-cases/dc-upgrade' || url.pathname === '/Use-Cases/dc-upgrade'
            || url.pathname === '/use-cases/dc-upgrade/' || url.pathname === '/Use-Cases/dc-upgrade/') {
            return new Response(DC_UPGRADE_CASE_HTML, {
                headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
            });
        }

        if (url.pathname === '/use-cases/dc-azure-security' || url.pathname === '/Use-Cases/dc-azure-security'
            || url.pathname === '/use-cases/dc-azure-security/' || url.pathname === '/Use-Cases/dc-azure-security/') {
            return new Response(DC_AZURE_SECURITY_HTML, {
                headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
            });
        }

        if (url.pathname === '/use-cases/aks-employee-portal' || url.pathname === '/Use-Cases/aks-employee-portal'
            || url.pathname === '/use-cases/aks-employee-portal/' || url.pathname === '/Use-Cases/aks-employee-portal/') {
            return new Response(AKS_EMPLOYEE_PORTAL_HTML, {
                headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
            });
        }

        // Handle briefings listing page
        if (url.pathname === '/briefings' || url.pathname === '/briefings/') {
            return new Response(BRIEFINGS_LISTING_HTML, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-store',
                },
            });
        }

        // Handle briefing detail pages
        if (url.pathname.startsWith('/briefings/')) {
            const dateSlug = url.pathname.split('/').pop();
            if (dateSlug && /^\d{4}-\d{2}-\d{2}$/.test(dateSlug)) {
                return handleBriefingDetail(dateSlug, env);
            }
        }

        // Handle briefings API endpoint
        if (url.pathname === '/api/briefings' && request.method === 'GET') {
            return handleBriefingsList(env);
        }

        // Handle single briefing JSON endpoint
        if (url.pathname.startsWith('/api/briefings/') && request.method === 'GET' && !url.pathname.startsWith('/api/briefings/publish')) {
            const dateSlug = url.pathname.split('/').pop();
            if (dateSlug && /^\d{4}-\d{2}-\d{2}$/.test(dateSlug)) {
                return handleBriefingJson(dateSlug, env);
            }
        }

        // Handle publish briefing (POST from cron job)
        if (url.pathname === '/api/briefings/publish' && request.method === 'POST') {
            return handlePublishBriefing(request, env);
        }

        // Handle Weekly Analysis detail pages
        if (url.pathname.startsWith('/weekly-analysis/')) {
            const dateSlug = url.pathname.split('/').pop();
            if (dateSlug && /^\d{4}-\d{2}-\d{2}$/.test(dateSlug)) {
                return handleWeeklyAnalysisDetail(dateSlug, env);
            }
        }

        // Handle Weekly Analysis API endpoint
        if (url.pathname === '/api/weekly-analysis' && request.method === 'GET') {
            return handleWeeklyAnalysisList(env);
        }

        // Handle publish weekly analysis (POST from cron job)
        if (url.pathname === '/api/weekly-analysis/publish' && request.method === 'POST') {
            return handlePublishWeeklyAnalysis(request, env);
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
                'Cache-Control': 'no-cache, no-store, must-revalidate',
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

// --- Briefings API handlers ---

async function handleBriefingsList(env) {
    try {
        const listKey = 'briefings_index';
        const indexRaw = await env.BRIEFINGS.get(listKey) || '[]';
        const index = JSON.parse(indexRaw);
        return jsonResponse({ briefings: index, count: index.length });
    } catch (err) {
        console.error('Briefings list error:', err);
        return jsonResponse({ briefings: [], error: 'Failed to load briefings' }, 500);
    }
}

async function handleBriefingDetail(dateSlug, env) {
    try {
        const raw = await env.BRIEFINGS.get(dateSlug);
        if (!raw) {
            return new Response('Briefing not found', { status: 404 });
        }
        const briefing = JSON.parse(raw);
        const html = buildBriefingDetailPage(briefing);
        return new Response(html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-store',
            },
        });
    } catch (err) {
        console.error('Briefing detail error:', err);
        return new Response('Failed to load briefing', { status: 500 });
    }
}

async function handleBriefingJson(dateSlug, env) {
    try {
        const raw = await env.BRIEFINGS.get(dateSlug);
        if (!raw) {
            return jsonResponse({ error: 'Briefing not found' }, 404);
        }
        return jsonResponse(JSON.parse(raw));
    } catch (err) {
        console.error('Briefing JSON error:', err);
        return jsonResponse({ error: 'Failed to load briefing' }, 500);
    }
}

// --- Admin API: manage briefings ---
// Extend handleAdminAPI to support briefing CRUD
// (We add a new path check before the existing 404 fallback)

async function handlePublishBriefing(request, env) {
    const publishKey = env.BRIEFINGS_PUBLISH_KEY || 'apposight-briefings-2026';
    const authHeader = request.headers.get('Authorization');

    if (authHeader !== 'Bearer ' + publishKey) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    try {
        const body = await request.json();
        const { date, high_priority, watch, general } = body;

        if (!date) {
            return jsonResponse({ error: 'Missing date field' }, 400);
        }

        const briefing = {
            date,
            high_priority: high_priority || [],
            watch: watch || [],
            general: general || [],
            published_at: new Date().toISOString(),
            critical_count: (high_priority || []).length,
            watch_count: (watch || []).length,
            general_count: (general || []).length,
        };

        // Store the briefing by date
        await env.BRIEFINGS.put(date, JSON.stringify(briefing));

        // Update index
        const indexRaw = await env.BRIEFINGS.get('briefings_index') || '[]';
        const index = JSON.parse(indexRaw);

        // Remove existing entry for same date if any
        const existingIdx = index.findIndex(b => b.date === date);
        if (existingIdx >= 0) {
            index[existingIdx] = {
                date,
                critical_count: briefing.critical_count,
                watch_count: briefing.watch_count,
                general_count: briefing.general_count,
            };
        } else {
            index.push({
                date,
                critical_count: briefing.critical_count,
                watch_count: briefing.watch_count,
                general_count: briefing.general_count,
            });
        }

        // Sort by date descending
        index.sort((a, b) => b.date.localeCompare(a.date));

        // Keep last 90 days
        while (index.length > 90) {
            const old = index.pop();
            await env.BRIEFINGS.delete(old.date);
        }

        await env.BRIEFINGS.put('briefings_index', JSON.stringify(index));

        console.log(`Briefing published for ${date} — ${briefing.critical_count} critical, ${briefing.watch_count} watch, ${briefing.general_count} general`);

        return jsonResponse({
            success: true,
            message: `Briefing published for ${date}`,
            date,
        });
    } catch (err) {
        console.error('Publish briefing error:', err);
        return jsonResponse({ error: 'Failed to publish briefing' }, 500);
    }
}

// --- Weekly Analysis ---

function buildWeeklyAnalysisDetailPage(post) {
    const [y, m, d] = post.date.split('-');
    const date = new Date(+y, +m - 1, +d);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const whyHtml = post.why_it_matters
        ? `<div class="wa-content-block">
            <h3>Why It Matters</h3>
            <p>${escHtml(post.why_it_matters)}</p>
            ${post.technical_impact ? `<div class="wa-impact"><strong>Technical:</strong> ${escHtml(post.technical_impact)}</div>` : ''}
            ${post.business_impact ? `<div class="wa-impact"><strong>Business:</strong> ${escHtml(post.business_impact)}</div>` : ''}
            ${post.timeline ? `<div class="wa-impact"><strong>Timeline:</strong> ${escHtml(post.timeline)}</div>` : ''}
          </div>` : '';

    const takeHtml = post.the_take
        ? `<div class="wa-content-block wa-take">
            <h3>The Take</h3>
            <p>${escHtml(post.the_take)}</p>
          </div>` : '';

    const watchHtml = post.what_to_watch && post.what_to_watch.length
        ? `<div class="wa-content-block">
            <h3>What to Watch Next</h3>
            <ul>${post.what_to_watch.map(i => `<li>${escHtml(i)}</li>`).join('')}</ul>
          </div>` : '';

    const sourcesHtml = post.sources && post.sources.length
        ? `<div class="wa-sources">
            <strong>Sources:</strong>
            ${post.sources.map(s => `<a href="${escHtml(s.url)}" target="_blank" rel="noopener">${escHtml(s.label || s.url)}</a>`).join(' · ')}
          </div>` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escHtml(post.title)} — Weekly Analysis | AppoSight</title>
    <meta name="description" content="Weekly security analysis from AppoSight: ${escHtml(post.title)}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --black: #1d1d1f; --gray: #86868b; --light-gray: #f5f5f7;
            --white: #ffffff; --blue: #2997ff; --red: #ff3b30; --orange: #ff9500;
        }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--black); background: var(--white); }
        nav {
            position: fixed; top: 0; width: 100%; padding: 14px 40px;
            background: rgba(255,255,255,0.8); backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px); z-index: 100;
            display: flex; justify-content: space-between; align-items: center;
        }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; }
        .logo svg { height: 32px; }
        .nav-links a { color: var(--black); text-decoration: none; margin-left: 28px; font-size: 12px; opacity: 0.8; transition: opacity 0.3s; }
        .nav-links a:hover { opacity: 1; }
        .hamburger {
            display: none; flex-direction: column; gap: 5px; background: none; border: none;
            cursor: pointer; padding: 4px; z-index: 110;
        }
        .hamburger span {
            display: block; width: 24px; height: 2px; background: var(--black);
            border-radius: 2px; transition: all 0.3s;
        }
        .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .wa-hero {
            padding: 160px 40px 40px; text-align: center; background: var(--black); color: var(--white);
        }
        .wa-hero .back-link {
            display: inline-block; color: var(--blue); text-decoration: none; font-size: 14px;
            margin-bottom: 24px; opacity: 0.8;
        }
        .wa-hero .back-link:hover { opacity: 1; }
        .wa-hero .date-label {
            font-size: 13px; color: var(--gray); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
        }
        .wa-hero h1 {
            font-size: clamp(28px, 5vw, 52px); font-weight: 700; letter-spacing: -2px; line-height: 1.15; max-width: 700px; margin: 0 auto;
        }
        .wa-badge-bar {
            font-size: 13px; color: var(--gray); margin-top: 20px; letter-spacing: 0.3px;
        }
        .wa-body { max-width: 720px; margin: 0 auto; padding: 60px 40px; }
        .wa-content-block { margin-bottom: 40px; }
        .wa-content-block h3 {
            font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: var(--gray);
            margin-bottom: 16px;
        }
        .wa-content-block p { font-size: 17px; line-height: 1.7; color: var(--black); }
        .wa-content-block ul { font-size: 17px; line-height: 1.7; padding-left: 20px; }
        .wa-content-block li { margin-bottom: 8px; }
        .wa-impact {
            margin-top: 12px; font-size: 16px; line-height: 1.6; color: var(--gray);
            padding-left: 16px; border-left: 2px solid #d2d2d7;
        }
        .wa-take {
            background: var(--light-gray); border-radius: 12px; padding: 28px;
        }
        .wa-take h3 { color: var(--black); }
        .wa-take p { color: var(--black); }
        .wa-sources {
            margin-top: 48px; padding: 20px 24px; background: var(--light-gray);
            border-radius: 12px; font-size: 14px; line-height: 1.6;
        }
        .wa-sources a { color: var(--blue); text-decoration: none; }
        .wa-sources a:hover { text-decoration: underline; }
        footer {
            background: var(--light-gray); padding: 40px; text-align: center;
            font-size: 12px; color: var(--gray); border-top: 1px solid #d2d2d7;
        }
        @media (max-width: 600px) {
            nav { padding: 14px 20px; }
            .hamburger { display: flex; }
            .nav-links {
                position: fixed; top: 0; right: 0; width: 260px; height: 100vh;
                background: rgba(255,255,255,0.98); backdrop-filter: blur(20px);
                display: flex; flex-direction: column; justify-content: center;
                padding: 0 40px; transform: translateX(100%); transition: transform 0.3s ease;
                z-index: 105; box-shadow: -4px 0 24px rgba(0,0,0,0.1);
            }
            .nav-links.open { transform: translateX(0); }
            .nav-links a { margin-left: 0; margin-bottom: 24px; font-size: 20px; opacity: 0.85; }
            .wa-hero { padding: 140px 20px 30px; }
            .wa-body { padding: 40px 20px; }
        }
    </style>
</head>
<body>
    <nav>
        <a href="/" class="logo-link">
            <div class="logo">
            <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(30, 40)">
                    <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5"/>
                    <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/>
                </g>
                <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text>
            </svg>
            </div>
        </a>
        <div class="nav-links">
            <a href="/about">About</a>
            <a href="/#capabilities">Capabilities</a>
            <a href="/#pentest">Pentest</a>
            <a href="/Use-Cases">Use Cases</a>
            <a href="/briefings">Briefings</a>
            <a href="/#contact">Contact</a>
        </div>
        <button class="hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
        </button>
    </nav>

    <div class="wa-hero">
        <a href="/briefings" class="back-link">← All Briefings</a>
        <div class="date-label">Weekly Analysis — ${dateStr}</div>
        <h1>${escHtml(post.title)}</h1>
        <div class="wa-badge-bar">AI-drafted &middot; Human-reviewed &middot; Finalized by Stanley</div>
    </div>

    <div class="wa-body">
        ${post.what_happened ? `<div class="wa-content-block"><h3>What Happened</h3><p>${escHtml(post.what_happened)}</p></div>` : ''}
        ${whyHtml}
        ${takeHtml}
        ${watchHtml}
        ${sourcesHtml}
    </div>

    <footer>
        <p>Copyright &copy; 2026 AppoSight. All rights reserved.</p>
    </footer>
    <script>
    (function(){var h=document.querySelector('.hamburger'),n=document.querySelector('.nav-links');if(h&&n){h.addEventListener('click',function(){h.classList.toggle('active');n.classList.toggle('open');});n.querySelectorAll('a').forEach(function(l){l.addEventListener('click',function(){h.classList.remove('active');n.classList.remove('open');});});}})();
    </script>
</body>
</html>`;
}

// --- Weekly Analysis API handlers ---

async function handleWeeklyAnalysisList(env) {
    try {
        const indexRaw = await env.BRIEFINGS.get('weekly_analysis_index') || '[]';
        const index = JSON.parse(indexRaw);
        return jsonResponse({ posts: index, count: index.length });
    } catch (err) {
        console.error('Weekly analysis list error:', err);
        return jsonResponse({ posts: [], error: 'Failed to load weekly analysis' }, 500);
    }
}

async function handleWeeklyAnalysisDetail(dateSlug, env) {
    try {
        const raw = await env.BRIEFINGS.get('wa_' + dateSlug);
        if (!raw) {
            return new Response('Weekly analysis post not found', { status: 404 });
        }
        const post = JSON.parse(raw);
        const html = buildWeeklyAnalysisDetailPage(post);
        return new Response(html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-store',
            },
        });
    } catch (err) {
        console.error('Weekly analysis detail error:', err);
        return new Response('Failed to load weekly analysis', { status: 500 });
    }
}

async function handlePublishWeeklyAnalysis(request, env) {
    const publishKey = env.BRIEFINGS_PUBLISH_KEY || 'apposight-briefings-2026';
    const authHeader = request.headers.get('Authorization');

    if (authHeader !== 'Bearer ' + publishKey) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    try {
        const body = await request.json();
        const { date, title, summary, what_happened, why_it_matters, technical_impact, business_impact, timeline, the_take, what_to_watch, sources } = body;

        if (!date || !title) {
            return jsonResponse({ error: 'Missing required fields: date and title' }, 400);
        }

        const post = {
            date,
            title,
            summary: summary || '',
            what_happened: what_happened || '',
            why_it_matters: why_it_matters || '',
            technical_impact: technical_impact || '',
            business_impact: business_impact || '',
            timeline: timeline || '',
            the_take: the_take || '',
            what_to_watch: what_to_watch || [],
            sources: sources || [],
            published_at: new Date().toISOString(),
        };

        await env.BRIEFINGS.put('wa_' + date, JSON.stringify(post));

        const indexRaw = await env.BRIEFINGS.get('weekly_analysis_index') || '[]';
        const index = JSON.parse(indexRaw);

        const existingIdx = index.findIndex(p => p.date === date);
        const indexEntry = {
            date,
            title,
            summary: summary || '',
        };
        if (existingIdx >= 0) {
            index[existingIdx] = indexEntry;
        } else {
            index.push(indexEntry);
        }

        index.sort((a, b) => b.date.localeCompare(a.date));

        // Keep last 52 weeks
        while (index.length > 52) {
            const old = index.pop();
            await env.BRIEFINGS.delete('wa_' + old.date);
        }

        await env.BRIEFINGS.put('weekly_analysis_index', JSON.stringify(index));

        console.log(`Weekly analysis published for ${date}: ${title}`);

        return jsonResponse({
            success: true,
            message: `Weekly analysis published for ${date}`,
            date,
        });
    } catch (err) {
        console.error('Publish weekly analysis error:', err);
        return jsonResponse({ error: 'Failed to publish weekly analysis' }, 500);
    }
}
