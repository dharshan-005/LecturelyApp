export const searchTranscript = (segments, keyword) => {
  const lower = keyword.toLowerCase();
  return segments.filter((seg) =>
    seg.text.toLowerCase().includes(lower),
  );
};
