// components/EmailModal.jsx
import React, { useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const EmailModal = ({
  inviteLink,
  interviewerName,
  onClose,
  onSendStart,
  onSendFinish,
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email) return alert("Please enter an email address");

    onSendStart(); // ✅ show spinner
    onClose();

    try {
      const res = await fetch(`${apiBaseUrl}/api/sendInterviewEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          inviteLink,
          interviewerName,
        }),
      });

      if (!res.ok) throw new Error("Failed to send email");
      alert("Email sent!");
    } catch (err) {
      console.error(err);
      alert("Error sending email.");
    } finally {
      onSendFinish(); // stop spinner
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Send Interview Link</h3>

        <input
          type="email"
          placeholder="Interviewee Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
