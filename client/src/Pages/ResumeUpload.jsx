import { useContext, useState, useEffect } from "react";
import { ResumeContext } from "../ContextProvider/ResumeProvider";
const apiBaseUrl = import.meta.env.VITE_API_URL

const RenderValue = ({ value }) => {
  if (Array.isArray(value)) {
    return (
      <ul className="list-disc list-inside ml-4">
        {value.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  } else if (typeof value === "object" && value !== null) {
    return (
      <div className="ml-4 border-l pl-4 space-y-1">
        {Object.entries(value).map(([key, val]) => (
          <div key={key}>
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
            <RenderValue value={val} />
          </div>
        ))}
      </div>
    );
  } else {
    return <span>{value || "—"}</span>;
  }
};

const ResumeUpload = () => {
    console.log("This is apiBaseUrl "+apiBaseUrl)
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { handleResumeUpload } = useContext(ResumeContext);

  const fieldOrder = [
    "name",
    "email",
    "phone",
    "education",
    "experience",
    "skills",
    "research interest",
    "publications",
    "projects",
    "achievements",
    "certifications",
  ];

  useEffect(() => {
    const storedResume = localStorage.getItem("resumeData");
    if (storedResume) {
      const parsed = JSON.parse(storedResume);
      setResumeData(parsed);
      handleResumeUpload(parsed);
    }
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/upload-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "PDF upload failed");
      }

      const resumeObj = await response.json();
      setResumeData(resumeObj);
      localStorage.setItem("resumeData", JSON.stringify(resumeObj));
      handleResumeUpload(resumeObj);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to extract PDF text");
    } finally {
      setLoading(false);
    }
  };

  const remainingFields = resumeData
    ? Object.entries(resumeData).filter(
        ([key]) => !fieldOrder.includes(key.toLowerCase())
      )
    : [];

  return (
    <div className="relative min-h-screen p-6 max-w-full mx-auto">
      {/* Upload Section */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          className="file-input file-input-bordered w-full"
        />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white backdrop-blur-md">
          <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {/* Resume Display */}
      {resumeData && (
        <div className="card shadow-lg bg-base-100 p-6 max-w-full">
          <h2 className="text-2xl font-bold text-center mb-6">
            Resume Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fieldOrder.map((key) => {
              const actualKey = Object.keys(resumeData).find(
                (k) => k.toLowerCase() === key.toLowerCase()
              );
              if (!actualKey) return null;

              const data = resumeData[actualKey];

              // Custom layout for skills
              if (key.toLowerCase() === "skills") {
                return (
                  <div key={key} className="mb-4 md:col-span-2">
                    <h3 className="text-lg font-semibold capitalize mb-2">
                      {key.replace(/_/g, " ")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(data) ? (
                        data.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full bg-[#5dbea3] text-white font-medium text-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span>{data}</span>
                      )}
                    </div>
                  </div>
                );
              }

              // Custom layout for education
              if (key.toLowerCase() === "education") {
                const { degree = [], university = "", college = "" } = data;

                if(!Array.isArray(degree)){
                  degree = degree ? [degree] : [];
                }
                return (
                  <div key={key} className="mb-4 md:col-span-2">
                    <h3 className="text-lg font-semibold capitalize mb-2">
                      Education
                    </h3>
                    <div className="space-y-1">
                      {degree.map((deg, idx) => {
                        const lowerDeg = deg.toLowerCase();
                        let institute = "";
                        if (lowerDeg.includes("m.sc")) {
                          institute = university;
                        } else if (lowerDeg.includes("b.sc")) {
                          institute = college;
                        }
                        return (
                          <p key={idx} className="text-sm">
                            <span className="font-medium">{deg}</span>
                            {institute && (
                              <span className="text-white-600">
                                {" "}
                                — {institute}
                              </span>
                            )}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // Default layout
              return (
                <div key={key} className="mb-4">
                  <h3 className="text-lg font-semibold capitalize mb-1">
                    {key.replace(/_/g, " ")}
                  </h3>
                  <RenderValue value={data} />
                </div>
              );
            })}

            {/* Render remaining fields */}
            {remainingFields.map(([key, value]) => (
              <div key={key} className="mb-4">
                <h3 className="text-lg font-semibold capitalize mb-1">
                  {key.replace(/_/g, " ")}
                </h3>
                <RenderValue value={value} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
