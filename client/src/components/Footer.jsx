import { FaGithub, FaLinkedin, FaEnvelope, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-gray-900 via-slate-800 to-gray-900 text-gray-300 py-10 px-6 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
        
        {/* Brand / About */}
        <div>
          <h2 className="text-2xl font-bold text-cyan-400">Group-4 </h2>
          <p className="mt-2 text-sm">
            Your intelligent assistant for mock interviews and personalized evaluation, powered by LLMs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-cyan-300 mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/" className="hover:text-cyan-400">Home</a></li>
            <li><a href="/profile" className="hover:text-cyan-400">Profile</a></li>
            <li><a href="/interview" className="hover:text-cyan-400">Interview</a></li>
            <li><a href="/evaluation" className="hover:text-cyan-400">Evaluation</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-xl font-semibold text-cyan-300 mb-2">Connect</h3>
          <div className="flex justify-center md:justify-start gap-4 mt-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">
              <FaGithub size={22} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">
              <FaLinkedin size={22} />
            </a>
            <a href="mailto:contact@aiinterviewer.com" className="hover:text-cyan-400">
              <FaEnvelope size={22} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">
              <FaTwitter size={22} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 text-xs text-gray-500">
        © {new Date().getFullYear()} AI Interviewer. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
