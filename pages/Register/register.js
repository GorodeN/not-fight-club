document.addEventListener("DOMContentLoaded", function () {
  const characterName = document.getElementById("character-name");
  const registerBtn = document.querySelector(".register__button");

  registerBtn.addEventListener("click", () => {
    if (!characterName.value || characterName.value.length < 1) {
      characterName.value = "Guest";
    }

    const character = {
      name: characterName.value,
      avatar: "character1",
      wins: 0,
      loses: 0,
    };

    try {
      localStorage.setItem("characterInfo", JSON.stringify(character));
      if (characterName.value) location.href = "/pages/Main/main.html";
    } catch (e) {}
  });
});
