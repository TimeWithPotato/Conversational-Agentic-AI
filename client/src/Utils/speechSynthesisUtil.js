export function speakText(text, refs) {
  // refs should contain:
  // recognitionRef, isRecognizingRef, shouldListenRef, setIsListening, isSpeakingRef

  return new Promise((resolve) => {
    const {
      recognitionRef,
      isRecognizingRef,
      shouldListenRef,
      setIsListening,
      isSpeakingRef,
    } = refs;

    if (recognitionRef.current && isRecognizingRef.current) {
      recognitionRef.current.stop();
      shouldListenRef.current = false;
      setIsListening(false);
      isRecognizingRef.current = false;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onstart = () => {
      isSpeakingRef.current = true;
      console.log("🔊 Speaking started...");
    };

    utterance.onend = () => {
      isSpeakingRef.current = false;
      console.log("🔇 Speaking finished.");
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
}
