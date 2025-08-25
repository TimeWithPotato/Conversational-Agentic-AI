//InterviewProvider.jsx
import React, { createContext, useContext, useState } from 'react';

export const InterviewContext = createContext("");

export const InterviewProvider = ({ children }) => {
    
    const [roomId, setRoomId] = useState(null);
    const [isGuestJoin, setIsGuestJoin] = useState(false);
    const [interviewerId, setInterviewerId] = useState();
    const [intervieweeId, setIntervieweeId] = useState();
    const [intervieweeName, setIntervieweeName] = useState();
    const [startTime, setStartTime] = useState();
    return (
        <InterviewContext.Provider value={{roomId, setRoomId, isGuestJoin, setIsGuestJoin, interviewerId, setInterviewerId, intervieweeId, setIntervieweeId, intervieweeName, setIntervieweeName, startTime, setStartTime}}>
            {children}
        </InterviewContext.Provider>
    );
};

export const useInterviewContext = ()=>useContext(InterviewContext);