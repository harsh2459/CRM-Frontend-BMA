import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import '../style/pages/showUserTask.css'

const ShowUsersTask = () => {
  const { empId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  console.log(empId);
  console.log(tasks);
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/task/get_tasks/${empId}`);
      console.log("API Response:", response.data);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [empId]);

  const getStatusClass = (status) => {
    if (!status) return 'badge muted';
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
        return 'badge success';
      case 'in progress':
      case 'inprogress':
        return 'badge info';
      case 'blocked':
        return 'badge warn';
      case 'cancelled':
        return 'badge danger';
      default:
        return 'badge muted';
    }
  };

  const getPriorityClass = (priority) => {
    if (!priority) return 'badge muted';
    const priorityLower = priority.toLowerCase();
    switch (priorityLower) {
      case 'Not importent and Not urgent':
        return 'badge low';
      case 'importent but not urgent':
        return 'badge medium';
      case 'Not importent But urgent':
        return 'badge high';
      case 'importent and urgent':
        return 'badge critical';
      default:
        return 'badge muted';
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="task-container">
        <h3>Tasks For Employee: {empId}</h3>
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="task-container">
        <h3>Tasks For Employee: {empId}</h3>
        <div className="error">{error}</div>
        <button onClick={fetchTasks} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="task-container">
      <h3>Tasks For Employee:{empId}</h3>
      <div className="task-cards">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Link
              to={`/taskdeatil/${task._id}`}
              key={task._id} // Added key prop here
              className="task-link" // Added class for styling if needed
            >
              <div className="task-card">
                <div className="task-title">
                  <h4>{task.title || 'Untitled Task'}</h4>
                  <span className={getPriorityClass(task.priority)}>
                    {task.priority || 'No Priority'}
                  </span>
                </div>
                <p className="task-description">
                  {task.description || 'No description available'}
                </p>
                <div className="task-status">
                  <span className={getStatusClass(task.status)}>
                    {task.status || 'No Status'}
                  </span>
                </div>
                <div className="task-footer">
                  <p>Assigned to: {
                    task.assignees && task.assignees.length > 0
                      ? task.assignees.map(assignee => assignee.assigneeCode || 'Unknown').join(', ')
                      : 'Unassigned'
                  }</p>
                  <p>Due: {task.dueAt ? new Date(task.dueAt).toLocaleDateString() : "No due date"}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No tasks assigned to this employee.</p>
        )}
      </div>
      <div className="back-button">
        <button className="btn btn-primary" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  );
}

export default ShowUsersTask;