import { useState, createContext } from "react";
export const ChatHistoryContext = createContext(null);
const ChatHistoryProvider = ({children}) => {
const [chatHistory, setChatHistory] = useState([])
    return (
        <ChatHistoryContext.Provider value={{chatHistory, setChatHistory}}>
            {children}
        </ChatHistoryContext.Provider>
    );
};

export default ChatHistoryProvider;