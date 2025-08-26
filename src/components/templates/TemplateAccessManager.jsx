 import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { saveTemplateAccess } from "../../actions/templateActions";
import "../../style/templates.css";

export default function TemplateAccessManager({ matrix, template }) {
  const dispatch = useDispatch();
  const [scope, setScope] = useState(template?.visibility?.scope || "restricted");
  const [allowedDepartments, setAllowedDepartments] = useState(template?.visibility?.allowedDepartments || []);
  const [allowedUsers, setAllowedUsers] = useState(template?.visibility?.allowedUsers?.map(String) || []);

  const allDepartments = useMemo(() => {
    const set = new Set((matrix?.users || []).map(u => u.department).filter(Boolean));
    return Array.from(set);
  }, [matrix]);

  const toggle = (list, setList, v) => {
    setList(list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
  };

  const submit = () => {
    dispatch(saveTemplateAccess(template._id, { scope, allowedDepartments, allowedUsers }));
  };

  return (
    <div className="tpl-card">
      <h4>Access</h4>

      <div className="tpl-row">
        <label className="lbl">Scope</label>
        <select className="select" value={scope} onChange={e=>setScope(e.target.value)}>
          <option value="restricted">Restricted</option>
          <option value="public">Public</option>
        </select>
      </div>

      <div className="tpl-row">
        <label className="lbl">Departments</label>
        <div className="pill-row">
          {allDepartments.map(dep => (
            <button key={dep}
              type="button"
              className={`pill ${allowedDepartments.includes(dep) ? "pill--on" : ""}`}
              onClick={()=>toggle(allowedDepartments, setAllowedDepartments, dep)}>
              {dep}
            </button>
          ))}
        </div>
      </div>

      <div className="tpl-row">
        <label className="lbl">Users</label>
        <div className="pill-list">
          {matrix?.users?.map(u => (
            <button key={u._id}
              type="button"
              title={u.employeeCode}
              className={`pill ${allowedUsers.includes(String(u._id)) ? "pill--on" : ""}`}
              onClick={()=>toggle(allowedUsers, setAllowedUsers, String(u._id))}>
              {u.name}
            </button>
          ))}
        </div>
      </div>

      <div className="tpl-actions">
        <button className="btn btn-primary" onClick={submit}>Save Access</button>
      </div>
    </div>
  );
}
