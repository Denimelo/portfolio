// ==========================================================
// Portfolio · Narcisse Apelete
// Langue (FR/EN) et thème (automatique / clair / sombre)
// ==========================================================

const EN = {
  skip: "Skip to content",
  "nav.projects": "Projects",
  "nav.path": "Background",
  "nav.skills": "Skills",
  "nav.contact": "Contact",

  "hero.where": "Full-stack developer · Abidjan, Côte d'Ivoire",
  "hero.lede": "I build complete web applications: the database, the API and the interface. I also enjoy explaining what I build, and I tutor maths.",
  "hero.status": "Intern at <strong>Groupe Logiciels &amp; Services</strong> until April 2027",
  "hero.cta": "See my projects",
  "hero.cv": "Download my CV",
  "hero.photoAlt": "Portrait of Narcisse Apelete in a blue suit",

  "projects.title": "Projects",

  "p1.meta": "Internship project · 2026–2027",
  "p1.status": "In progress",
  "p1.title": "Action plan management app",
  "p1.desc": "An organisation sets its vision, breaks it down into actions as finely as it needs, then tracks how they are carried out: a performance rate weighted by criticality, a scoring scale, deadline alerts and a dashboard for each owner.",
  "p1.f1": "I wrote the functional specification (needs, scope, requirements per module, risks, acceptance scenarios) and the UML models, submitted to management.",
  "p1.f2": "Database and module design: action tree, performance, alerts, roles.",
  "p1.f3": "An AI assistant will suggest actions to create and owners to assign.",
  "p1.note": "Internal project: screenshots and code will be shared after release.",
  "tree.vision": "Vision",
  "tree.a1": "Action 1",
  "tree.a2": "Action 2",
  "tree.late": "overdue",

  "p2.meta": "Live site · since April 2026",
  "p2.status": "In production",
  "p2.desc": "The platform of a secondary-school maths teacher: lessons, exercises, worked solutions, drills and a parents' area, with archives for every school year.",
  "p2.f1": "Designed and launched end to end, then maintained throughout the year.",
  "p2.f2": "Over 200 documents published, sorted by class and by year.",
  "p2.f3": "Used by Year 10 and Year 11 students, and by their parents.",
  "p2.site": "Visit maximaths.com",
  "p2.code": "View the code",
  "p2.alt1": "Maximaths home page",
  "p2.alt2": "Choosing a class and school year on Maximaths",

  "path.title": "Background",
  "path.work": "Work experience",
  "path.edu": "Education",
  "path.e1.when": "Oct 2026 – Apr 2027",
  "path.e1.role": "Full-stack developer intern",
  "path.e1.desc": "Designing and building an action plan management application within the Business Applications Development unit.",
  "path.e2.when": "Dec 2025 – Jul 2026",
  "path.e2.role": "Maths tutor",
  "path.e2.where": "Self-employed, Abidjan",
  "path.e2.desc": "Tutored two students in the French school system (Year 10 and Year 12) through to the end of the year, with good results.",
  "path.e3.when": "May – Aug 2025",
  "path.e3.role": "Full-stack developer intern",
  "path.e3.desc": "A support platform for small businesses, built in 3 months in a team of 5: a 24-table PostgreSQL database, a FastAPI REST API, a Remix dashboard of about ten pages, deployed on Render.",
  "path.e4.when": "Jul – Sep 2024",
  "path.e4.role": "Full-stack developer intern",
  "path.e4.desc": "A web platform integrated into a savings and credit cooperative's information system: business logic and interface in C#, data modelling.",
  "path.e5.role": "Software engineering degree",
  "path.e5.desc": "Software engineering and information systems at the African Institute of Computer Science. Graduated with a 14.05/20 average (French grading scale).",

  "skills.title": "Skills",
  "skills.back": "Back end and APIs",
  "skills.front": "Front end and mobile",
  "skills.data": "Databases",
  "skills.tools": "Tools and deployment",
  "skills.design": "Analysis and design",
  "skills.designList": "UML modelling (use cases, classes, sequences, activities), functional specifications, acceptance test scenarios",
  "about.title": "Beyond code",
  "about.p": "I have always liked explaining things. At school I helped classmates debug their back ends and deploy their APIs; today I tutor students in maths. That habit of making things clear shows in my specifications, my documentation and my presentations. I speak French and English (TOEIC certified), and I enjoy reading, music and sport.",

  "contact.title": "Let's work together",
  "contact.lede": "A job, a project or a question: write to me, I reply quickly.",
  "contact.cv": "CV (PDF)",
};

const UI = {
  fr: { langBtn: "EN", langLabel: "Switch to English", title: "Narcisse Apelete · Développeur full-stack",
        theme: { system: "Thème : automatique", light: "Thème : clair", dark: "Thème : sombre" } },
  en: { langBtn: "FR", langLabel: "Passer en français", title: "Narcisse Apelete · Full-stack developer",
        theme: { system: "Theme: automatic", light: "Theme: light", dark: "Theme: dark" } },
};

const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
};

// Garde le texte français d'origine pour pouvoir revenir en arrière
const FR = {};
document.querySelectorAll("[data-i18n]").forEach(el => { FR[el.dataset.i18n] = el.textContent; });
document.querySelectorAll("[data-i18n-html]").forEach(el => { FR[el.dataset.i18nHtml] = el.innerHTML; });
document.querySelectorAll("[data-i18n-alt]").forEach(el => { FR[el.dataset.i18nAlt] = el.alt; });

let lang = "fr";

function applyLang(next) {
  lang = next;
  const dict = next === "en" ? EN : FR;
  document.documentElement.lang = next;
  document.querySelectorAll("[data-i18n]").forEach(el => { const v = dict[el.dataset.i18n]; if (v) el.textContent = v; });
  document.querySelectorAll("[data-i18n-html]").forEach(el => { const v = dict[el.dataset.i18nHtml]; if (v) el.innerHTML = v; });
  document.querySelectorAll("[data-i18n-alt]").forEach(el => { const v = dict[el.dataset.i18nAlt]; if (v) el.alt = v; });
  const ui = UI[next];
  const btn = document.getElementById("lang-toggle");
  btn.textContent = ui.langBtn;
  btn.setAttribute("aria-label", ui.langLabel);
  document.title = ui.title;
  updateThemeLabel();
}

// ---------- Thème ----------
const THEMES = ["system", "light", "dark"];
function currentTheme() { return document.documentElement.dataset.theme || "system"; }
function updateThemeLabel() {
  document.getElementById("theme-toggle").setAttribute("aria-label", UI[lang].theme[currentTheme()]);
}
document.getElementById("theme-toggle").addEventListener("click", () => {
  const next = THEMES[(THEMES.indexOf(currentTheme()) + 1) % THEMES.length];
  document.documentElement.dataset.theme = next;
  store.set("theme", next);
  updateThemeLabel();
});

// ---------- Langue ----------
document.getElementById("lang-toggle").addEventListener("click", () => {
  const next = lang === "fr" ? "en" : "fr";
  store.set("lang", next);
  applyLang(next);
});

// Langue de départ : ?lang=en, choix enregistré, sinon langue du navigateur
const param = new URLSearchParams(location.search).get("lang");
const saved = store.get("lang");
const browser = (navigator.language || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";
applyLang(param === "en" || param === "fr" ? param : saved || browser);

document.getElementById("year").textContent = new Date().getFullYear();
