import {Container} from "./container.js";
import {Ball} from "./ball.js";
import {BallGame} from "./ballGame.js";

const ballElement = document.querySelector("#ball");
const containerElement = document.querySelector("#ball-container");

const ydir = document.querySelector("#ydir");
const xdir = document.querySelector("#xdir");
const xcoor = document.querySelector("#xcoor");
const ycoor = document.querySelector("#ycoor");
const speed = 10;
const ballObj = new Ball(ballElement, 0, 0, 70, speed);

const containerWidth = containerElement.getBoundingClientRect().width - 32;
const containerHeight = containerElement.getBoundingClientRect().height - 32;
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
