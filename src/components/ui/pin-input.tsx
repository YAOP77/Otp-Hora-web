"use client";

import { useId, useRef } from "react";

type PinInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  mask?: boolean;
};

export function PinInput({
  length = 6,
  value,
  onChange,
  id,
  disabled,
  mask = true,
}: PinInputProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const digits: string[] = [];
  for (let i = 0; i < length; i++) {
    digits.push(value[i] ?? "");
  }

  function applyNext(next: string) {
    onChange(next.replace(/\D/g, "").slice(0, length));
  }

  function handleChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length === 0) {
      const arr = value.split("");
      arr[index] = "";
      applyNext(arr.join(""));
      return;
    }
    const last = raw.slice(-1);
    const arr = value.split("");
    while (arr.length < length) arr.push("");
    arr[index] = last;
    applyNext(arr.join(""));
    if (last && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(text);
    const focusIndex = Math.min(text.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  }

  return (
    <div
      className="flex gap-2"
      role="group"
      aria-label="Code PIN à 6 chiffres"
      onPaste={handlePaste}
    >
      {digits.map((digit, i) => (
        <input
          key={`${baseId}-${i}`}
          id={`${baseId}-${i}`}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type={mask ? "password" : "text"}
          inputMode="numeric"
          pattern="\d*"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          className="h-12 w-10 rounded-lg border border-border text-center text-lg font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          value={digit}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          aria-label={`Chiffre ${i + 1}`}
        />
      ))}
    </div>
  );
}
