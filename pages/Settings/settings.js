document.addEventListener("DOMContentLoaded", function () {
  const characterName = document.getElementById("character-name");
  const settingsBtn = document.querySelector(".settings__button");

  characterName.value = JSON.parse(characterInfo).name;

  settingsBtn.addEventListener("click", () => {
    let characterInfo = localStorage.getItem('characterInfo');

    if (!characterName.value || characterName.value.length < 1) {
      return;
    }

    try {
      if (characterInfo) {
        characterInfo = JSON.parse(characterInfo);
        characterInfo.name = characterName.value;
        localStorage.setItem("characterInfo", JSON.stringify(characterInfo));
      }
    } catch (e) {}
  });
});
