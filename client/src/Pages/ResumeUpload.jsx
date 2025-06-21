import React, { useContext, useState } from "react";
import { ResumeContext } from "../ContextProvider/ResumeProvider";

const ResumeUpload = () => {
  const [pdfText, setPdfText] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleResumeUpload } = useContext(ResumeContext);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("PDF upload failed");

      const data = await response.json();
      setPdfText(data.text);
      handleResumeUpload();
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to extract PDF text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <input type="file" accept="application/pdf" onChange={handleUpload} />
      {loading && <p className="text-blue-500 mt-2">Extracting PDF content...</p>}
      <textarea
        className="w-full h-64 mt-4 p-2 border border-gray-300"
        value={pdfText}
        readOnly
        placeholder="Extracted PDF text will appear here..."
      />
    </div>
  );
};

export default ResumeUpload;
