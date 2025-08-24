const characterInfo = localStorage.getItem("characterInfo") || null;

function loadCharacter() {
  if (!characterInfo) {
    try {
      if (!location.href.includes("pages/Register/register.html")) {
        location.href = "pages/Register/register.html";
      }
    } catch (e) {}
  }
}

loadCharacter();
