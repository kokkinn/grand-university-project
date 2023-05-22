document.querySelectorAll(".ec-button").forEach((button) =>
  button.addEventListener("click", () => {
    const accordionContent = button.nextElementSibling;
    accordionContent.classList.toggle("ec-button-active");
    if (accordionContent.classList.contains("ec-button-active")) {
      accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
    } else {
      accordionContent.style.maxHeight = "0";
    }
  })
);

document.querySelectorAll(".item-project").forEach((item) => {
  item.addEventListener(
    "mouseover",
    function (event) {
      this.querySelector("div a img").classList.add("item-project-active");
    },
    false
  );
  item.addEventListener(
    "mouseleave",
    function (event) {
      this.querySelector("div a img").classList.remove("item-project-active");
    },
    false
  );
});

const buttonGoTop = document.querySelector(".button-gotop");
const triangles = document.querySelectorAll(".triangle");
let scrollTop = null;

// TODO maybe parallax scroll
window.addEventListener("scroll", () => {
  if (
    document.documentElement.scrollTop < scrollTop &&
    document.documentElement.scrollTop > 700
  ) {
    buttonGoTop.classList.remove("button-gt-hidden");
  } else {
    buttonGoTop.classList.add("button-gt-hidden");
  }

  scrollTop = document.documentElement.scrollTop;
  // if (scrollTop > 1) {
  //   triangles.forEach((triangle) => triangle.classList.add("triangle-hidden"));
  // } else {
  //   triangles.forEach((triangle) =>
  //     triangle.classList.remove("triangle-hidden")
  //   );
  // }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});
