import React, { useContext, useState } from "react";
import JitsiComponent from "../components/JitsiComponent";
import VoiceToTextAndSpeak from "../Pages/VoiceToTextAndSpeak";
import MessengerInterface from "../components/MessengerInterface";

const ParentInterViewContainer = () => {
  const [showJitsi, setShowJitsi] = useState(true);

  const handleMeetingEnd = () => {
    setShowJitsi(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 overflow-hidden">
      <div className="w-full md:w-1/3 overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg p-4">
        {showJitsi ? (
          <JitsiComponent onMeetingEnd={handleMeetingEnd} />
        ) : (
          <div className="text-center text-gray-400 mt-10">Meeting Ended</div>
        )}
      </div>
      <div className="w-full md:w-1/3 overflow-hidden">
        <VoiceToTextAndSpeak />
      </div>
      <div className="w-full md:w-1/3 overflow-hidden">
        <MessengerInterface />
      </div>
    </div>
  );
};


export default ParentInterViewContainer;
