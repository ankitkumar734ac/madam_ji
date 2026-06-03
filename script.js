const siteConfig = {
  herName: "My Future Wife",
  // Change this placeholder to her real birthday.
  birthdayMonth: 8,
  birthdayDay: 20,
  openEveryYear: true,
  photos: [
    { src: "assets/photos/photo-1.jpg", caption: "Your smile belongs here" },
    { src: "assets/photos/photo-2.jpg", caption: "Our favorite memory" },
    { src: "assets/photos/photo-3.jpg", caption: "A moment I love" },
    { src: "assets/photos/photo-4.jpg", caption: "The future Mrs." }
  ]
};

const lockedView = document.querySelector("#locked-view");
const birthdayView = document.querySelector("#birthday-view");
const unlockDate = document.querySelector("#unlock-date");
const heroName = document.querySelector("#hero-name");
const photoGrid = document.querySelector("#photo-grid");
const startSurprise = document.querySelector("#start-surprise");
const surpriseMessage = document.querySelector("#surprise-message");
const previewMode = new URLSearchParams(window.location.search).get("preview");

function birthdayForYear(year) {
  return new Date(year, siteConfig.birthdayMonth - 1, siteConfig.birthdayDay);
}

function getNextBirthday(now) {
  const thisYear = birthdayForYear(now.getFullYear());
  if (siteConfig.openEveryYear && now > endOfBirthday(thisYear)) {
    return birthdayForYear(now.getFullYear() + 1);
  }
  return thisYear;
}

function endOfBirthday(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function isBirthday(now) {
  return now.getMonth() + 1 === siteConfig.birthdayMonth && now.getDate() === siteConfig.birthdayDay;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function renderCountdown() {
  const now = new Date();
  const target = getNextBirthday(now);
  const distance = Math.max(target - now, 0);
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);

  document.querySelector("#days").textContent = pad(days);
  document.querySelector("#hours").textContent = pad(hours);
  document.querySelector("#minutes").textContent = pad(minutes);
  document.querySelector("#seconds").textContent = pad(seconds);

  unlockDate.textContent = `Opens on ${target.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric"
  })}.`;
}

function showBirthday() {
  lockedView.classList.add("hidden");
  birthdayView.classList.remove("hidden");
  heroName.textContent = siteConfig.herName;
  renderPhotos();
}

function showLocked() {
  birthdayView.classList.add("hidden");
  lockedView.classList.remove("hidden");
  renderCountdown();
  window.setInterval(renderCountdown, 1000);
}

function renderPhotos() {
  photoGrid.innerHTML = "";
  siteConfig.photos.forEach((photo) => {
    const card = document.createElement("article");
    card.className = "photo-card";

    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.caption;
    image.onerror = () => {
      card.innerHTML = `<div class="photo-placeholder">${photo.caption}<br>Replace with ${photo.src}</div>`;
    };

    card.append(image);
    photoGrid.append(card);
  });
}

function celebrate() {
  document.body.animate(
    [
      { filter: "brightness(1)" },
      { filter: "brightness(1.16)" },
      { filter: "brightness(1)" }
    ],
    { duration: 900, easing: "ease-out" }
  );
  document.querySelector(".memory-band").scrollIntoView({ behavior: "smooth" });
}

document.querySelectorAll(".surprise-card").forEach((button) => {
  button.addEventListener("click", () => {
    surpriseMessage.textContent = button.dataset.message;
  });
});

startSurprise.addEventListener("click", celebrate);

if (previewMode === "birthday" || isBirthday(new Date())) {
  showBirthday();
} else {
  showLocked();
}
