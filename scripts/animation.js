//Rocket images - might be dynamic on prod
const ROCKET_IMAGES = [
  'assets/rockets/1.svg',
  'assets/rockets/2.svg',
  'assets/rockets/1.svg',
  'assets/rockets/1.svg',
  'assets/rockets/2.svg',
  'assets/rockets/2.svg',
];

/* DECLARE STATIC ASSETS PRESETS */
const PRESETS = {
  preset1: {
    id: 'preset1',
    frameStart: 'assets/frames/preset1/start_1.svg',
    frameEnd: 'assets/frames/preset1/end_1.svg',
    frameFiller: 'assets/frames/preset1/center_1.svg',
    backScroll: 'assets/frames/preset1/back_1.png',
    planet: 'assets/planets/1.svg',
  },
  preset5: {
    id: 'preset5',
    frameStart: 'assets/frames/preset5/start.svg',
    frameEnd: 'assets/frames/preset5/end.svg',
    frameFiller: 'assets/frames/preset5/center.svg',
    backScroll: 'assets/frames/preset5/back.png',
    planet: 'assets/planets/5.svg',
  },
};

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

//Comets
const elComets = [...document.querySelectorAll('.item__comet')];

// Clock
const elMin = document.getElementById('minContainer');
const elSec = document.getElementById('secContainer');

/* CONTROLLERS */

//save & get duration from storage
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
    console.log(remainingTime);
    return remainingTime;
  }
}

/* ANIMATION CONTROLLER */

// set presets
// args - String[](rocket assets paths), PRESET(Current preset), Number(ms)
// const animate = new Animator(ROCKET_IMAGES, PRESETS.preset1, 30000);

// animate.init().start();
// init - inject assets
// start - start animation
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
      const newDuration = this.remainingAnimationTime(this.duration);
      if (!!~newDuration) {
        this.duration = newDuration;
      }
    } else {
      this.saveStartTime();
    }
    this.setEnding();
    this.startFrames();
    this.startRockets();
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
        this.min.parentElement.classList.add('clock--stop');
      }
    }, 1000);
  }
}

const animate = new Animator(ROCKET_IMAGES, PRESETS.preset5, 720000);
animate.init().start();
