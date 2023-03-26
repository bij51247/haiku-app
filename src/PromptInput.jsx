export const PromptInput = ({ prompt, maxLength, onChange }) => {
    return (
      <input
        value={prompt}
        maxLength={maxLength}
        onChange={onChange}
      />
    );
  };