//ResumeProvider.jsx
import React, { createContext, useState } from "react";

export const ResumeContext = createContext(null);

const ResumeProvider = ({ children }) => {
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [resume, setResume] = useState({})

  const handleResumeUpload = async (resume) => {
    setIsResumeUploaded(true);
    setResume(resume)
    // console.log(resume)
  };

  return (
    <ResumeContext.Provider value={{ isResumeUploaded, handleResumeUpload, resume}}>
      {children}
    </ResumeContext.Provider>
  );
};

export default ResumeProvider;
