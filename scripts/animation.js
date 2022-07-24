/* DECLARE ELEMENTS */

// Frames
const elFrameStart = document.getElementById('frameStart');
const elFrameEnd = document.getElementById('frameEnd');
const elFrameFiller1 = document.getElementById('frameFiller1');
const elFrameFiller2 = document.getElementById('frameFiller2');
const elBackScroll = document.getElementById('frameBack');

//Rockets
const elRocketStarters = document.getElementById('rocketStarters');
const elRocketContainer = document.getElementById('rocketContainer');
const elRockets = [...document.querySelectorAll('.item__rocket')];

//Planet
const elPlanet = document.getElementById('planetContainer');

//Stones
// const elStones = [...document.querySelectorAll('.item__stone')];

//Comets
const elComets = [...document.querySelectorAll('.item__comet')];

// Clock
const elMin = document.getElementById('minContainer');
const elSec = document.getElementById('secContainer');

//Rocket images - array of image sorces
const ROCKET_IMAGES = [
  'assets/rockets/1.svg',
  'assets/rockets/2.svg',
  'assets/rockets/1.svg',
  'assets/rockets/1.svg',
  'assets/rockets/2.svg',
  'assets/rockets/2.svg',
];

// Presets of assets
const PRESETS = {
  preset1: {
    id: 'preset1',
    frameStart: 'assets/frames/preset1/start.svg',
    frameEnd: 'assets/frames/preset1/end.svg',
    frameFiller: 'assets/frames/preset1/center.svg',
    backScroll: 'assets/frames/preset1/back.svg',
    planet: 'assets/planets/1.svg',
  },
};

class StorageController {
  saveStartTime() {
    localStorage.setItem('animation-started-at', JSON.stringify(Date.now()));
  }
  clearSaved() {
    localStorage.removeItem('animation-started-at');
  }
  get isAnimationStarted() {
    return !!localStorage.getItem('animation-started-at');
  }
  remainingAnimationTime(duration) {
    const startTime = +JSON.parse(localStorage.getItem('animation-started-at'));
    const timeNow = Date.now();
    const remainingTime = duration - (timeNow - startTime);

    return remainingTime;
  }
}

class Animator extends StorageController {
  frameStart = elFrameStart;
  frameFiller1 = elFrameFiller1;
  frameFiller2 = elFrameFiller2;
  frameEnd = elFrameEnd;
  backScroll = elBackScroll;
  rocketStarters = elRocketStarters;
  rockets = elRockets;
  rocketContainer = elRocketContainer;
  comets = elComets;
  planet = elPlanet;
  interval = null;
  min = elMin;
  sec = elSec;
  clockInterval = null;

  constructor(rocketImages, preset, duration) {
    super();
    this.rocketImages = rocketImages;
    this.preset = preset;
    this.duration = duration;
  }

  init() {
    if (this.isAnimationStarted) {
      this.setFrames(false);
    } else {
      this.setFrames(true);
    }
    this.setRockets();

    return this;
  }
  start() {
    if (this.isAnimationStarted) {
      this.duration = this.remainingAnimationTime(this.duration);
    } else {
      this.saveStartTime();
    }
    this.setEnding();
    this.startFrames();
    this.startRockets();
    // this.startStones();
    this.startCountdown();
  }
  setFrames(isNewAnimation) {
    this.frameFiller1.parentElement.classList.add(this.preset.id);
    if (!isNewAnimation) {
      this.rocketStarters.style.display = 'none';
    }
    this.frameStart.style.backgroundImage = isNewAnimation
      ? `url(${this.preset.frameStart})`
      : `url(${this.preset.frameFiller})`;
    this.frameFiller1.style.backgroundImage = `url(${this.preset.frameFiller})`;
    this.frameFiller2.style.backgroundImage = `url(${this.preset.frameFiller})`;
    this.frameEnd.style.backgroundImage = `url(${this.preset.frameEnd})`;
    this.backScroll.style.backgroundImage = `url(${this.preset.backScroll})`;
    this.planet.style.backgroundImage = `url(${this.preset.planet})`;
  }
  setRockets() {
    this.rocketImages.forEach((image, index) => {
      this.rockets[index].style.backgroundImage = `url(${image})`;
    });
  }
  setEnding() {
    console.log('Animation started at: ', new Date());
    setTimeout(() => {
      this.stopComets();
      // this.stopStones();
      this.frameEnd.classList.add('animate', 'animate--once');
      this.planet.classList.add('appear');
      console.log('Animation ended at: ', new Date());
      this.clearSaved();
    }, this.duration - 9000);
  }
  startFrames() {
    this.frameStart.classList.add('animate', 'animate--once');
    [...document.querySelectorAll('.item__frame--filler')].forEach(frame =>
      frame.classList.add('animate')
    );
    this.frameFiller1.classList.add('animate');
    this.frameFiller2.classList.add('animate');
  }
  startRockets() {
    this.rocketContainer.classList.add('start');
    setTimeout(() => {
      this.rockets.forEach(rocket => rocket.classList.add('animate-rocket'));
    }, 1500);
  }
  stopComets() {
    this.comets.forEach(comet => comet.classList.add('animate--once'));
  }
  // startStones() {
  //   const interval = setInterval(() => {
  //     this.stones.forEach(stone => stone.classList.toggle('animate'));
  //   }, 4850);
  //   this.interval = interval;
  // }
  stopStones() {
    this.stones.forEach(stone => stone.classList.add('animate--once'));
    clearInterval(this.interval);
  }
  startCountdown() {
    const contdownTo = new Date(Date.now() + this.duration);
    this.clockInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = contdownTo - now;
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      this.min.innerText = minutes;
      this.sec.innerText = seconds;
      if (distance < 0) {
        clearInterval(this.clockInterval);
        this.min.innerText = '00';
        this.sec.innerText = '00';
        this.min.parentElement.classList.add('clock--fade');
      }
    }, 1000);
  }
}

const animate = new Animator(ROCKET_IMAGES, PRESETS.preset1, 30000);
animate.init().start();
