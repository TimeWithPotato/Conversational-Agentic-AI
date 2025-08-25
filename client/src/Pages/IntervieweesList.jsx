import React, { useEffect, useState } from "react";
import ScoreBarChart from "../components/ScoreBarChart";
import ScorePieChart from "../components/ScorePieChart";
import Swal from "sweetalert2";
import "animate.css";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const IntervieweesList = () => {
  const [interviewees, setInterviewees] = useState([]);
  const [loadingInterviewees, setLoadingInterviewees] = useState(true);
  const [errorInterviewees, setErrorInterviewees] = useState(null);

  const [evaluation, setEvaluation] = useState(null);
  const [loadingEvalId, setLoadingEvalId] = useState(false);
  const [loading, setLoading] = useState(false);


  // console.log("Your api is: ", apiBaseUrl);

  // Fetch interviewees list on mount
  useEffect(() => {
    const fetchInterviewees = async () => {
      try {
        setLoadingInterviewees(true);
        setLoading(true);
        const res = await fetch(`${apiBaseUrl}/api/getInterviewees`);
        if (!res.ok) throw new Error("Failed to fetch interviewees");
        if (res.ok) setLoading(false);
        const data = await res.json();
        setInterviewees(data);
      } catch (err) {
        setErrorInterviewees(err.message);
        setLoading(false);
      } finally {
        setLoadingInterviewees(false);
        setLoading(false);
      }
    };
    fetchInterviewees();
  }, []);

  // Fetch evaluation for a given interviewee ID
  const handleEvaluate = async (intervieweeId) => {
    setLoadingEvalId(intervieweeId);
    setEvaluation(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/getEvaluationByIntervieweeId/${intervieweeId}`
      );
      if (!res.ok) throw new Error("Failed to fetch evaluation");
      if (res.ok) setLoading(false);
      const data = await res.json();
      setEvaluation(data);
    } catch (err) {
      setLoading(false);
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__faster",
        },
        customClass: {
          popup: "custom-swal-popup",
          confirmButton: "custom-swal-btn",
        },
      });
    } finally {
      setLoadingEvalId(null);
      setLoading(false);
    }
  };

  if (loadingInterviewees)
    return <p className="text-white">Loading interviewees...</p>;
  if (errorInterviewees)
    return <p className="text-red-500">Error: {errorInterviewees}</p>;

  if (interviewees.length === 0)
    return <p className="text-white">No interviewees found.</p>;

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white backdrop-blur-md">
          <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
        </div>
      )}
      <div className="max-w-6xl mx-auto p-6 bg-gray-900 rounded shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-6">Interviewees List</h1>
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-600 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-600 px-4 py-2 text-left">
                Interview ID
              </th>
              <th className="border border-gray-600 px-4 py-2 text-left">
                Date
              </th>
              <th className="border border-gray-600 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {interviewees.map(
              ({ _id, intervieweeName, intervieweeId, createdAt }) => (
                <tr key={_id} className="hover:bg-gray-700">
                  <td className="border border-gray-600 px-4 py-2">
                    {intervieweeName}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 break-all">
                    {intervieweeId}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {new Date(createdAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    <button
                      onClick={() => handleEvaluate(intervieweeId)}
                      disabled={loadingEvalId === intervieweeId}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-3 py-1 rounded disabled:opacity-50"
                    >
                      {loadingEvalId === intervieweeId
                        ? "Evaluating..."
                        : "Evaluate"}
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* Show evaluation results below */}
        {evaluation && (
          <section className="mt-10 p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-extrabold text-yellow-400 mb-4">
              Evaluation Result for{" "}
              {evaluation.intervieweeName || "Interviewee"}
            </h2>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <ScoreBarChart evaluation={evaluation} />
              <div className="hidden md:block w-3 h-64 rounded-full mx-8 bg-gradient-to-b from-red-500 via-red-300 to-slate-300 shadow-lg"></div>
              <ScorePieChart evaluation={evaluation} />
            </div>

            <div className="mt-8 border-t border-yellow-400 pt-6">
              <div className="mb-6">
                <p>
                  <strong>Grammar Score:</strong> {evaluation.grammar_score}
                </p>
                <p>
                  <strong>Verbal Delivery:</strong> {evaluation.verbal_delivery}
                </p>
                <p>
                  <strong>Correct Answers:</strong> {evaluation.correct_answers}
                </p>
                <p>
                  <strong>Overall Score:</strong> {evaluation.overall_score}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-yellow-400">
                  Feedback
                </h3>
                {evaluation.feedback && evaluation.feedback.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2 max-h-56 overflow-y-auto text-white">
                    {evaluation.feedback.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-gray-400">No feedback available.</p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default IntervieweesList;
