var gBetterVoice = null;
var gStart = false;
var gRate = 1.0;

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

function createSpeechSynthesisUtterance(rate) {
  const speechUtter = new SpeechSynthesisUtterance();
  speechUtter.rate = rate;
  speechUtter.volume = 1.0;
  speechUtter.voice = gBetterVoice;
  return speechUtter;
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (var key in changes) {
    const storageChange = changes[key];
    if (key === "start") {
      gStart = storageChange.newValue;
    } else if (key === "rate") {
      gRate = storageChange.newValue;
    }
  }
});

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
  const observer = new MutationObserver(function (mutations, observer) {
    if (!gStart) {
      return;
    }

    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        const speechUtter = createSpeechSynthesisUtterance(gRate);
        const element = node;

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
    });
  });

  const chatContent = document.getElementById("chat-content");
  const config = { childList: true };
  observer.observe(chatContent, config);
};
