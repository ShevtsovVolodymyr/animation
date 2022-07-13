/* DECLARE ELEMENTS */
// Frames
const elFrameStart = document.getElementById('frameStart');
const elFrameEnd = document.getElementById('frameEnd');
const elFrameFiller1 = document.getElementById('frameFiller1');
const elFrameFiller2 = document.getElementById('frameFiller2');

//Rockets
const elRockets = [...document.querySelectorAll('.item__rocket--inner')];

//Planet
const elPlanet = document.querySelector('.item__planet');

//Stones
const elStones = [...document.querySelectorAll('.item__stone')];

//Comets
const elComets = [...document.querySelectorAll('.item__comet')];

//Rocket images - array of image sorces
const ROCKET_IMAGES = [
  '/assets/rockets/rocket-1.svg',
  '/assets/rockets/rocket-1.svg',
  '/assets/rockets/rocket-1.svg',
];

// Presets of assets
const PRESETS = {
  preset1: {
    frameStart: '/assets/frames/preset1/start.jpeg',
    frameEnd: '/assets/frames/preset1/start.jpeg',
    frameFiller: '/assets/frames/preset1/filler.jpeg',
    planet: '/assets/planets/venus.svg',
  },
};

const ANIMATION_TIMINGS = {
  END: 6,
  BEFORE_END: 12,
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
  rockets = elRockets;
  rocketContainers = this.rockets.map(rocket => rocket.parentElement);
  comets = elComets;
  planet = elPlanet;
  interval = null;
  clockInterval = null;

  constructor(rocketImages, preset, duration) {
    super();
    this.rocketImages = rocketImages;
    this.preset = preset;
    this.duration = duration;
  }

  init() {
    // if (this.isAnimationStarted) {
    //   this.setFrames(false);
    // } else {
    //   this.setFrames(true);
    // }
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
    this.frameStart.style.backgroundImage = isNewAnimation
      ? `url(${this.preset.frameStart})`
      : `url(${this.preset.frameFiller})`;
    this.frameFiller1.style.backgroundImage = `url(${this.preset.frameFiller})`;
    this.frameFiller2.style.backgroundImage = `url(${this.preset.frameFiller})`;
    this.frameEnd.style.backgroundImage = `url(${this.preset.frameEnd})`;
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
      this.stopStones();
      this.frameEnd.classList.add('animate', 'animate--once');
      this.planet.classList.add('appear');
      this.rockets.forEach(rocket =>
        rocket.classList.add('scale-down-dissapear')
      );
      console.log('Animation ended at: ', new Date());
      this.clearSaved();
    }, this.duration - 12000);
  }
  startFrames() {
    this.frameStart.classList.add('animate', 'animate--once');
    [...document.querySelectorAll('.item__frame--filler')].forEach(frame =>
      frame.classList.add('animate')
    );
    // this.frameFiller1.classList.add('animate');
    // this.frameFiller2.classList.add('animate');
  }
  startRockets() {
    this.rocketContainers.forEach(rocket =>
      rocket.classList.add('animate-rocket')
    );
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
      const minTxt = document.querySelector('.clock-time--min');
      const secTxt = document.querySelector('.clock-time--sec');
      // const colon = document.querySelector('.clock__colon');
      minTxt.innerHTML = minutes;
      secTxt.innerHTML = seconds;
      if (distance < 0) {
        clearInterval(this.clockInterval);
        minTxt.innerHTML = '00';
        secTxt.innerHTML = '00';
      }
    }, 1000);
  }
}

const animate = new Animator(ROCKET_IMAGES, PRESETS.preset1, 60000);
animate.init();
