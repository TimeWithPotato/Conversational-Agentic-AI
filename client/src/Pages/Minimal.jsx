  // === Handle LLM Response ===
//   const sendToBackend = useCallback(async (userAnswer = null) => {
//     let updatedChat = [...chatRef.current];

//     // Add user's answer to the last item
//     if (
//       userAnswer &&
//       updatedChat.length > 0 &&
//       !updatedChat[updatedChat.length - 1].answer
//     ) {
//       updatedChat[updatedChat.length - 1].answer = userAnswer;
//     }

//     const response = await fetch("http://localhost:5000/api/interview", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         resume: localStorage.getItem("resumeData") || "Demo resume",
//         history: updatedChat,
//       }),
//     });

//     const data = await response.json();
//     console.log("Backend:", data);

//     updatedChat.push({
//       react: data.react || "",
//       question: data.question || "",
//       answer: null,
//       finish: data.finish || false,
//     });

//     setChatHistory(updatedChat);
//     setTextToSpeak(data.react);
//     setInterviewFinished(data.finish);
    //   }, []);




import React, { useState, useEffect, useCallback, useRef } from "react";

// === Speech Recognition Hook ===
const useSpeechRecognition = (onResultCallback) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in your browser.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-US";

    recog.onstart = () => {
      console.log("Listening started");
      setIsListening(true);
    };

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Heard:", transcript);
      if (onResultCallback) onResultCallback(transcript);
    };

    recog.onerror = (event) => {
      console.error("Recognition error:", event.error);
      setIsListening(false);
    };

    recog.onend = () => {
      console.log("Listening ended");
      setIsListening(false);
    };

    recognitionRef.current = recog;

    return () => recog.abort();
  }, [onResultCallback]);

  const startListening = () =>
    recognitionRef.current && recognitionRef.current.start();
  const stopListening = () =>
    recognitionRef.current && recognitionRef.current.stop();

  return { isListening, startListening, stopListening };
};

// === Main App Component ===
const MinimalSpeechApp = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [textToSpeak, setTextToSpeak] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [interviewFinished, setInterviewFinished] = useState(false);

  const speakingRef = useRef(false);
  const chatRef = useRef([]);
  useEffect(() => {
    chatRef.current = chatHistory;
  }, [chatHistory]);

  // === Mock Backend ===
  const mockResponses = [
    { react: "Welcome! Tell me about yourself.", question: "Tell me about yourself." },
    { react: "Good. Why do you want this job?", question: "Why this job?" },
    { react: "Nice answer. That's it!", question: null, finish: true },
  ];
  const mockIndexRef = useRef(0);

  const sendToBackend = useCallback(async (userAnswer = null) => {
    if (interviewFinished) return;

    let updatedChat = [...chatRef.current];

    if (
      userAnswer &&
      updatedChat.length > 0 &&
      !updatedChat[updatedChat.length - 1].answer
    ) {
      updatedChat[updatedChat.length - 1].answer = userAnswer;
    }

    const data = mockResponses[mockIndexRef.current++];
    if (!data) return;

    updatedChat.push({
      react: data.react || "",
      question: data.question || "",
      answer: null,
      finish: data.finish || false,
    });

    setChatHistory(updatedChat);

    if (!data.finish) {
      setTextToSpeak(data.react);
    }

    if (data.finish) {
      setInterviewFinished(true);
      setTextToSpeak("Interview is over. Thank you!");
    }
  }, [interviewFinished]);

  const onSpeechResult = useCallback(
    async (spokenText) => {
      setTranscript(spokenText);
      await sendToBackend(spokenText);
    },
    [sendToBackend]
  );

  const { startListening, stopListening, isListening } =
    useSpeechRecognition(onSpeechResult);

const speakText = useCallback(
  (text) => {
    if (!text || interviewFinished) return;

    if (speechSynthesis.speaking || speakingRef.current) {
      console.log("Skipping speech: already speaking");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    utterance.onstart = () => {
      console.log("Speaking:", text);
      setIsSpeaking(true);
      speakingRef.current = true;
    };

    utterance.onend = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
      speakingRef.current = false;

      // Only start listening if not already listening
      if (!interviewFinished && !isListening) {
        startListening();
      }
    };

    utterance.onerror = (e) => {
      console.error("Speech error:", e);
      setIsSpeaking(false);
      speakingRef.current = false;
    };

    window.speechSynthesis.cancel(); // clear any current speech
    window.speechSynthesis.speak(utterance);
  },
  [startListening, interviewFinished, isListening]
);

  useEffect(() => {
    if (textToSpeak && !interviewFinished) {
      speakText(textToSpeak);
    }
  }, [textToSpeak, speakText, interviewFinished]);

  const startInterview = async () => {
    if (isSpeaking || isListening || speakingRef.current) return;

    setTranscript("");
    setChatHistory([]);
    setInterviewFinished(false);
    mockIndexRef.current = 0;
    await sendToBackend(null);
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>🧠 Minimal AI Interview</h2>

      <button
        onClick={startInterview}
        disabled={isSpeaking || isListening || interviewFinished}
      >
        {interviewFinished
          ? "✅ Interview Finished"
          : isSpeaking
          ? "🔊 Speaking..."
          : isListening
          ? "🎤 Listening..."
          : "▶️ Start Interview"}
      </button>

      {isListening && (
        <button onClick={stopListening} style={{ marginLeft: 10 }}>
          ⛔ Stop Listening
        </button>
      )}

      <div style={{ marginTop: 20 }}>
        <strong>Transcript:</strong>{" "}
        {transcript || <i>Say something after prompt...</i>}
      </div>

      <div style={{ marginTop: 20 }}>
        <strong>Chat History:</strong>
        <pre style={{ whiteSpace: "pre-wrap", background: "#eee", padding: 10 }}>
          {chatHistory.map((item, i) => {
            return `#${i + 1}
🤖: ${item.react}
❓: ${item.question}
🧑: ${item.answer || "(waiting...)"}\n`;
          })}
        </pre>
      </div>
    </div>
  );
};

export default MinimalSpeechApp;
