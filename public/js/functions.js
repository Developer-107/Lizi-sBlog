// ---------------- Navbar scrolling function -----------------------

const navbar = document.getElementById("navbar");
const navHeight = navbar.offsetHeight;


let lastScrollTop = 0;

// Start at normal position
navbar.style.top = "0px";

window.addEventListener("scroll", function() {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    // Scrolling down → hide navbar
    navbar.style.top = `-${navHeight}px`;
    navbar.classList.remove("scrolled-up");
  } else if (lastScrollTop > currentScroll) {
    // Scrolling up → show navbar ONLY if not at very top
      if (currentScroll > 40){
      navbar.style.top = "0px";
      navbar.classList.add("scrolled-up"); // optional style
    } else {
      // At very top → leave navbar in normal starting position
      navbar.style.top = "0px";
      navbar.classList.remove("scrolled-up");}
    }
  

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});