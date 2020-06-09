chrome.storage.sync.get('rate', function (data) {
  if (typeof data.rate === 'undefined') {
    chrome.storage.sync.set({ rate: 1.0 }, function () { });
  }
});


window.onload = (event) => {
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");

  chrome.storage.sync.get('start', function (data) {
    startButton.disabled = data.start;
    stopButton.disabled = !data.start;
  });

  startButton.onclick = function () {
    if (!"speechSynthesis" in window) {
      console.log('not support SpeechSynthesisUtterance');
      return;
    }

    const speechUtter = new SpeechSynthesisUtterance();
    speechUtter.rate = 1.0;
    speechUtter.volume = 1.0;
    speechUtter.lang = "ja-JP";
    //speechUtter.voice = gBetterVoice;
    speechUtter.text = "よみあげすたーと";
    window.speechSynthesis.speak(speechUtter);

    chrome.storage.sync.set({ start: true }, function () { });

    startButton.disabled = true;
    stopButton.disabled = false;
  };

  stopButton.onclick = function () {
    chrome.storage.sync.set({ start: false }, function () { });

    startButton.disabled = false;
    stopButton.disabled = true;
  };

  const rate = document.getElementById('rate');

  chrome.storage.sync.get('rate', function (data) {
    if (typeof data.rate === 'undefined') {
      return;
    }

    rate.value = data.rate;
  });

  rate.addEventListener('input', function (ev) {
    const element = ev.srcElement;
    chrome.storage.sync.set({ rate: element.value }, function () { });
  });
};