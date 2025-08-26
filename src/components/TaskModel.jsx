import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignTask } from "../actions/taskActions";
import { getUsers } from "../actions/getUsersActions";
import { fetchCategories } from "../actions/categoryActions";
import CategoryModal from "./CategoryModal";
import "../style/components/newTaskModal.css"

const TaskModel = ({ onClose = () => { }, afterCreate = () => { } }) => {
    const dispatch = useDispatch();
    const { users = [] } = useSelector((s) => s.user || {});
    const { categories = [], loading: catLoading } = useSelector((s) => s.category || {});
    const { loading } = useSelector((s) => s.task || {});

    const [form, setForm] = useState({
        title: "",
        description: "",
        assigneeCodes: [],
        categoryId: "",          // store category _id
        priority: "importent but not urgent",
        dueAt: "",
        dynamicFields: []  // Store dynamic fields
    });

    const [pickUser, setPickUser] = useState("");
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [allowCustomDue, setAllowCustomDue] = useState(false);   // <-- manual override toggle
    const overlayRef = useRef(null);

    // Dynamic field state for adding new fields
    const [dynamicField, setDynamicField] = useState({
        fieldName: "",
        fieldType: "text", // default to text
        fieldValue: ""
    });

    useEffect(() => { dispatch(getUsers()); }, [dispatch]);
    useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

    const onOverlay = (e) => { if (e.target === overlayRef.current) onClose(); };

    const onField = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const addAssignee = () => {
        if (!pickUser) return;
        setForm(f => (f.assigneeCodes.includes(pickUser) ? f : { ...f, assigneeCodes: [...f.assigneeCodes, pickUser] }));
        setPickUser("");
    };

    const removeAssignee = (code) => {
        setForm(f => ({ ...f, assigneeCodes: f.assigneeCodes.filter(c => c !== code) }));
    };

    const calcDueAtFromCategory = (cat) => {
        if (!cat?.dueTimeInMinutes) return "";
        const dt = new Date();
        dt.setMinutes(dt.getMinutes() + Number(cat.dueTimeInMinutes || 0));
        const pad = (n) => String(n).padStart(2, "0");
        return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
    };

    useEffect(() => {
        if (!form.categoryId || allowCustomDue) return;
        const cat = categories.find(c => c._id === form.categoryId);
        const v = calcDueAtFromCategory(cat);
        if (v) setForm(f => ({ ...f, dueAt: v }));
    }, [form.categoryId, categories, allowCustomDue]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.assigneeCodes.length || !form.categoryId) return;
        await dispatch(assignTask(form));
        afterCreate();
    };

    const userByCode = useMemo(() => {
        const m = new Map();
        users.forEach(u => m.set(u.employeeCode, u));
        return m;
    }, [users]);

    const handleCategoryCreated = async (created) => {
        setShowCategoryModal(false);
        await dispatch(fetchCategories());
        if (created?._id) {
            setForm(f => ({ ...f, categoryId: created._id }));
            setAllowCustomDue(false); // default to category time for new categories
        }
    };

    // Add dynamic field to form
    const addDynamicField = () => {
        if (!dynamicField.fieldName || !dynamicField.fieldValue) return; // Ensure both fields are filled
        const newField = { ...dynamicField };
        setForm((prevForm) => ({
            ...prevForm,
            dynamicFields: [...prevForm.dynamicFields, newField] // Add dynamic field to state
        }));
        setDynamicField({ fieldName: "", fieldType: "text", fieldValue: "" }); // Reset input fields after adding
    };

    // Handle dynamic field changes
    const handleDynamicFieldChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFields = [...form.dynamicFields];
        updatedFields[index][name] = value;
        setForm({ ...form, dynamicFields: updatedFields });
    };

    // Remove dynamic field
    const removeDynamicField = (index) => {
        const updatedFields = form.dynamicFields.filter((_, i) => i !== index);
        setForm({ ...form, dynamicFields: updatedFields });
    };

    return (
        <div className="modal-overlay-task" ref={overlayRef} onMouseDown={onOverlay}>
            <div className="modal-card-task" role="dialog" aria-modal="true">
                <h3 className="modal-title">Assign New Task</h3>
                <form className="modal-form modal-task" onSubmit={onSubmit}>
                    <div className="task-form-left">
                        <input
                            name="title"
                            placeholder="Task Title"
                            value={form.title}
                            onChange={onField}
                            required
                        />

                        <textarea
                            name="description"
                            placeholder="Task Description"
                            value={form.description}
                            onChange={onField}
                            rows={4}
                        />

                        <label className="field-label">Assignees</label>
                        <div className="assignee-picker">
                            <select value={pickUser} onChange={(e) => setPickUser(e.target.value)}>
                                <option value="">Select user…</option>
                                {users.map((u) => (
                                    <option key={u._id} value={u.employeeCode}>
                                        {u.name} ({u.employeeCode})
                                    </option>
                                ))}
                            </select>
                            <button type="button" onClick={addAssignee} disabled={!pickUser}>
                                Add
                            </button>
                        </div>

                        {form.assigneeCodes.length > 0 && (
                            <div className="chip-row">
                                {form.assigneeCodes.map((code) => {
                                    const u = userByCode.get(code);
                                    const label = u ? `${u.name} (${u.employeeCode})` : code;
                                    return (
                                        <span key={code} className="chip">
                                            {label}
                                            <button type="button" className="chip-x" onClick={() => removeAssignee(code)} />
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        <label className="field-label">Priority</label>
                        <select name="priority" value={form.priority} onChange={onField}>
                            <option>important but not urgent</option>
                            <option>important and urgent</option>
                            <option>Not important But urgent</option>
                            <option>Not important But Not urgent</option>
                        </select>
                    </div>

                    <div className="task-form-right">
                        <label className="field-label">Category</label>
                        <div className="assignee-picker">
                            <select
                                name="categoryId"
                                value={form.categoryId}
                                onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                            >
                                <option value="">{catLoading ? "Loading…" : "Select Category"}</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name} — {c.dueTime} min
                                    </option>
                                ))}
                            </select>
                            <button type="button" onClick={() => setShowCategoryModal(true)}>
                                Add
                            </button>
                        </div>

                        <label className="field-label">Due Time</label>
                        <div className="assignee-picker">
                            <input
                                type="datetime-local"
                                name="dueAt"
                                value={form.dueAt}
                                onChange={onField}
                                disabled={!allowCustomDue && !!form.categoryId}
                            />
                            <button
                                type="button"
                                onClick={() => setAllowCustomDue((v) => !v)}
                                title={allowCustomDue ? "Use category default time" : "Edit due time"}
                            >
                                {allowCustomDue ? "Use default" : "Edit"}
                            </button>
                        </div>

                        {/* Dynamic Fields Section */}
                        <h4>Dynamic Fields</h4>
                        <div>
                            <input
                                type="text"
                                name="fieldName"
                                placeholder="Field Name"
                                value={dynamicField.fieldName}
                                onChange={(e) => setDynamicField({ ...dynamicField, fieldName: e.target.value })}
                            />
                            <select
                                name="fieldType"
                                value={dynamicField.fieldType}
                                onChange={(e) => setDynamicField({ ...dynamicField, fieldType: e.target.value })}
                            >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="email">Email</option>
                                <option value="file">File</option>
                            </select>
                            <input
                                type={dynamicField.fieldType}
                                name="fieldValue"
                                placeholder="Field Value"
                                value={dynamicField.fieldValue}
                                onChange={(e) => setDynamicField({ ...dynamicField, fieldValue: e.target.value })}
                            />
                            <button type="button" onClick={addDynamicField}>
                                Add Dynamic Field
                            </button>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="submit" disabled={loading || !form.assigneeCodes.length || !form.categoryId}>
                            {loading ? "Assigning..." : "Assign Task"}
                        </button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            {showCategoryModal && <CategoryModal onClose={() => setShowCategoryModal(false)} onCreated={handleCategoryCreated} />}
        </div>

    );
};

export default TaskModel
