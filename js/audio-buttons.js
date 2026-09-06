// Wires up any button.play-audio-btn[data-audio] on the page to play a
// pronunciation clip from /audio/{data-folder}/{data-audio}.m4a. If the
// clip hasn't been recorded yet (or fails to load), the button briefly
// shows an "X" so it's clear the recording is missing, then resets.

(function () {
  document.querySelectorAll(".play-audio-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const folder = btn.getAttribute("data-folder") || "letters";
      const name = btn.getAttribute("data-audio");
      if (!name) return;

      const original = btn.textContent;
      let handled = false;

      function showMissing() {
        if (handled) return;
        handled = true;
        btn.textContent = "❌";
        btn.classList.add("missing");
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove("missing");
        }, 800);
      }

      const audio = new Audio("../audio/" + folder + "/" + name + ".m4a");
      audio.addEventListener("error", showMissing);
      audio.play().catch(showMissing);
    });
  });
})();
