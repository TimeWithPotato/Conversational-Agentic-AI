export function removeLastQuestionFromReact(react, question) {
  if (!react || !question) return react;

  const questionSentences = question.split(/(?<=[.!?])\s+/); // split by sentence
  const reactSentences = react.split(/(?<=[.!?])\s+/);

  const filteredReactSentences = reactSentences.filter(
    sentence => !questionSentences.includes(sentence)
  );

  return filteredReactSentences.join(" ");

  return react;
}
