const SUBJECTS = {
  calc: "Calculus",
  ie: "Internet Essentials",
  fl: "Foreign Language",
  prog: "Programming",
  dm: "Discrete Maths",
  la: "Linear Algebra",
  hou: "History of Ukraine",
  pe: "Physical Education",
  none: "-",
};

const LESSONS_TIME = {
  first: { start: "5:00", finish: "6:20" },
  second: { start: "6:30", finish: "7:50" },
  third: { start: "8:20", finish: "9:40" },
  fourth: { start: "9:50", finish: "11:10" },
  fifth: { start: "11:20", finish: "12:40" },
  sixth: { start: "12:50", finish: "13:10" },
};
const LESSONS_NUMBER = {
  first: "I",
  second: "II",
  third: "III",
  fourth: "IV",
  fifth: "V",
  sixth: "VI",
};
const scheduleData = {
  data: {
    monday: {
      first: SUBJECTS.calc,
      second: SUBJECTS.calc,
      third: SUBJECTS.fl,
      fourth: SUBJECTS.none,
      fifth: SUBJECTS.none,
      sixth: SUBJECTS.none,
    },
    tuesday: {
      first: SUBJECTS.ie,
      second: SUBJECTS.dm,
      third: SUBJECTS.prog,
      fourth: SUBJECTS.prog,
      fifth: SUBJECTS.none,
      sixth: SUBJECTS.none,
    },
    wednesday: {
      first: SUBJECTS.la,
      second: SUBJECTS.la,
      third: SUBJECTS.la,
      fourth: SUBJECTS.none,
      fifth: SUBJECTS.none,
      sixth: SUBJECTS.none,
    },
    thursday: {
      first: SUBJECTS.hou,
      second: SUBJECTS.prog,
      third: SUBJECTS.ie,
      fourth: SUBJECTS.none,
      fifth: SUBJECTS.none,
      sixth: SUBJECTS.none,
    },
    friday: {
      first: SUBJECTS.calc,
      second: SUBJECTS.calc,
      third: SUBJECTS.none,
      fourth: SUBJECTS.la,
      fifth: SUBJECTS.none,
      sixth: SUBJECTS.none,
    },
    saturday: {
      first: SUBJECTS.none,
      second: SUBJECTS.pe,
      third: SUBJECTS.none,
      fourth: SUBJECTS.none,
      fifth: SUBJECTS.none,
      sixth: SUBJECTS.none,
    },
    sunday: {
      first: SUBJECTS.none,
      second: SUBJECTS.none,
      third: SUBJECTS.none,
      fourth: SUBJECTS.none,
      fifth: SUBJECTS.none,
      sixth: SUBJECTS.none,
    },
  },
};

export { LESSONS_TIME, LESSONS_NUMBER, scheduleData };
