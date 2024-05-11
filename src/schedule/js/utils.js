/**
 * Modifies HH:MM date with provided offset in minutes
 * @param {String} time a time in H(H):M(M) format
 * @param {Number} offsetMinutes an offset from UTC in minutes
 * @return {string} modified time based on the offset
 */
function timeOfDayApplyUTC(time, offsetMinutes) {
  const padding = (num) => (num - 10 < 0 ? "0" + num : num);
  const split = time.split(":");
  const offsetSeconds = offsetMinutes * 60;
  let secondsPassed = split[0] * 60 * 60 + split[1] * 60;
  let res = secondsPassed + offsetSeconds;
  if (res < 0) res = 86400 + offsetSeconds;
  const hours = Math.floor(res / 3600);
  const minutes = (res - hours * 3600) / 60;
  return `${padding(hours)}:${padding(minutes)}`;
  // TODO simplify code and maths expressions
}

/**
 * Checks if current time (for local machine) belongs to a range of given starting and ending time
 * @param start starting date
 * @param end ending date
 * @return {boolean} true for current time is in range, else false
 */
function checkTimeIsInRange(start, end) {
  const currentDate = new Date();
  let startDate = new Date(currentDate.getTime());
  startDate.setHours(Number(start.split(":")[0]));
  startDate.setMinutes(Number(start.split(":")[1]));
  startDate.setSeconds(0);

  let endDate = new Date(currentDate.getTime());
  endDate.setHours(Number(end.split(":")[0]));
  endDate.setMinutes(Number(end.split(":")[1]));
  endDate.setSeconds(0);
  return startDate < currentDate && endDate > currentDate;
}

export { checkTimeIsInRange, timeOfDayApplyUTC };
