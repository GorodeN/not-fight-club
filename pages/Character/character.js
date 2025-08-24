document.addEventListener("DOMContentLoaded", function () {
  const BASE_PATH = window.location.pathname.includes('/not-fight-club/') 
  ? '/not-fight-club/' 
  : '/';

  const characterImg = document.querySelector(".character__image");
  const characterTypeRadios = document.querySelectorAll(
    '.character__change-type input[type="radio"]'
  );
  const characterName = document.querySelector(".character__name");
  const characterWins = document.querySelector(".character__wins-count");
  const characterLoses = document.querySelector(".character__loses-count");
  const characterChangeBtn = document.querySelector(".character__change-btn");

  characterImg.src = `${BASE_PATH}assets/characters/${
    JSON.parse(characterInfo).avatar
  }.png`;
  characterName.innerHTML = JSON.parse(characterInfo).name;
  characterWins.innerHTML = JSON.parse(characterInfo).wins;
  characterLoses.innerHTML = JSON.parse(characterInfo).loses;

  characterTypeRadios.forEach((characterRadio) => {
    let characterInfo = localStorage.getItem("characterInfo");

    characterInfo = JSON.parse(characterInfo);

    if (characterRadio.dataset.characterAvatar == characterInfo.avatar) {
      characterRadio.checked = true;
    }

    characterRadio.addEventListener("change", function () {
      if (this.checked) {
        characterImg.src = `${BASE_PATH}assets/characters/${characterRadio.dataset.characterAvatar}.png`;
      }
    });
  });

  characterChangeBtn.addEventListener("click", () => {
    let characterInfo = localStorage.getItem("characterInfo");

    let characterTypeRadioChecked = document.querySelector(
      '.character__change-type input[type="radio"]:checked'
    );

    try {
      if (characterInfo) {
        characterInfo = JSON.parse(characterInfo);
        characterInfo.avatar =
          characterTypeRadioChecked.dataset.characterAvatar;
        localStorage.setItem("characterInfo", JSON.stringify(characterInfo));
        alert("Avatar changed successfully");
      }
    } catch (e) {
      alert("Error:" + e);
    }
  });
});
