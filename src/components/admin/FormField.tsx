type FormFieldProps = {
  label: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "url" | "number" | "password";
  multiline?: boolean;
  error?: string;
  hint?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
};

export default function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  multiline = false,
  error,
  hint,
  required,
  dir,
}: FormFieldProps) {
  return (
    <div className="admin-form-group">
      <label className="admin-label" htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          className={`admin-textarea${error ? " error" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir={dir}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className={`admin-input${error ? " error" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir={dir}
        />
      )}
      {hint ? <p className="admin-inline-hint">{hint}</p> : null}
      {error ? <p className="admin-field-error">{error}</p> : null}
    </div>
  );
}
