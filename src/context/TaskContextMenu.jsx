import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../style/context/textcontextmenu.css";

export default function TaskContextMenu({
  x, y, task, onClose,
  onOpen, onEdit, onDelete,
  onDone, oncancellend, onBlocked, onInProgress, onReOpen
}) {
  const ref = useRef(null);
  const [showSub, setShowSub] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const clickAway = (e) => {
      if (!ref.current || !ref.current.contains(e.target)) onClose();
    };
    const esc = (e) => e.key === "Escape" && onClose();
    const close = () => onClose();

    window.addEventListener("click", clickAway);
    window.addEventListener("contextmenu", clickAway);
    window.addEventListener("keydown", esc);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("click", clickAway);
      window.removeEventListener("contextmenu", clickAway);
      window.removeEventListener("keydown", esc);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [onClose]);

  // keep menu inside viewport
  const mainW = 224;
  const mainH = 240;
  const style = {
    position: "fixed",
    left: Math.min(x, window.innerWidth - mainW - 8),
    top: Math.min(y, window.innerHeight - mainH - 8),
    zIndex: 9999
  };

  // position submenu to the right, unless it would overflow
  const subLeft = (style.left + mainW + 8 > window.innerWidth)
    ? -180 /* open left */
    : mainW - 8 /* open right, overlapping a bit */;

  const subStyle = {
    left: subLeft,
    top: 0
  };

  const showSubMenu = () => setShowSub(true);
  const hideSubMenu = () => {
    const id = setTimeout(() => {
      setShowSub(false);
    }, 500); // Delay of 0.5 seconds
    setTimeoutId(id);
  };


  const node = (
    <div ref={ref} className="cm" style={style} role="menu" aria-label="Task menu">
      <button className="cm-it" onClick={() => { onOpen(task); onClose(); }}>Open</button>
      <button className="cm-it" onClick={() => { onEdit(task); onClose(); }}>Edit</button>

      {/* Submenu trigger */}
      <div
        className={`cm-it cm-sub ${showSub ? "is-open" : ""}`}
        onMouseEnter={showSubMenu}
        onMouseLeave={hideSubMenu}
        onFocus={showSubMenu}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) hideSubMenu();
        }}
        tabIndex={0}
        aria-haspopup="true" 
        aria-expanded={showSub}
      >
        <span>Status</span>
        <span className="cm-caret">▶</span>

        {/* Submenu */}
        {showSub && (
          <div className="cm-submenu" style={subStyle} role="menu">
            <button className="cm-it" onClick={() => { onDone(task); onClose(); }}>Mark as Done</button>
            <button className="cm-it" onClick={() => { oncancellend(task); onClose(); }}>Mark as Cancelled</button>
            <button className="cm-it" onClick={() => { onReOpen(task); onClose(); }}>Mark as Re‑Open</button>
            <button className="cm-it" onClick={() => { onInProgress(task); onClose(); }}>Mark as In Progress</button>
            <button className="cm-it" onClick={() => { onBlocked(task); onClose(); }}>Mark as Blocked</button>
          </div>
        )}
      </div>

      <div className="cm-sep" />

      <button className="cm-it danger" onClick={() => { onDelete(task); onClose(); }}>Delete</button>
    </div>
  );

  return createPortal(node, document.body);
}
