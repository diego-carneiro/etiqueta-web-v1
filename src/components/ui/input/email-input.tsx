import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  onValidityChange?: (isValid: boolean) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailInput({
  value,
  onChange,
  placeholder = "Digite o e-mail",
  className = "",
  required = false,
  disabled = false,
  onValidityChange,
}: EmailInputProps) {
  const [isTouched, setIsTouched] = useState(false);

  const isEmpty = value.trim().length === 0;
  const isFormatValid = EMAIL_REGEX.test(value.trim());
  const isValid = required ? !isEmpty && isFormatValid : isEmpty || isFormatValid;
  const shouldShowError = isTouched && !isValid;

  const errorMessage = useMemo(() => {
    if (!shouldShowError) {
      return "";
    }

    if (required && isEmpty) {
      return "Informe o e-mail.";
    }

    return "Formato de e-mail inválido.";
  }, [isEmpty, required, shouldShowError]);

  const handleChange = (nextValue: string) => {
    onChange(nextValue);
    const nextIsEmpty = nextValue.trim().length === 0;
    const nextIsFormatValid = EMAIL_REGEX.test(nextValue.trim());
    const nextIsValid = required
      ? !nextIsEmpty && nextIsFormatValid
      : nextIsEmpty || nextIsFormatValid;

    onValidityChange?.(nextIsValid);
  };

  return (
    <div className="space-y-1">
      <Input
        type="email"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={() => {
          setIsTouched(true);
          onValidityChange?.(isValid);
        }}
        placeholder={placeholder}
        aria-invalid={shouldShowError}
        disabled={disabled}
        className={`border-none focus:ring-2 focus:ring-brand/40 focus:outline-none mt-4 ${className}`.trim()}
      />
      {shouldShowError && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
