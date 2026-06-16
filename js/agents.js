(function(){'use strict';

const agents = [
  // ── Pipeline Agents (16) ──
  { name:'autopilot',        cat:'pipeline', desc:'Full autonomous pipeline — scope to auth to recon to hunt to exploit to report. 12-phase methodology, no handholding.' },
  { name:'consult',          cat:'pipeline', desc:'Same P1–P12 pipeline as autopilot, pauses at every phase for human approval. Interactive mode.' },
  { name:'scope',            cat:'pipeline', desc:'Register target domain, scope boundaries, credentials. Phase 1 engagement scaffold.' },
  { name:'auth',             cat:'pipeline', desc:'Authenticate to target — capture tokens, cookies, and session state. Phase 2.' },
  { name:'browser-auth',     cat:'pipeline', desc:'Automated browser authentication via Playwright. Google OAuth, form login, session capture. Phase 2.5.' },
  { name:'pintel',           cat:'pipeline', desc:'Passive intel — WHOIS, M365/Azure checks, cloud bucket enum, spoof check. Phase 3.' },
  { name:'recon',            cat:'pipeline', desc:'Full recon — subdomain enum, DNS, crawl, params, nuclei, secrets, technology fingerprint. Phase 4.' },
  { name:'surface',          cat:'pipeline', desc:'Attack surface analysis — endpoint prioritization, rank Tier 0/1/2. Phase 5.' },
  { name:'hunt',             cat:'pipeline', desc:'Dispatch all 54 hunt-* sub-agents based on surface analysis. Coverage gated at 90%. Phase 6.' },
  { name:'deepthink',        cat:'pipeline', desc:'Conditional deep reasoning — gap analysis, first-principles, chain analysis, persistent issue tracking. Triggered by 6 pipeline signals.' },
  { name:'exploit',          cat:'pipeline', desc:'Deep research-driven exploitation of ALL findings from Phase 6. WAF bypass, chain construction. Phase 8.' },
  { name:'search',           cat:'pipeline', desc:'Conditional real-time intel — researches CVEs, bypass techniques, disclosed reports. Triggered by 5 pipeline signals.' },
  { name:'capture',          cat:'pipeline', desc:'Evidence collection — Playwright screenshots, HAR, collaborator interactions, per-finding PoC reports. Phase 10.' },
  { name:'validate',         cat:'pipeline', desc:'Re-run PoCs, 7-Question Gate, severity grading. Updates per-finding PoC reports. Phase 11.' },
  { name:'report',           cat:'pipeline', desc:'Coverage check, phase gates, generates per-finding PoC reports and final deliverable. Phase 12.' },

  // ── Hunt Agents (54) ──
  { name:'hunt-api-misconfig',        cat:'hunt', desc:'API security misconfiguration — mass assignment, rate limiting gaps, excessive data exposure, improper asset management.' },
  { name:'hunt-aspnet',               cat:'hunt', desc:'ASP.NET / .NET — ViewState validation bypass, machineKey disclosure, IIS misconfig, request validation bypass.' },
  { name:'hunt-ato',                  cat:'hunt', desc:'Account Takeover — password reset logic flaws, email takeover, OAuth token theft, 2FA bypass, SSO bypass chains.' },
  { name:'hunt-auth-bypass',          cat:'hunt', desc:'Authentication bypass — forced browsing, HTTP method override, parameter pollution, direct endpoint access.' },
  { name:'hunt-brute-force',          cat:'hunt', desc:'Brute force / credential stuffing — rate limiting bypass, JWT brute force, 2FA bypass, password policy bypass.' },
  { name:'hunt-business-logic',       cat:'hunt', desc:'Business logic flaws — pricing manipulation, workflow bypass, multi-step process flaws, KYC bypass.' },
  { name:'hunt-cache-poison',         cat:'hunt', desc:'Web cache poisoning — unkeyed inputs, CDN-specific (Cloudflare, Akamai, Fastly), cache deception.' },
  { name:'hunt-cicd',                 cat:'hunt', desc:'CI/CD pipeline — GitHub Actions injection, GitLab CI abuse, Jenkins Groovy, self-hosted runner compromise.' },
  { name:'hunt-clickjacking',         cat:'hunt', desc:'Clickjacking — X-Frame-Options and CSP frame-ancestors detection, UI redressing, invisible frames, framebusting bypass.' },
  { name:'hunt-cloud-misconfig',      cat:'hunt', desc:'Cloud storage misconfig — open S3/Azure Blob/GCP buckets, public AMIs, metadata exposure, snapshot sharing.' },
  { name:'hunt-cors',                 cat:'hunt', desc:'CORS misconfiguration — origin reflection, wildcard origin with credentials, preflight bypass, null origin.' },
  { name:'hunt-crlf',                 cat:'hunt', desc:'CRLF / Log injection — header injection, response splitting, HTTP request smuggling via CRLF, XSS via log poisoning.' },
  { name:'hunt-csrf',                 cat:'hunt', desc:'Cross-Site Request Forgery — anti-CSRF token bypass, SameSite bypass, JSON Content-Type, multi-step CSRF.' },
  { name:'hunt-dependency-confusion', cat:'hunt', desc:'Dependency confusion — supply chain substitution, NPM/Pip/Gem/Maven package squatting, registry poisoning.' },
  { name:'hunt-deserialization',      cat:'hunt', desc:'Insecure deserialization — PHP unserialize, Java (ysoserial), .NET ViewState, Python pickle, Ruby MARSHAL.' },
  { name:'hunt-dispatch',             cat:'hunt', desc:'Hunt dispatcher — routes to correct hunting agent based on target fingerprinting and technology stack.' },
  { name:'hunt-dom',                  cat:'hunt', desc:'DOM-based vulnerabilities — DOM XSS, DOM clobbering, prototype pollution, trusted types bypass.' },
  { name:'hunt-file-upload',          cat:'hunt', desc:'File upload vulnerabilities — unrestricted upload, SVG XSS, polyglot files, Content-Type bypass, zip slip.' },
  { name:'hunt-graphql',              cat:'hunt', desc:'GraphQL API — introspection, batching attacks, alias abuse, depth-based DoS, auth bypass, IDOR.' },
  { name:'hunt-host-header',          cat:'hunt', desc:'Host header injection — password reset poisoning, cache poisoning, SSRF via Host header, routing-based SSRF.' },
  { name:'hunt-http-param-pollution', cat:'hunt', desc:'HTTP Parameter Pollution — duplicate parameter injection, WAF/bypass, framework-specific parsing differences.' },
  { name:'hunt-http-smuggling',       cat:'hunt', desc:'HTTP request smuggling — CL.TE, TE.CL, TE.TE, connection reuse poisoning, WAF bypass.' },
  { name:'hunt-idor',                 cat:'hunt', desc:'Insecure Direct Object Reference — UUID enumeration, sequential IDs, GraphQL IDOR, multi-tenant access.' },
  { name:'hunt-jwt-confusion',        cat:'hunt', desc:'JWT attacks — RS256->HS256 confusion, none alg bypass, kid injection, jwks_uri spoofing, JWK injection.' },
  { name:'hunt-k8s',                  cat:'hunt', desc:'Kubernetes security — RBAC abuse, pod escape, secrets exposure, kubelet API, etcd access, container breakout.' },
  { name:'hunt-laravel',              cat:'hunt', desc:'Laravel — debug mode exposure, APP_KEY decryption, serialization RCE, mass assignment, Blade SSTI.' },
  { name:'hunt-ldap',                 cat:'hunt', desc:'LDAP injection — anonymous binds, privilege escalation via LDAP, directory traversal, AD/LDAP misconfig.' },
  { name:'hunt-lfi',                  cat:'hunt', desc:'Local File Inclusion / Path Traversal — directory traversal, RFI, PHP wrappers, log poisoning to RCE.' },
  { name:'hunt-llm-ai',               cat:'hunt', desc:'LLM/AI security — prompt injection, RAG poisoning, model data extraction, jailbreak, MCP server abuse.' },
  { name:'hunt-mass-assignment',      cat:'hunt', desc:'Mass Assignment — extra field injection, ORM parameter binding bypass, admin flag escalation.' },
  { name:'hunt-mfa-bypass',           cat:'hunt', desc:'MFA bypass — push fatigue, backup code reuse, token reuse, biometric bypass, SIM swap, social engineering.' },
  { name:'hunt-misc',                 cat:'hunt', desc:'Catch-all — emerging threats, zero-day patterns, uncommon attack surfaces, novel vulnerability types.' },
  { name:'hunt-nextjs',               cat:'hunt', desc:'Next.js — Vercel misconfig, SSG/SSR data leakage, API route auth bypass, middleware bypass, RSC injection.' },
  { name:'hunt-nodejs',               cat:'hunt', desc:'Node.js / Express — prototype pollution, unsafe eval, deserialization, CORS misconfig, express-session flaws.' },
  { name:'hunt-nosqli',               cat:'hunt', desc:'NoSQL injection — MongoDB $where/$regex, CouchDB JavaScript, Cassandra CQL, DynamoDB expression injection.' },
  { name:'hunt-ntlm-info',            cat:'hunt', desc:'NTLM information disclosure — challenge capture, relay primitives, coercion, NetNTLMv2 interception.' },
  { name:'hunt-oauth',                cat:'hunt', desc:'OAuth 2.0 / OpenID Connect — redirect URI bypass, state nonce leakage, CSRF on OAuth flow, implicit flow.' },
  { name:'hunt-open-redirect',        cat:'hunt', desc:'Open redirect — URL parser bypass, protocol confusion, CRLF injection, chaining to phishing/XSS.' },
  { name:'hunt-prototype-pollution',  cat:'hunt', desc:'Prototype pollution — client-side and server-side, __proto__ injection, constructor manipulation, RCE chains.' },
  { name:'hunt-race-condition',       cat:'hunt', desc:'Race conditions — TOCTOU, payment races, coupon/loyalty races, rate limit race, database contention.' },
  { name:'hunt-rce',                  cat:'hunt', desc:'Remote Code Execution — OS command injection, eval() injection, SSTI to RCE, file write chains.' },
  { name:'hunt-saml',                 cat:'hunt', desc:'SAML SSO — XML signature wrapping, assertion injection, replay attack, recipient/audience confusion.' },
  { name:'hunt-session',              cat:'hunt', desc:'Session management — fixation, predictable tokens, weak cookie attributes, concurrent session handling.' },
  { name:'hunt-sharepoint',           cat:'hunt', desc:'SharePoint — on-prem/online misconfig, privilege escalation, workflow abuse, viewstate deserialization.' },
  { name:'hunt-source-leak',          cat:'hunt', desc:'Source code leak — .git/config exposure, .env file access, backup file disclosure, source map analysis.' },
  { name:'hunt-springboot',           cat:'hunt', desc:'Spring Boot — actuator exposure, Spring4Shell, classpath RCE, SpEL injection, property injection.' },
  { name:'hunt-sqli',                 cat:'hunt', desc:'SQL injection — classic, blind/time-based, second-order, ORM raw-fragment, NoSQL ($regex, $where).' },
  { name:'hunt-ssrf',                 cat:'hunt', desc:'Server-Side Request Forgery — cloud metadata (AWS/GCP/Azure/K8s), redirect chains, OOB, 11+ bypass techniques.' },
  { name:'hunt-ssti',                 cat:'hunt', desc:'Server-Side Template Injection — Jinja2, Twig, Freemarker, Velocity, Jade/Pug, ERB. Detection to RCE.' },
  { name:'hunt-subdomain',            cat:'hunt', desc:'Subdomain takeover — CNAME dangling, NS delegation, Azure/DNS/CloudFront/S3 takeover, dead link hijacking.' },
  { name:'hunt-tls-network',          cat:'hunt', desc:'TLS/SSL — weak cipher suites, outdated versions, cert validation bypass, STARTTLS injection, HTTP/2 downgrade.' },
  { name:'hunt-websocket',            cat:'hunt', desc:'WebSocket security — message injection, origin bypass, CSWSH, WS proxy misconfig, cross-origin hijacking.' },
  { name:'hunt-xss',                  cat:'hunt', desc:'Cross-Site Scripting — reflected, stored, DOM-based, CSP bypass, mXSS, sanitizer evasion, polyglot payloads.' },
  { name:'hunt-xxe',                  cat:'hunt', desc:'XML External Entity — in-band XXE, blind OOB XXE, SVG XXE, XInclude, docx/pptx XXE, SOAP XXE.' },

  // ── Specialty Agents (8) ──
  { name:'cloud-iam-deep',            cat:'specialty', desc:'AWS/Azure/GCP IAM — 24+ privilege escalation patterns, cross-account role trust, managed policy exploitation.' },
  { name:'enterprise-vpn-attack',     cat:'specialty', desc:'Enterprise VPN — Cisco ASA/FTD, Fortinet FortiGate, Citrix ADC, Pulse Secure, SonicWall, F5 Big-IP CVEs.' },
  { name:'m365-entra-attack',         cat:'specialty', desc:'Microsoft 365 / Entra ID — AADSTS error analysis, Smart Lockout, Conditional Access bypass, token theft.' },
  { name:'okta-attack',               cat:'specialty', desc:'Okta Identity — SWA injection, delegated authentication flaws, API token abuse, event hook manipulation.' },
  { name:'supply-chain-attack-recon', cat:'specialty', desc:'Supply chain — dependency confusion, package squatting, GH Actions injection, SBOM mining, registry poisoning.' },
  { name:'meme-coin-audit',           cat:'specialty', desc:'Meme coin / token audit — rug-pull detection, honeypot analysis, liquidity lock, proxy contract risks.' },
  { name:'apk-redteam-pipeline',      cat:'specialty', desc:'Android APK — decompile (jadx/apktool), secret grep, Frida instrumentation, cert pinning bypass, intent analysis.' },
  { name:'offensive-osint',           cat:'specialty', desc:'Offensive OSINT — identity fabric mapping, breached credential lookup, email/phone/social enumeration.' },

  // ── Support Agents (10) ──
  { name:'web2-recon',             cat:'support', desc:'Web recon — subdomain enumeration, technology fingerprinting, endpoint discovery, directory brute force, WAF detection.' },
  { name:'web2-vuln-classes',      cat:'support', desc:'Complete 20-class vulnerability reference. Root causes, bypass tables, exploit techniques, and real paid examples.' },
  { name:'osint-methodology',      cat:'support', desc:'OSINT methodology — source verification, data correlation, persona tracking, geolocation, temporal analysis.' },
  { name:'redteam-mindset',        cat:'support', desc:'Red team operator mindset — primary directive, anti-patterns, operational discipline, burnout avoidance.' },
  { name:'redteam-report-template',cat:'support', desc:'Red team report generator — client-facing DOCX with Subject/Observations/Impact/Recommendation/PoC sections.' },
  { name:'report-writing',         cat:'support', desc:'Report writer — HackerOne, Bugcrowd, Intigriti, Immunefi templates. CVSS 3.1/4.0 scoring, human tone.' },
  { name:'triage-validation',      cat:'support', desc:'Finding triage — 7-Question Gate: PASS/KILL/DOWNGRADE/CHAIN REQUIRED verdicts.' },
  { name:'evidence-hygiene',       cat:'support', desc:'Evidence sanitization — cookie/PII redaction, HAR cleaning, screenshot metadata stripping, chain of custody.' },
  { name:'bugcrowd-reporting',     cat:'support', desc:'Bugcrowd reporting — VRT category mapping, severity justification, OOS rebuttals, Bugcrowdninja hygiene.' },
  { name:'bug-bounty',             cat:'support', desc:'Bug bounty master — full P1–P12 methodology, mindset frameworks, signal chains, 17 critical rules.' },
];

const grid = document.getElementById('agentsGrid');
const search = document.getElementById('agentSearch');
const filterBtns = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';
let currentQuery = '';

function render() {
  const q = currentQuery.toLowerCase().trim();
  const filtered = agents.filter(function(a) {
    const matchFilter = currentFilter === 'all' || a.cat === currentFilter;
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.cat.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });
  if (!filtered.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted)">No agents match your search.</div>';
    return;
  }
  grid.innerHTML = filtered.map(function(a) {
    return '<div class="agent-card fade-in" data-name="' + a.name + '">' +
      '<div class="name">' + a.name + '</div>' +
      '<div class="desc">' + a.desc + '</div>' +
      '<div class="meta"><span class="badge ' + a.cat + '">' + a.cat + '</span></div>' +
    '</div>';
  }).join('');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.agent-card.fade-in').forEach(function(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
      obs.observe(el);
    });
  }
}

search.addEventListener('input', function() { currentQuery = this.value; render(); });
filterBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    filterBtns.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    render();
  });
});

render();
})();
