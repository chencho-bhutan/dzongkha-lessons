// Reusable "matching game" exercise widget.
// Usage: call initMatchingGame(containerId, pairs, roundSize) where
// pairs is an array of { glyph, roman } objects to draw rounds from.
// Requires sounds.js to be loaded first (for DzongkhaSounds).

function initMatchingGame(containerId, pairs, roundSize) {
  roundSize = roundSize || 6;
  const container = document.getElementById(containerId);
  if (!container) return;

  let score = 0;
  let selected = null; // { el, type, id }
  let matchedCount = 0;
  let roundPairs = [];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function render() {
    roundPairs = shuffle(pairs).slice(0, roundSize).map(function (p, i) {
      return Object.assign({ id: i }, p);
    });
    matchedCount = 0;
    selected = null;

    const glyphCards = shuffle(roundPairs.map(function (p) {
      return { id: p.id, text: p.glyph, type: "glyph" };
    }));
    const romanCards = shuffle(roundPairs.map(function (p) {
      return { id: p.id, text: p.roman, type: "roman" };
    }));

    const muted = DzongkhaSounds.isMuted();

    let html =
      '<div class="exercise-header">' +
        '<h2 style="margin:0;">Match the Letter to Its Sound</h2>' +
        '<span class="exercise-score">⭐ Score: <span id="' + containerId + '-score">' + score + '</span>' +
        ' <button class="sound-toggle" id="' + containerId + '-mute" title="Toggle sound effects">' + (muted ? "🔇" : "🔊") + "</button></span>" +
      "</div>" +
      '<p class="exercise-instructions">Tap a letter, then tap the romanized sound that matches it.</p>' +
      '<div class="match-grid">' +
        '<div>' + glyphCards.map(cardHtml).join("") + "</div>" +
        '<div>' + romanCards.map(cardHtml).join("") + "</div>" +
      "</div>" +
      '<div class="exercise-complete" id="' + containerId + '-complete"></div>';

    container.innerHTML = html;

    container.querySelectorAll(".match-card").forEach(function (el) {
      el.addEventListener("click", function () {
        handleClick(el);
      });
    });

    document.getElementById(containerId + "-mute").addEventListener("click", function (e) {
      const nowMuted = !DzongkhaSounds.isMuted();
      DzongkhaSounds.setMuted(nowMuted);
      e.target.textContent = nowMuted ? "🔇" : "🔊";
    });
  }

  function cardHtml(card) {
    const cls = card.type === "glyph" ? "glyph-card" : "roman-card";
    return (
      '<div class="match-card ' + cls + '" data-id="' + card.id + '" data-type="' + card.type + '">' +
      card.text +
      "</div>"
    );
  }

  function handleClick(el) {
    if (el.classList.contains("matched")) return;

    const id = el.getAttribute("data-id");
    const type = el.getAttribute("data-type");

    if (!selected) {
      if (el.classList.contains("selected")) {
        el.classList.remove("selected");
        selected = null;
        return;
      }
      clearSelections();
      el.classList.add("selected");
      selected = { el: el, id: id, type: type };
      return;
    }

    if (selected.type === type) {
      // Same column clicked again — just move the selection.
      clearSelections();
      el.classList.add("selected");
      selected = { el: el, id: id, type: type };
      return;
    }

    if (selected.id === id) {
      // Correct match.
      DzongkhaSounds.playCorrect();
      selected.el.classList.remove("selected");
      selected.el.classList.add("matched");
      el.classList.add("matched");
      score += 10;
      matchedCount++;
      document.getElementById(containerId + "-score").textContent = score;
      selected = null;

      if (matchedCount === roundPairs.length) {
        setTimeout(function () {
          DzongkhaSounds.playComplete();
        }, 100);
        showComplete();
      }
    } else {
      // Wrong match — brief shake, then reset.
      DzongkhaSounds.playWrong();
      selected.el.classList.add("wrong");
      el.classList.add("wrong");
      const wrongEl = selected.el;
      selected = null;
      setTimeout(function () {
        wrongEl.classList.remove("selected", "wrong");
        el.classList.remove("wrong");
      }, 300);
    }
  }

  function clearSelections() {
    container.querySelectorAll(".match-card.selected").forEach(function (el) {
      el.classList.remove("selected");
    });
  }

  function showComplete() {
    const totalXpKey = "dzongkha_xp";
    const prevXp = parseInt(localStorage.getItem(totalXpKey) || "0", 10);
    localStorage.setItem(totalXpKey, prevXp + roundPairs.length * 10);

    const completeEl = document.getElementById(containerId + "-complete");
    completeEl.innerHTML =
      "🎉 You matched all " + roundPairs.length + " pairs! " +
      '<button class="play-again-btn" id="' + containerId + '-again">Play Again</button>';
    completeEl.classList.add("show");
    document.getElementById(containerId + "-again").addEventListener("click", render);
  }

  render();
}
