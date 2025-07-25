//QnaHistoryProvider.jsx
import { createContext, useState } from "react";

export const QnaHistoryContext = createContext(null);

const QnaHistoryProvider = ({ children }) => {
  const [QnaHistory, setQnaHistory] = useState([]);

  return (
    <QnaHistoryContext.Provider
      value={{QnaHistory,setQnaHistory}}>
      {children}
    </QnaHistoryContext.Provider>
  );
};

export default QnaHistoryProvider;
