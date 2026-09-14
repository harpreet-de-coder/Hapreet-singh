/*!
 * Harpreet Singh — Portfolio Chatbot Widget
 * Drop-in, dependency-free FAQ assistant. Answers from a local knowledge base
 * (no server/API needed) and hands off to email/contact form for anything else.
 * Embed with:  <script src="hs-chatbot-widget.js" defer></script>
 */
(function () {
  "use strict";

  /* ---------------- CONFIG — edit these to customize ---------------- */
  var CONFIG = {
    name: "Harpreet",
    title: "Harpreet's Assistant",
    subtitle: "Usually replies in a few hours",
    avatarText: "HS",
    contactEmail: "hsldh21@gmail.com",
    contactFormUrl: "contact-us.html",
    greeting: "Hey! 👋 I'm a quick assistant for Harpreet's portfolio. Ask me about services, tools, experience, or how to start a project.",
    quickReplies: ["Services", "Experience", "Tools used", "How to hire", "Contact"],
    accent1: "#3e7bfa", /* blue   */
    accent2: "#8b5cf6", /* purple */
    accent3: "#22d3ee"  /* cyan   */
  };

  /* ---------------- KNOWLEDGE BASE ---------------- */
  /* Each entry: array of trigger keywords + a reply. First match wins. */
  var KB = [
    {
      k: ["service", "offer", "what do you do", "what can you build"],
      a: "I offer web development, WordPress development, website design, landing page design, UI/UX design, and form/integration setup (JotForm, Contact Form 7). Want details on any of these?"
    },
    {
      k: ["experience", "who is harpreet", "about", "years", "background"],
      a: "Harpreet Singh is a Web Developer & Designer with 4+ years of professional experience and 100+ projects delivered, specializing in WordPress, Elementor, responsive design and UI/UX."
    },
    {
      k: ["tool", "tech", "technology", "stack", "wordpress", "elementor", "figma"],
      a: "The toolkit includes HTML, WordPress, Elementor, JotForm, Contact Form 7, Slider Revolution, Thrive, Figma, plus AI tools like Claude, ChatGPT, Antigravity and Google Flow."
    },
    {
      k: ["hire", "start a project", "work together", "available", "book"],
      a: "Easiest way is the contact form — describe your project type and goals and you'll hear back to discuss scope, timeline and next steps."
    },
    {
      k: ["price", "cost", "rate", "budget", "quote"],
      a: "Pricing depends on project scope, so the fastest way to get a number is to share your project details via the contact form or email — you'll get a tailored quote."
    },
    {
      k: ["project", "portfolio", "work", "example", "case study"],
      a: "There's a range of projects in the Projects section above — WordPress builds, landing pages, creative/animated sites and Figma-first UI/UX work. Scroll up to check them out!"
    },
    {
      k: ["contact", "email", "reach", "get in touch"],
      a: "You can email directly, or use the contact form for a faster reply."
    },
    {
      k: ["hello", "hi", "hey", "yo"],
      a: "Hey there! What would you like to know — services, tools, experience, or how to start a project?"
    },
    {
      k: ["thank", "thanks", "great", "cool", "awesome"],
      a: "Anytime! Anything else you'd like to know?"
    }
  ];

  var FALLBACK = "I don't have a canned answer for that, but Harpreet will! Send a message via the contact form or email and you'll get a personal reply.";

  function findReply(text) {
    var t = text.toLowerCase();
    for (var i = 0; i < KB.length; i++) {
      for (var j = 0; j < KB[i].k.length; j++) {
        if (t.indexOf(KB[i].k[j]) !== -1) return KB[i].a;
      }
    }
    return null;
  }

  /* ---------------- STYLES ---------------- */
  var css = "\n"
    + ".hscw-root{--hc-blue:" + CONFIG.accent1 + ";--hc-purple:" + CONFIG.accent2 + ";--hc-cyan:" + CONFIG.accent3 + ";"
    + "--hc-bg:#0b0e17;--hc-surface:#10131f;--hc-line:rgba(255,255,255,.09);--hc-ink:#edeff7;--hc-ink-dim:#8891a7;"
    + "--hc-font:'Space Grotesk','Inter',system-ui,sans-serif;--hc-font-body:'Inter',system-ui,sans-serif;"
    + "position:fixed;z-index:99999;right:20px;bottom:20px;font-family:var(--hc-font-body);}"
    + ".hscw-launcher{width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;"
    + "background:linear-gradient(135deg,var(--hc-blue),var(--hc-purple) 60%,var(--hc-cyan));"
    + "box-shadow:0 8px 28px rgba(62,123,250,.35);display:flex;align-items:center;justify-content:center;"
    + "transition:transform .25s cubic-bezier(.16,.84,.44,1);}"
    + ".hscw-launcher:hover{transform:scale(1.07);}"
    + ".hscw-launcher svg{width:26px;height:26px;}"
    + ".hscw-badge{position:absolute;top:-2px;right:-2px;width:14px;height:14px;border-radius:50%;background:var(--hc-cyan);"
    + "border:2px solid var(--hc-bg);}"
    + ".hscw-panel{position:absolute;right:0;bottom:76px;width:360px;max-width:calc(100vw - 40px);height:500px;"
    + "max-height:calc(100vh - 120px);background:var(--hc-surface);border:1px solid var(--hc-line);border-radius:18px;"
    + "display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.5);"
    + "opacity:0;transform:translateY(16px) scale(.98);pointer-events:none;"
    + "transition:opacity .25s cubic-bezier(.16,.84,.44,1),transform .25s cubic-bezier(.16,.84,.44,1);}"
    + ".hscw-root.open .hscw-panel{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}"
    + ".hscw-root.open .hscw-launcher .hscw-icon-chat{display:none;}"
    + ".hscw-root.open .hscw-launcher .hscw-icon-close{display:block;}"
    + ".hscw-launcher .hscw-icon-close{display:none;}"
    + ".hscw-head{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--hc-line);"
    + "background:linear-gradient(120deg,rgba(62,123,250,.12),rgba(139,92,246,.10));}"
    + ".hscw-avatar{width:38px;height:38px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;"
    + "font-family:var(--hc-font);font-weight:700;font-size:14px;color:#fff;"
    + "background:linear-gradient(135deg,var(--hc-blue),var(--hc-cyan));}"
    + ".hscw-head-text{flex:1;min-width:0;}"
    + ".hscw-head-text strong{display:block;font-family:var(--hc-font);font-size:14px;color:var(--hc-ink);}"
    + ".hscw-head-text span{display:block;font-size:11.5px;color:var(--hc-ink-dim);margin-top:2px;}"
    + ".hscw-head-close{background:none;border:none;color:var(--hc-ink-dim);cursor:pointer;font-size:20px;line-height:1;padding:4px;}"
    + ".hscw-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}"
    + ".hscw-body::-webkit-scrollbar{width:6px;}"
    + ".hscw-body::-webkit-scrollbar-thumb{background:var(--hc-line);border-radius:3px;}"
    + ".hscw-msg{max-width:82%;padding:10px 13px;border-radius:14px;font-size:13.5px;line-height:1.5;}"
    + ".hscw-msg.bot{align-self:flex-start;background:#161a29;color:var(--hc-ink);border-bottom-left-radius:4px;}"
    + ".hscw-msg.user{align-self:flex-end;background:linear-gradient(120deg,var(--hc-blue),var(--hc-purple));"
    + "color:#fff;border-bottom-right-radius:4px;}"
    + ".hscw-msg a{color:var(--hc-cyan);text-decoration:underline;}"
    + ".hscw-quick{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px;}"
    + ".hscw-chip{border:1px solid var(--hc-line);background:transparent;color:var(--hc-ink-dim);font-size:12px;"
    + "padding:6px 11px;border-radius:999px;cursor:pointer;transition:all .18s ease;font-family:var(--hc-font-body);}"
    + ".hscw-chip:hover{border-color:var(--hc-blue);color:var(--hc-ink);}"
    + ".hscw-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px;background:#161a29;border-radius:14px;border-bottom-left-radius:4px;}"
    + ".hscw-typing span{width:6px;height:6px;border-radius:50%;background:var(--hc-ink-dim);animation:hscw-blink 1.2s infinite ease-in-out;}"
    + ".hscw-typing span:nth-child(2){animation-delay:.15s;} .hscw-typing span:nth-child(3){animation-delay:.3s;}"
    + "@keyframes hscw-blink{0%,80%,100%{opacity:.25;}40%{opacity:1;}}"
    + ".hscw-foot{display:flex;align-items:center;gap:8px;padding:12px;border-top:1px solid var(--hc-line);}"
    + ".hscw-input{flex:1;background:#0b0e17;border:1px solid var(--hc-line);border-radius:999px;padding:10px 14px;"
    + "color:var(--hc-ink);font-size:13.5px;font-family:var(--hc-font-body);outline:none;}"
    + ".hscw-input:focus{border-color:var(--hc-blue);}"
    + ".hscw-send{width:36px;height:36px;flex:none;border-radius:50%;border:none;cursor:pointer;"
    + "background:linear-gradient(135deg,var(--hc-blue),var(--hc-purple));display:flex;align-items:center;justify-content:center;}"
    + ".hscw-send svg{width:16px;height:16px;fill:#fff;}"
    + "@media(max-width:480px){.hscw-panel{width:calc(100vw - 24px);right:-8px;height:70vh;}.hscw-root{right:14px;bottom:14px;}}";

  var styleTag = document.createElement("style");
  styleTag.setAttribute("data-hs-chatbot", "");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ---------------- MARKUP ---------------- */
  var root = document.createElement("div");
  root.className = "hscw-root";
  root.innerHTML =
    '<div class="hscw-panel" role="dialog" aria-label="' + CONFIG.title + '">'
      + '<div class="hscw-head">'
        + '<div class="hscw-avatar">' + CONFIG.avatarText + '</div>'
        + '<div class="hscw-head-text"><strong>' + CONFIG.title + '</strong><span>' + CONFIG.subtitle + '</span></div>'
        + '<button class="hscw-head-close" aria-label="Close chat">&times;</button>'
      + '</div>'
      + '<div class="hscw-body" id="hscwBody"></div>'
      + '<div class="hscw-foot">'
        + '<input class="hscw-input" id="hscwInput" type="text" placeholder="Type a message…" autocomplete="off">'
        + '<button class="hscw-send" id="hscwSend" aria-label="Send">'
          + '<svg viewBox="0 0 24 24"><path d="M3 20l18-8L3 4v6l12 2-12 2z"/></svg>'
        + '</button>'
      + '</div>'
    + '</div>'
    + '<button class="hscw-launcher" aria-label="Open chat">'
      + '<span class="hscw-badge"></span>'
      + '<svg class="hscw-icon-chat" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>'
      + '<svg class="hscw-icon-close" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>'
    + '</button>';
  document.body.appendChild(root);

  var body = root.querySelector("#hscwBody");
  var input = root.querySelector("#hscwInput");
  var sendBtn = root.querySelector("#hscwSend");
  var launcher = root.querySelector(".hscw-launcher");
  var closeBtn = root.querySelector(".hscw-head-close");

  function addMsg(text, who) {
    var el = document.createElement("div");
    el.className = "hscw-msg " + who;
    el.innerHTML = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  function addQuickReplies(list) {
    var wrap = document.createElement("div");
    wrap.className = "hscw-quick";
    list.forEach(function (label) {
      var chip = document.createElement("button");
      chip.className = "hscw-chip";
      chip.type = "button";
      chip.textContent = label;
      chip.addEventListener("click", function () { handleUserText(label); });
      wrap.appendChild(chip);
    });
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function showTyping() {
    var el = document.createElement("div");
    el.className = "hscw-typing";
    el.id = "hscwTyping";
    el.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }
  function hideTyping() {
    var el = document.getElementById("hscwTyping");
    if (el) el.remove();
  }

  function contactLine() {
    return 'You can email <a href="mailto:' + CONFIG.contactEmail + '">' + CONFIG.contactEmail
      + '</a> or use the <a href="' + CONFIG.contactFormUrl + '">contact form</a>.';
  }

  function handleUserText(text) {
    if (!text || !text.trim()) return;
    addMsg(escapeHtml(text), "user");
    input.value = "";
    showTyping();
    setTimeout(function () {
      hideTyping();
      var reply = findReply(text);
      if (!reply) reply = FALLBACK;
      var isContact = /contact|email|reach|hire|start a project/i.test(text);
      addMsg(reply + (isContact ? "<br><br>" + contactLine() : ""), "bot");
    }, 550 + Math.random() * 400);
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  var started = false;
  function openPanel() {
    root.classList.add("open");
    if (!started) {
      started = true;
      addMsg(CONFIG.greeting, "bot");
      addQuickReplies(CONFIG.quickReplies);
    }
    setTimeout(function () { input.focus(); }, 260);
  }
  function closePanel() { root.classList.remove("open"); }

  launcher.addEventListener("click", function () {
    root.classList.contains("open") ? closePanel() : openPanel();
  });
  closeBtn.addEventListener("click", closePanel);
  sendBtn.addEventListener("click", function () { handleUserText(input.value); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") handleUserText(input.value);
  });
})();
