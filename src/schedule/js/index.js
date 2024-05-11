import { scheduleData } from "./scheduleData.js";
import {
  renderCurrentLesson,
  renderDateNode,
  renderTableBodyFromData,
} from "./renders.js";

const currTimezoneOffsetMinutes = -new Date().getTimezoneOffset();
const currentLessonNode = { current: null };
const currentLessonString = { current: null };
export const refreshCurrLessonNode = (currLessonName) => {
  document.querySelector("#nc-subject").innerText = currLessonName;
};

// render table body with data from ./scheduleData.js
renderTableBodyFromData(
  document.querySelector("tbody"),
  scheduleData,
  currTimezoneOffsetMinutes
);

// fill current date and set auto refresh
const dateNode = document.querySelector("#nc-date")
renderDateNode(dateNode);
window.setInterval(() => {
  renderDateNode(dateNode);
}, 1000);

// fill current lesson and set auto refresh
renderCurrentLesson(currentLessonNode, currentLessonString);
window.setInterval(() => {
  renderCurrentLesson(currentLessonNode);
}, 5000);

// if (navigator.userAgent.search("Safari") > -1) {
//   display = 'inline-block';
// }
