import {getRandomColor} from "./utils.js";

export class Container {
    width = 300;
    height = 300;
    containerElement;
    constructor(width_, height_, containerElement_) {
        this.height = height_;
        this.width = width_;
        this.containerElement = containerElement_;
    }
    init() {
        // this.containerElement.style.width = this.width + "px";
        // this.containerElement.style.height = this.height + "px";
    }

    randomBorder() {
        this.containerElement.style.borderColor = getRandomColor();
    }
}
