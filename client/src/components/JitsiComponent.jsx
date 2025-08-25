// JitsiComponent.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../ContextProvider/AuthProvider";
import { useInterviewContext } from "../ContextProvider/InterviewProvider";

const JitsiComponent = ({ onMeetingEnd }) => {
  const jitsiContainerRef = useRef(null);
  const apiRef = useRef(null);
  const { user } = useContext(AuthContext);
  const { roomId } = useInterviewContext();

  const displayName = user?.displayName || user?.email || "Guest";
  const [roomName, setRoomName] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");

  useEffect(() => {
    if (roomId) {
      setRoomName(roomId);
      setJoinedRoom(roomId);
    }
  }, [roomId]);

  useEffect(() => {
    if (!joinedRoom) return;

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
        userInfo: { displayName },
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
    }

    return () => {
      if (apiRef.current) apiRef.current.dispose();
      if (jitsiContainerRef.current) jitsiContainerRef.current.innerHTML = "";
    };
  }, [joinedRoom]);

  const handleJoinRoom = () => {
    if (roomName.trim()) {
      setJoinedRoom(roomName.trim());
    }
  };

  return (
    <div className="flex flex-col h-full">
      {!roomId && (
        <div className="mb-4">
          <div className="text-gray-300 font-semibold mb-2">
            Hello: <span className="text-white">{displayName}</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Room Name"
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
      )}
      <div
        ref={jitsiContainerRef}
        className="flex-grow rounded-lg border border-gray-600"
        style={{ minHeight: "400px", height: "100%" }}
      >
        {!joinedRoom && !roomId && (
          <p className="text-center mt-10 text-gray-400">
            Enter room name and click join to start video conference
          </p>
        )}
      </div>
    </div>
  );
};

export default JitsiComponent;
