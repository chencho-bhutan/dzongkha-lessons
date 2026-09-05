// Drag-and-drop "stacking" game: drag ra/la/sa onto every base letter
// that legally accepts it as a Gochen (superscript). Uses Pointer Events
// so it works on both mouse and touch. Requires sounds.js to be loaded first.

function initStackingGame(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const ALL_30 = ["ཀ","ཁ","ག","ང","ཅ","ཆ","ཇ","ཉ","ཏ","ཐ","ད","ན","པ","ཕ","བ","མ","ཙ","ཚ","ཛ","ཝ","ཞ","ཟ","འ","ཡ","ར","ལ","ཤ","ས","ཧ","ཨ"];

  const ROUNDS = [
    {
      letter: "ར",
      name: "ra",
      targets: ["ཀ","ག","ང","ཇ","ཉ","ཏ","ད","ན","བ","མ","ཙ","ཛ"],
      combined: { "ཀ":"རྐ","ག":"རྒ","ང":"རྔ","ཇ":"རྗ","ཉ":"རྙ","ཏ":"རྟ","ད":"རྡ","ན":"རྣ","བ":"རྦ","མ":"རྨ","ཙ":"རྩ","ཛ":"རྫ" }
    },
    {
      letter: "ལ",
      name: "la",
      targets: ["ཀ","ག","ང","ཅ","ཇ","ཏ","ད","པ","བ","ཧ"],
      combined: { "ཀ":"ལྐ","ག":"ལྒ","ང":"ལྔ","ཅ":"ལྕ","ཇ":"ལྗ","ཏ":"ལྟ","ད":"ལྡ","པ":"ལྤ","བ":"ལྦ","ཧ":"ལྷ" }
    },
    {
      letter: "ས",
      name: "sa",
      targets: ["ཀ","ག","ང","ཉ","ཏ","ད","ན","པ","བ","མ","ཙ"],
      combined: { "ཀ":"སྐ","ག":"སྒ","ང":"སྔ","ཉ":"སྙ","ཏ":"སྟ","ད":"སྡ","ན":"སྣ","པ":"སྤ","བ":"སྦ","མ":"སྨ","ཙ":"སྩ" }
    }
  ];

  let roundIndex = 0;
  let score = 0;
  let found = 0;
  let attempts = 0;

  function render() {
    const round = ROUNDS[roundIndex];
    found = 0;
    attempts = 0;

    let html =
      '<div class="exercise-header">' +
        '<h2 style="margin:0;">Round ' + (roundIndex + 1) + ' of ' + ROUNDS.length + ': Stack ' + round.letter + '</h2>' +
        '<span class="exercise-score">⭐ Score: <span id="' + containerId + '-score">' + score + '</span></span>' +
      "</div>" +
      '<p class="exercise-instructions">Drag <strong>' + round.letter + '</strong> onto every letter it can sit on top of. There are <strong>' + round.targets.length + '</strong> correct letters on the board.</p>' +
      '<div class="stack-progress">Found: <span id="' + containerId + '-found">0</span> / ' + round.targets.length + '</div>' +
      '<div class="drag-source-row"><div class="drag-source" id="' + containerId + '-source">' + round.letter + '</div></div>' +
      '<div class="stack-board" id="' + containerId + '-board"></div>' +
      '<div class="exercise-complete" id="' + containerId + '-complete"></div>';

    container.innerHTML = html;

    const board = document.getElementById(containerId + "-board");
    ALL_30.forEach(function (glyph) {
      const tile = document.createElement("div");
      tile.className = "stack-target";
      tile.setAttribute("data-glyph", glyph);
      tile.textContent = glyph;
      board.appendChild(tile);
    });

    attachDragHandlers(round);
  }

  function attachDragHandlers(round) {
    const source = document.getElementById(containerId + "-source");
    let ghost = null;
    let currentHover = null;

    source.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      ghost = document.createElement("div");
      ghost.className = "drag-ghost";
      ghost.textContent = round.letter;
      document.body.appendChild(ghost);
      positionGhost(e.clientX, e.clientY);
      source.classList.add("dragging");

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    });

    function positionGhost(x, y) {
      if (!ghost) return;
      ghost.style.left = x + "px";
      ghost.style.top = y + "px";
    }

    function onMove(e) {
      positionGhost(e.clientX, e.clientY);
      if (ghost) ghost.style.display = "none";
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (ghost) ghost.style.display = "";

      const target = el && el.closest(".stack-target");
      if (currentHover && currentHover !== target) {
        currentHover.classList.remove("drag-over");
      }
      if (target && !target.classList.contains("solved")) {
        target.classList.add("drag-over");
        currentHover = target;
      } else {
        currentHover = null;
      }
    }

    function onUp(e) {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      source.classList.remove("dragging");
      if (ghost) {
        ghost.remove();
        ghost = null;
      }

      if (currentHover) {
        currentHover.classList.remove("drag-over");
        handleDrop(currentHover, round);
        currentHover = null;
      }
    }
  }

  function handleDrop(tile, round) {
    if (tile.classList.contains("solved")) return;
    const glyph = tile.getAttribute("data-glyph");
    attempts++;

    if (round.targets.indexOf(glyph) !== -1) {
      // Correct.
      DzongkhaSounds.playCorrect();
      tile.classList.add("solved");
      tile.textContent = round.combined[glyph];
      score += 10;
      found++;
      document.getElementById(containerId + "-score").textContent = score;
      document.getElementById(containerId + "-found").textContent = found;

      if (found === round.targets.length) {
        setTimeout(function () {
          DzongkhaSounds.playComplete();
        }, 100);
        showRoundComplete(round);
      }
    } else {
      // Incorrect.
      DzongkhaSounds.playWrong();
      tile.classList.add("shake");
      setTimeout(function () {
        tile.classList.remove("shake");
      }, 300);
    }
  }

  function showRoundComplete(round) {
    const completeEl = document.getElementById(containerId + "-complete");
    const isLastRound = roundIndex === ROUNDS.length - 1;

    completeEl.innerHTML =
      "🎉 Round " + (roundIndex + 1) + " complete! You found all " + round.targets.length +
      " letters that take " + round.letter + " (in " + attempts + " tries). " +
      '<button class="play-again-btn" id="' + containerId + '-next">' +
      (isLastRound ? "Play Again" : "Continue to Round " + (roundIndex + 2)) +
      "</button>";
    completeEl.classList.add("show");

    document.getElementById(containerId + "-next").addEventListener("click", function () {
      if (isLastRound) {
        const totalXpKey = "dzongkha_xp";
        const prevXp = parseInt(localStorage.getItem(totalXpKey) || "0", 10);
        localStorage.setItem(totalXpKey, prevXp + score);
        roundIndex = 0;
        score = 0;
      } else {
        roundIndex++;
      }
      render();
    });
  }

  render();
}
