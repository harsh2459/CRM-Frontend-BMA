import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTemplate, deleteTemplate, fetchAccessMatrix, fetchTemplates, updateTemplate } from "../actions/templateActions";
import TemplateForm from "../components/templates/TemplateForm";
import TemplateAccessManager from "../components/templates/TemplateAccessManager";
import "../style/templates.css";
import { Link } from "react-router-dom";

export default function Templates() {
  const dispatch = useDispatch();
  const { items, loading, access } = useSelector(s => s.template || {});
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [accessFor, setAccessFor] = useState(null);

  useEffect(() => { dispatch(fetchTemplates()); }, [dispatch]);
  useEffect(() => { if (accessFor) dispatch(fetchAccessMatrix()); }, [dispatch, accessFor]);

  const onCreate = (body) => {
    if (editing) dispatch(updateTemplate(editing._id, body));
    else dispatch(createTemplate(body));
    setOpenForm(false); setEditing(null);
  };

  return (
    <div className="page">
      <div className="page-bar">
        <h2>Templates</h2>
        <button className="btn btn-accent" onClick={()=>setOpenForm(v=>!v)}>{openForm ? "Close" : "New Template"}</button>
      </div>

      {openForm && (
        <TemplateForm initial={editing} onSubmit={onCreate} onCancel={()=>{ setOpenForm(false); setEditing(null); }} />
      )}

      {loading ? <div>Loading…</div> : (
        <div className="grid">
          {items.map(t => (
            <div key={t._id} className="card">
              <div className="card-hd">
                <h4>{t.name}</h4>
                <span className="badge">{t.visibility?.scope || "restricted"}</span>
              </div>
              <p className="muted">{t.description}</p>
              <div className="row-btns">
                <Link className="btn btn-primary" to={`/templates/${t._id}`}>Open</Link>
                <button className="btn btn-ghost" onClick={()=>{ setEditing(t); setOpenForm(true); }}>Edit</button>
                <button className="btn btn-ghost" onClick={()=>setAccessFor(t)}>Access</button>
                <button className="btn btn-ghost" onClick={()=>dispatch(deleteTemplate(t._id))}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {accessFor && (
        <div className="modal-overlay" onMouseDown={e=>e.target.classList.contains("modal-overlay") && setAccessFor(null)}>
          <div className="modal-card">
            <div className="modal-title">
              Manage Access — {accessFor.name}
            </div>
            <TemplateAccessManager matrix={access} template={accessFor}/>
            <div className="tpl-actions">
              <button className="btn btn-ghost" onClick={()=>setAccessFor(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
