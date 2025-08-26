import { useParams } from 'react-router-dom';
import '../style/pages/TaskDetail.css';  // Add your custom styles here
import axiosInstance from '../utils/axiosInstance';
import { useEffect, useState, useMemo } from 'react';

const TaskDetail = () => {
  const { empid, taskid } = useParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [admin, setadmin] = useState(null)
  const fetchTask = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await axiosInstance.get(`/task/taskdeatil/${taskid}`);
      const data = res?.data || {};
      const t = data.task || (Array.isArray(data.tasks) ? data.tasks[0] : data);
      if (!t || !t._id) {
        throw new Error("Task not found");
      }
      setTask(t);


      const ress = await axiosInstance.get(`/admin/get_admin/${t.adminId}`);
      setadmin(ress.data.admin);

    } catch (e) {
      setErr(e?.response?.data?.error || e.message || "Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [empid, taskid]);

  const assignees = useMemo(() => task?.assignees || [], [task]);

  if (loading) {
    return (
      <div className="task-detail-container">
        <div className="td-skel-title" />
        <div className="td-skel-card" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="task-detail-container">
        <h3 className="td-title">Task Details</h3>
        <div className="td-error">{err}</div>
        <div className="back-button">
          <button className="btn btn-primary" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="task-detail-container">
      <div className="td-header">
        <h3 className="td-title">Task Details</h3>
        <div className="td-subtitle">
          Employee: <b>{empid}</b> • Task ID: <code>{taskid}</code>
        </div>
      </div>

      <div className="task-detail-card">
        <div className="td-row">
          <span className="td-key">Title</span>
          <span className="td-val">{task?.title || "—"}</span>
        </div>

        <div className="td-row">
          <span className="td-key">Description</span>
          <span className="td-val td-pre">{task?.description || "—"}</span>
        </div>

        <div className="td-row">
          <span className="td-key">Admin</span>
          <span className="td-val td-pre">{admin.name || "—"}</span>
        </div>

        <div className="td-grid">
          <div className="td-row">
            <span className="td-key">Category</span>
            <span className="td-val">{task?.category || "—"}</span>
          </div>
          <div className="td-row">
            <span className="td-key">Priority</span>
            <span className={`td-badge p-${(task?.priority || "Medium").toLowerCase()}`}>
              {task?.priority || "Medium"}
            </span>
          </div>
          <div className="td-row">
            <span className="td-key">Status</span>
            <span className={`td-badge s-${(task?.status || "Open").toLowerCase().replace(/\s+/g, '-')}`}>
              {task?.status || "Open"}
            </span>
          </div>
          <div className="td-row">
            <span className="td-key">Due</span>
            <span className="td-val">
              {task?.dueAt ? new Date(task.dueAt).toLocaleString() : "—"}
            </span>
          </div>
          <div className="td-row">
            <span className="td-key">Created</span>
            <span className="td-val">
              {task?.createdAt ? new Date(task.createdAt).toLocaleString() : "—"}
            </span>
          </div>
          <div className="td-row">
            <span className="td-key">Updated</span>
            <span className="td-val">
              {task?.updatedAt ? new Date(task.updatedAt).toLocaleString() : "—"}
            </span>
          </div>
        </div>

        <div className="td-row">
          <span className="td-key">Assignees</span>
          <div className="td-assignees">
            {assignees.length === 0 ? (
              <span className="td-muted">No assignees</span>
            ) : (
              assignees.map((a) => (
                <span key={a.assigneeCode || a.assigneeId} className="td-chip">
                  {a.assigneeCode || a.assigneeId || "—"}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="back-button">
        <button className="btn btn-primary" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  );
}

export default TaskDetail;
