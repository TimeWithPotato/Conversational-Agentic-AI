import React from "react";

const NameModal = ({ tempName, setTempName, onContinue }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg max-w-sm w-full text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Enter your name
      </h2>
      <input
        type="text"
        value={tempName}
        onChange={(e) => setTempName(e.target.value)}
        placeholder="Your name"
        className="w-full p-3 rounded-xl border border-white/30 bg-slate-800/50 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <button
        disabled={!tempName.trim()}
        onClick={onContinue}
        className={`mt-6 w-full py-3 rounded-2xl font-semibold text-white transition-colors duration-300 ${
          tempName.trim()
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  </div>
);

export default NameModal;
