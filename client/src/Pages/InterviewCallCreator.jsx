// InterviewCallCreator.jsx
import React, { useState, useEffect, useContext } from "react";
import { Mails, SendHorizontal } from "lucide-react";
import JitsiComponent from "../components/JitsiComponent";
import { AuthContext } from "../ContextProvider/AuthProvider";
import { useInterviewContext } from "../ContextProvider/InterviewProvider";
import EmailModal from "../components/EmailModal";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const InterviewCallCreator = () => {
  const { user } = useContext(AuthContext);
  const { roomId, setRoomId } = useInterviewContext();
  const [inviteLink, setInviteLink] = useState("");
  const [responseOk, setResponseOk] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");



  // handle modal and spinner logic
  const handleSendStart = () => setSendingEmail(true);
  const handleSendFinish = () => setSendingEmail(false);

  // ✅ Utility function to generate room ID
  const generateRoomId = (uid) => {
    const random = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();
    return `${uid}-${random}-${timestamp}`;
  };

  // ✅ Register interviewer (once)
  useEffect(() => {
    const createInterviewer = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${apiBaseUrl}/api/createInterviewer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.displayName,
            _id: user.uid,
          }),
        });

        setResponseOk(res.ok);
        if (!res.ok) {
          alert("Failed to create the interviewer.");
        }
      } catch (err) {
        console.error("Create interviewer error:", err);
        alert("Failed to connect to the server.");
      }
    };

    createInterviewer();
  }, [user]);

  // ✅ Generate room + invite link after user and interviewer are ready
  useEffect(() => {
    if (user && responseOk && !roomId) {
      const generatedRoomId = generateRoomId(user.uid);
      setRoomId(generatedRoomId);
      setInviteLink(`${window.location.origin}/interview/${generatedRoomId}`);
    }
  }, [user, responseOk, roomId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invitation link copied!");
  };

  if (!roomId) return <p className="text-white">Loading interview room...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-white bg-black/40 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Interview Room</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Invitation Link:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="flex-1 p-2 rounded text-black"
          />
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Copy
          </button>
        </div>
      </div>

      <div style={{ height: "600px", borderRadius: "12px", overflow: "hidden" }}>
        <JitsiComponent roomName={roomId} />
      </div>
      {/* Floating Email Button */}
        {showEmailModal && (
          <EmailModal
            inviteLink={inviteLink}
            interviewerName={user.displayName}
            onClose={() => setShowEmailModal(false)}
          onSendStart={ handleSendStart }
          onSendFinish={ handleSendFinish}
          />
        )}

        <button
          onClick={() => !sendingEmail && setShowEmailModal(true)}
          className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 z-50"
          title="Send invite via email"
        >
          {sendingEmail ? (
            <SendHorizontal className="w-6 h-6 animate-spin" />
          ) : (
            <Mails className="w-6 h-6" />
          )}
        </button>


    </div>
  );
};

export default InterviewCallCreator;
