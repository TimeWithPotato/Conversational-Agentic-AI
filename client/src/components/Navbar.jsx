import { useContext, useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../ContextProvider/AuthProvider";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";

const Navbar = () => {
  const { user, Logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAuthenticated = !!user;
  const [showMenu, setShowMenu] = useState(false);
  const [mockInterviewOpen, setMockInterviewOpen] = useState(false);
  const mockInterviewTimeout = useRef(null);

  const handleLogout = async () => {
    try {
      await Logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Handle mouse enter / leave with delay for desktop dropdown (Mock Interview)
  const handleMockInterviewMouseEnter = () => {
    clearTimeout(mockInterviewTimeout.current);
    setMockInterviewOpen(true);
  };
  const handleMockInterviewMouseLeave = () => {
    mockInterviewTimeout.current = setTimeout(() => {
      setMockInterviewOpen(false);
    }, 200);
  };

  // Close menu on window resize > md to avoid stuck open
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMenu(false);
        setMockInterviewOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="bg-gray-900 px-6 py-4 shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-white text-2xl font-extrabold tracking-wide select-none">
          AI Interviewer App
        </div>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle menu"
          className="text-white md:hidden focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
          onClick={() => setShowMenu((prev) => !prev)}
          type="button"
        >
          {showMenu ? (
            <X
              size={28}
              className="transition-transform duration-300 ease-in-out hover:scale-110 active:scale-95"
            />
          ) : (
            <Menu
              size={28}
              className="transition-transform duration-300 ease-in-out hover:scale-110 active:scale-95"
            />
          )}
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-lg font-semibold tracking-wide transition transform duration-200 ${
                isActive
                  ? "text-yellow-400 scale-110"
                  : "text-white hover:text-yellow-400 hover:scale-105 active:scale-95"
              }`
            }
          >
            Home
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `text-lg font-semibold tracking-wide transition transform duration-200 ${
                    isActive
                      ? "text-yellow-400 scale-110"
                      : "text-white hover:text-yellow-400 hover:scale-105 active:scale-95"
                  }`
                }
              >
                Profile
              </NavLink>

              <NavLink
                to="/start-interview"
                className={({ isActive }) =>
                  `text-lg font-semibold tracking-wide transition transform duration-200 ${
                    isActive
                      ? "text-yellow-400 scale-110"
                      : "text-white hover:text-yellow-400 hover:scale-105 active:scale-95"
                  }`
                }
              >
                Take Interview
              </NavLink>

              {/* Mock Interview with dropdown */}
              <div
                className="relative"
                onMouseEnter={handleMockInterviewMouseEnter}
                onMouseLeave={handleMockInterviewMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setMockInterviewOpen((prev) => !prev)}
                  className="inline-flex items-center text-lg font-semibold tracking-wide text-white hover:text-yellow-400 focus:outline-none"
                >
                  Mock Interview
                  <ChevronDown
                    className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                      mockInterviewOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mockInterviewOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-gray-800 rounded shadow-lg z-50">
                    <NavLink
                      to="/interview"
                      onClick={() => setMockInterviewOpen(false)}
                      className="block px-4 py-2 text-white hover:bg-yellow-600 hover:text-black"
                    >
                      Mock Interview
                    </NavLink>
                    <NavLink
                      to="/evaluation"
                      onClick={() => setMockInterviewOpen(false)}
                      className="block px-4 py-2 text-white hover:bg-yellow-600 hover:text-black"
                    >
                      Mock Interview Results
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink
                to="/ResumeUpload"
                className={({ isActive }) =>
                  `text-lg font-semibold tracking-wide transition transform duration-200 ${
                    isActive
                      ? "text-yellow-400 scale-110"
                      : "text-white hover:text-yellow-400 hover:scale-105 active:scale-95"
                  }`
                }
              >
                Upload Resume
              </NavLink>

              <NavLink
                to="/intervieweesList"
                className={({ isActive }) =>
                  `text-lg font-semibold tracking-wide transition transform duration-200 ${
                    isActive
                      ? "text-yellow-400 scale-110"
                      : "text-white hover:text-yellow-400 hover:scale-105 active:scale-95"
                  }`
                }
              >
                Interviewees
              </NavLink>

              <button
                onClick={handleLogout}
                className="text-white font-semibold tracking-wide px-3 py-1 rounded-md hover:text-yellow-400 hover:scale-105 active:scale-95 transition transform duration-200 shadow-sm shadow-yellow-500/50"
                type="button"
              >
                Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-lg font-semibold tracking-wide transition transform duration-200 ${
                    isActive
                      ? "text-yellow-400 scale-110"
                      : "text-white hover:text-yellow-400 hover:scale-105 active:scale-95"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `text-lg font-semibold tracking-wide transition transform duration-200 ${
                    isActive
                      ? "text-yellow-400 scale-110"
                      : "text-white hover:text-yellow-400 hover:scale-105 active:scale-95"
                  }`
                }
              >
                Create Account
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          showMenu ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 bg-gray-800 rounded-lg p-4 shadow-lg">
          <NavLink
            to="/"
            onClick={() => setShowMenu(false)}
            className={({ isActive }) =>
              `text-base font-semibold tracking-wide transition transform duration-200 rounded-md px-3 py-2 ${
                isActive
                  ? "text-yellow-400 bg-yellow-900 scale-105"
                  : "text-white hover:text-yellow-400 hover:bg-yellow-900 hover:scale-105 active:scale-95"
              }`
            }
          >
            Home
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/profile"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `text-base font-semibold tracking-wide transition transform duration-200 rounded-md px-3 py-2 ${
                    isActive
                      ? "text-yellow-400 bg-yellow-900 scale-105"
                      : "text-white hover:text-yellow-400 hover:bg-yellow-900 hover:scale-105 active:scale-95"
                  }`
                }
              >
                Profile
              </NavLink>

              <NavLink
                to="/start-interview"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `text-base font-semibold tracking-wide transition transform duration-200 rounded-md px-3 py-2 ${
                    isActive
                      ? "text-yellow-400 bg-yellow-900 scale-105"
                      : "text-white hover:text-yellow-400 hover:bg-yellow-900 hover:scale-105 active:scale-95"
                  }`
                }
              >
                Take Interview
              </NavLink>

              {/* Mock Interview with toggle submenu */}
              <div>
                <button
                  onClick={() => setMockInterviewOpen((prev) => !prev)}
                  className="flex justify-between w-full text-white text-base font-semibold rounded-md px-3 py-2 hover:text-yellow-400 hover:bg-yellow-900 active:scale-95 transition duration-200"
                  type="button"
                >
                  Mock Interview
                  {mockInterviewOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {mockInterviewOpen && (
                  <div className="flex flex-col pl-4 mt-2 space-y-2">
                    <NavLink
                      to="/interview"
                      onClick={() => {
                        setShowMenu(false);
                        setMockInterviewOpen(false);
                      }}
                      className="text-white text-base font-semibold rounded-md px-3 py-2 hover:text-yellow-400 hover:bg-yellow-900 active:scale-95 transition duration-200"
                    >
                      Mock Interview
                    </NavLink>
                    <NavLink
                      to="/evaluation"
                      onClick={() => {
                        setShowMenu(false);
                        setMockInterviewOpen(false);
                      }}
                      className="text-white text-base font-semibold rounded-md px-3 py-2 hover:text-yellow-400 hover:bg-yellow-900 active:scale-95 transition duration-200"
                    >
                      Mock Interview Results
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink
                to="/ResumeUpload"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `text-base font-semibold tracking-wide transition transform duration-200 rounded-md px-3 py-2 ${
                    isActive
                      ? "text-yellow-400 bg-yellow-900 scale-105"
                      : "text-white hover:text-yellow-400 hover:bg-yellow-900 hover:scale-105 active:scale-95"
                  }`
                }
              >
                Upload Resume
              </NavLink>

              <NavLink
                to="/intervieweesList"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `text-base font-semibold tracking-wide transition transform duration-200 rounded-md px-3 py-2 ${
                    isActive
                      ? "text-yellow-400 bg-yellow-900 scale-105"
                      : "text-white hover:text-yellow-400 hover:bg-yellow-900 hover:scale-105 active:scale-95"
                  }`
                }
              >
                Interviewees
              </NavLink>

              <button
                onClick={() => {
                  handleLogout();
                  setShowMenu(false);
                }}
                className="text-white font-semibold tracking-wide px-3 py-2 rounded-md hover:text-yellow-400 hover:bg-yellow-900 hover:scale-105 active:scale-95 transition transform duration-200 shadow-sm shadow-yellow-500/50"
                type="button"
              >
                Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <NavLink
                to="/login"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `text-base font-semibold tracking-wide transition transform duration-200 rounded-md px-3 py-2 ${
                    isActive
                      ? "text-yellow-400 bg-yellow-900 scale-105"
                      : "text-white hover:text-yellow-400 hover:bg-yellow-900 hover:scale-105 active:scale-95"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `text-base font-semibold tracking-wide transition transform duration-200 rounded-md px-3 py-2 ${
                    isActive
                      ? "text-yellow-400 bg-yellow-900 scale-105"
                      : "text-white hover:text-yellow-400 hover:bg-yellow-900 hover:scale-105 active:scale-95"
                  }`
                }
              >
                Create Account
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
