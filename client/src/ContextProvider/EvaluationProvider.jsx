import React from 'react';
import { useState } from 'react';
import { createContext } from 'react';

export const EvaluationContext = createContext(null)
const EvaluationProvider = ({ children }) => {
      const [evaluation, setEvaluation] = useState([]);
    return (
        <EvaluationContext.Provider value={{ evaluation, setEvaluation }}>
            {children}
        </EvaluationContext.Provider>
    );
};

export default EvaluationProvider;