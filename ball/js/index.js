import {
  getRandomColor,
  getUnitVector,
  randomIntFromInterval,
} from "./utils.js";

class Ball {
  ballElement;
  x;
  y;
  xDirection = 1;
  yDirection = 3;
  yDNormalized;
  xDNormalized;
  isMoving = false;
  speed;
  constructor(ballElement_, initialX, initialY, ballDiameter, speed_) {
    this.ballElement = ballElement_;
    this.x = initialX;
    this.y = initialY;
    this.diameter = ballDiameter;
    this.speed = speed_;
  }

  init() {
    this.ballElement.style.width = this.diameter + "px";
    this.ballElement.style.height = this.diameter + "px";
    this.ballElement.style.left = this.y + "px";
    this.ballElement.style.bottom = this.x + "px";
    this.isMoving = true;
  }
  changeDirection() {
    this.yDNormalized = -this.yDNormalized;
    this.xDNormalized = -this.xDNormalized;
    this.xDirection = -this.xDirection;
    this.yDirection = -this.yDirection;
  }
  playHitSound() {
    // const audio = new Audio("audio/punch.mp3");
    // audio.play();
  }
}

class Container {
  width = 300;
  height = 300;
  containerElement;
  constructor(width_, height_, containerElement_) {
    this.height = height_;
    this.width = width_;
    this.containerElement = containerElement_;
  }
  init() {
    this.containerElement.style.width = this.width + "px";
    this.containerElement.style.height = this.height + "px";
  }

  randomBorder() {
    this.containerElement.style.borderColor = getRandomColor();
  }
}

class BallGame {
  ballObject;
  containerObject;
  statsElements;
  speedRangeElement;

  constructor(
    ballObject_,
    containerObject_,
    statsElements_,
    speedRangeElement_
  ) {
    this.ballObject = ballObject_;
    this.containerObject = containerObject_;
    this.statsElements = statsElements_;
    this.speedRangeElement = speedRangeElement_;
  }

  logData() {
    this.statsElements.yd.innerText = this.ballObject.yDirection;
    this.statsElements.xd.innerText = this.ballObject.xDirection;
    this.statsElements.xc.innerText = Math.floor(this.ballObject.x);
    this.statsElements.yc.innerText = Math.floor(this.ballObject.y);
  }
  init() {
    this.speedRangeElement.addEventListener("input", (ev) => {
      console.log('a')
      this.ballObject.speed = ev.target.value;
    });

    const initialNormalizedVector = getUnitVector(
      this.ballObject.xDirection,
      this.ballObject.yDirection
    );
    this.ballObject.yDNormalized = initialNormalizedVector.at(1);
    this.ballObject.xDNormalized = initialNormalizedVector.at(0);

    window.addEventListener("keydown", (ev) => {
      switch (ev.code) {
        case "Space":
          this.ballObject.changeDirection();
          break;
        case "s":
          this.ballObject.isMoving = false;
          break;
        case "g":
          this.ballObject.isMoving = true;
          requestAnimationFrame(this.ballStep);
          break;
      }
    });
    this.ballObject.ballElement.addEventListener("mousedown", () => {
      this.ballObject.changeDirection();
    });
    this.ballObject.isMoving = true;
    requestAnimationFrame(this.ballStep);
  }

  ballStep = () => {
    if (
      this.ballObject.y + this.ballObject.yDirection < 0 ||
      this.ballObject.y + this.ballObject.yDirection >
        this.containerObject.height - this.ballObject.diameter
    ) {
      this.ballObject.playHitSound();
      this.containerObject.randomBorder();
      // collied with top or bottom

      this.ballObject.y =
        this.ballObject.y + this.ballObject.yDirection < 0
          ? 0
          : this.containerObject.height - this.ballObject.diameter;
      this.ballObject.yDirection = -this.ballObject.yDirection;
      this.ballObject.yDirection =
        randomIntFromInterval(1, 5) *
        (this.ballObject.yDirection / Math.abs(this.ballObject.yDirection));
      const unitVector = getUnitVector(
        this.ballObject.xDirection,
        this.ballObject.yDirection
      );
      this.ballObject.xDNormalized = unitVector.at(0);
      this.ballObject.yDNormalized = unitVector.at(1);
    } else if (
      this.ballObject.x + this.ballObject.xDirection < 0 ||
      this.ballObject.x + this.ballObject.xDirection >
        this.containerObject.width - this.ballObject.diameter
    ) {
      // collied with left or right
      this.ballObject.playHitSound();
      this.containerObject.randomBorder();
      this.ballObject.x =
        this.ballObject.x + this.ballObject.xDirection < 0
          ? 0
          : this.containerObject.width - this.ballObject.diameter;
      this.ballObject.xDirection = -this.ballObject.xDirection;
      this.ballObject.xDirection =
        randomIntFromInterval(1, 5) *
        (this.ballObject.xDirection / Math.abs(this.ballObject.xDirection));
      const unitVector = getUnitVector(
        this.ballObject.xDirection,
        this.ballObject.yDirection
      );

      this.ballObject.xDNormalized = unitVector.at(0);
      this.ballObject.yDNormalized = unitVector.at(1);
    }
    this.ballObject.x += this.ballObject.xDNormalized * this.ballObject.speed;
    this.ballObject.y += this.ballObject.yDNormalized * this.ballObject.speed;

    this.ballObject.ballElement.style.left = this.ballObject.x + "px";
    this.ballObject.ballElement.style.bottom = this.ballObject.y + "px";
    this.logData();
    if (this.ballObject.isMoving) {
      requestAnimationFrame(this.ballStep);
    }
  };
}

const ballElement = document.querySelector("#ball");
const containerElement = document.querySelector("#ball-container");

const ydir = document.querySelector("#ydir");
const xdir = document.querySelector("#xdir");
const xcoor = document.querySelector("#xcoor");
const ycoor = document.querySelector("#ycoor");
const speed = 10;
const ballObj = new Ball(ballElement, 0, 0, 70, speed);

const containerWidth = (window.innerWidth / 100) * 50;
const containerHeight = (window.innerHeight / 100) * 60;

const containerObj = new Container(
  containerWidth,
  containerHeight,
  containerElement
);
ballObj.init();
containerObj.init();

const speedRange = document.querySelector("#input-speed-range");
const ballGame1 = new BallGame(
  ballObj,
  containerObj,
  {
    yd: ydir,
    xd: xdir,
    yc: ycoor,
    xc: xcoor,
  },
  speedRange
);
ballGame1.init();
