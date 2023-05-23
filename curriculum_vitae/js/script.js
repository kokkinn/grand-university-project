import { renderEolympData } from "./render.js";
import { eolympData } from "../data/eolympData.js";
import { setUpEventListeners } from "./setUpEventListeners.js";

renderEolympData(eolympData, document.querySelector(".eolymp-contest-list"));
setUpEventListeners();
