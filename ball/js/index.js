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

let containerWidth = window.innerWidth / 100 * 80;
if (window.innerWidth > 1000) containerWidth = window.innerWidth / 100 * 60;
const containerHeight = window.innerHeight / 100 * 70;
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
console.log(ballGame1.containerObject.width)
console.log(ballGame1.containerObject.height)
