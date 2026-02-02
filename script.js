const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const subtitle = document.getElementById("subtitle");
const confetti = document.getElementById("confetti");
const afterYes = document.getElementById("afterYes");
const rizzAudio = document.getElementById("rizzAudio");
const marvinAudio = document.getElementById("marvinAudio");

let noCount = 0;
let lastRizzAt = 0;

function setSubtitle(text) {
  subtitle.textContent = text;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function launchConfetti() {
  // Clear any old confetti
  confetti.innerHTML = "";

  const colors = ["#ff2e88", "#ff5aa7", "#ffffff", "#ff8fc6", "#f01f7a"];
  const pieces = 120;

  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement("i");
    const left = rand(0, 100);
    const delay = Math.random() * 0.25;
    const duration = 1.6 + Math.random() * 1.2;
    const size = 6 + Math.random() * 8;

    piece.style.left = `${left}vw`;
    piece.style.background = colors[rand(0, colors.length - 1)];
    piece.style.width = `${Math.max(6, size * 0.7)}px`;
    piece.style.height = `${size}px`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.animationDelay = `${delay}s`;
    piece.style.transform = `translateY(-20px) rotate(${rand(0, 360)}deg)`;

    confetti.appendChild(piece);
  }

  // Auto-clear after animation ends
  window.setTimeout(() => {
    confetti.innerHTML = "";
  }, 3200);
}

function stopAllAudio() {
  for (const el of [rizzAudio, marvinAudio]) {
    if (!el) continue;
    el.pause();
    el.currentTime = 0;
  }
}

function tryPlay(audioEl, { restart = true } = {}) {
  if (!audioEl) return;
  if (restart) audioEl.currentTime = 0;
  audioEl.play().catch(() => {
    // Playback can be blocked unless the browser counts it as a user gesture.
  });
}

function playRizzThrottled() {
  const now = Date.now();
  if (now - lastRizzAt < 900) return;
  lastRizzAt = now;
  tryPlay(rizzAudio);
}

function dodgeNoButton() {
  // Move the "No" button somewhere inside the card (never outside it).
  const card = document.querySelector(".card");
  if (!card) return;

  const cardRect = card.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const margin = 14;

  const maxLeft = Math.max(margin, cardRect.width - btnRect.width - margin);
  const maxTop = Math.max(margin, cardRect.height - btnRect.height - margin);

  const left = rand(margin, Math.floor(maxLeft));
  const top = rand(margin, Math.floor(maxTop));

  // `.card` is already `position: relative` in CSS, so absolute stays within it.
  noBtn.style.position = "absolute";
  noBtn.style.left = `${left}px`;
  noBtn.style.top = `${top}px`;
  noBtn.style.zIndex = "5";
}

function growYesButton() {
  const scale = 1 + Math.min(0.8, noCount * 0.12);
  yesBtn.style.transform = `scale(${scale})`;
}

noBtn.addEventListener("click", () => {
  noCount += 1;
  setSubtitle(noLines[Math.min(noLines.length - 1, noCount - 1)]);
  dodgeNoButton();
  growYesButton();
});

noBtn.addEventListener("mouseenter", () => {
  playRizzThrottled();
  noCount += 1;
  growYesButton();
  dodgeNoButton();
});

// Mobile-friendly: dodge on touch/press too
noBtn.addEventListener("pointerdown", () => {
  playRizzThrottled();
  dodgeNoButton();
});

yesBtn.addEventListener("click", () => {
  document.body.classList.add("accepted");
  if (afterYes) afterYes.hidden = false;
  setSubtitle("Yay!! I love you. Happy Valentine’s Day Bubby! 💗");
  launchConfetti();
  stopAllAudio();
  tryPlay(marvinAudio);
  yesBtn.disabled = true;
  noBtn.disabled = true;
  yesBtn.textContent = "Yes!! (we locked in twin)";
});
