const STORAGE_KEY = "readingQuest_general_v1";
const APP_VERSION = "general-mvp-0.3";

const LEVELS = [
  { level: 1, xp: 0, title: "Wood Pickaxe" },
  { level: 2, xp: 500, title: "Stone Miner" },
  { level: 3, xp: 1500, title: "Iron Crafter" },
  { level: 4, xp: 3000, title: "Gold Explorer" },
  { level: 5, xp: 5000, title: "Redstone Reader" },
  { level: 6, xp: 8000, title: "Emerald Hunter" },
  { level: 7, xp: 12000, title: "Diamond Digger" },
  { level: 8, xp: 17000, title: "Netherite Knight" },
  { level: 9, xp: 24000, title: "Ender Master" },
  { level: 10, xp: 32000, title: "Dragon Slayer" },
];

const XP_RULES = {
  baseLog: 100,
  speechComment: 150,
  newBook: 100,
  finishedBook: 500,
};

const DEFAULT_GOAL_POINTS = 15000;
const DEFAULT_GOAL_NAME = "Reward";

let audioCtx = null;

function getAudioContext() {
  if (audioCtx) return audioCtx;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  try {
    audioCtx = new Ctx();
  } catch (error) {
    console.warn("AudioContext not available:", error);
    return null;
  }
  return audioCtx;
}

function unlockAudio() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
}

function playTone(frequency, durationMs, options = {}) {
  if (!state.config.soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = options.type || "triangle";
  osc.frequency.value = frequency;

  const now = ctx.currentTime;
  const peak = options.volume != null ? options.volume : 0.18;
  const attack = 0.01;
  const decay = Math.max(durationMs / 1000 - attack, 0.05);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peak, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);

  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + attack + decay + 0.02);
}

function playSequence(notes) {
  if (!state.config.soundEnabled) return;
  let delay = 0;
  notes.forEach((note) => {
    window.setTimeout(() => playTone(note.freq, note.dur, note), delay);
    delay += note.dur;
  });
}

function playXpSound() {
  playSequence([
    { freq: 880, dur: 70, type: "triangle", volume: 0.16 },
    { freq: 1320, dur: 100, type: "triangle", volume: 0.16 },
  ]);
}

function playSaveSound() {
  playTone(1046.5, 220, { type: "sine", volume: 0.16 });
}

function playLevelUpSound() {
  playSequence([
    { freq: 523.25, dur: 90, type: "square", volume: 0.14 },
    { freq: 659.25, dur: 90, type: "square", volume: 0.15 },
    { freq: 783.99, dur: 90, type: "square", volume: 0.16 },
    { freq: 1046.5, dur: 90, type: "square", volume: 0.18 },
    { freq: 1318.5, dur: 90, type: "square", volume: 0.18 },
    { freq: 1568.0, dur: 700, type: "triangle", volume: 0.22 },
  ]);
  window.setTimeout(() => {
    playTone(1046.5, 700, { type: "triangle", volume: 0.13 });
    playTone(1318.5, 700, { type: "sine", volume: 0.1 });
  }, 450);
}

const state = loadState();
let currentScreen = state.config?.initialSetupDone ? "home" : "setup";
let currentRecognition = null;
let currentCommentMode = "typed";

const els = {
  setupScreen: document.getElementById("setup-screen"),
  homeScreen: document.getElementById("home-screen"),
  logScreen: document.getElementById("log-screen"),
  resultScreen: document.getElementById("result-screen"),
  setupName: document.getElementById("setup-name"),
  setupReward: document.getElementById("setup-reward"),
  setupGoal: document.getElementById("setup-goal"),
  setupLanguage: document.getElementById("setup-language"),
  setupTheme: document.getElementById("setup-theme"),
  setupSound: document.getElementById("setup-sound"),
  setupSave: document.getElementById("setup-save"),
  setupReset: document.getElementById("setup-reset"),
  savedStatus: document.getElementById("saved-status"),
  parentSettingsButton: document.getElementById("parent-settings-button"),
  playerName: document.getElementById("player-name"),
  playerTitle: document.getElementById("player-title"),
  totalXp: document.getElementById("total-xp"),
  booksCount: document.getElementById("books-count"),
  streakCount: document.getElementById("streak-count"),
  levelProgressText: document.getElementById("level-progress-text"),
  levelProgressFill: document.getElementById("level-progress-fill"),
  rewardLabel: document.getElementById("reward-label"),
  rewardProgressText: document.getElementById("reward-progress-text"),
  rewardProgressFill: document.getElementById("reward-progress-fill"),
  logReadButton: document.getElementById("log-read-button"),
  bookshelfButton: document.getElementById("bookshelf-button"),
  statsButton: document.getElementById("stats-button"),
  bookTitle: document.getElementById("book-title"),
  bookMic: document.getElementById("book-mic"),
  lastBookButton: document.getElementById("last-book-button"),
  recentBooks: document.getElementById("recent-books"),
  enjoymentButtons: Array.from(document.querySelectorAll(".emoji-button")),
  commentMic: document.getElementById("comment-mic"),
  commentText: document.getElementById("comment-text"),
  finishedBook: document.getElementById("finished-book"),
  saveLogButton: document.getElementById("save-log-button"),
  resultXp: document.getElementById("result-xp"),
  resultTotal: document.getElementById("result-total"),
  resultLevel: document.getElementById("result-level"),
  resultNext: document.getElementById("result-next"),
  resultSavedStatus: document.getElementById("result-saved-status"),
  resultHomeButton: document.getElementById("result-home-button"),
  resultLevelup: document.getElementById("result-levelup"),
  resultLevelupTitle: document.getElementById("result-levelup-title"),
  bookshelfScreen: document.getElementById("bookshelf-screen"),
  bookshelfBack: document.getElementById("bookshelf-back"),
  bookshelfSummary: document.getElementById("bookshelf-summary"),
  bookshelfList: document.getElementById("bookshelf-list"),
  statsScreen: document.getElementById("stats-screen"),
  statsBack: document.getElementById("stats-back"),
  statsTotalXp: document.getElementById("stats-total-xp"),
  statsLevel: document.getElementById("stats-level"),
  statsBooks: document.getElementById("stats-books"),
  statsFinished: document.getElementById("stats-finished"),
  statsLogs: document.getElementById("stats-logs"),
  statsStreak: document.getElementById("stats-streak"),
  statsBestStreak: document.getElementById("stats-best-streak"),
  statsChart: document.getElementById("stats-chart"),
  statsRecentLogs: document.getElementById("stats-recent-logs"),
  homeButtons: Array.from(document.querySelectorAll("[data-home]")),
  recentBookTemplate: document.getElementById("recent-book-template"),
};

const draft = {
  enjoyment: 0,
};

init();

function init() {
  bindEvents();
  fillSetupFields();
  renderAll();
}

function bindEvents() {
  const unlockOnce = () => {
    unlockAudio();
    document.removeEventListener("click", unlockOnce);
    document.removeEventListener("touchstart", unlockOnce);
    document.removeEventListener("keydown", unlockOnce);
  };
  document.addEventListener("click", unlockOnce);
  document.addEventListener("touchstart", unlockOnce);
  document.addEventListener("keydown", unlockOnce);

  els.setupSave.addEventListener("click", saveSetup);
  if (els.setupReset) {
    els.setupReset.addEventListener("click", resetAllData);
  }
  els.parentSettingsButton.addEventListener("click", () => showScreen("setup"));
  els.logReadButton.addEventListener("click", () => {
    resetDraft();
    renderLogScreen();
    showScreen("log");
  });
  els.bookshelfButton.addEventListener("click", () => showScreen("bookshelf"));
  els.statsButton.addEventListener("click", () => showScreen("stats"));
  els.bookshelfBack.addEventListener("click", () => showScreen("home"));
  els.statsBack.addEventListener("click", () => showScreen("home"));
  els.bookMic.addEventListener("click", () => startSpeech("book"));
  els.commentMic.addEventListener("click", () => startSpeech("comment"));
  els.lastBookButton.addEventListener("click", useLastBook);
  els.saveLogButton.addEventListener("click", saveLog);
  els.resultHomeButton.addEventListener("click", () => showScreen("home"));

  els.homeButtons.forEach((button) => {
    button.addEventListener("click", () => showScreen("home"));
  });

  els.enjoymentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      draft.enjoyment = Number(button.dataset.enjoyment);
      renderEnjoyment();
    });
  });
}

function defaultState() {
  return {
    appVersion: APP_VERSION,
    player: {
      name: "Player",
      totalXp: 0,
      level: 1,
      title: "Wood Pickaxe",
      bestStreak: 0,
      currentStreak: 0,
      lastLogDate: "",
    },
    logs: [],
    books: [],
    config: {
      initialSetupDone: false,
      goalName: DEFAULT_GOAL_NAME,
      goalPoints: DEFAULT_GOAL_POINTS,
      speechLang: "en-AU",
      theme: "minecraft",
      soundEnabled: true,
      xpRules: { ...XP_RULES },
    },
  };
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState();

  try {
    const parsed = JSON.parse(raw);
    const base = defaultState();
    return {
      ...base,
      ...parsed,
      config: { ...base.config, ...(parsed.config || {}) },
      player: { ...base.player, ...(parsed.player || {}) },
    };
  } catch (error) {
    console.error("Failed to parse localStorage:", error);
    return defaultState();
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (els.savedStatus) {
    els.savedStatus.textContent = "Saved on this device";
  }
  if (els.resultSavedStatus) {
    els.resultSavedStatus.textContent = "Saved on this device";
  }
}

function saveSetup() {
  state.player.name = (els.setupName.value || "Player").trim();
  state.config.goalName = (els.setupReward.value || DEFAULT_GOAL_NAME).trim();
  state.config.goalPoints =
    Number(els.setupGoal.value || 0) || DEFAULT_GOAL_POINTS;
  state.config.speechLang = els.setupLanguage.value;
  state.config.theme = els.setupTheme.value;
  state.config.soundEnabled = els.setupSound ? els.setupSound.checked : true;
  state.config.initialSetupDone = true;

  updatePlayerLevel();
  persistState();
  renderAll();
  showScreen("home");
  playSaveSound();
}

function fillSetupFields() {
  els.setupName.value = state.player.name || "";
  els.setupReward.value = state.config.goalName || "";
  els.setupGoal.value = state.config.goalPoints || DEFAULT_GOAL_POINTS;
  els.setupLanguage.value = state.config.speechLang || "en-AU";
  els.setupTheme.value = state.config.theme || "minecraft";
  if (els.setupSound) {
    els.setupSound.checked = state.config.soundEnabled !== false;
  }
}

function resetAllData() {
  const confirmed = window.confirm(
    "Reset all data?\n\n" +
      "This will delete the player, all logs, books, and XP on this device.\n" +
      "This cannot be undone."
  );
  if (!confirmed) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
  window.location.reload();
}

function showScreen(name) {
  currentScreen = name;

  const map = {
    setup: els.setupScreen,
    home: els.homeScreen,
    log: els.logScreen,
    result: els.resultScreen,
    bookshelf: els.bookshelfScreen,
    stats: els.statsScreen,
  };

  Object.values(map).forEach((screen) => screen.classList.add("hidden"));
  map[name].classList.remove("hidden");
  window.scrollTo(0, 0);

  if (name === "home") renderHomeScreen();
  if (name === "log") renderLogScreen();
  if (name === "result") renderResultScreen();
  if (name === "setup") fillSetupFields();
  if (name === "bookshelf") renderBookshelfScreen();
  if (name === "stats") renderStatsScreen();
}

function renderAll() {
  renderHomeScreen();
  renderLogScreen();
  renderResultScreen();
  showScreen(currentScreen);
}

function renderHomeScreen() {
  updatePlayerLevel();
  els.playerName.textContent = state.player.name || "Player";
  els.playerTitle.textContent = state.player.title;
  els.totalXp.textContent = formatNumber(state.player.totalXp);
  els.booksCount.textContent = formatNumber(state.books.length);
  els.streakCount.textContent = formatNumber(state.player.currentStreak);
  els.rewardLabel.textContent = `${state.config.goalName} progress`;

  const levelInfo = getCurrentLevelInfo();
  const nextLevel = getNextLevelInfo();
  const progressIntoLevel = state.player.totalXp - levelInfo.xp;
  const progressNeeded = nextLevel ? nextLevel.xp - levelInfo.xp : 1;
  const progressPercent = nextLevel
    ? Math.min(100, (progressIntoLevel / progressNeeded) * 100)
    : 100;

  els.levelProgressText.textContent = nextLevel
    ? `${formatNumber(progressIntoLevel)} / ${formatNumber(progressNeeded)}`
    : "MAX";
  els.levelProgressFill.style.width = `${progressPercent}%`;

  const rewardPercent = Math.min(
    100,
    (state.player.totalXp / state.config.goalPoints) * 100
  );
  els.rewardProgressText.textContent = `${formatNumber(
    state.player.totalXp
  )} / ${formatNumber(state.config.goalPoints)}`;
  els.rewardProgressFill.style.width = `${rewardPercent}%`;
}

function renderLogScreen() {
  renderEnjoyment();
  renderRecentBooks();
  const lastBook = state.books[state.books.length - 1]?.title || "";
  els.lastBookButton.disabled = !lastBook;
  els.lastBookButton.textContent = lastBook ? `Last Book: ${lastBook}` : "Last Book";
}

function renderResultScreen(lastXp = 0, leveledUpTo = null) {
  const nextLevel = getNextLevelInfo();
  els.resultXp.textContent = `+${formatNumber(lastXp)} XP`;
  els.resultTotal.textContent = `Total XP: ${formatNumber(state.player.totalXp)}`;
  els.resultLevel.textContent = `Level ${state.player.level} - ${state.player.title}`;
  els.resultNext.textContent = nextLevel
    ? `Next level: ${formatNumber(nextLevel.xp)} XP`
    : "Top level reached";

  if (leveledUpTo) {
    els.resultLevelup.classList.remove("hidden");
    els.resultLevelupTitle.textContent = `Level ${leveledUpTo.level} - ${leveledUpTo.title}`;
  } else {
    els.resultLevelup.classList.add("hidden");
  }
}

function renderEnjoyment() {
  els.enjoymentButtons.forEach((button) => {
    button.classList.toggle(
      "selected",
      Number(button.dataset.enjoyment) === draft.enjoyment
    );
  });
}

function getBookshelfData() {
  return state.books
    .map((book) => {
      const bookLogs = state.logs.filter(
        (log) => log.bookTitle === book.title
      );
      return {
        ...book,
        sessions: bookLogs.length,
        totalXp: bookLogs.reduce((sum, log) => sum + (log.xpEarned || 0), 0),
      };
    })
    .sort((a, b) => (b.lastReadDate || "").localeCompare(a.lastReadDate || ""));
}

function getLast7DaysXp() {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const xp = state.logs
      .filter((log) => log.date === iso)
      .reduce((sum, log) => sum + (log.xpEarned || 0), 0);
    days.push({
      iso,
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      xp,
    });
  }
  return days;
}

function renderBookshelfScreen() {
  const books = getBookshelfData();
  const finishedCount = books.filter((b) => b.finished).length;
  els.bookshelfSummary.textContent = books.length
    ? `${formatNumber(books.length)} book${
        books.length === 1 ? "" : "s"
      } · ${formatNumber(finishedCount)} finished`
    : "No books yet. Start with Log Today's Read.";

  els.bookshelfList.innerHTML = "";
  books.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";
    if (book.finished) card.classList.add("book-card-finished");

    const main = document.createElement("div");
    main.className = "book-card-main";

    const title = document.createElement("h3");
    title.className = "book-card-title";
    title.textContent = book.title;
    main.appendChild(title);

    const meta = document.createElement("p");
    meta.className = "book-card-meta";
    meta.textContent = `${formatNumber(book.sessions)} session${
      book.sessions === 1 ? "" : "s"
    } · ${formatNumber(book.totalXp)} XP`;
    main.appendChild(meta);

    const dates = document.createElement("p");
    dates.className = "book-card-dates";
    if (book.firstReadDate === book.lastReadDate) {
      dates.textContent = `Read on ${book.lastReadDate}`;
    } else {
      dates.textContent = `${book.firstReadDate} → ${book.lastReadDate}`;
    }
    main.appendChild(dates);

    card.appendChild(main);

    if (book.finished) {
      const badge = document.createElement("span");
      badge.className = "book-card-badge";
      badge.textContent = "Finished";
      card.appendChild(badge);
    }

    els.bookshelfList.appendChild(card);
  });
}

function renderStatsScreen() {
  const totalXp = state.player.totalXp || 0;
  const finishedCount = state.books.filter((b) => b.finished).length;

  els.statsTotalXp.textContent = formatNumber(totalXp);
  els.statsLevel.textContent = `${state.player.level} - ${state.player.title}`;
  els.statsBooks.textContent = formatNumber(state.books.length);
  els.statsFinished.textContent = formatNumber(finishedCount);
  els.statsLogs.textContent = formatNumber(state.logs.length);
  els.statsStreak.textContent = formatNumber(state.player.currentStreak || 0);
  els.statsBestStreak.textContent = formatNumber(state.player.bestStreak || 0);

  const days = getLast7DaysXp();
  const maxXp = Math.max(1, ...days.map((d) => d.xp));
  els.statsChart.innerHTML = "";
  days.forEach((day) => {
    const col = document.createElement("div");
    col.className = "bar-col";

    const value = document.createElement("span");
    value.className = "bar-value";
    value.textContent = day.xp ? formatNumber(day.xp) : "";
    col.appendChild(value);

    const track = document.createElement("div");
    track.className = "bar-track";
    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.height = day.xp ? `${(day.xp / maxXp) * 100}%` : "0%";
    track.appendChild(fill);
    col.appendChild(track);

    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = day.label;
    col.appendChild(label);

    els.statsChart.appendChild(col);
  });

  const recent = [...state.logs]
    .sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""))
    .slice(0, 5);
  els.statsRecentLogs.innerHTML = "";
  if (!recent.length) {
    const empty = document.createElement("li");
    empty.className = "recent-log-empty muted";
    empty.textContent = "No logs yet.";
    els.statsRecentLogs.appendChild(empty);
  } else {
    recent.forEach((log) => {
      const li = document.createElement("li");
      li.className = "recent-log";
      const left = document.createElement("div");
      left.className = "recent-log-left";
      const title = document.createElement("strong");
      title.textContent = log.bookTitle || "(untitled)";
      const meta = document.createElement("span");
      meta.className = "recent-log-meta";
      meta.textContent = log.date + (log.finishedBook ? " · Finished" : "");
      left.appendChild(title);
      left.appendChild(meta);

      const right = document.createElement("span");
      right.className = "recent-log-xp";
      right.textContent = `+${formatNumber(log.xpEarned || 0)} XP`;

      li.appendChild(left);
      li.appendChild(right);
      els.statsRecentLogs.appendChild(li);
    });
  }
}

function renderRecentBooks() {
  const titles = [...new Set(state.logs.map((log) => log.bookTitle).filter(Boolean))]
    .reverse()
    .slice(0, 3);

  els.recentBooks.innerHTML = "";
  titles.forEach((title) => {
    const node = els.recentBookTemplate.content.firstElementChild.cloneNode(true);
    node.textContent = title;
    node.addEventListener("click", () => {
      els.bookTitle.value = title;
    });
    els.recentBooks.appendChild(node);
  });
}

function resetDraft() {
  draft.enjoyment = 0;
  currentCommentMode = "typed";
  els.bookTitle.value = "";
  els.commentText.value = "";
  els.finishedBook.checked = false;
}

function useLastBook() {
  const lastBook = state.books[state.books.length - 1]?.title;
  if (lastBook) els.bookTitle.value = lastBook;
}

function startSpeech(target) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    window.alert("Speech recognition is not supported in this browser.");
    return;
  }

  if (currentRecognition) {
    currentRecognition.stop();
  }

  const recognition = new SpeechRecognition();
  recognition.lang = state.config.speechLang || "en-AU";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  currentRecognition = recognition;

  if (target === "comment") {
    els.commentMic.textContent = "Listening...";
  } else {
    els.bookMic.textContent = "Listening...";
  }

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();

    if (target === "book") {
      els.bookTitle.value = transcript;
    } else {
      currentCommentMode = "speech";
      els.commentText.value = els.commentText.value
        ? `${els.commentText.value} ${transcript}`
        : transcript;
    }
  };

  recognition.onend = () => {
    currentRecognition = null;
    els.commentMic.textContent = "Start speaking";
    els.bookMic.textContent = "Mic";
  };

  recognition.start();
}

function saveLog() {
  const bookTitle = els.bookTitle.value.trim();
  const comment = els.commentText.value.trim();
  const finishedBook = els.finishedBook.checked;

  if (!bookTitle) {
    window.alert("Please add a book title.");
    return;
  }

  if (!draft.enjoyment) {
    window.alert("Please choose an enjoyment level.");
    return;
  }

  let xpEarned = state.config.xpRules.baseLog;
  if (comment) xpEarned += state.config.xpRules.speechComment;

  const existingBook = state.books.find((book) => book.title === bookTitle);
  if (!existingBook) xpEarned += state.config.xpRules.newBook;
  if (finishedBook) xpEarned += state.config.xpRules.finishedBook;

  const today = new Date().toISOString().slice(0, 10);
  const log = {
    id: `log_${Date.now()}`,
    date: today,
    bookTitle,
    enjoyment: draft.enjoyment,
    comment,
    commentMode: comment ? currentCommentMode : "none",
    xpEarned,
    finishedBook,
    timestamp: new Date().toISOString(),
  };

  const previousLevel = state.player.level;

  state.logs.push(log);
  updateBooks(bookTitle, today, finishedBook);
  updateStreak(today);
  state.player.totalXp += xpEarned;
  updatePlayerLevel();

  const leveledUpTo =
    state.player.level > previousLevel ? getCurrentLevelInfo() : null;
  const dwellTime = leveledUpTo ? 5000 : 2500;

  persistState();
  renderHomeScreen();
  renderLogScreen();
  showScreen("result");
  renderResultScreen(xpEarned, leveledUpTo);

  if (leveledUpTo) {
    playLevelUpSound();
  } else {
    playXpSound();
  }

  window.setTimeout(() => {
    if (currentScreen === "result") showScreen("home");
  }, dwellTime);
}

function updateBooks(bookTitle, today, finishedBook) {
  const book = state.books.find((item) => item.title === bookTitle);

  if (!book) {
    state.books.push({
      title: bookTitle,
      status: finishedBook ? "finished" : "reading",
      startDate: today,
      endDate: finishedBook ? today : "",
      logCount: 1,
    });
    return;
  }

  book.logCount += 1;
  if (finishedBook) {
    book.status = "finished";
    book.endDate = today;
  }
}

function updateStreak(today) {
  if (state.player.lastLogDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayText = yesterday.toISOString().slice(0, 10);

  if (!state.player.lastLogDate) {
    state.player.currentStreak = 1;
  } else if (state.player.lastLogDate === yesterdayText) {
    state.player.currentStreak += 1;
  } else {
    state.player.currentStreak = 1;
  }

  state.player.bestStreak = Math.max(
    state.player.bestStreak,
    state.player.currentStreak
  );
  state.player.lastLogDate = today;
}

function updatePlayerLevel() {
  const current = getCurrentLevelInfo();
  state.player.level = current.level;
  state.player.title = current.title;
}

function getCurrentLevelInfo() {
  return LEVELS.reduce((acc, level) => {
    if (state.player.totalXp >= level.xp) return level;
    return acc;
  }, LEVELS[0]);
}

function getNextLevelInfo() {
  return LEVELS.find((level) => level.xp > state.player.totalXp) || null;
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(value);
}
