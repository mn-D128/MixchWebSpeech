var gBetterVoice = null;

function updateBetterVoice() {
  function subUpdateBetterVoice(voice) {
    if (voice.lang !== 'ja-JP') {
      return;
    }

    if (voice.name.startsWith('Google')) {
      console.log('updateBetterVoice ' + voice.name);
      gBetterVoice = voice;
      return;
    }

    console.log('updateBetterVoice ' + voice.name);
    gBetterVoice = voice;
  }

  const voices = speechSynthesis.getVoices();
  voices.forEach(function (voice, index, array) {
    subUpdateBetterVoice(voice);
  });
}

// サポート確認
if (!"speechSynthesis" in window) {
  console.log('not support SpeechSynthesisUtterance');
} else {
  updateBetterVoice();

  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = updateBetterVoice;
  }
}

window.onload = (event) => {
  const chatContent = document.getElementById("chat-content");
  chatContent.addEventListener("DOMNodeInserted", function (ev) {
    const speechUtter = new SpeechSynthesisUtterance();
    speechUtter.rate = 1.0;
    speechUtter.voice = gBetterVoice;

    // TODO: firstではだめかも
    const element = chatContent.firstElementChild;
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
    else if (element.style.cssStyle === "animation-name: chat-popup; animation-duration: 2s;") {
      speechUtter.text = element.firstChild.innerHTML;
    }
    // アドボーナス
    // ファンになった
    // ファンクラブ加入

    speechSynthesis.speak(speechUtter);
  }, false);

  const elements = document.getElementsByClassName('fan-btn');
  for (var i = 0; i < elements.length; i++) {
    elements[i].onclick = function () {
      console.log('onclick');
      speechSynthesis.speak(new SpeechSynthesisUtterance('Hey'));
    };
  }
};
