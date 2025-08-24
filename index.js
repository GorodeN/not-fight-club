const characterInfo = localStorage.getItem("characterInfo") || null;

const BASE_PATH = window.location.pathname.includes("/not-fight-club/")
  ? "/not-fight-club/"
  : "/";

function loadCharacter() {
  if (!characterInfo) {
    try {
      if (!location.href.includes("pages/Register/register.html")) {
        location.href = BASE_PATH + "pages/Register/register.html";
      }
    } catch (e) {}
  }
}

loadCharacter();
