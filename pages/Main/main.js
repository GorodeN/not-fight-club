document.addEventListener("DOMContentLoaded", function () {
  const BASE_PATH = window.location.pathname.includes('/not-fight-club/') 
  ? '/not-fight-club/' 
  : '/';

  const config = {
    maxHealth: 120,
    damage: 20,
    critChance: 0.15,
    critMultiplier: 1.6,
  };

  const enemies = {
    enemy1: {
      name: "Ultron",
      avatar: "enemy1",
      attackCount: 2,
      defenceCount: 1,
    },
    enemy2: {
      name: "Thanos",
      avatar: "enemy2",
      attackCount: 1,
      defenceCount: 3,
    },
  };

  const startFightBlock = document.querySelector(".main__start-fight");
  const startFightBtn = document.querySelector(".main__fight-btn");

  const battleBlock = document.querySelector(".main__battle");

  const characterName = document.querySelector(".battle__character-name");
  const characterImg = document.querySelector(".battle__character-image");
  const characterHealthProgress = document.querySelector(
    ".battle__character-health--progress"
  );
  const characterHealthRemaining = document.querySelector(
    ".battle__character-health--remaining"
  );
  const characterHealthGeneral = document.querySelector(
    ".battle__character-health--general"
  );

  const enemyName = document.querySelector(".battle__enemy-name");
  const enemyImg = document.querySelector(".battle__enemy-image");
  const enemyHealthProgress = document.querySelector(
    ".battle__enemy-health--progress"
  );
  const enemyHealthRemaining = document.querySelector(
    ".battle__enemy-health--remaining"
  );
  const enemyHealthGeneral = document.querySelector(
    ".battle__enemy-health--general"
  );

  const defenceCheckboxes = document.querySelectorAll(
    '.zones__defence input[type="checkbox"]'
  );

  const attackBtn = document.querySelector(".main__attack-btn");
  const newFightBtn = document.querySelector(".main__new-fight-btn");

  const battleLog = document.querySelector(".battle__log");

  let character, enemy, battleState, battleLogs;
  const attackZones = ["Head", "Neck", "Body", "Belly", "Legs"];

  function init() {
    character = JSON.parse(localStorage.getItem("characterInfo"));

    battleState = JSON.parse(localStorage.getItem("battleState")) || null;
    battleLogs = JSON.parse(localStorage.getItem("battleLogs")) || [];

    if (battleState) {
      loadBattleState();
    } else {
      resetBattle();
    }

    defenceCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", updateDefenceOptions);
    });

    startFightBtn.addEventListener("click", startBattle);
    attackBtn.addEventListener("click", handleAttack);
    newFightBtn.addEventListener("click", newBattle);

    newFightBtn.style.display = "none";
  }

  function loadBattleState() {
    enemy = battleState.enemy;

    characterName.textContent = character.name;
    characterImg.src = `${BASE_PATH}assets/characters/${character.avatar}.png`;
    enemyName.textContent = enemy.name;
    enemyImg.src = `${BASE_PATH}assets/enemies/${enemy.avatar}.png`;

    updateHealth();
    updateDefenceOptions();
    displayLogs();

    startFightBlock.style.display = "none";
    battleBlock.style.display = "block";

    if (battleState.character.health <= 0 || battleState.enemy.health <= 0) {
      endBattleUI();
    }
  }

  function resetBattle() {
    characterHealthProgress.value = config.maxHealth;
    characterHealthRemaining.textContent = config.maxHealth;
    characterHealthGeneral.textContent = config.maxHealth;

    enemyHealthProgress.value = config.maxHealth;
    enemyHealthRemaining.textContent = config.maxHealth;
    enemyHealthGeneral.textContent = config.maxHealth;

    battleLog.innerHTML = "";

    defenceCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
      checkbox.disabled = false;
    });

    attackBtn.disabled = true;
  }

  function updateDefenceOptions() {
    const checkedCount = document.querySelectorAll(
      '.zones__defence input[type="checkbox"]:checked'
    ).length;

    defenceCheckboxes.forEach((checkbox) => {
      if (checkedCount >= 2 && !checkbox.checked) {
        checkbox.disabled = true;
      } else {
        checkbox.disabled = false;
      }
    });

    attackBtn.disabled = checkedCount !== 2;
  }

  function startBattle() {
    const selectedEnemy = document.querySelector('input[name="enemy"]:checked')
      .dataset.enemy;
    enemy = { ...enemies[selectedEnemy] };

    battleState = {
      character: { ...character, health: config.maxHealth },
      enemy: { ...enemy, health: config.maxHealth },
      turn: 0,
    };

    saveBattleState();

    characterName.textContent = character.name;
    characterImg.src = `${BASE_PATH}assets/characters/${character.avatar}.png`;

    enemyName.textContent = enemy.name;
    enemyImg.src = `${BASE_PATH}assets/enemies/${enemy.avatar}.png`;

    startFightBlock.style.display = "none";
    battleBlock.style.display = "block";

    defenceCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
      checkbox.disabled = false;
    });
    attackBtn.disabled = true;

    addLog("<b>Battle started!</b>");
  }

  function handleAttack() {
    const playerAttackZone = document.querySelector(
      'input[name="attack"]:checked'
    ).value;
    const playerDefenceZones = Array.from(
      document.querySelectorAll(
        '.zones__defence input[type="checkbox"]:checked'
      )
    ).map((defZone) => defZone.value);

    const currentEnemy = battleState?.enemy || enemy;

    const enemyAttackZones = getRandomZones(
      attackZones,
      currentEnemy.attackCount
    );

    const enemyDefenceZones = getRandomZones(
      attackZones,
      currentEnemy.defenceCount
    );

    processRound(
      playerAttackZone,
      playerDefenceZones,
      enemyAttackZones,
      enemyDefenceZones
    );

    saveBattleState();

    if (battleState.character.health <= 0 || battleState.enemy.health <= 0) {
      endBattle();
    }
  }

  function processRound(
    playerAttack,
    playerDefence,
    enemyAttacks,
    enemyDefence
  ) {
    battleState.turn++;

    const isPlayerCrit = Math.random() < config.critChance;

    if (isPlayerCrit || !enemyDefence.includes(playerAttack)) {
      const damage = isPlayerCrit
        ? Math.floor(config.damage * config.critMultiplier)
        : config.damage;

      battleState.enemy.health = Math.max(0, battleState.enemy.health - damage);

      if (isPlayerCrit) {
        addLog(
          `<span class="log-character">${character.name}</span> attacked <span class="log-enemy">${enemy.name}</span> to <span class="log-zone">${playerAttack}</span> and scored a critical hit for <span class="log-damage">${damage}</span> damage!`
        );
      } else {
        addLog(
          `<span class="log-character">${character.name}</span> attacked <span class="log-enemy">${enemy.name}</span> to <span class="log-zone">${playerAttack}</span> for <span class="log-damage">${damage}</span> damage.`
        );
      }
    } else {
      addLog(
        `<span class="log-character">${character.name}</span> attacked <span class="log-enemy">${enemy.name}</span> to <span class="log-zone">${playerAttack}</span> but <span class="log-enemy">${enemy.name}</span> was able to protect it.`
      );
    }

    enemyAttacks.forEach((zone) => {
      const isEnemyCrit = Math.random() < config.critChance;

      if (isEnemyCrit || !playerDefence.includes(zone)) {
        const damage = isEnemyCrit
          ? Math.floor(config.damage * config.critMultiplier)
          : config.damage;

        battleState.character.health = Math.max(
          0,
          battleState.character.health - damage
        );

        if (isEnemyCrit) {
          addLog(
            `<span class="log-enemy">${enemy.name}</span> attacked <span class="log-character">${character.name}</span> to <span class="log-zone">${zone}</span> and scored a critical hit for <span class="log-damage">${damage}</span> damage!`
          );
        } else {
          addLog(
            `<span class="log-enemy">${enemy.name}</span> attacked <span class="log-character">${character.name}</span> to <span class="log-zone">${zone}</span> for <span class="log-damage">${damage}</span> damage.`
          );
        }
      } else {
        addLog(
          `<span class="log-enemy">${enemy.name}</span> attacked <span class="log-character">${character.name}</span> to <span class="log-zone">${zone}</span> but <span class="log-character">${character.name}</span> was able to protect it.`
        );
      }
    });

    updateHealth();
  }

  function updateHealth() {
    characterHealthProgress.value = battleState.character.health;
    characterHealthRemaining.textContent = battleState.character.health;
    enemyHealthProgress.value = battleState.enemy.health;
    enemyHealthRemaining.textContent = battleState.enemy.health;
  }

  function addLog(message) {
    battleLogs.push(message);

    const logEntry = document.createElement("p");
    logEntry.innerHTML = message;

    battleLog.appendChild(logEntry);
    battleLog.scrollTop = battleLog.scrollHeight;
  }

  function displayLogs() {
    battleLog.innerHTML = "";
    battleLogs.forEach((log) => {
      const logEntry = document.createElement("p");
      logEntry.innerHTML = log;

      battleLog.appendChild(logEntry);
    });
  }

  function endBattle() {
    if (battleState.character.health <= 0) {
      addLog(
        `<span class="log-character">${character.name}</span> was defeated!`
      );
      character.loses = (character.loses || 0) + 1;
    } else {
      addLog(`<span class="log-enemy">${enemy.name}</span> was defeated!`);
      character.wins = (character.wins || 0) + 1;
    }

    localStorage.setItem("characterInfo", JSON.stringify(character));
    localStorage.removeItem("battleState");
    localStorage.removeItem("battleLogs");

    endBattleUI();
  }

  function endBattleUI() {
    attackBtn.disabled = true;
    defenceCheckboxes.forEach((checkbox) => {
      checkbox.disabled = true;
    });
    newFightBtn.style.display = "block";
  }

  function newBattle() {
    localStorage.removeItem("battleState");
    localStorage.removeItem("battleLogs");

    location.reload();
  }

  function saveBattleState() {
    localStorage.setItem("battleState", JSON.stringify(battleState));
    localStorage.setItem("battleLogs", JSON.stringify(battleLogs));
  }

  function getRandomZones(zones, count) {
    const shuffled = [...zones].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  init();
});
