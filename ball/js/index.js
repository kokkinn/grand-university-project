function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
class Ball {
  ballElement;
  x;
  y;
  xDirection = 1;
  yDirection = 1;
  isMoving = false;
  speed = 4;
  constructor(ballElement_, initialX, initialY, ballDiameter) {
    this.ballElement = ballElement_;
    this.x = initialX;
    this.y = initialY;
    this.diameter = ballDiameter;
  }

  init() {
    this.ballElement.style.width = this.diameter + "px";
    this.ballElement.style.height = this.diameter + "px";
    this.ballElement.style.left = this.y + "px";
    this.ballElement.style.bottom = this.x + "px";
    this.isMoving = true;
    this.ballElement.addEventListener("mousedown", () => {
      this.yDirection = -this.yDirection;
      this.xDirection = -this.xDirection;
    });
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
}

class BallGame {
  ballObject;
  containerObject;
  statsElements;

  constructor(ballObject_, containerObject_, statsElements_) {
    this.ballObject = ballObject_;
    this.containerObject = containerObject_;
    this.statsElements = statsElements_;
  }

  logData() {
    this.statsElements.yd.innerText = this.ballObject.yDirection;
    this.statsElements.xd.innerText = this.ballObject.xDirection;
    this.statsElements.yc.innerText = this.ballObject.x;
    this.statsElements.xc.innerText = this.ballObject.y;
  }
  init() {
    document.addEventListener("keypress", (ev) => {
      if (ev.key === "s") {
        this.ballObject.isMoving = false;
      } else if (ev.key === "g") {
        this.ballObject.isMoving = true;
        requestAnimationFrame(this.ballStep);
      }
    });
    this.ballObject.isMoving = true;
    requestAnimationFrame(this.ballStep);
  }

  ballStep = () => {
    if (
      this.ballObject.y < 0 ||
      this.ballObject.y > this.containerObject.height - this.ballObject.diameter
    ) {
      this.ballObject.yDirection =
        randomIntFromInterval(1, 10) *
        (-this.ballObject.yDirection / Math.abs(this.ballObject.yDirection));

      this.ballObject.y =
        this.ballObject.y < 0
          ? 0
          : this.containerObject.height - this.ballObject.diameter;
    }
    if (
      this.ballObject.x < 0 ||
      this.ballObject.x > this.containerObject.width - this.ballObject.diameter
    ) {
      this.ballObject.xDirection =
        randomIntFromInterval(1, 10) *
        (-this.ballObject.xDirection / Math.abs(this.ballObject.xDirection));
      this.ballObject.x =
        this.ballObject.x < 0
          ? 0
          : this.containerObject.width - this.ballObject.diameter;
    }
    if (
      Math.abs(this.ballObject.yDirection) <
      Math.abs(this.ballObject.xDirection)
    ) {
      this.ballObject.y +=
        (this.ballObject.yDirection * this.ballObject.speed) /
        Math.abs(this.ballObject.xDirection);

      // this.ballObject.y = Math.round(this.ballObject.y * 100) / 100

      this.ballObject.x +=
        (this.ballObject.xDirection * this.ballObject.speed) /
        Math.abs(this.ballObject.xDirection);
    } else if (
      Math.abs(this.ballObject.yDirection) >
      Math.abs(this.ballObject.xDirection)
    ) {
      this.ballObject.y +=
        (this.ballObject.yDirection * this.ballObject.speed) /
        Math.abs(this.ballObject.yDirection);
      this.ballObject.x +=
        (this.ballObject.xDirection * this.ballObject.speed) /
        Math.abs(this.ballObject.yDirection);

      // this.ballObject.x = Math.round(this.ballObject.x * 100) / 100
    } else {
      this.ballObject.y +=
        (this.ballObject.yDirection * this.ballObject.speed) /
        Math.abs(this.ballObject.yDirection);
      this.ballObject.x +=
        (this.ballObject.xDirection * this.ballObject.speed) /
        Math.abs(this.ballObject.xDirection);
    }

    // this.ballObject.y += this.ballObject.yDirection
    // this.ballObject.x += this.ballObject.xDirection

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

const ballObj = new Ball(ballElement, 0, 0, 70);
const containerObj = new Container(400, 400, containerElement);
ballObj.init();
containerObj.init();
const ballGame1 = new BallGame(ballObj, containerObj, {
  yd: ydir,
  xd: xdir,
  yc: ycoor,
  xc: xcoor,
});
ballGame1.init();
