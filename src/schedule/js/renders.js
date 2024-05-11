import { checkTimeIsInRange, timeOfDayApplyUTC } from "./utils.js";
import { LESSONS_NUMBER, LESSONS_TIME } from "./scheduleData.js";
import { DAY_NAMES, MONTH_NAMES } from "./constants.js";
import { refreshCurrLessonNode } from "./index.js";

/**
 *
 * @param {Element} tableBodyNode A table body node to append trs
 * @param {Object} scheduleData A schedule presented as a JS object, sample is stored into ./scheduleData.js
 * @param {Number} currUtc A positive delay from UTC
 * @return {null}
 */
function renderTableBodyFromData(tableBodyNode, scheduleData, currUtc) {
  let tableBody = "";
  for (const weekday in scheduleData.data) {
    tableBody += `<tr>
                    <td class="td-weekday ${weekday}" rowspan="7">
                    <div>
                        ${
                          weekday.charAt(0).toUpperCase() + weekday.slice(1)
                        }</div>
                    </td>
                  </tr>`;
    for (const lessonNumber in scheduleData.data[weekday]) {
      const lessonName = encodeURIComponent(
        scheduleData.data[weekday][lessonNumber]
      );
      tableBody += `<tr data-ln=${lessonNumber} data-sn=${lessonName}>
                        <td class="${weekday}">${LESSONS_NUMBER[lessonNumber]}</td>
                        <td class="${weekday} td-lesson-time"></td>
                        <td class="${weekday}">${scheduleData.data[weekday][lessonNumber]}</td>
                    </tr>`;
    }
  }
  tableBodyNode.innerHTML = tableBody;
  renderTimeInTable(document.querySelectorAll(".td-lesson-time"), currUtc);
}

/**
 * Based on given UTC offset in minutes created new lessons time, appends new time to corresponding node
 * (based on the lesson number). Adds data-fn, data-st attributes, which are required by current lesson procedure.
 * @param tdsWithTime {NodeListOf[NodeList]} a list of nodes, that are TDs of table row with lesson time
 * @param utc_offset {Number} a utc offset from 0
 */
function renderTimeInTable(tdsWithTime, utc_offset) {
  // having an object with UTC+0 time for lesson, we produce a new object with offset
  let newTime = {};
  for (const lesson_number in LESSONS_TIME) {
    newTime[lesson_number] = {
      start: timeOfDayApplyUTC(
        LESSONS_TIME[lesson_number]["start"],
        utc_offset
      ),
      finish: timeOfDayApplyUTC(
        LESSONS_TIME[lesson_number]["finish"],
        utc_offset
      ),
    };
  }

  tdsWithTime.forEach((td) => {
    td.innerText = `${newTime[td.parentElement.dataset.ln].start} - ${
      newTime[td.parentElement.dataset.ln].finish
    }`;
    td.parentElement.setAttribute(
      "data-st",
      newTime[td.parentElement.dataset.ln].start
    );
    td.parentElement.setAttribute(
      "data-fn",
      newTime[td.parentElement.dataset.ln].finish
    );
  });
}

/**
 * Appends text to lesson div
 * @param currentLessonNode HTML node to append text (about lesson)
 */
function renderCurrentLesson(currentLessonNode) {
  const removePreviousTimeCellHighlight = (ln) => {
    ln.current.parentElement.style.removeProperty("background-color");
    ln.current.parentElement.style.removeProperty("color");
    ln.current = null;
  };

  let isLesson = false;
  const timeCellsForCurrentWeekDay = document.querySelectorAll(
    `.${DAY_NAMES[new Date().getDay()].toLowerCase()}.td-lesson-time`
  );
  timeCellsForCurrentWeekDay.forEach((timeCell) => {
    if (
      checkTimeIsInRange(
        timeCell.parentElement.dataset.st,
        timeCell.parentElement.dataset.fn
      )
    ) {
      isLesson = true;

      if (currentLessonNode.current != null)
        removePreviousTimeCellHighlight(currentLessonNode);
      timeCell.parentElement.style.backgroundColor = "#785964";
      timeCell.parentElement.style.color = "#eed0d0";
      currentLessonNode.current = timeCell;
      let string;
      if (decodeURIComponent(timeCell.parentElement.dataset.sn) === "-") {
        string = "No lesson!!!";
      } else {
        string = `Current lesson is ${decodeURIComponent(
          timeCell.parentElement.dataset.sn
        )}`;
      }
      refreshCurrLessonNode(`${string}`);
    }
  });
  if (isLesson === false) {
    if (currentLessonNode.current != null)
      removePreviousTimeCellHighlight(currentLessonNode);

    if (
      checkTimeIsInRange(
        timeCellsForCurrentWeekDay[0].parentElement.dataset.st,
        timeCellsForCurrentWeekDay[timeCellsForCurrentWeekDay.length - 1]
          .parentElement.dataset.fn
      )
    ) {
      refreshCurrLessonNode("It's break time :>");
    } else {
      refreshCurrLessonNode("No more university for today !!!");
    }
  }
}

/**
 * Creates a date string and appends it to the node
 * @param dateTextNode {Element} a node which should contain a date string
 */
function renderDateNode(dateTextNode) {
  const padding = (num) => (num - 10 < 0 ? "0" + num : num);
  const curDate = new Date();
  dateTextNode.innerHTML = `Today is ${
    DAY_NAMES[curDate.getDay()]
  }, ${curDate.getDate()} of ${MONTH_NAMES[curDate.getMonth()]}, ${padding(
    curDate.getHours()
  )}:${padding(curDate.getMinutes())}:${padding(curDate.getSeconds())}`;
}

export {
  renderTimeInTable,
  renderTableBodyFromData,
  renderCurrentLesson,
  renderDateNode,
};
