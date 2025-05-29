// Initial Setup
var defaultSongIndex = 0;
var imageTag = document.querySelector(".image-tag");
var musicProgressBar = document.querySelector(".music-progress-bar");
var currentTime = document.querySelector(".current-time");
var totalTime = document.querySelector(".total-time");
var musicName = document.querySelector(".music-name");
var repeatBtn = document.querySelector(".repeat-button");
var shuffleBtn = document.querySelector(".shuffle-button");
var playBtn = document.querySelector(".play-button");
var prevBtn = document.querySelector(".backward-button");
var nextBtn = document.querySelector(".forward-button");
var soundbar = document.querySelector(".soundbar");
var playicon = document.querySelector("#p");
var playspeed = document.querySelector(".playspeed");
var audio = document.querySelector(".song-here");

var songs = [
  {
    name: "Pata nahi kis roop me aakar",
    src: "Ram_Darshan.mp3",
    img: "Narayan.jpg",
  },
  { name: "The Boys (Bones)", src: "Bones.mp3", img: "bones.png" },
  {
    name: "Party With Jagaban",
    src: "Midas_The_Jagaban_PartyWithAJagaban.mp3",
    img: "jagaban.jpg",
  },
  { name: "Habibi (remix)", src: "habibi.mp3", img: "Habibi.png" },
  {
    name: "Serena Safari (bass)",
    src: "SerenaSafari(Remix).mp3",
    img: "Serene-Safari.png",
  },
  {
    name: "Funk De Bleza",
    src: "Funk_de_Beleza.mp3",
    img: "funk-de-bleza.jpeg",
  },
  {
    name: "MONTAGEM TOMADA FUNK",
    src: "MONTAGEM_TOMADA.mp3",
    img: "montagem-tomado.jpeg",
  },
  {
    name: "Matuska Ultrafunk",
    src: "Matuska_Ultrafunk.mp3",
    img: "matuska-ultrafunk.jpeg",
  },
  { name: "NUNCA MUDA FUNK", src: "NUNCA_MUDA.mp3", img: "nunca-muda.jpeg" },
  {
    name: "PASSO BEM SOLTO",
    src: "PASSO_BEM_SOLTO.mp3",
    img: "passo-bem-solto.jpg",
  },
  { name: "SLAVA FUNK", src: "SLAVA_FUNK.mp3", img: "slava-funk.jpeg" },
  { name: "Snowman - Sia", src: "Snowman.mp3", img: "snowman.jpeg" },
];

var prev_speed = 1;
var prev_vol = 0.5;
var isPlayingNow = false;
var playingInterval;

// Initialize player
window.addEventListener("load", () => {
  document.querySelector(".music-image-box").style.animationPlayState =
    "paused";
  document.body.style.backgroundImage = `url(${songs[defaultSongIndex].img})`;
  loadAndPlaySong(false);
  audio.volume = prev_vol;
  soundbar.value = prev_vol;
  playspeed.value = prev_speed;
  document.querySelector(".writespeed").textContent = `${prev_speed} x`;
});

// Load and play the current song
function loadAndPlaySong(autoPlay = true) {
  const song = songs[defaultSongIndex];
  audio.src = song.src;
  musicName.textContent = song.name;
  imageTag.setAttribute("src", song.img);
  audio.playbackRate = prev_speed;
  audio.volume = prev_vol;
  document.body.style.backgroundImage = `url(${song.img})`;
  if (autoPlay) {
    audio.play();
  }
}

// Play/Pause Toggle
playBtn.addEventListener("click", () => {
  isPlayingNow ? audio.pause() : audio.play();
});

// Previous Song
prevBtn.addEventListener("click", () => {
  defaultSongIndex = (defaultSongIndex - 1 + songs.length) % songs.length;
  loadAndPlaySong();
});

// Next Song
nextBtn.addEventListener("click", () => {
  PlayNextSong();
});

// Volume Control
soundbar.addEventListener("input", (e) => {
  audio.volume = e.target.value;
  prev_vol = e.target.value;
});

// Speed Control
playspeed.addEventListener("input", (e) => {
  audio.playbackRate = e.target.value;
  prev_speed = e.target.value;
  document.querySelector(".writespeed").textContent = `${e.target.value} x`;
});

// Shuffle and Repeat Toggles
shuffleBtn.addEventListener("click", () => {
  shuffleBtn.classList.toggle("active-btn");
});

repeatBtn.addEventListener("click", () => {
  repeatBtn.classList.toggle("active-btn");
});

// Update UI when song plays
audio.addEventListener("playing", () => {
  isPlayingNow = true;
  playicon.classList.remove("fa-play");
  playicon.classList.add("fa-pause");

  totalTime.textContent = `${Math.floor(audio.duration / 60)}:${String(
    Math.floor(audio.duration % 60)
  ).padStart(2, "0")}`;
  musicProgressBar.max = Math.floor(audio.duration);

  playingInterval = setInterval(playingMusic, 1000);
});

// Update UI when song pauses
audio.addEventListener("pause", () => {
  clearInterval(playingInterval);
  isPlayingNow = false;
  playicon.classList.remove("fa-pause");
  playicon.classList.add("fa-play");
});

// On song end
audio.addEventListener("ended", () => {
  clearInterval(playingInterval);
  if (repeatBtn.classList.contains("active-btn")) {
    audio.currentTime = 0;
    audio.play();
  } else if (shuffleBtn.classList.contains("active-btn")) {
    defaultSongIndex = Math.floor(Math.random() * songs.length);
    loadAndPlaySong();
  } else {
    PlayNextSong();
  }
});

// Music Progress Display
function playingMusic() {
  const cur = audio.currentTime;
  const dur = audio.duration;

  currentTime.textContent = `${Math.floor(cur / 60)}:${String(
    Math.floor(cur % 60)
  ).padStart(2, "0")}`;
  musicProgressBar.value = cur;
  musicProgressBar.style.backgroundSize = `${(cur / dur) * 100}%`;
}

// Seek on progress bar input
musicProgressBar.addEventListener("input", (e) => {
  audio.currentTime = e.target.value;
});

// Play next song (with shuffle/repeat logic already handled)
function PlayNextSong() {
  defaultSongIndex = (defaultSongIndex + 1) % songs.length;
  loadAndPlaySong();
}

// Visualizer Setup
const canvas = document.querySelector(".audio-visualizer");
const ctx = canvas.getContext("2d");

let audioCtx, analyser, source, animationId;
let lastDataArray = [];

function setupVisualizer() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512; // Higher resolution for smoother, fuller circle
    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  const bufferLength = analyser.frequencyBinCount; // Half of fftSize
  const dataArray = new Uint8Array(bufferLength);
  const lastDataArray = new Uint8Array(bufferLength); // To freeze on pause

  //   function draw() {
  //   animationId = requestAnimationFrame(draw);

  //   if (!audio.paused) {
  //     analyser.getByteFrequencyData(dataArray);
  //     lastDataArray.set(dataArray); // save latest frequency data
  //   }

  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   const centerX = canvas.width / 2;
  //   const centerY = canvas.height / 2;
  //   const baseRadius = 10;
  //   const points = bufferLength;
  //   const angleStep = (Math.PI * 2) / points;

  //   ctx.beginPath();
  //   for (let i = 0; i <= points; i++) {
  //     const index = i % bufferLength;
  //     const value = lastDataArray[index];
  //     const waveformRadius = baseRadius + value * 0.9;

  //     const angle = i * angleStep;
  //     const x = centerX + waveformRadius * Math.cos(angle);
  //     const y = centerY + waveformRadius * Math.sin(angle);

  //     if (i === 0) {
  //       ctx.moveTo(x, y);
  //     } else {
  //       ctx.lineTo(x, y);
  //     }
  //   }

  //   ctx.closePath();
  //   ctx.fillStyle = "rgba(188, 19, 254, 0.5)"; // Change this color as you wish
  //   ctx.shadowBlur = 20;
  //   ctx.shadowColor = "rgba(188, 19, 254, 0.5)";
  //   ctx.fill();
  // }
  let rotationAngle = 0; // global variable

  // function draw() {
  //   animationId = requestAnimationFrame(draw);
  //   analyser.getByteFrequencyData(dataArray);

  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   const centerX = canvas.width / 2;
  //   const centerY = canvas.height / 2;
  //   const radius = 75;
  //   const barWidth = 4;
  //   const angleStep = (Math.PI * 2) / bufferLength;

  //   const isPaused = audio.paused;

  //   // Increment rotation angle to rotate the whole bars circle
  //   rotationAngle += 0.01; // adjust speed (radians per frame)
  //   if (rotationAngle > Math.PI * 2) rotationAngle -= Math.PI * 2;

  //   for (let i = 0; i < bufferLength; i++) {
  //     const value = isPaused ? dataArray[i] * 0.3 : dataArray[i]; // Dim when paused
  //     const barHeight = value / 1.5;
  //     const angle = i * angleStep + rotationAngle; // add rotation here

  //     ctx.save();
  //     ctx.translate(centerX, centerY);
  //     ctx.rotate(angle);
  //     ctx.fillStyle = `rgb(${value}, ${200 - value}, 255)`;
  //     ctx.fillRect(radius, -barWidth / 2, barHeight, barWidth);
  //     ctx.restore();
  //   }
  // }
  function draw() {
    animationId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 75;
    const barWidth = 1;
    const angleStep = (Math.PI * 5) / bufferLength;

    const isPaused = audio.paused;

    // Increment rotation angle to rotate the whole bars circle
    rotationAngle += 0.01; // adjust speed (radians per frame)
    if (rotationAngle > Math.PI * 2) rotationAngle -= Math.PI * 2;

    for (let i = 0; i < bufferLength; i++) {
      const value = isPaused ? dataArray[i] * 0.3 : dataArray[i]; // Dim when paused
      // Minimum height to make small values visible and pulsate
      const minBarHeight = 5;
      const barHeight = Math.max(value / 1.2, minBarHeight);

      const angle = i * angleStep + rotationAngle; // add rotation here

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.fillStyle = `rgb(${value}, ${200 - value}, 255)`;
      ctx.fillRect(radius, -barWidth / 2, barHeight, barWidth);
      ctx.restore();
    }
  }

  draw();
}

// Set up visualizer on play
audio.addEventListener("play", () => {
  if (!audioCtx || audioCtx.state === "suspended") {
    setupVisualizer();
  } else {
    audioCtx.resume();
  }
});

// Resize canvas if needed on window resize
window.addEventListener("resize", () => {
  if (canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
});
