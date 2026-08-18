import { siteConfig } from "./config.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  prologueIndex: 0,
  discoveries: new Set(),
  giftDodges: 0,
  toastTimer: null,
  experienceStarted: false,
  endingQueued: false
};

const lockedView = $("#locked-view");
const prologue = $("#prologue");
const experience = $("#experience");
const audio = $("#background-music");
const musicToggle = $("#music-toggle");
const prologueMusic = $("#prologue-music");

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function birthdayForYear(year) {
  return new Date(year, siteConfig.birthday.month - 1, siteConfig.birthday.day);
}

function endOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function nextBirthday(now = new Date()) {
  const current = birthdayForYear(now.getFullYear());
  return siteConfig.birthday.openEveryYear && now > endOfDay(current)
    ? birthdayForYear(now.getFullYear() + 1)
    : current;
}

function isBirthday(now = new Date()) {
  return now.getMonth() + 1 === siteConfig.birthday.month && now.getDate() === siteConfig.birthday.day;
}

function pad(number) {
  return String(number).padStart(2, "0");
}

function renderCountdown() {
  const target = nextBirthday();
  const distance = Math.max(target - new Date(), 0);
  setText("#days", pad(Math.floor(distance / 86400000)));
  setText("#hours", pad(Math.floor((distance % 86400000) / 3600000)));
  setText("#minutes", pad(Math.floor((distance % 3600000) / 60000)));
  setText("#seconds", pad(Math.floor((distance % 60000) / 1000)));
  setText("#unlock-date", `Opens ${target.toLocaleDateString(undefined, { month: "long", day: "numeric" })}.`);
}

function shouldShowGate() {
  const preview = new URLSearchParams(location.search).get("preview") === "birthday";
  return siteConfig.birthday.lockUntilBirthday && !preview && !isBirthday();
}

function configurePage() {
  document.title = siteConfig.pageTitle;
  setText("#hero-eyebrow", siteConfig.hero.eyebrow);
  setText("#hero-title", siteConfig.hero.title.replace("My Love", siteConfig.herName));
  setText("#hero-message", siteConfig.hero.message);
  setText("#hero-photo-note", siteConfig.hero.photoNote);
  setText("#gift-prompt", siteConfig.giftTease.prompt);
  setText("#letter-heading", siteConfig.letter.heading);
  setText("#letter-signoff", siteConfig.letter.signoff);
  setText("#letter-from", `— ${siteConfig.yourName}`);
  setText("#wish-title", siteConfig.birthdayWish.title);
  setText("#wish-text", siteConfig.birthdayWish.text);
  setText("#finale-prelude", siteConfig.finale.prelude);
  setText("#finale-title", siteConfig.finale.title);
  setText("#finale-line", siteConfig.finale.line);
  setText("#finale-closing", siteConfig.finale.closing);
  setText("#finale-words", siteConfig.finale.finalWords);

  $("#letter-body").innerHTML = siteConfig.letter.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");

  const heroImage = $("#hero-image");
  heroImage.alt = siteConfig.hero.photoAlt;
  prepareImage(heroImage, siteConfig.hero.photo, $("#hero-portrait"), `Add her hero portrait\n${siteConfig.hero.photo}`);

  renderPrologue();
  renderMemories();
  renderReasons();
  renderTimeline();
  renderFinaleMosaic();
  configureMusic();
}

function escapeHtml(value) {
  const span = document.createElement("span");
  span.textContent = value;
  return span.innerHTML;
}

function prepareImage(image, src, shell, placeholderText) {
  shell?.classList.remove("is-placeholder");
  if (shell) shell.dataset.placeholder = placeholderText;
  image.onerror = () => {
    shell?.classList.add("is-placeholder");
    image.onerror = null;
  };
  image.src = src;
}

function renderPrologue() {
  const scene = siteConfig.prologue[state.prologueIndex];
  setText("#prologue-kicker", scene.kicker);
  setText("#prologue-line", scene.line);
  setText("#prologue-note", scene.note);

  const next = $("#prologue-next");
  next.innerHTML = state.prologueIndex === siteConfig.prologue.length - 1
    ? "Open my surprise <span>♡</span>"
    : state.prologueIndex === 0
      ? "Are you ready? <span>→</span>"
      : "Keep going <span>→</span>";

  $("#prologue-dots").innerHTML = siteConfig.prologue
    .map((_, index) => `<span class="${index === state.prologueIndex ? "is-active" : ""}" aria-label="Scene ${index + 1} of ${siteConfig.prologue.length}"></span>`)
    .join("");
}

function advancePrologue() {
  if (state.prologueIndex === siteConfig.prologue.length - 1) {
    enterExperience();
    return;
  }

  state.prologueIndex += 1;
  const content = $(".prologue-content");
  content.classList.remove("prologue-copy-change");
  void content.offsetWidth;
  renderPrologue();
  content.classList.add("prologue-copy-change");
}

function enterExperience() {
  if (state.experienceStarted) return;
  state.experienceStarted = true;
  prologue.classList.add("is-leaving");
  window.setTimeout(() => {
    prologue.classList.add("is-hidden");
    experience.classList.remove("is-hidden");
    experience.setAttribute("aria-hidden", "false");
    window.scrollTo({ top: 0, behavior: "instant" });
    initializeReveals();
    queueEndingReveal();
    burstParticles(reduceMotion ? 0 : 38);
  }, reduceMotion ? 0 : 760);
}

function renderMemories() {
  const reel = $("#memory-reel");
  reel.innerHTML = "";
  siteConfig.memories.forEach((memory, index) => {
    const card = document.createElement("figure");
    card.className = "memory-card reveal";
    card.innerHTML = `
      <div class="memory-photo"><img loading="lazy" alt="${escapeHtml(memory.alt)}"></div>
      <figcaption>
        <h3>${escapeHtml(memory.caption)}</h3>
        <button class="memory-open" type="button" data-memory="${index}">Read the little note →</button>
      </figcaption>`;

    const image = $("img", card);
    image.onerror = () => {
      image.remove();
      $(".memory-photo", card).insertAdjacentHTML("beforeend", `<div class="memory-placeholder">Add this memory<br>${escapeHtml(memory.src)}</div>`);
    };
    image.src = memory.src;
    reel.append(card);
  });
}

function renderReasons() {
  const grid = $("#reasons-grid");
  grid.innerHTML = siteConfig.loveReasons.map((reason, index) => `
    <button class="reason-card reveal" type="button" data-reason="${index}" aria-pressed="false">
      <span class="reason-symbol">${escapeHtml(reason.symbol)}</span>
      <h3>${escapeHtml(reason.title)}</h3>
      <p>${escapeHtml(reason.message)}</p>
    </button>`).join("");
}

function renderTimeline() {
  const list = $("#timeline-list");
  list.innerHTML = "";
  siteConfig.timeline.forEach((item) => {
    const article = document.createElement("article");
    article.className = "timeline-item reveal";
    article.innerHTML = `
      <div class="timeline-photo" data-placeholder="Add timeline photo · ${escapeHtml(item.photo)}"><img loading="lazy" src="${escapeHtml(item.photo)}" alt="${escapeHtml(item.title)}"></div>
      <div class="timeline-copy">
        <p class="eyebrow">${escapeHtml(item.date)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
      </div>`;
    const photo = $(".timeline-photo", article);
    const image = $("img", article);
    image.onerror = () => {
      photo.classList.add("is-placeholder");
      image.remove();
    };
    list.append(article);
  });
}

function renderFinaleMosaic() {
  const mosaic = $("#finale-mosaic");
  mosaic.innerHTML = "";
  siteConfig.finale.photos.forEach((src) => {
    const frame = document.createElement("div");
    frame.className = "finale-photo";
    const image = document.createElement("img");
    image.alt = "";
    image.onerror = () => {
      frame.classList.add("is-placeholder");
      image.remove();
    };
    image.src = src;
    frame.append(image);
    mosaic.append(frame);
  });
}

function initializeReveals() {
  const reveals = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.13, rootMargin: "0px 0px -7%" });
  reveals.forEach((element) => observer.observe(element));
}

function queueEndingReveal() {
  if (state.endingQueued) return;
  state.endingQueued = true;
  const ending = $("#ending");
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    window.setTimeout(() => {
      $("#ending-first").classList.add("is-hidden");
      $("#ending-second").setAttribute("aria-hidden", "false");
      $("#ending-second").classList.add("is-visible");
    }, reduceMotion ? 0 : 900);
    window.setTimeout(() => $("#finale-button").classList.remove("is-hidden"), reduceMotion ? 50 : 1950);
  }, { threshold: 0.01, rootMargin: "0px 0px 12%" });
  observer.observe(ending);
}

function openMemory(index) {
  const memory = siteConfig.memories[index];
  const dialog = $("#memory-dialog");
  const shell = $(".dialog-photo", dialog);
  const image = $("#dialog-image");
  shell.classList.remove("is-placeholder");
  shell.dataset.placeholder = `Add this memory\n${memory.src}`;
  image.alt = memory.alt;
  prepareImage(image, memory.src, shell, shell.dataset.placeholder);
  setText("#dialog-date", memory.date);
  setText("#dialog-title", memory.caption);
  setText("#dialog-story", memory.story);
  dialog.showModal();
  document.body.classList.add("modal-open");
}

function closeMemory() {
  $("#memory-dialog").close();
  document.body.classList.remove("modal-open");
}

function markDiscovery(key) {
  state.discoveries.add(key);
  const count = state.discoveries.size;
  setText("#discovery-count", `${count} little ${count === 1 ? "secret" : "secrets"} found`);
}

function revealReason(button) {
  const index = Number(button.dataset.reason);
  const willOpen = !button.classList.contains("is-open");
  button.classList.toggle("is-open", willOpen);
  button.setAttribute("aria-pressed", String(willOpen));
  if (willOpen) {
    markDiscovery(`reason-${index}`);
    button.animate?.([
      { transform: "scale(.98)" },
      { transform: "scale(1.015)" },
      { transform: "scale(1)" }
    ], { duration: 500, easing: "cubic-bezier(.22,1,.36,1)" });
  }
}

function revealSecret(button) {
  const index = Number(button.dataset.secret);
  button.classList.add("is-found");
  markDiscovery(`secret-${index}`);
  showToast(siteConfig.hiddenNotes[index]);
}

function showToast(message, label = "You found a hidden note") {
  const toast = $("#secret-toast");
  $("small", toast).textContent = label;
  setText("#secret-toast-text", message);
  toast.setAttribute("aria-hidden", "false");
  toast.classList.add("is-visible");
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.setAttribute("aria-hidden", "true");
  }, 5200);
}

function configureMusic() {
  if (!siteConfig.music.src) {
    prologueMusic.classList.add("is-hidden");
    musicToggle.classList.add("is-hidden");
    return;
  }
  audio.src = siteConfig.music.src;
  prologueMusic.classList.remove("is-hidden");
  musicToggle.classList.remove("is-hidden");
}

async function toggleMusic() {
  if (!siteConfig.music.src) return;
  if (audio.paused) {
    try {
      await audio.play();
      musicToggle.setAttribute("aria-pressed", "true");
      musicToggle.setAttribute("aria-label", `Pause ${siteConfig.music.title}`);
      prologueMusic.innerHTML = `Playing ${escapeHtml(siteConfig.music.title)} <span aria-hidden="true">♫</span>`;
    } catch {
      showToast("Tap once more to let our song begin.", "A little music note");
    }
  } else {
    audio.pause();
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.setAttribute("aria-label", `Play ${siteConfig.music.title}`);
    prologueMusic.innerHTML = `Play ${escapeHtml(siteConfig.music.title)} <span aria-hidden="true">♫</span>`;
  }
}

function answerLoveQuestion(event) {
  if (!(event.target instanceof HTMLButtonElement)) return;
  setText("#love-answer", "Wrong. More than that. Always more than that. ❤️");
  $$("button", $("#love-options")).forEach((button) => button.disabled = true);
}

function dodgeGiftButton(event) {
  if (event.pointerType === "touch" || !window.matchMedia("(pointer: fine)").matches || state.giftDodges >= 2) return;
  state.giftDodges += 1;
  const x = state.giftDodges % 2 ? 82 : -76;
  const y = state.giftDodges % 2 ? -12 : 13;
  event.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
  setText("#gift-answer", state.giftDodges === 1 ? "Oh… you thought it would be that easy?" : "Okay, okay—one more try. 😌");
}

function revealGift(event) {
  event.currentTarget.style.transform = "none";
  setText("#gift-answer", siteConfig.giftTease.reveal);
  burstParticles(reduceMotion ? 0 : 18);
}

function toggleLetter() {
  const wrap = $("#envelope");
  const letter = $("#love-letter");
  const trigger = $("#open-letter");
  const open = !wrap.classList.contains("is-open");
  wrap.classList.toggle("is-open", open);
  letter.classList.toggle("is-open", open);
  trigger.setAttribute("aria-expanded", String(open));
  letter.setAttribute("aria-hidden", String(!open));
  setText(".envelope-instruction", open ? "A letter meant only for you" : "Tap the seal to open my letter");
  if (open && !reduceMotion) window.setTimeout(() => letter.scrollIntoView({ behavior: "smooth", block: "center" }), 800);
}

function openFinale() {
  const finale = $("#finale");
  finale.classList.remove("is-hidden");
  finale.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => finale.classList.add("is-active"));
  burstParticles(reduceMotion ? 0 : window.innerWidth < 640 ? 58 : 95, true);
  $("#finale-close").focus({ preventScroll: true });
}

function closeFinale() {
  const finale = $("#finale");
  finale.classList.remove("is-active");
  window.setTimeout(() => {
    finale.classList.add("is-hidden");
    finale.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    $("#birthday-wish").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }, reduceMotion ? 0 : 700);
}

function burstParticles(count, finale = false) {
  if (!count || reduceMotion) return;
  const layer = $("#particle-layer");
  const symbols = finale ? ["♡", "♡", "✦", "❀", "·"] : ["♡", "✦", "·"];
  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.fontSize = `${10 + Math.random() * 20}px`;
    particle.style.opacity = String(.35 + Math.random() * .6);
    particle.style.setProperty("--duration", `${4.5 + Math.random() * 5}s`);
    particle.style.setProperty("--drift", `${-100 + Math.random() * 200}px`);
    particle.style.setProperty("--spin", `${-240 + Math.random() * 480}deg`);
    particle.style.animationDelay = `${Math.random() * 2.8}s`;
    if (index % 3 === 0) particle.style.color = "var(--gold-pale)";
    layer.append(particle);
    window.setTimeout(() => particle.remove(), 12500);
  }
}

function bindEvents() {
  $("#prologue-next").addEventListener("click", advancePrologue);
  prologueMusic.addEventListener("click", toggleMusic);
  musicToggle.addEventListener("click", toggleMusic);
  $("#memory-reel").addEventListener("click", (event) => {
    const button = event.target.closest("[data-memory]");
    if (button) openMemory(Number(button.dataset.memory));
  });
  $("#memory-dialog-close").addEventListener("click", closeMemory);
  $("#memory-dialog").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeMemory();
  });
  $("#memory-dialog").addEventListener("close", () => document.body.classList.remove("modal-open"));
  $("#reasons-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-reason]");
    if (button) revealReason(button);
  });
  $$(".secret-heart").forEach((button) => button.addEventListener("click", () => revealSecret(button)));
  $("#love-options").addEventListener("click", answerLoveQuestion);
  $("#gift-button").addEventListener("pointerenter", dodgeGiftButton);
  $("#gift-button").addEventListener("click", revealGift);
  $("#open-letter").addEventListener("click", toggleLetter);
  $("#finale-button").addEventListener("click", openFinale);
  $("#finale-close").addEventListener("click", closeFinale);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && $("#finale").classList.contains("is-active")) closeFinale();
  });
}

function boot() {
  configurePage();
  bindEvents();
  const showGate = shouldShowGate();
  document.body.classList.toggle("gate-active", showGate);
  if (showGate) {
    lockedView.classList.remove("is-hidden");
    renderCountdown();
    window.setInterval(renderCountdown, 1000);
  } else {
    prologue.classList.remove("is-hidden");
  }
}

boot();
