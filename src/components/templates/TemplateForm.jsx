import React, { useState } from "react";
import "../../style/templates.css";

export default function TemplateForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [fields, setFields] = useState(initial?.fields?.length ? initial.fields : []);

  const addField = () => setFields(prev => [...prev, {
    fieldName: "", fieldType: "text", isRequired: false, options: [], placeholder: ""
  }]);

  const updateField = (i, prop, val) => {
    const copy = fields.slice();
    copy[i] = { ...copy[i], [prop]: val };
    setFields(copy);
  };

  const removeField = (i) => setFields(fields.filter((_, idx) => idx !== i));

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, fields });
  };

  return (
    <form className="tpl-card" onSubmit={submit}>
      <div className="tpl-row">
        <input className="input" placeholder="Template name" value={name} onChange={e=>setName(e.target.value)} required />
      </div>
      <div className="tpl-row">
        <textarea className="textarea" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      </div>

      <div className="tpl-fields-hdr">
        <span>Fields</span>
        <button type="button" className="btn btn-accent" onClick={addField}>Add field</button>
      </div>

      {fields.map((f, i) => (
        <div key={i} className="tpl-field-row">
          <input className="input" placeholder="Field name" value={f.fieldName}
                 onChange={e=>updateField(i,"fieldName",e.target.value)} />
          <select className="select" value={f.fieldType}
                  onChange={e=>updateField(i,"fieldType",e.target.value)}>
            <option value="text">Text</option>
            <option value="textarea">Textarea</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="dropdown">Dropdown</option>
            <option value="radio">Radio</option>
            <option value="checkbox">Checkbox</option>
          </select>
          <label className="chk">
            <input type="checkbox" checked={!!f.isRequired}
                   onChange={e=>updateField(i,"isRequired",e.target.checked)} />
            required
          </label>
          {(f.fieldType === "dropdown" || f.fieldType === "radio" || f.fieldType === "checkbox") && (
            <input className="input" placeholder="Options (comma separated)"
                   value={f.options?.join(",") || ""}
                   onChange={e=>updateField(i,"options", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))}/>
          )}
          <button type="button" className="btn btn-ghost" onClick={()=>removeField(i)}>Remove</button>
        </div>
      ))}

      <div className="tpl-actions">
        <button className="btn btn-primary" type="submit">{initial ? "Update" : "Create"}</button>
        {onCancel && <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
