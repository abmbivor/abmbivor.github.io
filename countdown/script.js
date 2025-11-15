// ELEMENTS
const urlParams = new URLSearchParams(window.location.search);
const targetTimeParam = urlParams.get("t");

const datetimeInput = document.getElementById("datetimeInput");
const startBtn = document.getElementById("startBtn");
const countdownSection = document.getElementById("countdownSection");
const pickerSection = document.getElementById("pickerSection");
const timerEl = document.getElementById("timer");
const targetDateEl = document.getElementById("targetDate");
const shareLinkEl = document.getElementById("shareLink");
const copyBtn = document.getElementById("copyBtn");
const savedList = document.getElementById("savedList");
const themeToggle = document.getElementById("themeToggle");

let countdownInterval = null;

// ---- DARK MODE ----
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// ---- LOAD SAVED COUNTDOWNS ----
loadSavedCountdowns();

// If opening via share link
if (targetTimeParam) {
    startCountdown(targetTimeParam);
}

startBtn.addEventListener("click", () => {
    const selected = datetimeInput.value;
    if (!selected) return alert("Please choose a date/time!");

    const shareURL = `${location.origin}${location.pathname}?t=${encodeURIComponent(selected)}`;
    history.pushState({}, "", shareURL);

    // Save countdown locally
    saveCountdown(selected);

    startCountdown(selected);
});

copyBtn.addEventListener("click", () => {
    shareLinkEl.select();
    document.execCommand("copy");
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = "Copy", 1200);
});

function startCountdown(dateStr) {
    const target = new Date(dateStr);
    if (isNaN(target.getTime())) return alert("Invalid date!");

    pickerSection.classList.add("hidden");
    countdownSection.classList.remove("hidden");

    targetDateEl.textContent = "Countdown to: " + target.toLocaleString();
    shareLinkEl.value = location.href;

    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(() => updateTimer(target), 1000);
    updateTimer(target);
}

function updateTimer(target) {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
        timerEl.textContent = "🎉 Time's Up!";
        clearInterval(countdownInterval);
        return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const mins = Math.floor((diff / 60000) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    timerEl.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
}

// ---- SAVE + LOAD COUNTDOWNS ----
function saveCountdown(timeString) {
    let saved = JSON.parse(localStorage.getItem("countdowns") || "[]");
    if (!saved.includes(timeString)) {
        saved.push(timeString);
        localStorage.setItem("countdowns", JSON.stringify(saved));
    }
    loadSavedCountdowns();
}

function loadSavedCountdowns() {
    const saved = JSON.parse(localStorage.getItem("countdowns") || "[]");
    savedList.innerHTML = "";

    saved.forEach(timeStr => {
        const li = document.createElement("li");
        li.textContent = new Date(timeStr).toLocaleString();
        li.onclick = () => {
            location.href = `?t=${encodeURIComponent(timeStr)}`;
            startCountdown(timeStr);
        };
        savedList.appendChild(li);
    });
}

const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", () => {
    // Remove the ?t=... parameter and return to the main picker UI
    window.location.href = window.location.pathname;
});

