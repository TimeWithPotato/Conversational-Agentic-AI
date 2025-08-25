import React, { useContext, useState } from "react";
import { QnaHistoryContext } from "../ContextProvider/QnaHistoryProvider";
import ScoreBarChart from "../components/ScoreBarChart";
import ScorePieChart from "../components/ScorePieChart";
import Swal from "sweetalert2";
import "animate.css";
import { EvaluationContext } from "../ContextProvider/EvaluationProvider";

const apiBaseUrl = import.meta.env.VITE_API_URL;
const Evaluation = () => {
  const { QnaHistory } = useContext(QnaHistoryContext);
  const { evaluation, setEvaluation } = useContext(EvaluationContext);
  const [loading, setIsLoading] = useState(false);

  const handleEvaluate = async () => {
    if (!QnaHistory || QnaHistory.length === 0) {
      Swal.fire({
        title: "No interview data found!",
        text: "Please complete the interview before evaluation.",
        icon: "warning",
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__faster",
        },
        customClass: {
          popup: "custom-swal-popup",
          confirmButton: "custom-swal-btn",
          cancelButton: "custom-swal-btn-cancel",
        },
        showCancelButton: false,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(QnaHistory),
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate interview");
      }

      const result = await response.json();
      setEvaluation(result);
      console.log(result);
    } catch (error) {
      console.error("Evaluation error:", error.message);
      Swal.fire({
        title: "Evaluation Failed",
        text: error.message,
        icon: "error",
        customClass: {
          popup: "custom-swal-popup",
          confirmButton: "custom-swal-btn",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 relative min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-white tracking-wide">
        Conversation Summary
      </h2>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <span className="loading loading-spinner text-blue-600 w-14 h-14"></span>
        </div>
      )}

      {/* Q&A History */}
      <section className="mb-12 max-w-full mx-auto shadow-lg ">
        <h3 className="font-semibold text-lg text-white mb-3">Q&A History:</h3>
        <ul className="list-disc list-inside space-y-3 max-h-72 overflow-y-auto rounded-md border border-white/10 p-4 shadow-sm bg-white/10 backdrop-blur-sm text-white">
          {QnaHistory && QnaHistory.length > 0 ? (
            QnaHistory.map((item, index) => (
              <li
                key={index}
                className="p-3 border border-white/10 rounded-lg bg-white/5 backdrop-blur-md shadow"
              >
                <p>
                  <span className="font-bold text-indigo-700">Q.</span>{" "}
                  {item.question}
                </p>
                <p className="mt-1">
                  <span className="font-bold text-indigo-700">A.</span>{" "}
                  {item.answer}
                </p>
              </li>
            ))
          ) : (
            <li className="text-gray-300 italic">No Q&A history available.</li>
          )}
        </ul>
      </section>

      {/* Evaluate Button */}
      <div className="text-center mb-5">
        <button
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition duration-300 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed"
          onClick={handleEvaluate}
          disabled={loading}
        >
          {loading ? "Evaluating..." : "Evaluate Interview"}
        </button>
      </div>

      {/* Statistical Evaluation */}
      {evaluation &&
        Object.keys(evaluation).length > 0 &&
        QnaHistory.length > 0 && (
          <section className="max-w-full mx-auto mt-10bg-gradient-to-br from-[#f0f3f5] via-[#5c828f] to-[#78929d] p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center md:items-start gap-8 relative">
            <ScoreBarChart evaluation={evaluation} />
            {/* Vertical Divider */}
            <div className="hidden md:block w-3 mt-12 h-64 rounded-full mx-8 bg-gradient-to-b from-red-500 via-red-500-300 to-slate-300 shadow-lg"></div>
            <ScorePieChart evaluation={evaluation} />

            {/* Score & Feedback Container */}
            <div className="w-full mt-10 border-t border-gray-300 pt-6">
              {/* Score Section */}
              <div className="mb-8">
                <h3 className="text-xl font-extrabold text-yellow-600 mb-4 border-b border-yellow-400 pb-2">
                  Evaluation Result
                </h3>
                <p className="text-white font-semibold">
                  <span className="font-medium">Grammar Score:</span>{" "}
                  {evaluation.grammar_score}
                </p>
                <p className="text-white font-semibold">
                  <span className="font-medium">Verbal Delivery:</span>{" "}
                  {evaluation.verbal_delivery}
                </p>
                <p className="text-white font-semibold">
                  <span className="font-medium">Correct Answers:</span>{" "}
                  {evaluation.correct_answers}
                </p>
                <p className="text-white font-semibold">
                  <span className="font-medium">Overall Score:</span>{" "}
                  {evaluation.overall_score}
                </p>
              </div>

              {/* Feedback Section */}
              <div>
                <h4 className="text-xl font-extrabold text-yellow-600 mb-4 border-b border-yellow-400 pb-2">
                  Feedback
                </h4>
                {evaluation.feedback && evaluation.feedback.length > 0 ? (
                  <ul className="list-disc list-inside text-white space-y-2 max-h-56 overflow-y-auto">
                    {evaluation.feedback.map((line, idx) => (
                      <li key={idx} className="leading-relaxed text-sm">
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No feedback available.</p>
                )}
              </div>
            </div>
          </section>
        )}
    </div>
  );
};

export default Evaluation;
