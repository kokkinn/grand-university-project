import {getUnitVector, randomIntFromInterval} from "./utils.js";

export class BallGame {
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
            console.log("a");
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
