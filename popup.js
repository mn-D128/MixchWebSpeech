
window.onload = (event) => {
  const startButton = document.getElementById("startButton");
  startButton.onclick = function () {
    const speechUtter = new SpeechSynthesisUtterance();
    speechUtter.rate = 1.0;
    speechUtter.volume = 1.0;
    speechUtter.lang = "ja-JP";
    //speechUtter.voice = gBetterVoice;
    speechUtter.text = "よみあげすたーと";
    window.speechSynthesis.speak(speechUtter);

    chrome.storage.sync.set({ start: true }, function () {
    });
  };
};