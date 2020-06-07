var gBetterVoice = null;

function updateBetterVoice() {
  function subUpdateBetterVoice(voice) {
    if (voice.lang !== 'ja-JP') {
      return;
    }

    if (voice.name.startsWith('Google')) {
      gBetterVoice = voice;
      return;
    }

    gBetterVoice = voice;
  }

  const voices = window.speechSynthesis.getVoices();
  voices.forEach(function (voice, index, array) {
    subUpdateBetterVoice(voice);
  });
}

function createSpeechSynthesisUtterance() {
  const speechUtter = new SpeechSynthesisUtterance();
  speechUtter.rate = 1.0;
  speechUtter.volume = 1.0;
  speechUtter.voice = gBetterVoice;
  return speechUtter;
}

chrome.storage.sync.set({ start: false }, function () {
  console.log('saved storage start false');
});

// サポート確認
if (!"speechSynthesis" in window) {
  console.log('not support SpeechSynthesisUtterance');
} else {
  updateBetterVoice();

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateBetterVoice;
  }
}

window.onload = (event) => {
  const chatContent = document.getElementById("chat-content");
  chatContent.addEventListener("DOMNodeInserted", function (ev) {
    chrome.storage.sync.get('start', function (data) {
      if (data.start == false) {
        return;
      }

      const speechUtter = createSpeechSynthesisUtterance();

      const element = ev.srcElement;

      //console.log("css " + element.style.cssText);

      // 通常コメント
      if (element.classList.contains("chat-normal")) {
        speechUtter.text = element.children[2].innerHTML;
      }
      // スーパーコメント
      else if (element.classList.contains("chat-supercomment")) {
        speechUtter.text = element.firstChild.firstChild.firstChild.lastChild.innerHTML;
      }
      // スタンプ
      else if (element.classList.contains("chat-stamp")) {
        speechUtter.text = element.firstChild.lastChild.innerHTML + "さんがスタンプを投げました";
      }
      // 動画ギフト
      else if (element.classList.contains("chat-videolog")) {
        speechUtter.text = element.children[1].innerHTML;
      }
      // TODO: キャスト
      else if (element.style.cssText === "animation-name: chat-popup; animation-duration: 2s;") {
        speechUtter.text = element.firstChild.innerHTML;
      }

      // アドボーナス
      // ファンになった
      // ファンクラブ加入

      window.speechSynthesis.speak(speechUtter);
    });
  }, false);
};
