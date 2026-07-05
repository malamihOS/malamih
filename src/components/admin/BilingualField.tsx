type BilingualFieldProps = {
  label: string;
  enName: string;
  arName: string;
  enValue: string;
  arValue: string;
  onEnChange: (value: string) => void;
  onArChange: (value: string) => void;
  multiline?: boolean;
  enError?: string;
  arError?: string;
  required?: boolean;
};

export default function BilingualField({
  label,
  enName,
  arName,
  enValue,
  arValue,
  onEnChange,
  onArChange,
  multiline = false,
  enError,
  arError,
  required,
}: BilingualFieldProps) {
  const Input = multiline ? "textarea" : "input";

  return (
    <div className="admin-form-group">
      <label className="admin-label">
        {label}
        {required ? " *" : ""}
      </label>
      <div className="admin-bilingual">
        <div>
          <div className="admin-bilingual-label">English</div>
          <Input
            name={enName}
            className={`admin-${multiline ? "textarea" : "input"}${enError ? " error" : ""}`}
            value={enValue}
            onChange={(e) => onEnChange(e.target.value)}
            dir="ltr"
          />
          {enError ? <p className="admin-field-error">{enError}</p> : null}
        </div>
        <div>
          <div className="admin-bilingual-label">Arabic</div>
          <Input
            name={arName}
            className={`admin-${multiline ? "textarea" : "input"}${arError ? " error" : ""}`}
            value={arValue}
            onChange={(e) => onArChange(e.target.value)}
            dir="rtl"
          />
          {arError ? <p className="admin-field-error">{arError}</p> : null}
        </div>
      </div>
    </div>
  );
}
