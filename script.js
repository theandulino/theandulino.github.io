// ===== Einstellungen =====
const GITHUB_USER = "theandulino";
const MAX_PROJECTS = 6;
// Repos, die nicht angezeigt werden sollen (z. B. diese Webseite selbst)
const HIDE_REPOS = ["user", `${GITHUB_USER}.github.io`];

document.getElementById("year").textContent = new Date().getFullYear();

// ===== Terminal-Animation =====
const lines = [
  ["p", "$ "], ["", "whoami\n"],
  ["", "andreas astner — developer\n"],
  ["p", "$ "], ["", "cat skills.txt\n"],
  ["c", "web · tools · apis · automation\n"],
  ["p", "$ "], ["", "git log --oneline -1\n"],
  ["c", "a1b2c3d "], ["", "ship it 🚀\n"],
  ["p", "$ "],
];

function typeTerminal() {
  const el = document.getElementById("typed");
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    el.innerHTML = lines.map(([c, t]) => `<span class="${c}">${t}</span>`).join("");
    return;
  }
  let li = 0, ci = 0, span = null;
  (function step() {
    if (li >= lines.length) return;
    const [cls, text] = lines[li];
    if (ci === 0) { span = document.createElement("span"); span.className = cls; el.appendChild(span); }
    const ch = text[ci++];
    span.textContent += ch;
    // Befehle (direkt nach einem Prompt) werden langsam "getippt", Ausgaben erscheinen schnell
    const isCommand = cls === "" && lines[li - 1]?.[0] === "p";
    if (ci >= text.length) { li++; ci = 0; }
    setTimeout(step, ch === "\n" ? 380 : isCommand ? 60 : 10);
  })();
}
typeTerminal();

// ===== Projekte von GitHub laden =====
const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", HTML: "#e34c26",
  CSS: "#563d7c", Java: "#b07219", "C#": "#178600", "C++": "#f34b7d", C: "#555555",
  Go: "#00ADD8", Rust: "#dea584", PHP: "#4F5D95", Shell: "#89e051", Kotlin: "#A97BFF",
  Swift: "#F05138", Dart: "#00B4AB", Vue: "#41b883", Svelte: "#ff3e00",
};

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function timeAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / 864e5);
  if (days < 1) return "heute";
  if (days < 30) return `vor ${days} Tag${days === 1 ? "" : "en"}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `vor ${months} Monat${months === 1 ? "" : "en"}`;
  const years = Math.floor(months / 12);
  return `vor ${years} Jahr${years === 1 ? "" : "en"}`;
}

async function loadProjects() {
  const list = document.getElementById("project-list");
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
    if (!res.ok) throw new Error(res.status);
    const repos = (await res.json())
      .filter((r) => !r.fork && !r.archived && !HIDE_REPOS.includes(r.name))
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, MAX_PROJECTS);

    if (!repos.length) {
      list.innerHTML = `<div class="empty mono">// Hier erscheinen bald meine Projekte. Schau solange auf
        <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">GitHub</a> vorbei.</div>`;
      return;
    }

    list.innerHTML = repos.map((r, i) => `
      <a class="project reveal" href="${esc(r.homepage || r.html_url)}" target="_blank" rel="noopener">
        <div class="project-top"><span>${String(i + 1).padStart(2, "0")}</span><span class="arrow">↗</span></div>
        <h3>${esc(r.name)}</h3>
        <p>${esc(r.description || "Keine Beschreibung.")}</p>
        <div class="project-meta">
          ${r.language ? `<span class="lang" style="--lang:${LANG_COLORS[r.language] || "var(--accent)"}">${esc(r.language)}</span>` : ""}
          ${r.stargazers_count ? `<span>★ ${r.stargazers_count}</span>` : ""}
          <span>${timeAgo(r.pushed_at)}</span>
        </div>
      </a>`).join("");
    observeReveals();
  } catch (e) {
    list.innerHTML = `<div class="empty mono">// Projekte konnten gerade nicht geladen werden.
      <a href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noopener">Direkt auf GitHub ansehen ↗</a></div>`;
  }
}
loadProjects();

// ===== Scroll-Reveal =====
const io = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12 })
  : null;

function observeReveals() {
  document.querySelectorAll(".reveal:not(.in)").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
}
document.querySelectorAll(".section-head, .about-grid, .stack-grid, .contact-big, .links")
  .forEach((el) => el.classList.add("reveal"));
observeReveals();
