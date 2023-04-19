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
