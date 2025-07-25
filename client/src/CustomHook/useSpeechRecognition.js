import { useState, useEffect, useRef } from "react";

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const transcriptRef = useRef("");
  const isSpeakingRef = useRef(false);
  const shouldListenRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      if (isSpeakingRef.current) return;

      isRecognizingRef.current = true;

      const length = e.results.length - 1;
      const speechToText = e.results[length][0].transcript;

      transcriptRef.current += " " + speechToText;
      setTranscript(transcriptRef.current.trim());
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      console.log("Recognition started");
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      console.log("Recognition ended");
      if (shouldListenRef.current) {
        recognitionRef.current.start();
        console.log("Recognition Restarted");
      }
      // User controls start/stop, no auto-restart
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (
      recognitionRef.current &&
      !isRecognizingRef.current &&
      !isSpeakingRef.current &&
      !shouldListenRef.current
    ) {
      transcriptRef.current = "";
      setTranscript("");
      shouldListenRef.current = true;
      recognitionRef.current.start();
      setIsListening(true);
      console.log("🎤 Listening started");
    }
  };

  const stopListening = () => {
    if (!isListening) return;

    shouldListenRef.current = false;
    setIsListening(false);

    recognitionRef.current.stop();
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    transcriptRef,
    isRecognizingRef,
    isSpeakingRef,
    shouldListenRef,
    recognitionRef,
    setTranscript,
    setIsListening,
  };
}
