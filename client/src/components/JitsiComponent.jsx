import React, { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../ContextProvider/AuthProvider";

const JitsiComponent = ({ onMeetingEnd }) => {
  const [roomName, setRoomName] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");
  const jitsiContainerRef = useRef(null);
  const apiRef = useRef(null);

  // Get the logged-in user's display name from your Firebase auth context
  const { user } = useContext(AuthContext);
  const intervieweeName = user?.displayName || user?.email || "Interviewee";

  useEffect(() => {
    if (!joinedRoom) return;

    // Load Jitsi API dynamically (avoid server side or SSR issues)
    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = () => startConference();
      document.body.appendChild(script);
    } else {
      startConference();
    }

    function startConference() {
      const domain = "meet.jit.si";
      const options = {
        roomName: joinedRoom,
        parentNode: jitsiContainerRef.current,
        userInfo: {
          intervieweeName,
        },
        configOverwrite: {
          startWithAudioMuted: true,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
        },
      };

      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      apiRef.current.addListener("readyToClose", () => {
        if (onMeetingEnd) onMeetingEnd();
      });

      return () => {
        apiRef.current && apiRef.current.dispose();
      };
    }

    // Cleanup on unmount or room change
    return () => {
      if (window.JitsiMeetExternalAPI && jitsiContainerRef.current) {
        jitsiContainerRef.current.innerHTML = "";
      }
    };
  }, [joinedRoom, intervieweeName, onMeetingEnd]);

  const handleJoinRoom = () => {
    if (roomName.trim()) {
      setJoinedRoom(roomName.trim());
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex flex-col">
        <div className="mb-1 text-gray-300 font-semibold">
          Hello: <span className="text-white">{intervieweeName}</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Room Name/ID"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="flex-grow p-2 rounded-md text-white"
          />
          <button
            onClick={handleJoinRoom}
            className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
          >
            Join
          </button>
        </div>
      </div>

      <div
        ref={jitsiContainerRef}
        className="flex-grow rounded-lg border border-gray-600"
        style={{ minHeight: "400px", height: "100%" }}
      >
        {!joinedRoom && (
          <p className="text-center mt-10 text-gray-400">
            Enter room name and click join to start video conference
          </p>
        )}
      </div>
    </div>
  );
};

export default JitsiComponent;
