export async function playAudio(word: string, pronunciation?: string) {
  let checkPronun = 0;
  if (pronunciation) {
    const audio = new Audio(pronunciation);
    try {
      await audio.play();
    } catch (err) {
      checkPronun = 1;
    }
  } else {
    checkPronun = 1;
  }

  if (checkPronun === 1 && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(word);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  }
}