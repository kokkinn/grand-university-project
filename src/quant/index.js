// if (navigator.userAgent.toLowerCase().indexOf("safari") !== -1) {
//   console.log("a");
//   document.querySelectorAll("foreignObject div").forEach((s) => {
//     if (window.innerWidth < 900) {
//       s.style.transform = "scale(0.5) translate(-15px, -15px)";
//     } else {
//
//       // s.style.transform = "scale(0.5) translate(-15px, -20px)";
//     }
//   });
// }

const solutionContainer = document.querySelector("#solution-container");
const seeSolution = document.querySelector("#cas")
const hideSolution = document.querySelector('#has')
// const svg1Container = document.querySelector('#svg-c-1')
// const svg2Container = document.querySelector('#svg-c-2')
// svg1Container.addEventListener('click', ()=>{
//   svg1Container.classList.toggle('svg-c-active')
// })
solutionContainer.addEventListener("click", (ev) => {
  solutionContainer.style.filter = "blur(0)";
  seeSolution.style.display = "none";
  solutionContainer.style.cursor = "auto";
  hideSolution.style.opacity = '1'
});
hideSolution.addEventListener('click', ()=>{
  solutionContainer.style.filter = "blur(8px)";
  seeSolution.style.display = "block";
  if (isTouchDevice()){
    seeSolution.style.opacity = "1";
  }
  solutionContainer.style.cursor = "pointer";
  hideSolution.style.opacity = '0'
})
solutionContainer.addEventListener("mouseover", () => {
  seeSolution.style.opacity = '1';
});

solutionContainer.addEventListener("mouseleave", () => {
  seeSolution.style.opacity = 0;
});
function isTouchDevice() {
  return (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0));
}
if (isTouchDevice()){
  seeSolution.style.opacity = '1 !important'
}
