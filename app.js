var imageLink = "https://source.unsplash.com/random/1680x3000/?night";
var defaultSongIndex = 1;
var imageTag = document.querySelector(".image-tag");

var musicProgressBar = document.querySelector(".music-progress-bar");
var progressLoader = 0;
var checker = 0;
var currentTime = document.querySelector(".current-time");
var totalTime = document.querySelector(".total-time");
var sett;
var musicName = document.querySelector(".music-name");

window.addEventListener("load", () => {
  document.body.style.backgroundImage = `url(${imageLink})`;
  imageTag.setAttribute("src", imageLink);
  imageTag.setAttribute("alt", "");
  document.querySelector(".music-image-box").style.animationPlayState =
    "paused";
});

var songs = [
  {
    name: "Pata nahi kis roop me aakar",
    src: "Ram_Darshan.mp3",
  },
  {
    name: "The Boys (Bones)",
    src: "Bones.mp3",
  },
  {
    name: "Party With Jagaban",
    src: "Midas_The_Jagaban_PartyWithAJagaban.mp3",
  },
  {
    name: "Habibi (remix)",
    src: "habibi.mp3",
  },
  {
    name: "Serena Safari (bass)",
    src: "SerenaSafari(Remix).mp3",
  },
];
var audio = document.querySelector(".song-here");
var source = document.querySelector("source");
audio.src = songs[defaultSongIndex].src;
musicName.innerHTML = songs[defaultSongIndex].name;
// Buttons
var shufflebtn = document.querySelector(".shuffle-button");
var repeatbtn = document.querySelector(".repeat-button");
var playBtn = document.querySelector(".play-button");
var prevBtn = document.querySelector(".backward-button");
var nextBtn = document.querySelector(".forward-button");
var soundbar = document.querySelector(".soundbar");
var playicon = document.querySelector("#p");
var songSpeed = 1;

var curTime;
var maxTime;

var playingInerval;
var min = 0;
var sec = 0;

var isPlayingNow = false;
var isNextClicked = false;
var isPrevClicked = false;
var notPaused = false;

var playspeed = document.querySelector(".playspeed");
playspeed.addEventListener("input", (e) => {
  document.querySelector(".writespeed").textContent = e.target.value + " x";
  audio.playbackRate = e.target.value;
});

soundbar.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

shufflebtn.addEventListener("click", () => {
  shufflebtn.classList.toggle("active-btn");
});
repeatbtn.addEventListener("click", () => {
  repeatbtn.classList.toggle("active-btn");
});

prevBtn.addEventListener("click", () => {
  clearInterval(playingInerval);
  notPaused = false;
  isPrevClicked = true;
  if (defaultSongIndex < 0) {
    defaultSongIndex = songs.length - 1;
  } else if (defaultSongIndex == 0) {
    defaultSongIndex = songs.length - 1;
    // console.log(defaultSongIndex % songs.length);
    audio.src = songs[songs.length - 1].src;
    musicName.innerHTML = songs[songs.length - 1].name;
    audio.play();
  } else {
    defaultSongIndex--;
    // console.log(defaultSongIndex % songs.length);
    audio.src = songs[defaultSongIndex % songs.length].src;
    musicName.innerHTML = songs[defaultSongIndex % songs.length].name;
    audio.play();
  }
});
nextBtn.addEventListener("click", () => {
  clearInterval(playingInerval);
  notPaused = false;
  isNextClicked = true;
  if (defaultSongIndex >= songs.length - 1) {
    defaultSongIndex = 0;
    // console.log(defaultSongIndex % songs.length);
    audio.src = songs[defaultSongIndex % songs.length].src;
    musicName.innerHTML = songs[defaultSongIndex % songs.length].name;
    audio.play();
  } else {
    defaultSongIndex++;
    // console.log(defaultSongIndex % songs.length);
    audio.src = songs[defaultSongIndex % songs.length].src;
    musicName.innerHTML = songs[defaultSongIndex % songs.length].name;
    audio.play();
  }
});

playBtn.addEventListener("click", () => {
  console.log(songSpeed);
  isPlayingNow ? audio.pause() : audio.play();
});
audio.onplaying = function () {
  isPlayingNow = true;
  isNextClicked = false;
  isPrevClicked = false;
  playicon.classList.remove("fa-play");
  playicon.classList.add("fa-pause");
  if (!notPaused) {
    min = 0;
    sec = 0;
  }
  maxTime = audio.duration;
  curTime = audio.currentTime;
  checker = Math.floor(maxTime);
  totalTime.textContent =
    Math.floor(maxTime / 60) + ":" + Math.floor(maxTime % 60);
  musicProgressBar.setAttribute("min", "0");
  musicProgressBar.setAttribute("max", `${Math.floor(maxTime)}`);
  musicProgressBar.setAttribute("value", "1");
  playingInerval = setInterval(playingMusic, 1000);
};
audio.onpause = function () {
  // clearInterval(playingInerval);
  notPaused = true;
  isPlayingNow = false;
  playicon.classList.remove("fa-pause");
  playicon.classList.add("fa-play");
};

function playingMusic() {
  if (isNextClicked || isPrevClicked) {
    clearInterval(playingInerval);
  }
  if (!isPlayingNow) {
    clearInterval(playingInerval);
  }
  musicProgressBar.style.backgroundSize =
    ((sec + min * 60) / checker) * 100 + "%";
  musicProgressBar.value = sec + min * 60;
  sec++;
  if (sec > 59) {
    min++;
    sec = 0;
    currentTime.textContent = sec > 9 ? `${min}:${sec}` : `${min}:0${sec}`;
  }
  currentTime.textContent = sec > 9 ? `${min}:${sec}` : `${min}:0${sec}`;
  if (Math.floor(maxTime) < sec) {
    clearInterval(playingInerval);
  }
}

// further functionality i will add later :)
// musicProgressBar.addEventListener("input", () => {});
