document.querySelectorAll(".ec-button").forEach((button) =>
  button.addEventListener("click", () => {
    const accordionContent = button.nextElementSibling;
    accordionContent.classList.toggle("ec-button-active");
    if (accordionContent.classList.contains("ec-button-active")) {
      accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
      // accordionContent.style.maxHeight = "10rem"; // TODO maybe scroll the problems
      //   accordionContent.style.overflow = "scroll";
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
