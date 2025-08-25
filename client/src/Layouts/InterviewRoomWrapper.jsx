import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ParentInterViewContainer from "./ParentInterViewContainer";
import { useInterviewContext } from "../ContextProvider/InterviewProvider";
import NameModal from "../components/NameModal";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const InterviewRoomWrapper = () => {
  const { roomId } = useParams();
  const {
    setRoomId,
    isGuestJoin,
    setIsGuestJoin,
    setInterviewerId,
    setIntervieweeId,
    intervieweeName,
    setIntervieweeName,
    setStartTime,
  } = useInterviewContext();

  const [responseOk, setResponseOk] = useState(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState(""); // for input before submit

  const hasCreatedInterview = useRef(false);

  useEffect(() => {
    if (isGuestJoin && !intervieweeName) {
      // Guest joined but name not set => show modal
      setShowNameModal(true);
    } else {
      setShowNameModal(false);
    }
  }, [isGuestJoin, intervieweeName]);

  const createInterview = async (name) => {
    if (!roomId) return;
    if (hasCreatedInterview.current) return;
    hasCreatedInterview.current = true;

    const interviewerId = roomId.split("-")[0];
    const intervieweeId = roomId;
    const startTime = new Date();

    const data = {
      interviewerId,
      intervieweeId,
      intervieweeName: name,
      startTime,
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/createInterview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setResponseOk(true);
        setInterviewerId(interviewerId);
        setIntervieweeId(intervieweeId);
        setStartTime(startTime);
        setIntervieweeName(name);
      } else {
        setResponseOk(false);
        alert("Failed to create the interview");
      }
    } catch (err) {
      console.error("Create interview error:", err);
      setResponseOk(false);
      alert("Failed to create the interview");
    }
  };

  // Trigger creating interview only after intervieweeName is set for guests
  useEffect(() => {
    if (roomId && isGuestJoin && intervieweeName && !responseOk) {
      createInterview(intervieweeName);
    }
  }, [roomId, isGuestJoin, intervieweeName, responseOk]);

  useEffect(() => {
    if (roomId) {
      setRoomId(roomId);
      setIsGuestJoin(true);
    } else {
      setIsGuestJoin(false);
      setRoomId("");
      hasCreatedInterview.current = false;
    }
  }, [roomId, setIsGuestJoin, setRoomId]);

  // Modal JSX to get interviewee name
  if (showNameModal) {
    return (
      <NameModal
        tempName={tempName}
        setTempName={setTempName}
        onContinue={() => {
          setIntervieweeName(tempName.trim());
          setShowNameModal(false);
        }}
      />
    );
  }

  if (!roomId) {
    return (
      <div className="p-6 text-red-500 text-center">
        Invalid room. No room ID provided in URL.
      </div>
    );
  }

  if (showNameModal) {
    return <NameModal />;
  }

  if (responseOk) return <ParentInterViewContainer />;

  return <p className="text-white">Loading interview...</p>;
};

export default InterviewRoomWrapper;
