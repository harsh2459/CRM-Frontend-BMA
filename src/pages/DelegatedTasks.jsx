import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, fetchTasksByAdmin, updateTaskStatus } from "../actions/taskActions";
import Pagination from '../components/Pagination';
import { Link, useNavigate } from "react-router-dom";  // Import Link
import '../style/components/delegatedTasks.css';
import TaskContextMenu from "../context/TaskContextMenu";
import TaskModel from "../components/TaskModel.jsx";
import CalendarView from "../components/CalendarView.jsx";

const StatusBadge = ({ status }) => {
  const cls =
    status === "Completed" ? "badge success" :
      status === "In Progress" ? "badge info" :
        status === "Blocked" ? "badge warn" :
          status === "Cancelled" ? "badge danger" : "badge muted";
  return <span className={cls}>{status}</span>;
};

const getPriorityClass = (priority) => {
  if (!priority) return 'badge muted';
  switch (priority) {
    case 'Not importent and Not urgent':
      return 'badge low';
    case 'importent but not urgent':
      return 'badge medium';
    case 'Not importent But urgent':
      return 'badge high';
    case 'importent and urgent':
      return 'badge critical';
  }
};

const DelegatedTasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: tasks, loading, total } = useSelector(s => s.task || { items: [], total: 0 });
  const [menu, setMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [q, setQ] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;  // Show one task per page
  const [isCalendarView, setIsCalendarView] = useState(false);

  const toggleView = () => {
    setIsCalendarView((prevState) => !prevState);
  };

  useEffect(() => {
    dispatch(fetchTasksByAdmin(q, currentPage, itemsPerPage));
  }, [dispatch, q, currentPage]);

  const handleAfterCreate = async () => {
    setShowModal(false);
    dispatch(fetchTasksByAdmin(q, currentPage, itemsPerPage));
  };

  const filtered = useMemo(() => {
    if (!q) return tasks;
    const rx = new RegExp(q, "i");
    return tasks.filter(t => rx.test(t.title) || rx.test(t.description || "") || rx.test(t.category || ""));
  }, [q, tasks]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const firstCode = (t) =>
    Array.isArray(t.assignees) ? t.assignees[0]?.assigneeCode : t.assignees?.assigneeCode;

  const openTask = (t) => {
    const code = firstCode(t) || "unknown";
    navigate(`/taskdeatil/${t._id}`);
  };
  const editTask = (t) => navigate(`/tasks/edit/${t._id}`);
  const removeTask = async (t) => {
    await dispatch(deleteTask(t._id));
    dispatch(fetchTasksByAdmin(q, currentPage, itemsPerPage));
  };
  const markDone = async (t) => {
    await dispatch(updateTaskStatus(t._id, "Completed"));
    dispatch(fetchTasksByAdmin(q, currentPage, itemsPerPage));
  };
  const markcancelle = async (t) => {
    await dispatch(updateTaskStatus(t._id, "Cancelled"));
    dispatch(fetchTasksByAdmin(q, currentPage, itemsPerPage));
  };
  const markInProgress = async (t) => {
    await dispatch(updateTaskStatus(t._id, "In Progress"));
    dispatch(fetchTasksByAdmin(q, currentPage, itemsPerPage));
  };
  const markReOpen = async (t) => {
    await dispatch(updateTaskStatus(t._id, "Open"));
    dispatch(fetchTasksByAdmin(q, currentPage, itemsPerPage));
  };
  const markBlocked = async (t) => {
    await dispatch(updateTaskStatus(t._id, "Blocked"));
    dispatch(fetchTasksByAdmin(q, currentPage, itemsPerPage));
  };
  return (
    <div className="containor">
      <div className="delegated-task-wrapper">
        <div className="delegated-header">
          <h2>Delegated Tasks</h2>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={toggleView}>
              {isCalendarView ? "List View" : "Calender view"}
            </button>
            <button className="btn btn-accent" onClick={() => setShowModal(true)}>
              Assign Task
            </button>
          </div>
        </div>

        {showModal && (
          <TaskModel onClose={() => setShowModal(false)} afterCreate={handleAfterCreate} />
        )}
        {isCalendarView ? <CalendarView showCurrentTimeIndicator={false} /> :
          <div className="task-list card">
            <div className="task-header-row">
              <div className="col title">Title</div>
              <div className="col assignees">Assignees</div>
              <div className="col priority">Priority</div>
              <div className="col due">Due</div>
              <div className="col status">Status</div>
            </div>
            {loading ? (
              <div className="task-loading">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="task-empty">No tasks yet.</div>
            ) : (
              filtered.map(t => {
                const allStatuses = (t.assignees || []).map(a => a.status);
                // const overall =
                // allStatuses.every(s => s === "Completed") ? "Completed" :
                //   allStatuses.some(s => s === "In Progress") ? "In Progress" :
                //     allStatuses.some(s => s === "Blocked") ? "Blocked" : "Open";

                return (
                  <div className="task-row cursour" role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openTask(t)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenu({ x: e.clientX, y: e.clientY, task: t });
                    }}>
                    <div className="col title">
                      <div className="t-title">{t.title}</div>
                      {t.category && <div className="t-sub">{t.category}</div>}
                    </div>
                    <div className="col assignees">
                      <div className="chip-row">
                        {(t.assignees || []).map(a => (
                          <span key={a.assigneeCode} className="chip">
                            {a.assigneeCode}
                            <span className="chip-dot" data-status={t.status} />
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="col priority">
                      <span className={`badge ${getPriorityClass(t.priority)}`}>{t.priority}</span>
                    </div>

                    <div className="col due">
                      {t.dueAt ? new Date(t.dueAt).toLocaleString() : "—"}
                    </div>

                    <div className="col status">
                      <StatusBadge status={t.status} />
                    </div>
                    {
                      menu && (
                        <TaskContextMenu
                          x={menu.x}
                          y={menu.y}
                          task={menu.task}
                          onClose={() => setMenu(null)}
                          onOpen={openTask}
                          onEdit={editTask}
                          onDelete={removeTask}
                          onDone={markDone}
                          onInProgress={markInProgress}
                          onReOpen={markReOpen}
                          oncancellend={markcancelle}
                          onBlocked={markBlocked}
                        />
                      )
                    }
                  </div>
                );

              })
            )}
            <Pagination
              totalItems={total}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        }
      </div>
    </div >
  );
};

export default DelegatedTasks;
