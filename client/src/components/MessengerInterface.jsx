import React, { useContext } from 'react';
import { ChatHistoryContext } from '../ContextProvider/ChatHistoryProvider';

const MessengerInterface = () => {
  const { chatHistory } = useContext(ChatHistoryContext);
  console.log("From MessengerInterface", chatHistory);

  return (
    <div className="border border-white/10 rounded-3xl shadow-xl p-6 h-[80vh] overflow-y-auto flex flex-col gap-5 bg-white/10 backdrop-blur-md">
      {chatHistory.length === 0 && (
        <p className="text-center text-gray-400 mt-20 select-none">
          No messages yet. Start the interview to see the conversation here.
        </p>
      )}

      {chatHistory.map((entry, idx) => (
        <div key={idx} className="flex flex-col space-y-3 max-w-full">
          {/* LLM/System Message */}
          {(entry?.react || entry?.question) && (
            <div className="self-start max-w-[75%] p-5 rounded-3xl rounded-bl-none shadow-md text-white backdrop-blur-lg bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/10">
              {entry?.react && (
                <p className="text-sm text-gray-200 mb-2 leading-relaxed whitespace-pre-wrap">
                  {entry.react}
                </p>
              )}
              {entry?.question && (
                <p className="font-semibold text-white text-base leading-snug">
                  {entry.question}
                </p>
              )}
            </div>
          )}

          {/* User Answer */}
          {entry?.answer && (
            <div className="self-end max-w-[75%] p-5 rounded-3xl rounded-br-none shadow-md text-white backdrop-blur-lg bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-blue-300/20 border border-blue-300/10 whitespace-pre-wrap font-medium">
              {entry.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessengerInterface;
