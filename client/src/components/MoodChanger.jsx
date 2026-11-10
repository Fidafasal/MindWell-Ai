import React, { useEffect, useRef, useState } from "react";
import MoodIcon from "./MoodIcons";
import "../styles/mood-changer.css";

const moods = [
  {
    name: "Good",
    description: "Feeling good about how things are going?",
    color: "good",
  },
  { name: "Happy", description: "Feeling joyful or upbeat?", color: "happy" },
  { name: "Calm", description: "Feeling settled and at ease?", color: "calm" },
  {
    name: "Angry",
    description: "Feeling irritated or frustrated?",
    color: "angry",
  },
  { name: "Sad", description: "Having a difficult or low day?", color: "sad" },
  {
    name: "Anxious",
    description: "Feeling worried or overwhelmed?",
    color: "anxious",
  },
  { name: "Tired", description: "Feeling low on energy?", color: "tired" },
  {
    name: "Stressed",
    description: "Too many things happening at once?",
    color: "stressed",
  },
  {
    name: "Bored",
    description: "Looking for something interesting to do?",
    color: "bored",
  },
];

const moodReflectionQuestions = [
  {
    id: "focus",
    question: "What’s taking up the most space in your mind?",
    options: [
      "Work or study",
      "Relationships",
      "Health",
      "Uncertainty",
      "Nothing specific",
    ],
  },
  {
    id: "energy",
    question: "How is your energy right now?",
    options: ["Low", "In between", "High"],
  },
  {
    id: "need",
    question: "What might feel supportive right now?",
    options: [
      "Rest",
      "A little movement",
      "A calming pause",
      "Something fun",
      "I’m not sure",
    ],
  },
];

const activities = [
  {
    id: "xox",
    title: "XOX",
    icon: "⭕",
    duration: "Anytime",
    description: "Take turns placing Xs and Os in a quick little game.",
  },
  {
    id: "doodle",
    title: "Doodle Your Mood",
    icon: "🎨",
    duration: "Anytime",
    description: "Choose colours and draw whatever comes to mind.",
  },
  {
    id: "breathing",
    title: "Breathing Flow",
    icon: "🌬️",
    duration: "2 min",
    description: "Follow a softly animated breathing rhythm.",
  },
  {
    id: "sounds",
    title: "Relaxing Sounds",
    icon: "🌧️",
    duration: "Anytime",
    description:
      "Choose from rain, waves, wind, forest and other calming soundscapes.",
  },
  {
    id: "memory",
    title: "Memory Match",
    icon: "🧠",
    duration: "2–4 min",
    description: "Flip cards and find all six matching pairs.",
  },
  {
    id: "reaction",
    title: "Reaction Game",
    icon: "⚡",
    duration: "1 min",
    description: "Wait for the signal and test your reaction speed.",
  },
  {
    id: "color",
    title: "Color Rush",
    icon: "🌈",
    duration: "30 sec",
    description: "Quickly identify the colour of each word.",
  },
  {
    id: "bubble",
    title: "Bubble Pop",
    icon: "🫧",
    duration: "30 sec",
    description: "Pop as many floating bubbles as you can.",
  },
];

const moodActivityRecommendations = {
  Good: ["xox", "color", "bubble"],
  Happy: ["xox", "memory", "reaction"],
  Calm: ["sounds", "doodle", "breathing"],
  Angry: ["breathing", "doodle", "sounds"],
  Sad: ["sounds", "doodle", "memory"],
  Anxious: ["breathing", "sounds", "doodle"],
  Tired: ["sounds", "breathing"],
  Stressed: ["breathing", "sounds", "doodle"],
  Bored: ["xox", "memory", "color", "bubble", "reaction"],
};

const memorySymbols = ["🌙", "🌿", "⭐", "☁️", "🌻", "🍀"];

const xoxWinningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getXoxWinner(board) {
  for (const [a, b, c] of xoxWinningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return board[a];
  }
  return null;
}

const colorOptions = [
  { name: "Red", value: "#ff647c" },
  { name: "Blue", value: "#5da9ff" },
  { name: "Green", value: "#5bd6a5" },
  { name: "Yellow", value: "#f4c95d" },
  { name: "Purple", value: "#a88bff" },
];

const breathingTechniques = [
  {
    id: "calm",
    name: "Calm & steady",
    description: "A gentle, even breath",
    phases: [
      { name: "inhale", label: "Breathe in", duration: 4 },
      { name: "exhale", label: "Breathe out", duration: 6 },
    ],
  },
  {
    id: "box",
    name: "Box breathing",
    description: "Four even sides",
    phases: [
      { name: "inhale", label: "Breathe in", duration: 4 },
      { name: "hold", label: "Hold gently", duration: 4 },
      { name: "exhale", label: "Breathe out", duration: 4 },
      { name: "hold", label: "Rest gently", duration: 4 },
    ],
  },
  {
    id: "478",
    name: "4–7–8 rhythm",
    description: "A slower, longer exhale",
    phases: [
      { name: "inhale", label: "Breathe in", duration: 4 },
      { name: "hold", label: "Hold gently", duration: 7 },
      { name: "exhale", label: "Breathe out", duration: 8 },
    ],
  },
];

function createMemoryCards() {
  return [...memorySymbols, ...memorySymbols]
    .map((symbol, index) => ({
      id: `${symbol}-${index}`,
      symbol,
      matched: false,
    }))
    .sort(() => Math.random() - 0.5);
}

function makeColorRound() {
  const word = colorOptions[Math.floor(Math.random() * colorOptions.length)];
  let ink = colorOptions[Math.floor(Math.random() * colorOptions.length)];

  while (ink.name === word.name) {
    ink = colorOptions[Math.floor(Math.random() * colorOptions.length)];
  }

  return {
    word: word.name.toUpperCase(),
    inkName: ink.name,
    inkValue: ink.value,
  };
}

function makeBubble(id = Math.random()) {
  return {
    id,
    left: 6 + Math.random() * 82,
    top: 8 + Math.random() * 72,
    size: 34 + Math.random() * 28,
    delay: Math.random() * 1.5,
  };
}

function makeBubbles() {
  return Array.from({ length: 10 }, (_, index) => makeBubble(index + 1));
}

function AfterMoodPicker({ afterMood, setAfterMood, onFinish }) {
  return (
    <div className="mc-after-wrap">
      <div className="mc-after-moods">
        {["Better", "A little better", "The same", "Not sure"].map(
          (feeling) => (
            <button
              type="button"
              key={feeling}
              className={afterMood === feeling ? "selected" : ""}
              onClick={() => setAfterMood(feeling)}
            >
              {feeling}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className="mc-primary-button"
        disabled={!afterMood}
        onClick={onFinish}
      >
        Finish
      </button>
    </div>
  );
}

function MoodChanger() {
  const [selectedMood, setSelectedMood] = useState("");
  const [moodReflection, setMoodReflection] = useState({});
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [xoxBoard, setXoxBoard] = useState(Array(9).fill(null));
  const [completed, setCompleted] = useState(false);
  const [afterMood, setAfterMood] = useState("");

  // Doodle
  const [drawingColor, setDrawingColor] = useState("#42d6bd");
  const [doodleEraser, setDoodleEraser] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [brushType, setBrushType] = useState("pen");
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  // Memory Match
  const [memoryCards, setMemoryCards] = useState(createMemoryCards);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [memoryLocked, setMemoryLocked] = useState(false);
  const memoryTimeoutRef = useRef(null);

  // Breathing
  const [breathingRunning, setBreathingRunning] = useState(false);
  const [breathingElapsed, setBreathingElapsed] = useState(0);
  const [breathingTechnique, setBreathingTechnique] = useState("calm");

  // Sounds
  const [activeSound, setActiveSound] = useState(null);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.35);
  const audioContextRef = useRef(null);
  const soundNodesRef = useRef([]);
  const masterGainRef = useRef(null);
  const birdTimerRef = useRef(null);

  // Mini-games
  const [gameRunning, setGameRunning] = useState(false);
  const [gameSeconds, setGameSeconds] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [gameMessage, setGameMessage] = useState(
    "Press start when you're ready.",
  );
  const [reactionState, setReactionState] = useState("ready");
  const [reactionStart, setReactionStart] = useState(0);
  const [reactionResult, setReactionResult] = useState(null);
  const [colorRound, setColorRound] = useState(makeColorRound);
  const [bubblePositions, setBubblePositions] = useState(makeBubbles);
  const reactionTimeoutRef = useRef(null);

  const memoryWon = memoryCards.every((card) => card.matched);

  // Clear all audio resources safely.
  function clearSoundResources() {
    if (birdTimerRef.current) {
      window.clearInterval(birdTimerRef.current);
      birdTimerRef.current = null;
    }

    soundNodesRef.current.forEach((node) => {
      try {
        if (typeof node.stop === "function") node.stop();
        if (typeof node.disconnect === "function") node.disconnect();
      } catch {
        // Node may already have stopped.
      }
    });

    soundNodesRef.current = [];
    masterGainRef.current = null;

    const context = audioContextRef.current;
    audioContextRef.current = null;

    if (context && context.state !== "closed") {
      context.close().catch(() => {});
    }
  }

  function stopSound() {
    clearSoundResources();
    setSoundPlaying(false);
  }

  // Clean up timers and audio when the component unmounts.
  useEffect(() => {
    return () => {
      clearSoundResources();

      if (memoryTimeoutRef.current) {
        window.clearTimeout(memoryTimeoutRef.current);
      }

      if (reactionTimeoutRef.current) {
        window.clearTimeout(reactionTimeoutRef.current);
      }
    };
  }, []);

  // Breathing timer.
  useEffect(() => {
    if (!breathingRunning) return undefined;

    const timer = window.setInterval(() => {
      setBreathingElapsed((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [breathingRunning]);

  // Mini-game countdown.
  useEffect(() => {
    if (!gameRunning) return undefined;

    const timer = window.setInterval(() => {
      setGameSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gameRunning]);

  // Stop the game when its timer reaches zero.
  useEffect(() => {
    if (!gameRunning || gameSeconds !== 0) return;

    setGameRunning(false);
    setGameMessage("Time is up! Great effort.");

    if (selectedActivity?.id === "reaction") {
      setReactionState("finished");

      if (reactionTimeoutRef.current) {
        window.clearTimeout(reactionTimeoutRef.current);
        reactionTimeoutRef.current = null;
      }
    }
  }, [gameSeconds, gameRunning, selectedActivity]);

  function resetMemory() {
    if (memoryTimeoutRef.current) {
      window.clearTimeout(memoryTimeoutRef.current);
      memoryTimeoutRef.current = null;
    }

    setMemoryCards(createMemoryCards());
    setFlippedCards([]);
    setMoves(0);
    setMemoryLocked(false);
  }

  function resetMiniGame() {
    if (reactionTimeoutRef.current) {
      window.clearTimeout(reactionTimeoutRef.current);
      reactionTimeoutRef.current = null;
    }

    setGameRunning(false);
    setGameSeconds(0);
    setGameScore(0);
    setGameMessage("Press start when you're ready.");
    setReactionState("ready");
    setReactionResult(null);
    setColorRound(makeColorRound());
    setBubblePositions(makeBubbles());
  }

  function openActivity(activity) {
    stopSound();
    setBreathingRunning(false);
    setBreathingElapsed(0);
    setSelectedActivity(activity);
    if (activity.id === "xox") setXoxBoard(Array(9).fill(null));
    setCompleted(false);
    setAfterMood("");
    resetMiniGame();

    if (activity.id === "memory") {
      resetMemory();
    }
  }

  function goBack() {
    stopSound();
    setBreathingRunning(false);
    setBreathingElapsed(0);
    setSelectedActivity(null);
    setCompleted(false);
    setAfterMood("");
    resetMiniGame();

    if (memoryTimeoutRef.current) {
      window.clearTimeout(memoryTimeoutRef.current);
      memoryTimeoutRef.current = null;
    }

    setMemoryLocked(false);
    setFlippedCards([]);
  }

  function resetMoodChanger() {
    goBack();
    setSelectedMood("");
    resetMemory();
  }

  // Browser-generated relaxing sounds.
  async function startSound(soundName) {
    stopSound();

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      setGameMessage("Your browser does not support audio playback.");
      return;
    }

    try {
      const context = new AudioContextClass();
      audioContextRef.current = context;

      if (context.state === "suspended") {
        await context.resume();
      }

      const master = context.createGain();
      master.gain.value = soundVolume;
      master.connect(context.destination);
      masterGainRef.current = master;
      soundNodesRef.current.push(master);

      const bufferSize = context.sampleRate * 3;
      const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
      const channel = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i += 1) {
        channel[i] = Math.random() * 2 - 1;
      }

      const noise = context.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = context.createBiquadFilter();
      const textureGain = context.createGain();

      noise.connect(filter);
      filter.connect(textureGain);
      textureGain.connect(master);

      soundNodesRef.current.push(noise, filter, textureGain);

      if (soundName === "rain") {
        filter.type = "lowpass";
        filter.frequency.value = 5200;
        textureGain.gain.value = 0.42;
      } else if (soundName === "ocean") {
        filter.type = "lowpass";
        filter.frequency.value = 520;
        textureGain.gain.value = 0.48;

        const wave = context.createOscillator();
        const depth = context.createGain();

        wave.type = "sine";
        wave.frequency.value = 0.075;
        depth.gain.value = 0.19;

        wave.connect(depth);
        depth.connect(textureGain.gain);
        wave.start();

        soundNodesRef.current.push(wave, depth);
      } else if (soundName === "forest" || soundName === "night") {
        filter.type = "bandpass";
        filter.frequency.value = soundName === "night" ? 1250 : 850;
        filter.Q.value = 0.55;
        textureGain.gain.value = soundName === "night" ? 0.06 : 0.12;

        birdTimerRef.current = window.setInterval(
          () => {
            const current = audioContextRef.current;

            if (!current || current.state === "closed") return;

            const chirp = current.createOscillator();
            const chirpGain = current.createGain();
            const now = current.currentTime;
            const isNight = soundName === "night";

            chirp.type = isNight ? "triangle" : "sine";
            chirp.frequency.setValueAtTime(
              (isNight ? 2400 : 1500) + Math.random() * (isNight ? 1000 : 700),
              now,
            );
            chirp.frequency.exponentialRampToValueAtTime(
              (isNight ? 3200 : 2200) + Math.random() * 500,
              now + (isNight ? 0.07 : 0.12),
            );

            chirpGain.gain.setValueAtTime(0.0001, now);
            chirpGain.gain.exponentialRampToValueAtTime(
              isNight ? 0.012 : 0.035,
              now + 0.035,
            );
            chirpGain.gain.exponentialRampToValueAtTime(
              0.0001,
              now + (isNight ? 0.18 : 0.28),
            );

            chirp.connect(chirpGain);
            chirpGain.connect(master);
            chirp.start(now);
            chirp.stop(now + (isNight ? 0.2 : 0.3));

            soundNodesRef.current.push(chirp, chirpGain);
          },
          soundName === "night" ? 1500 : 2600,
        );
      } else if (soundName === "stream") {
        filter.type = "highpass";
        filter.frequency.value = 480;
        textureGain.gain.value = 0.22;
      } else if (soundName === "wind") {
        filter.type = "lowpass";
        filter.frequency.value = 700;
        textureGain.gain.value = 0.34;

        const gust = context.createOscillator();
        const gustDepth = context.createGain();
        gust.frequency.value = 0.045;
        gustDepth.gain.value = 480;
        gust.connect(gustDepth);
        gustDepth.connect(filter.frequency);
        gust.start();
        soundNodesRef.current.push(gust, gustDepth);
      } else if (soundName === "fireplace") {
        filter.type = "lowpass";
        filter.frequency.value = 1800;
        textureGain.gain.value = 0.24;

        birdTimerRef.current = window.setInterval(
          () => {
            const current = audioContextRef.current;
            if (!current || current.state === "closed") return;

            const pop = current.createOscillator();
            const popGain = current.createGain();
            const now = current.currentTime;
            pop.type = "triangle";
            pop.frequency.setValueAtTime(180 + Math.random() * 280, now);
            pop.frequency.exponentialRampToValueAtTime(75, now + 0.08);
            popGain.gain.setValueAtTime(0.0001, now);
            popGain.gain.exponentialRampToValueAtTime(0.018, now + 0.008);
            popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
            pop.connect(popGain);
            popGain.connect(master);
            pop.start(now);
            pop.stop(now + 0.1);
            soundNodesRef.current.push(pop, popGain);
          },
          350 + Math.random() * 900,
        );
      }

      noise.start();
      setActiveSound(soundName);
      setSoundPlaying(true);
    } catch {
      clearSoundResources();
      setSoundPlaying(false);
      setGameMessage("The sound player could not start. Please try again.");
    }
  }

  function changeSoundVolume(value) {
    const next = Number(value);
    setSoundVolume(next);

    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        next,
        audioContextRef.current.currentTime,
        0.08,
      );
    }
  }

  // Doodle canvas.
  function canvasPoint(event) {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function configureDoodleBrush(context) {
    context.globalCompositeOperation = doodleEraser
      ? "destination-out"
      : "source-over";
    context.globalAlpha = brushType === "marker" && !doodleEraser ? 0.42 : 1;
    context.strokeStyle = drawingColor;
    context.lineWidth =
      brushSize *
      (brushType === "marker" ? 2.2 : brushType === "fine" ? 0.55 : 1);
    context.lineCap = brushType === "dotted" ? "round" : "round";
    context.lineJoin = "round";
    context.setLineDash(
      brushType === "dotted" && !doodleEraser ? [2, brushSize * 1.7] : [],
    );
  }

  function startDrawing(event) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawingRef.current = true;

    if (canvas.setPointerCapture) {
      canvas.setPointerCapture(event.pointerId);
    }

    const point = canvasPoint(event);
    if (!point) return;

    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(point.x, point.y);
    configureDoodleBrush(context);
  }

  function draw(event) {
    if (!drawingRef.current || !canvasRef.current) return;

    const point = canvasPoint(event);
    if (!point) return;

    const context = canvasRef.current.getContext("2d");
    configureDoodleBrush(context);
    context.lineTo(point.x, point.y);
    context.stroke();
  }

  function stopDrawing() {
    drawingRef.current = false;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Memory Match.
  function flipMemoryCard(index) {
    if (
      memoryLocked ||
      flippedCards.includes(index) ||
      memoryCards[index].matched ||
      flippedCards.length >= 2
    ) {
      return;
    }

    const next = [...flippedCards, index];
    setFlippedCards(next);

    if (next.length === 2) {
      setMoves((value) => value + 1);

      const [first, second] = next;

      if (memoryCards[first].symbol === memoryCards[second].symbol) {
        setMemoryCards((cards) =>
          cards.map((card, i) =>
            i === first || i === second ? { ...card, matched: true } : card,
          ),
        );

        setFlippedCards([]);
      } else {
        setMemoryLocked(true);

        memoryTimeoutRef.current = window.setTimeout(() => {
          setFlippedCards([]);
          setMemoryLocked(false);
          memoryTimeoutRef.current = null;
        }, 750);
      }
    }
  }

  function startTimedGame(seconds) {
    resetMiniGame();
    setGameSeconds(seconds);
    setGameRunning(true);
    setGameMessage("Go!");
  }

  // Reaction game.
  function startReactionRound() {
    if (!gameRunning) return;

    if (reactionTimeoutRef.current) {
      window.clearTimeout(reactionTimeoutRef.current);
    }

    setReactionResult(null);
    setReactionState("waiting");
    setGameMessage("Wait for green…");

    const delay = 1200 + Math.random() * 2800;

    reactionTimeoutRef.current = window.setTimeout(() => {
      setReactionState("go");
      setReactionStart(performance.now());
      setGameMessage("TAP NOW!");
      reactionTimeoutRef.current = null;
    }, delay);
  }

  function handleReactionTap() {
    if (!gameRunning) return;

    if (reactionState === "waiting") {
      if (reactionTimeoutRef.current) {
        window.clearTimeout(reactionTimeoutRef.current);
        reactionTimeoutRef.current = null;
      }

      setReactionState("early");
      setGameMessage("Too soon! Wait for the green signal.");
      setGameScore((score) => Math.max(0, score - 1));
    } else if (reactionState === "go") {
      const result = Math.round(performance.now() - reactionStart);

      setReactionResult(result);
      setReactionState("result");
      setGameScore((score) => score + 1);
      setGameMessage(`${result} ms reaction time`);
    }
  }

  // Color Rush.
  function answerColor(colorName) {
    if (!gameRunning) return;

    if (colorName === colorRound.inkName) {
      setGameScore((score) => score + 1);
      setGameMessage("Correct! Keep going.");
    } else {
      setGameMessage(`Not quite — the ink colour was ${colorRound.inkName}.`);
    }

    setColorRound(makeColorRound());
  }

  // Bubble Pop.
  function popBubble(id) {
    if (!gameRunning) return;

    setGameScore((score) => score + 1);

    setBubblePositions((current) =>
      current.map((bubble) =>
        bubble.id === id
          ? makeBubble(`${bubble.id}-${Date.now()}-${Math.random()}`)
          : bubble,
      ),
    );
  }

  const selectedMoodInfo = moods.find((mood) => mood.name === selectedMood);

  const recommendedActivities = selectedMood
    ? activities.filter((activity) =>
        moodActivityRecommendations[selectedMood]?.includes(activity.id),
      )
    : [];

  const backButton = (
    <button type="button" className="mc-back-button" onClick={goBack}>
      ← Back to activities
    </button>
  );

  // Main activity selection page.
  if (!selectedActivity) {
    return (
      <section className="mood-changer-page">
        <div className="mc-header">
          <span className="mc-eyebrow">YOUR PERSONAL WELLNESS SPACE</span>
          <h1>
            What would feel good <span>right now?</span>
          </h1>
          <p>
            Choose a mood if you like, or skip straight to an activity.
            Everything is available in one place.
          </p>
        </div>

        <section
          className="mc-reflection-checkin"
          aria-labelledby="mc-reflection-title"
        >
          <span className="mc-eyebrow">A QUICK SELF-CHECK</span>
          <h2 id="mc-reflection-title">
            A few questions to check in with yourself
          </h2>
          <p>
            Your answers stay here and are only used to show a gentle
            reflection. Skip any that don’t fit.
          </p>
          <div className="mc-reflection-questions">
            {moodReflectionQuestions.map((item, index) => (
              <fieldset className="mc-reflection-question" key={item.id}>
                <legend>
                  <span>{index + 1}</span>
                  {item.question}
                </legend>
                <div className="mc-reflection-options">
                  {item.options.map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={
                        moodReflection[item.id] === option ? "is-selected" : ""
                      }
                      aria-pressed={moodReflection[item.id] === option}
                      onClick={() =>
                        setMoodReflection((current) => ({
                          ...current,
                          [item.id]: option,
                        }))
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          {Object.keys(moodReflection).length > 0 && (
            <p className="mc-reflection-summary" aria-live="polite">
              {moodReflection.focus &&
              moodReflection.energy &&
              moodReflection.need
                ? `You’re thinking about ${moodReflection.focus.toLowerCase()}, with ${moodReflection.energy.toLowerCase()} energy. ${moodReflection.need === "I’m not sure" ? "It’s okay not to know what you need yet." : `${moodReflection.need} may be a gentle place to start.`}`
                : "Thanks for checking in. There’s no right answer, and you can change these anytime."}
            </p>
          )}
        </section>

        <div className="mc-mood-heading-row">
          <div>
            <span className="mc-eyebrow">OPTIONAL CHECK-IN</span>
            <h2>How are you feeling?</h2>
          </div>

          {selectedMood && (
            <button
              type="button"
              className="mc-clear-mood"
              onClick={() => setSelectedMood("")}
            >
              Clear mood
            </button>
          )}
        </div>

        <div className="mc-mood-grid">
          {moods.map((mood) => (
            <button
              type="button"
              key={mood.name}
              className={`mc-mood-card ${mood.color} ${
                selectedMood === mood.name ? "is-selected" : ""
              }`}
              onClick={() => setSelectedMood(mood.name)}
              aria-pressed={selectedMood === mood.name}
            >
              <span className="mc-mood-icon">
                <MoodIcon mood={mood.name} size={28} />
              </span>
              <strong>{mood.name}</strong>
              <small>{mood.description}</small>
              <span className="mc-card-arrow">
                {selectedMood === mood.name ? "Selected ✓" : "Choose mood"}
              </span>
            </button>
          ))}
        </div>

        {selectedMoodInfo && (
          <p className="mc-mood-note">
            You're checking in as{" "}
            <strong>
              <MoodIcon mood={selectedMoodInfo.name} size={18} />{" "}
              {selectedMoodInfo.name}
            </strong>
            . You can still choose any activity below.
          </p>
        )}

        {selectedMood && recommendedActivities.length > 0 && (
          <>
            <div className="mc-recommendation-heading mc-shared-heading">
              <div>
                <span className="mc-eyebrow">BASED ON YOUR MOOD</span>
                <h2>Recommended for {selectedMood}</h2>
              </div>
              <span className="mc-count">
                {recommendedActivities.length} suggestions
              </span>
            </div>

            <div className="mc-activity-grid">
              {recommendedActivities.map((activity) => (
                <button
                  type="button"
                  className="mc-activity-card mc-recommended-card"
                  key={activity.id}
                  onClick={() => openActivity(activity)}
                >
                  <span className="mc-activity-icon">{activity.icon}</span>
                  <span className="mc-activity-duration">
                    {activity.duration}
                  </span>
                  <strong>{activity.title}</strong>
                  <small>{activity.description}</small>
                  <span className="mc-card-arrow">Try this activity →</span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mc-recommendation-heading mc-shared-heading">
          <div>
            <span className="mc-eyebrow">PLAY, BREATHE OR LISTEN</span>
            <h2>Interactive Activities</h2>
          </div>
          <span className="mc-count">8 activities</span>
        </div>

        <div className="mc-activity-grid">
          {activities.map((activity) => (
            <button
              type="button"
              className="mc-activity-card"
              key={activity.id}
              onClick={() => openActivity(activity)}
            >
              <span className="mc-activity-icon">{activity.icon}</span>
              <span className="mc-activity-duration">{activity.duration}</span>
              <strong>{activity.title}</strong>
              <small>{activity.description}</small>
              <span className="mc-card-arrow">Open activity →</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  // XOX (tic-tac-toe).
  if (selectedActivity.id === "xox") {
    const winner = getXoxWinner(xoxBoard);
    const isDraw = !winner && xoxBoard.every(Boolean);
    const currentPlayer = xoxBoard.filter(Boolean).length % 2 === 0 ? "X" : "O";

    return (
      <section className="mood-changer-page">
        {backButton}
        <div className="mc-activity-detail mc-xox-detail">
          <div className="mc-detail-icon">⭕</div>
          <span className="mc-eyebrow">A QUICK PLAY BREAK</span>
          <h1>XOX</h1>
          <p>Take turns with a friend. Get three in a row to win.</p>

          <div className="xox-status" aria-live="polite">
            {winner
              ? `${winner} wins! Nice game.`
              : isDraw
                ? "It’s a draw!"
                : `${currentPlayer}’s turn`}
          </div>
          <div className="xox-board" role="grid" aria-label="XOX game board">
            {xoxBoard.map((mark, index) => (
              <button
                type="button"
                role="gridcell"
                key={index}
                className={`xox-cell ${mark ? `is-${mark.toLowerCase()}` : ""}`}
                aria-label={`Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}${mark ? `, ${mark}` : ", empty"}`}
                disabled={Boolean(mark) || Boolean(winner) || isDraw}
                onClick={() => {
                  setXoxBoard((board) => {
                    if (
                      board[index] ||
                      getXoxWinner(board) ||
                      board.every(Boolean)
                    )
                      return board;
                    const nextBoard = [...board];
                    nextBoard[index] =
                      board.filter(Boolean).length % 2 === 0 ? "X" : "O";
                    return nextBoard;
                  });
                }}
              >
                {mark}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="mc-primary-button"
            onClick={() => setXoxBoard(Array(9).fill(null))}
          >
            New game
          </button>
        </div>
      </section>
    );
  }

  // Breathing Flow.
  if (selectedActivity.id === "breathing") {
    const technique =
      breathingTechniques.find((item) => item.id === breathingTechnique) ||
      breathingTechniques[0];
    const cycleDuration = technique.phases.reduce(
      (total, item) => total + item.duration,
      0,
    );
    let phasePosition = breathingElapsed % cycleDuration;
    let activePhase = technique.phases[0];
    for (const item of technique.phases) {
      if (phasePosition < item.duration) {
        activePhase = item;
        break;
      }
      phasePosition -= item.duration;
    }
    const phase = activePhase.name;
    const label = activePhase.label;
    const count = activePhase.duration - phasePosition;

    return (
      <section className="mood-changer-page">
        {backButton}

        <div className="mc-activity-detail mc-breathing-detail">
          <div className="mc-detail-icon">🌬️</div>
          <span className="mc-eyebrow">SLOW DOWN · YOUR OWN PACE</span>
          <h1>Breathing Flow</h1>
          <p>
            Follow the circle's gentle rhythm. Keep your breathing comfortable;
            you can stop whenever you like.
          </p>

          <div
            className="breathing-techniques"
            role="group"
            aria-label="Choose a breathing technique"
          >
            {breathingTechniques.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`breathing-technique ${breathingTechnique === item.id ? "active" : ""}`}
                aria-pressed={breathingTechnique === item.id}
                disabled={breathingRunning}
                onClick={() => {
                  setBreathingTechnique(item.id);
                  setBreathingElapsed(0);
                }}
              >
                <strong>{item.name}</strong>
                <span>{item.description}</span>
                <small>
                  {item.phases
                    .map((itemPhase) => itemPhase.duration)
                    .join(" · ")}{" "}
                  sec
                </small>
              </button>
            ))}
          </div>
          <p className="breathing-technique-note">
            Keep every breath comfortable. Skip holds or pause if they don’t
            feel right.
          </p>

          <div
            className={`breathing-stage ${
              breathingRunning ? `is-${phase}` : "is-ready"
            }`}
          >
            <div className="breathing-orbit">
              <div className="breathing-orb">
                <span>{breathingRunning ? label : "Ready?"}</span>
                <strong>{breathingRunning ? count : "♡"}</strong>
              </div>
            </div>
            <p>
              {breathingRunning
                ? `${label} · ${count}s`
                : "Press start when you're comfortable"}
            </p>
          </div>

          <div className="breathing-stats">
            <span>
              Cycles completed{" "}
              <strong>{Math.floor(breathingElapsed / cycleDuration)}</strong>
            </span>
            <span>
              Time{" "}
              <strong>
                {Math.floor(breathingElapsed / 60)}:
                {String(breathingElapsed % 60).padStart(2, "0")}
              </strong>
            </span>
          </div>

          <div className="breathing-controls">
            <button
              type="button"
              className="mc-primary-button"
              onClick={() => setBreathingRunning((running) => !running)}
            >
              {breathingRunning
                ? "Pause"
                : breathingElapsed
                  ? "Continue"
                  : "Start breathing"}
            </button>

            <button
              type="button"
              className="mc-secondary-button"
              onClick={() => {
                setBreathingRunning(false);
                setBreathingElapsed(0);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Relaxing Sounds.
  if (selectedActivity.id === "sounds") {
    const soundOptions = [
      {
        id: "stream",
        title: "Babbling Brook",
        icon: "💧",
        detail: "A soft, flowing stream",
      },
      {
        id: "wind",
        title: "Gentle Wind",
        icon: "🍃",
        detail: "Slow, airy gusts through the trees",
      },
      {
        id: "fireplace",
        title: "Cozy Fireplace",
        icon: "🔥",
        detail: "Low crackle with gentle pops",
      },
      {
        id: "night",
        title: "Summer Night",
        icon: "🌙",
        detail: "Quiet nighttime ambience and crickets",
      },
      {
        id: "rain",
        title: "Gentle Rain",
        icon: "🌧️",
        detail: "Soft, steady rainfall",
      },
      {
        id: "ocean",
        title: "Ocean Waves",
        icon: "🌊",
        detail: "Slow, rolling wave ambience",
      },
      {
        id: "forest",
        title: "Forest Birds",
        icon: "🌲",
        detail: "Forest atmosphere and bird-like chirps",
      },
    ];

    return (
      <section className="mood-changer-page">
        {backButton}

        <div className="mc-activity-detail mc-sounds-detail">
          <div className="mc-detail-icon">🌧️</div>
          <span className="mc-eyebrow">A LITTLE SPACE TO UNWIND</span>
          <h1>Relaxing Sounds</h1>
          <p>
            Choose an ambience and let it play while you take a moment for
            yourself.
          </p>

          <div className="soundscape-grid">
            {soundOptions.map((sound) => (
              <button
                type="button"
                key={sound.id}
                className={`soundscape-card ${
                  activeSound === sound.id && soundPlaying ? "is-playing" : ""
                }`}
                onClick={() => startSound(sound.id)}
              >
                <span className="soundscape-icon">{sound.icon}</span>
                <strong>{sound.title}</strong>
                <small>{sound.detail}</small>
                <span className="soundscape-action">
                  {activeSound === sound.id && soundPlaying
                    ? "Playing now"
                    : "Play sound →"}
                </span>
              </button>
            ))}
          </div>

          <div className="sound-player-panel">
            <div className="sound-player-status">
              <span
                className={`sound-playing-indicator ${
                  soundPlaying ? "active" : ""
                }`}
              />
              <div>
                <strong>
                  {soundPlaying
                    ? soundOptions.find((sound) => sound.id === activeSound)
                        ?.title
                    : "Choose a sound"}
                </strong>
                <small>
                  {soundPlaying
                    ? "Ambient sound is playing"
                    : "Nothing playing right now"}
                </small>
              </div>
            </div>

            <div className="sound-player-controls">
              <button
                type="button"
                className="mc-primary-button"
                onClick={() =>
                  soundPlaying ? stopSound() : startSound(activeSound || "rain")
                }
              >
                {soundPlaying ? "Stop sound" : "Play sound"}
              </button>

              <label className="sound-volume-control">
                Volume
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.05"
                  value={soundVolume}
                  onChange={(event) => changeSoundVolume(event.target.value)}
                />
              </label>
            </div>

            <p className="sound-player-note">
              These ambient sounds are generated in your browser. No audio files
              or extra packages are needed.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Doodle Your Mood.
  if (selectedActivity.id === "doodle") {
    return (
      <section className="mood-changer-page">
        {backButton}

        <div className="mc-activity-detail">
          <div className="mc-detail-icon">🎨</div>
          <span className="mc-eyebrow">CREATIVE BREAK · NO RULES</span>
          <h1>Doodle Your Mood</h1>
          <p>
            Draw lines, shapes or anything you like. It doesn't need to look
            perfect.
          </p>

          <div className="doodle-toolbar">
            <div
              className="doodle-brush-controls"
              role="group"
              aria-label="Brush type"
            >
              {[
                { id: "pen", label: "Pen" },
                { id: "marker", label: "Marker" },
                { id: "fine", label: "Fine" },
                { id: "dotted", label: "Dotted" },
              ].map((brush) => (
                <button
                  type="button"
                  key={brush.id}
                  className={`doodle-tool-button ${brushType === brush.id ? "active" : ""}`}
                  aria-pressed={brushType === brush.id}
                  onClick={() => {
                    setBrushType(brush.id);
                    setDoodleEraser(false);
                  }}
                >
                  {brush.label}
                </button>
              ))}
            </div>
            <div
              className="doodle-size-controls"
              role="group"
              aria-label="Brush size"
            >
              <label htmlFor="doodle-brush-size">Brush size</label>
              <input
                id="doodle-brush-size"
                type="range"
                min="2"
                max="24"
                value={brushSize}
                onChange={(event) => setBrushSize(Number(event.target.value))}
                aria-label="Brush size"
                style={{
                  "--brush-size-progress": `${((brushSize - 2) / 22) * 100}%`,
                }}
              />
            </div>
            {[
              "#42d6bd",
              "#8b7cf6",
              "#ff8c9b",
              "#f5c86b",
              "#e9edf5",
              "#202b3b",
              "#ff6b35",
              "#f04e98",
              "#ffd166",
              "#06d6a0",
              "#4cc9f0",
              "#4361ee",
              "#9b5de5",
              "#a3e635",
            ].map((color) => (
              <button
                type="button"
                key={color}
                className={`doodle-color ${drawingColor === color && !doodleEraser ? "active" : ""}`}
                style={{ backgroundColor: color }}
                aria-label={`Choose ${color} drawing colour`}
                aria-pressed={drawingColor === color && !doodleEraser}
                onClick={() => {
                  setDrawingColor(color);
                  setDoodleEraser(false);
                }}
              />
            ))}

            <button
              type="button"
              className={`doodle-eraser ${doodleEraser ? "active" : ""}`}
              aria-label="Eraser"
              aria-pressed={doodleEraser}
              onClick={() => setDoodleEraser(true)}
            >
              Eraser
            </button>

            <button
              type="button"
              className="doodle-clear"
              onClick={clearCanvas}
            >
              Clear canvas
            </button>
          </div>

          <canvas
            ref={canvasRef}
            className="mood-doodle-canvas"
            width={720}
            height={360}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
            aria-label="Drawing canvas"
          />

          <p className="doodle-hint">
            Use your mouse, touchpad or finger to draw.
          </p>

          {!completed ? (
            <button
              type="button"
              className="mc-primary-button"
              onClick={() => setCompleted(true)}
            >
              I'm done doodling
            </button>
          ) : (
            <div className="mc-completion">
              <div className="mc-detail-icon">💛</div>
              <h2>Nice work. You made something of your own.</h2>
              <p>How are you feeling now?</p>
              <AfterMoodPicker
                afterMood={afterMood}
                setAfterMood={setAfterMood}
                onFinish={resetMoodChanger}
              />
            </div>
          )}
        </div>
      </section>
    );
  }

  // Memory Match.
  if (selectedActivity.id === "memory") {
    return (
      <section className="mood-changer-page">
        {backButton}

        <div className="mc-activity-detail">
          <div className="mc-detail-icon">🧠</div>
          <span className="mc-eyebrow">QUICK BRAIN GAME</span>
          <h1>Memory Match</h1>
          <p>
            Find all six matching pairs. Try to remember where each symbol
            appears.
          </p>

          <div className="memory-stats">
            <span>
              Moves <strong>{moves}</strong>
            </span>
            <span>
              Pairs{" "}
              <strong>
                {memoryCards.filter((card) => card.matched).length / 2} / 6
              </strong>
            </span>
          </div>

          <div className="memory-grid">
            {memoryCards.map((card, index) => {
              const revealed = flippedCards.includes(index) || card.matched;

              return (
                <button
                  type="button"
                  key={card.id}
                  className={`memory-card ${
                    revealed ? "revealed" : ""
                  } ${card.matched ? "matched" : ""}`}
                  onClick={() => flipMemoryCard(index)}
                  disabled={card.matched || memoryLocked}
                  aria-label={
                    revealed
                      ? `Card ${card.symbol}`
                      : `Reveal card ${index + 1}`
                  }
                >
                  {revealed ? card.symbol : "?"}
                </button>
              );
            })}
          </div>

          {memoryWon ? (
            <div className="mc-completion">
              <div className="mc-detail-icon">🏆</div>
              <h2>You found every pair!</h2>
              <p>You finished in {moves} moves.</p>

              <div className="memory-actions">
                <button
                  type="button"
                  className="mc-primary-button"
                  onClick={resetMemory}
                >
                  Play again
                </button>

                <button
                  type="button"
                  className="mc-secondary-button"
                  onClick={() => setCompleted(true)}
                >
                  Finish
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="mc-secondary-button"
              onClick={resetMemory}
            >
              Restart game
            </button>
          )}

          {completed && (
            <div className="mc-completion">
              <p>How are you feeling now?</p>
              <AfterMoodPicker
                afterMood={afterMood}
                setAfterMood={setAfterMood}
                onFinish={resetMoodChanger}
              />
            </div>
          )}
        </div>
      </section>
    );
  }

  // Reaction Game.
  if (selectedActivity.id === "reaction") {
    return (
      <section className="mood-changer-page">
        {backButton}

        <div className="mc-activity-detail mc-mini-game-detail">
          <div className="mc-detail-icon">⚡</div>
          <span className="mc-eyebrow">ONE-MINUTE CHALLENGE</span>
          <h1>Reaction Game</h1>
          <p>
            Wait for the red panel to turn green, then tap as quickly as you
            can. Don't jump the signal!
          </p>

          <div className="game-score-row">
            <span>
              Time <strong>{gameSeconds}s</strong>
            </span>
            <span>
              Successful taps <strong>{gameScore}</strong>
            </span>
            {reactionResult !== null && (
              <span>
                Last reaction <strong>{reactionResult} ms</strong>
              </span>
            )}
          </div>

          <button
            type="button"
            className={`reaction-zone ${reactionState}`}
            onClick={handleReactionTap}
            disabled={
              !gameRunning || !["waiting", "go"].includes(reactionState)
            }
          >
            <strong>
              {reactionState === "go"
                ? "TAP NOW!"
                : reactionState === "waiting"
                  ? "WAIT…"
                  : reactionState === "early"
                    ? "TOO SOON"
                    : reactionState === "result"
                      ? `${reactionResult} ms`
                      : reactionState === "finished"
                        ? "TIME'S UP"
                        : "READY?"}
            </strong>
            <small>
              {reactionState === "go"
                ? "Tap this panel"
                : reactionState === "waiting"
                  ? "Wait for green"
                  : gameMessage}
            </small>
          </button>

          <p className="game-feedback">{gameMessage}</p>

          <div className="game-action-row">
            <button
              type="button"
              className="mc-primary-button"
              onClick={() => {
                startTimedGame(60);
                setReactionState("ready");
                setGameMessage("Start a round when you're ready.");
              }}
            >
              Start 1-minute game
            </button>

            <button
              type="button"
              className="mc-secondary-button"
              disabled={
                !gameRunning ||
                reactionState === "waiting" ||
                reactionState === "go"
              }
              onClick={startReactionRound}
            >
              Start / next round
            </button>
          </div>

          {!gameRunning && gameSeconds === 0 && gameScore > 0 && (
            <p className="mc-game-finished">
              Your score: {gameScore} successful reactions.
            </p>
          )}
        </div>
      </section>
    );
  }

  // Color Rush.
  if (selectedActivity.id === "color") {
    return (
      <section className="mood-changer-page">
        {backButton}

        <div className="mc-activity-detail mc-mini-game-detail">
          <div className="mc-detail-icon">🌈</div>
          <span className="mc-eyebrow">30-SECOND FOCUS CHALLENGE</span>
          <h1>Color Rush</h1>
          <p>
            Look at the colour of the letters, not the word itself. Choose the
            matching colour below.
          </p>

          <div className="game-score-row">
            <span>
              Time <strong>{gameSeconds}s</strong>
            </span>
            <span>
              Score <strong>{gameScore}</strong>
            </span>
          </div>

          <div className="color-word-area">
            <span className="color-instruction">Which colour is the text?</span>
            <strong style={{ color: colorRound.inkValue }}>
              {colorRound.word}
            </strong>
          </div>

          <div className="color-options">
            {colorOptions.map((option) => (
              <button
                type="button"
                key={option.name}
                onClick={() => answerColor(option.name)}
                disabled={!gameRunning}
              >
                {option.name}
              </button>
            ))}
          </div>

          <p className="game-feedback">{gameMessage}</p>

          {!gameRunning ? (
            <button
              type="button"
              className="mc-primary-button"
              onClick={() => startTimedGame(30)}
            >
              Start Color Rush
            </button>
          ) : (
            <button
              type="button"
              className="mc-secondary-button"
              onClick={resetMiniGame}
            >
              Reset game
            </button>
          )}

          {!gameRunning && gameSeconds === 0 && gameScore > 0 && (
            <p className="mc-game-finished">Final score: {gameScore}</p>
          )}
        </div>
      </section>
    );
  }

  // Bubble Pop.
  if (selectedActivity.id === "bubble") {
    return (
      <section className="mood-changer-page">
        {backButton}

        <div className="mc-activity-detail mc-mini-game-detail">
          <div className="mc-detail-icon">🫧</div>
          <span className="mc-eyebrow">30-SECOND PLAY BREAK</span>
          <h1>Bubble Pop</h1>
          <p>Pop as many bubbles as you can before the timer runs out.</p>

          <div className="game-score-row">
            <span>
              Time <strong>{gameSeconds}s</strong>
            </span>
            <span>
              Popped <strong>{gameScore}</strong>
            </span>
          </div>

          <div className="bubble-play-area">
            {bubblePositions.map((bubble) => (
              <button
                type="button"
                key={bubble.id}
                className="game-bubble"
                style={{
                  left: `${bubble.left}%`,
                  top: `${bubble.top}%`,
                  animationDelay: `${bubble.delay}s`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                }}
                onClick={() => popBubble(bubble.id)}
                disabled={!gameRunning}
                aria-label="Pop bubble"
              />
            ))}

            {!gameRunning && (
              <div className="game-overlay-message">
                {gameScore > 0
                  ? `You popped ${gameScore} bubbles!`
                  : "Ready to pop?"}
              </div>
            )}
          </div>

          {!gameRunning ? (
            <button
              type="button"
              className="mc-primary-button"
              onClick={() => startTimedGame(30)}
            >
              Start Bubble Pop
            </button>
          ) : (
            <button
              type="button"
              className="mc-secondary-button"
              onClick={resetMiniGame}
            >
              Reset game
            </button>
          )}
        </div>
      </section>
    );
  }

  return null;
}

export default MoodChanger;
