import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

// optional types if you use reducers
export const TASK_REQUEST = "TASK_REQUEST";
export const TASK_SUCCESS = "TASK_SUCCESS";
export const TASK_FAIL = "TASK_FAIL";
export const TASK_LIST_SUCCESS = "TASK_LIST_SUCCESS";
export const TASK_UPDATE_STATUS_SUCCESS = 'TASK_UPDATE_STATUS_SUCCESS';
export const TASK_DELETE_REQUEST = 'TASK_DELETE_REQUEST';
export const TASK_DELETE_SUCCESS = 'TASK_DELETE_SUCCESS';
export const TASK_DELETE_FAIL = 'TASK_DELETE_FAIL';


export const assignTask = (payload) => async (dispatch, getState) => {
  try {
    dispatch?.({ type: "TASK_REQUEST" });

    const adminId =
      sessionStorage.getItem("adminId") ||
      getState()?.auth?.user?._id;
      console.log(payload);
      
    const res = await axiosInstance.post("/task/assign_task", {
      title: payload.title,
      description: payload.description,
      assigneeCodes: payload.assigneeCodes,
      category: payload.categoryId,
      priority: payload.priority,
      dueat: payload.dueAt,
      adminId,
    });

    toast.success("Task assigned");
    dispatch?.({ type: "TASK_SUCCESS", payload: res.data });
    return res.data;
  } catch (error) {
    const msg = error?.response?.data?.error || error.message || "Failed to assign task";
    toast.error(msg);
    dispatch?.({ type: "TASK_FAIL", payload: msg });
    throw error;
  }
};


export const fetchTasksByAdmin = (q = "", currentPage = 1, itemsPerPage = 20) => async (dispatch) => {
  try {
    dispatch({ type: TASK_REQUEST });

    const adminId = sessionStorage.getItem("adminId");
    if (!adminId) throw new Error("Missing adminId in session");

    const res = await axiosInstance.get("/task/by-admin", {
      params: { adminId, q, page: currentPage, limit: itemsPerPage }, // Send pagination in query params
    });

    dispatch({ type: TASK_LIST_SUCCESS, payload: res.data.items || [] });
  } catch (error) {
    const msg = error?.response?.data?.error || error.message || "Failed to load tasks";
    toast.error(msg);
    dispatch({ type: TASK_FAIL, payload: msg });
  }
};

export const deleteTask = (id) => async (dispatch) => {
  try {
    dispatch({ type: TASK_DELETE_REQUEST, meta: { id } });

    const res = await axiosInstance.delete(`/task/${id}`);
    // If your API returns {success:true} or the deleted task, you can read it from res.data

    dispatch({ type: TASK_DELETE_SUCCESS, payload: id });
    toast.success('Task deleted successfully');
    return res.data; // so caller can await
  } catch (error) {
    const msg = error?.response?.data?.error || error.message || 'Delete failed';
    dispatch({ type: TASK_DELETE_FAIL, payload: msg, error: true, meta: { id } });
    toast.error(msg);
    throw error;
  }
};

export const updateTaskStatus = (taskId, newStatus) => async (dispatch) => {
  try {
    dispatch({ type: TASK_REQUEST });

    const res = await axiosInstance.put('/task/update-task-status', { taskId, newStatus });

    // normalize possible shapes: {data}, {task}, or whole object
    const updated =
      res?.data?.data ||
      res?.data?.task ||
      res?.data;

    if (!updated || !updated._id) {
      throw new Error('Malformed response from update-task-status');
    }

    dispatch({ type: TASK_UPDATE_STATUS_SUCCESS, payload: updated });
    toast.success('Status updated');
    return updated; // let caller await this
  } catch (error) {
    const msg = error?.response?.data?.error || error.message || 'Failed to update status';
    dispatch({ type: TASK_FAIL, payload: msg });
    toast.error(msg);
    throw error;
  }
};