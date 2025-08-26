import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addCategory } from "../actions/categoryActions";
import "../style/components/category.css"

const CategoryModal = ({ onClose, onCreated }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [mins, setMins] = useState("");
  const [busy, setBusy] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  const onOverlay = (e) => { if (e.target === overlayRef.current && !busy) onClose(); };

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !mins) return;
    setBusy(true);
    try {
      const created = await dispatch(addCategory(name.trim(), Number(mins))); // thunk returns data
      onCreated?.(created); // let parent preselect
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-overlay-category" ref={overlayRef} onMouseDown={onOverlay}>
      <div className="modal-card">
        <h3 className="modal-title">Add Category</h3>
        <form className="modal-form" onSubmit={submit}>
          <input
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            min="1"
            placeholder="Default due time (minutes)(optional)"
            value={mins}
            onChange={(e) => setMins(e.target.value)}
          />
          <div className="modal-actions">
            <button type="submit" className="btn btn-accent" disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
