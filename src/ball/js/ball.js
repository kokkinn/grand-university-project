export class Ball {
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
