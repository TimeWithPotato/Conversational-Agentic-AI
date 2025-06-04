import React, { useEffect, useRef, useState } from "react";

const VoiceToTextAndSpeak = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("SpeechRecognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (e) => {
      const speechToText = e.results[0][0].transcript;
      setTranscript(speechToText);
      speakUserMessage(speechToText);
      sendTranscriptToServer(speechToText)
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const speakUserMessage = (text) => {
    if (!window.speechSynthesis) {
      alert("Speech Synthesis not supported in this browser.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };
  const sendTranscriptToServer = async (text) => {
    try {
      const response = await fetch("http://localhost:5000/transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      console.log("Server responded:", data);
    } catch (error) {
      console.error("Error sending transcript:", error);
    }
  };

  const handleStartListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setTranscript("");
      setIsListening(true);
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-screen-md bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col items-center gap-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
          🎙️ AI Interview
        </h1>

        <p className="text-center text-gray-600 text-base md:text-lg">
          Click the button below, and start the interview...
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            onClick={handleStartListening}
            className={`px-6 py-3 text-white rounded-lg text-base font-medium transition ${
              isListening
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isListening}
          >
            {isListening ? "Listening..." : "Start Speaking"}
          </button>

          {isListening && (
            <button
              onClick={handleStopListening}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-base font-medium transition"
            >
              Stop Listening
            </button>
          )}
        </div>

        <div className="w-full mt-4 bg-gray-100 p-4 rounded-lg text-gray-700 text-lg">
          <strong>Transcript:</strong>{" "}
          {transcript || (
            <em className="text-sm text-gray-400">
              Your spoken words will appear here.
            </em>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceToTextAndSpeak;
