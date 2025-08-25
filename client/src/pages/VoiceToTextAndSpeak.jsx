// client/src/Pages/VoiceToTextAndSpeak.jsx

import { useState, useContext } from "react";
import { ResumeContext } from "../ContextProvider/ResumeProvider";
import { ChatHistoryContext } from "../ContextProvider/ChatHistoryProvider";
import { useInterviewContext } from "../ContextProvider/InterviewProvider";
import { useSpeechRecognition } from "../CustomHook/useSpeechRecognition";
import { speakText } from "../Utils/speechSynthesisUtil";
import { removeLastQuestionFromReact } from "../helpers/removeLastQuestionFromReact";
import { QnaHistoryContext } from "../ContextProvider/QnaHistoryProvider";
import { Mic, Upload, StopCircle, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const VoiceToTextAndSpeak = () => {
  const { resume,isResumeUploaded, handleResumeUpload } = useContext(ResumeContext);
  const { chatHistory, setChatHistory } = useContext(ChatHistoryContext);
  const { QnaHistory, setQnaHistory } = useContext(QnaHistoryContext);
  const { isGuestJoin, interviewerId, intervieweeId, startTime } =
    useInterviewContext();

  const [isResumeSendToLlm, setIsResumeSendToLlm] = useState(false);
  const [isResumeSending, setIsResumeSending] = useState(false);
  const [isTranscriptSending, setIsTranscriptSending] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResumeParsed, setIsResumeparsed] = useState(false);
  const [isGuestInterviewFinish, setIsGuestInterviewFinish] = useState(false);

  // New state to hold fetched feedback and modal visibility
  const [guestFeedback, setGuestFeedback] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);
  const [isFetchingFeedback, setIsFetchingFeedback] = useState(false);

  const {
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
  } = useSpeechRecognition();

  console.log(resume);

  const navigate = useNavigate();

  useEffect(() => {
    const storeQnaInDbForGuestInterviewee = async () => {
      const data = {
        interviewerId: interviewerId,
        intervieweeId: intervieweeId,
        startTime,
        endTime: Date.now(),
        qna: QnaHistory,
      };
      const res = await fetch(`${apiBaseUrl}/api/storeQnaForGuestInterviewee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || res);
      }
    };

    if (isFinish) {
      storeQnaInDbForGuestInterviewee();
    }
  }, [isFinish]);

  useEffect(() => {
    const getGuestIntervieweeFeedback = async () => {
      setIsFetchingFeedback(true);
      setLoading(true);
      try {
        const res = await fetch(
          `${apiBaseUrl}/api/getEvaluationByIntervieweeId/${intervieweeId}?isGuestJoin=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch feedback");
        }
        if (res.ok) setLoading(false);

        const data = await res.json();
        setGuestFeedback(data.feedback || []);
        setShowFeedbackModal(true);
      } catch (err) {
        console.error("Error fetching guest feedback:", err);
        setFeedbackError(err.message);
        setShowFeedbackModal(true);
        setLoading(false);
      } finally {
        setIsGuestInterviewFinish(false);
        setIsFetchingFeedback(false);
        setLoading(false);
      }
    };
    if (isGuestInterviewFinish) {
      getGuestIntervieweeFeedback();
    }
  }, [isGuestInterviewFinish, intervieweeId]);

  const handleGuestInterviewFeedback = () => {
    setIsGuestInterviewFinish(true);
  };

  // Modal close handler
  const closeModal = () => {
    setShowFeedbackModal(false);
    setGuestFeedback([]);
    setFeedbackError(null);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/upload-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "PDF upload failed");
      }

      const resumeObj = await response.json();
      handleResumeUpload(resumeObj);
      setIsResumeparsed(true);
      console.log("VoiceToTextAndSpeak: ", resume);
      console.log(resumeObj);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to extract PDF text");
    } finally {
      setLoading(false);
    }
  };

  const onTranscriptChange = (value) => {
    setTranscript(value);
    transcriptRef.current = value;
    setCanSend(!isListening && value.trim().length > 0);
  };

  const handleStopListening = () => {
    if (!isListening) return;
    shouldListenRef.current = false;
    setIsListening(false);
    recognitionRef.current.stop();
    if (transcriptRef.current.trim().length > 0) setCanSend(true);
  };

  const handleSendToLlm = async () => {
    if (!canSend) return;

    setIsTranscriptSending(true);

    let updatedChat = [...chatHistory];
    if (updatedChat.length > 0 && !updatedChat[updatedChat.length - 1].answer) {
      updatedChat[updatedChat.length - 1].answer = transcriptRef.current.trim();
    }

    const payload = { resume, history: updatedChat };

    try {
      const response = await fetch(`${apiBaseUrl}/api/interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      data.react = removeLastQuestionFromReact(
        data.react,
        data.question
      ).trim();

      updatedChat = [
        ...updatedChat,
        {
          react: data.react || "",
          question: data.question || null,
          answer: data.answer || null,
          finish: data.finish,
        },
      ];
      setChatHistory(updatedChat);

      if (
        updatedChat.length > 1 &&
        updatedChat[updatedChat.length - 2].question &&
        transcriptRef.current.trim()
      ) {
        setQnaHistory((prev) => [
          ...prev,
          {
            question: updatedChat[updatedChat.length - 2].question,
            answer: transcriptRef.current.trim(),
          },
        ]);
      }

      if (data.finish) setIsFinish(true);

      if (data.react) {
        const speakMessage = `${data.react}. ${data.question || ""}`;
        await speakText(speakMessage, {
          recognitionRef,
          isRecognizingRef,
          shouldListenRef,
          setIsListening,
          isSpeakingRef,
        });
      }

      transcriptRef.current = "";
      setTranscript("");
      setCanSend(false);
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Check console.");
    } finally {
      setIsTranscriptSending(false);
    }
  };

  const handleSendResumeDataToLlm = async () => {
    setIsResumeSending(true);
    setChatHistory([]);
    setQnaHistory([]);
    try {
      const response = await fetch(`${apiBaseUrl}/api/interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, history: [] }),
      });

      if (!response.ok) throw new Error("Resume send failed");

      const data = await response.json();
      data.react = removeLastQuestionFromReact(
        data.react,
        data.question
      ).trim();

      setChatHistory([
        {
          react: data.react || "",
          question: data.question || null,
          answer: data.answer || null,
          finish: data.finish,
        },
      ]);

      setIsResumeSendToLlm(true);
      if (data.react) {
        await speakText(data.react, {
          recognitionRef,
          isRecognizingRef,
          shouldListenRef,
          setIsListening,
          isSpeakingRef,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Sending resume failed.");
    } finally {
      setIsResumeSending(false);
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white backdrop-blur-md">
          <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
        </div>
      )}
      {!loading && (
        <div className="flex flex-col gap-6 h-auto max-w-auto mx-auto rounded-3xl p-8 shadow-xl border border-white/10 bg-white/10 backdrop-blur-md">
          {/* Header */}
          <div className="flex flex-col justify-between items-center border-b border-gray-300 pb-4">
            <h2 className="lg::text-3xl text-md font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-slate-300 drop-shadow-md">
              Interview Assistant
            </h2>
            <div className="flex justify-between gap-3 mt-3 text-sm">
              {/* For guest join */}
              {isGuestJoin && (
                <div>
                  <div className="flex flex-col mx-auto mb-3">
                    <span className="text-sm block mb-2">
                      Upload your resume{" "}
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleUpload}
                      className="file-input file-input-bordered w-full"
                    />
                  </div>
                  {isGuestJoin && (
                                      <button
                    onClick={handleSendResumeDataToLlm}
                    disabled={isResumeSending || isResumeSendToLlm}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-semibold shadow-md transition-colors duration-300 w-auto ${
                      isResumeSending || isResumeSendToLlm || !isResumeParsed
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    <Upload className="w-3 h-5" />
                    {isResumeSending
                      ? "Sending Resume..."
                      : isResumeSendToLlm
                      ? "Resume Sent"
                      : "Start Interview"}
                  </button>
                  )}
                </div>
              )}

              {/* For authorized join */}
              {!isGuestJoin && (
        <button
          onClick={handleSendResumeDataToLlm}
          disabled={isResumeSending || isResumeSendToLlm || !resume?.name}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-semibold shadow-md transition-colors duration-300 ${
            isResumeSending || isResumeSendToLlm || !resume?.name
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <Upload className="w-3 h-5" />
          {isResumeSending
            ? "Sending Resume..."
            : isResumeSendToLlm
            ? "Resume Sent"
            : "Start Interview"}
        </button>
              )}
            </div>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder="Speak or type your response here..."
            rows={10}
            className="w-auto resize-none p-4 rounded-xl border border-slate-600 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all text-white font-medium placeholder-gray-400 bg-slate-800/70 backdrop-blur-md"
            style={{ minHeight: "3rem", maxHeight: "250px" }}
            onInput={(e) => {
              e.target.style.height = "10*20";
              const newHeight = Math.max(e.target.scrollHeight, 48);
              e.target.style.height = `${newHeight}px`;
            }}
          />

          {/* Controls */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button
              onClick={startListening}
              disabled={!isResumeSendToLlm || isListening}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-transform duration-200 transform w-auto ${
                !isResumeSendToLlm || isListening
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:scale-110"
              }`}
              title="Start Speaking"
            >
              <Mic className="w-6 h-6" />
              Speak
            </button>

            <button
              onClick={handleStopListening}
              disabled={!isListening}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-transform duration-200 transform w-auto ${
                !isListening
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:scale-110"
              }`}
              title="Stop Listening"
            >
              <StopCircle className="w-6 h-6" />
              Stop
            </button>

            <button
              onClick={handleSendToLlm}
              disabled={!canSend || isTranscriptSending}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-lg transition-transform duration-200 transform text-white w-auto ${
                isTranscriptSending
                  ? "bg-teal-400 animate-pulse cursor-not-allowed"
                  : canSend
                  ? "bg-teal-600 hover:scale-110"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              title="Send to Interviewer"
            >
              <Send className="w-6 h-6" />
              {isTranscriptSending ? "Sending..." : "Send"}
            </button>
          </div>

          {/* Listening Indicator */}
          {isListening && (
            <div className="flex justify-center items-center mt-6">
              <div className="flex items-center gap-3 px-5 py-2 bg-green-100 border border-green-400 rounded-full shadow-md animate-pulse">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zm-5 8a7.978 7.978 0 01-6.32-3.03L4 17.35A9.978 9.978 0 0012 21a9.978 9.978 0 008-3.65l-1.68-1.32A7.978 7.978 0 0112 19z" />
                </svg>
                <span className="text-green-800 font-semibold">
                  Listening...
                </span>
              </div>
            </div>
          )}

          {/* Finish & Evaluate Button */}
          {isFinish && !isGuestJoin && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => navigate("/evaluation")}
                className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-3xl shadow-xl transition-all duration-300 transform hover:scale-105 font-extrabold tracking-wide"
                title="Go to Evaluation"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M9 17v-6h13v6H9zm0 0V7h13v10H9zM3 7h6M3 11h6M3 15h6" />
                </svg>
                Evaluate Interview
              </button>
            </div>
          )}
          {/* Finish and guest interviewee */}
          {isFinish && isGuestJoin && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleGuestInterviewFeedback}
                className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-3xl shadow-xl transition-all duration-300 transform hover:scale-105 font-extrabold tracking-wide"
                title="Go to Evaluation"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M9 17v-6h13v6H9zm0 0V7h13v10H9zM3 7h6M3 11h6M3 15h6" />
                </svg>
                Check Feedback
              </button>
            </div>
          )}
          {/* Feedback Modal */}
          {showFeedbackModal && isFinish && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-white/10 rounded-xl p-6 max-w-lg w-full shadow-lg border border-white/20 text-white relative">
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 text-white hover:text-red-400 transition-colors"
                  aria-label="Close feedback modal"
                >
                  <X className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-bold mb-4 text-center">
                  Interview Feedback
                </h3>
                {feedbackError ? (
                  <p className="text-red-400 text-center">{feedbackError}</p>
                ) : guestFeedback.length === 0 ? (
                  <p className="text-center">No feedback available.</p>
                ) : (
                  <ul className="list-disc list-inside max-h-64 overflow-y-auto space-y-2">
                    {guestFeedback.map((fb, idx) => (
                      <li key={idx} className="text-white/90">
                        {fb}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VoiceToTextAndSpeak;
