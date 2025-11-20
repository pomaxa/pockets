import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  id: string;
  helpText?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'number' | 'date' | 'email' | 'tel';
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

interface SelectFieldProps extends BaseFieldProps {
  options: Array<{ value: string; label: string }>;
  selectProps?: SelectHTMLAttributes<HTMLSelectElement>;
}

interface TextareaFieldProps extends BaseFieldProps {
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export function InputField({ label, error, required, id, helpText, type = 'text', inputProps }: InputFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const helpId = helpText ? `${id}-help` : undefined;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold mb-2 text-gray-700">
        {label} {required && <span className="text-accent" aria-label="required">*</span>}
      </label>
      <input
        id={id}
        type={type}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={[errorId, helpId].filter(Boolean).join(' ') || undefined}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        {...inputProps}
      />
      {helpText && (
        <p id={helpId} className="text-sm text-gray-500 mt-1">
          {helpText}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-accent text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function SelectField({ label, error, required, id, helpText, options, selectProps }: SelectFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const helpId = helpText ? `${id}-help` : undefined;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold mb-2 text-gray-700">
        {label} {required && <span className="text-accent" aria-label="required">*</span>}
      </label>
      <select
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={[errorId, helpId].filter(Boolean).join(' ') || undefined}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText && (
        <p id={helpId} className="text-sm text-gray-500 mt-1">
          {helpText}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-accent text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextareaField({ label, error, required, id, helpText, textareaProps }: TextareaFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const helpId = helpText ? `${id}-help` : undefined;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold mb-2 text-gray-700">
        {label} {required && <span className="text-accent" aria-label="required">*</span>}
      </label>
      <textarea
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={[errorId, helpId].filter(Boolean).join(' ') || undefined}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        {...textareaProps}
      />
      {helpText && (
        <p id={helpId} className="text-sm text-gray-500 mt-1">
          {helpText}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-accent text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
