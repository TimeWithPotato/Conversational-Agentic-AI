import React, { createContext, useState } from "react";

export const ResumeContext = createContext(null);

const ResumeProvider = ({ children }) => {
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);

  const handleResumeUpload = () => {
    setIsResumeUploaded(true);
  };

  return (
    <ResumeContext.Provider value={{ isResumeUploaded, handleResumeUpload }}>
      {children}
    </ResumeContext.Provider>
  );
};

export default ResumeProvider;
