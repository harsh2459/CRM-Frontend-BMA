import React, { useState } from "react";
import "../../style/templates.css";

export default function TemplateRowModal({ fields, onClose, onCreate }) {
  const [form, setForm] = useState({});

  const onChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const submit = (e) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target.classList.contains("modal-overlay") && onClose()}>
      <div className="modal-card">
        <h4>Add Row</h4>
        <form onSubmit={submit} className="tpl-form">
          {fields.map((f) => (
            <Field key={f.fieldName} f={f} value={form[f.fieldName]} onChange={onChange} />
          ))}
          <div className="tpl-actions">
            <button className="btn btn-primary" type="submit">
              Create
            </button>
            <button className="btn btn-ghost" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ f, value, onChange }) {
  const common = { className: "input", value: value ?? "", onChange: (e) => onChange(f.fieldName, e.target.value) };

  if (f.fieldType === "textarea") {
    return (
      <div className="tpl-row">
        <label className="lbl">
          {f.fieldName}
          {f.isRequired && " *"}
        </label>
        <textarea className="textarea" {...common} />
      </div>
    );
  }
  if (f.fieldType === "dropdown" || f.fieldType === "radio") {
    return (
      <div className="tpl-row">
        <label className="lbl">
          {f.fieldName}
          {f.isRequired && " *"}
        </label>
        <select className="select" value={value ?? ""} onChange={(e) => onChange(f.fieldName, e.target.value)}>
          <option value="">Select...</option>
          {(f.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }
  if (f.fieldType === "checkbox") {
    const arr = Array.isArray(value) ? value : [];
    const toggle = (opt) => {
      const next = arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt];
      onChange(f.fieldName, next);
    };
    return (
      <div className="tpl-row">
        <label className="lbl">
          {f.fieldName}
          {f.isRequired && " *"}
        </label>
        <div className="pill-row">
          {(f.options || []).map((opt) => (
            <button
              key={opt}
              type="button"
              className={`pill ${arr.includes(opt) ? "pill--on" : ""}`}
              onClick={() => toggle(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }
  // default text/number/date
  const type = ["number", "date"].includes(f.fieldType) ? f.fieldType : "text";
  return (
    <div className="tpl-row">
      <label className="lbl">
        {f.fieldName}
        {f.isRequired && " *"}
      </label>
      <input type={type} className="input" value={value ?? ""} onChange={(e) => onChange(f.fieldName, e.target.value)} />
    </div>
  );
}
