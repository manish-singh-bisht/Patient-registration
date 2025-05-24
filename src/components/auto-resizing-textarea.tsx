import { useEffect, useRef, type ChangeEvent } from "react";

interface AutoResizeTextAreaProps {
  value: string | undefined;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  maxHeight?: number;
}

export const AutoResizeTextArea = ({
  value,
  onChange,
  placeholder,
  className = "",
  maxHeight = 120,
}: AutoResizeTextAreaProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto";
      const scrollHeight = textArea.scrollHeight;
      textArea.style.height = Math.min(scrollHeight, maxHeight) + "px";
      textArea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
    }
  }, [value, maxHeight]);

  return (
    <textarea
      ref={textAreaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`resize-none transition-all duration-200 ${className}`}
      rows={1}
    />
  );
};
