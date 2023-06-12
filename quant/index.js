if (navigator.userAgent.toLowerCase().indexOf("safari") !== -1) {
  console.log("a");
  document.querySelectorAll("foreignObject div").forEach((s) => {
    if (window.innerWidth < 900) {
      s.style.transform = "scale(0.5) translate(-15px, -15px)";
    } else {
      console.log('A')
      // s.style.transform = "scale(0.5) translate(-15px, -20px)";
    }
  });
}
