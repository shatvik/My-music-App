// var imageLink = "https://source.unsplash.com/random/1680x3000/?night";
var defaultSongIndex = 0;
var imageTag = document.querySelector(".image-tag");

var musicProgressBar = document.querySelector(".music-progress-bar");
var progressLoader = 0;
var checker = 0;
var currentTime = document.querySelector(".current-time");
var totalTime = document.querySelector(".total-time");
var sett;
var musicName = document.querySelector(".music-name");
// mew code :
var repeatBtn = document.querySelector(".repeat-button");
var shuffleBtn = document.querySelector(".shuffle-button");
window.addEventListener("load", () => {
  //document.body.style.backgroundImage = `url(${imageLink})`;
  // imageTag.setAttribute("src", "Narayan.jpg");
  //imageTag.setAttribute("src", imageLink);
  //imageTag.setAttribute("alt", "");
  document.querySelector(".music-image-box").style.animationPlayState =
    "paused";
});

var songs = [
  {
    name: "Pata nahi kis roop me aakar",
    src: "Ram_Darshan.mp3",
    img: "Narayan.jpg",
  },
  {
    name: "The Boys (Bones)",
    src: "Bones.mp3",
    img: "bones.png",
  },
  {
    name: "Party With Jagaban",
    src: "Midas_The_Jagaban_PartyWithAJagaban.mp3",
    img: "jagaban.jpg",
  },
  {
    name: "Habibi (remix)",
    src: "habibi.mp3",
    img: "Habibi.png",
  },
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
  {
    name: "NUNCA MUDA FUNK",
    src: "NUNCA_MUDA.mp3",
    img: "nunca-muda.jpeg",
  },
  {
    name: "PASSO BEM SOLTO",
    src: "PASSO_BEM_SOLTO.mp3",
    img: "passo-bem-solto.jpg",
  },
  {
    name: "SLAVA FUNK",
    src: "SLAVA_FUNK.mp3",
    img: "slava-funk.jpeg",
  },
  {
    name: "Snowman - Sia",
    src: "Snowman.mp3",
    img: "snowman.jpeg",
  },
];
var audio = document.querySelector(".song-here");
var source = document.querySelector("source");
audio.src = songs[defaultSongIndex].src;
musicName.innerHTML = songs[defaultSongIndex].name;
// new code
imageTag.setAttribute("src", songs[defaultSongIndex].img);
// Buttons
var shufflebtn = document.querySelector(".shuffle-button");
var repeatbtn = document.querySelector(".repeat-button");
var playBtn = document.querySelector(".play-button");
var prevBtn = document.querySelector(".backward-button");
var nextBtn = document.querySelector(".forward-button");
var soundbar = document.querySelector(".soundbar");
var playicon = document.querySelector("#p");
var songSpeed = 1;
// new code
var prev_speed = 1;
var prev_vol = 0.5;

var curTime;
var maxTime;

var playingInterval;
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
  prev_speed = e.target.value;
  playingInterval = setInterval(playingMusic, playspeed.value * 1000);
});

soundbar.addEventListener("input", (e) => {
  audio.volume = e.target.value;
  prev_vol = e.target.value;
});

shufflebtn.addEventListener("click", () => {
  shufflebtn.classList.toggle("active-btn");
});
repeatbtn.addEventListener("click", () => {
  repeatbtn.classList.toggle("active-btn");
});

prevBtn.addEventListener("click", () => {
  clearInterval(playingInterval);
  notPaused = false;
  isPrevClicked = true;
  if (defaultSongIndex < 0) {
    defaultSongIndex = songs.length - 1;
  } else if (defaultSongIndex == 0) {
    defaultSongIndex = songs.length - 1;
    // console.log(defaultSongIndex % songs.length);
    audio.src = songs[songs.length - 1].src;
    musicName.innerHTML = songs[songs.length - 1].name;
    // new code
    imageTag.setAttribute("src", songs[songs.length - 1].img);
    audio.play();
    audio.playbackRate = prev_speed;
    audio.volume = prev_vol;
  } else {
    defaultSongIndex--;
    // console.log(defaultSongIndex % songs.length);
    audio.src = songs[defaultSongIndex % songs.length].src;
    musicName.innerHTML = songs[defaultSongIndex % songs.length].name;
    // new code
    imageTag.setAttribute("src", songs[defaultSongIndex % songs.length].img);
    audio.play();
    audio.playbackRate = prev_speed;
    audio.volume = prev_vol;
  }
});
nextBtn.addEventListener("click", PlayNextSong);

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
  // console.log(checker);
  totalTime.textContent =
    Math.floor(maxTime / 60) + ":" + Math.floor(maxTime % 60);
  musicProgressBar.setAttribute("min", "0");
  musicProgressBar.setAttribute("max", `${Math.floor(maxTime)}`);
  musicProgressBar.setAttribute("value", "0");
  playingInterval = setInterval(playingMusic, playspeed.value * 1000);
};
audio.onpause = function () {
  clearInterval(playingInterval);
  notPaused = true;
  isPlayingNow = false;
  playicon.classList.remove("fa-pause");
  playicon.classList.add("fa-play");
};

function playingMusic() {
  if (isNextClicked || isPrevClicked) {
    clearInterval(playingInterval);
  }
  if (!isPlayingNow) {
    clearInterval(playingInterval);
  }
  console.log(((sec + min * 60) / checker) * 100);
  console.log(sec + min + 60);
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
    clearInterval(playingInterval);
  }
  if(audio.paused) clearInterval(playingInterval)
}
// new code :
repeatBtn.addEventListener("click", () => {
  if (repeatBtn.classList.contains("active-btn") && !isPlayingNow) {
    clearInterval(playingInterval);
    notPaused = false;
    isNextClicked = true;
    audio.play();
  } else {
    playBtn.addEventListener("click", () => {
      // console.log(songSpeed);
      isPlayingNow ? audio.pause() : audio.play();
    });
  }
});

// play next song :
function PlayNextSong() {
  clearInterval(playingInterval);
  notPaused = false;
  isNextClicked = true;
  if (defaultSongIndex >= songs.length - 1) {
    defaultSongIndex = 0;
    // console.log(defaultSongIndex % songs.length);
    audio.src = songs[defaultSongIndex % songs.length].src;
    musicName.innerHTML = songs[defaultSongIndex % songs.length].name;
    // new code
    imageTag.setAttribute("src", songs[defaultSongIndex % songs.length].img);
    audio.play();
    audio.playbackRate = prev_speed;
    audio.volume = prev_vol;
  } else {
    defaultSongIndex++;
    // console.log(defaultSongIndex % songs.length);
    audio.src = songs[defaultSongIndex % songs.length].src;
    musicName.innerHTML = songs[defaultSongIndex % songs.length].name;
    // new code
    imageTag.setAttribute("src", songs[defaultSongIndex % songs.length].img);
    audio.play();
    audio.playbackRate = prev_speed;
    audio.volume = prev_vol;
  }
}

// further functionality i will add later :)
// musicProgressBar.addEventListener("input", () => {});
