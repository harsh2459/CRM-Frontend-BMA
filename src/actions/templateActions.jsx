import axiosInstance from "../utils/axiosInstance";
import * as T from "../actionTypes/templateTypes";

// List all templates (admin) or visible for me (user) – choose endpoint by role if needed
export const fetchTemplates = () => async dispatch => {
  dispatch({ type: T.TPL_LIST_REQ });
  try {
    const { data } = await axiosInstance.get("/template/for-me"); // or /template/for-me for user
    console.log(data);
    dispatch({ type: T.TPL_LIST_OK, payload: data.items || data.templates || [] });
  } catch (e) {
    dispatch({ type: T.TPL_LIST_ERR, error: e.response?.data?.error || e.message });
  }
};

export const createTemplate = (body) => async dispatch => {
  dispatch({ type: T.TPL_CREATE_REQ });
  try {
    const { data } = await axiosInstance.post("/template/", body);
    dispatch({ type: T.TPL_CREATE_OK, payload: data.template });
  } catch (e) {
    dispatch({ type: T.TPL_CREATE_ERR, error: e.response?.data?.message || e.message });
  }
};

export const updateTemplate = (id, body) => async dispatch => {
  dispatch({ type: T.TPL_UPDATE_REQ });
  try {
    const { data } = await axiosInstance.patch(`/template/${id}`, body);
    dispatch({ type: T.TPL_UPDATE_OK, payload: data.template });
  } catch (e) {
    dispatch({ type: T.TPL_UPDATE_ERR, error: e.response?.data?.error || e.message });
  }
};

export const deleteTemplate = (id) => async dispatch => {
  dispatch({ type: T.TPL_DELETE_REQ, meta: { id } });
  try {
    await axiosInstance.delete(`/template/${id}`);
    dispatch({ type: T.TPL_DELETE_OK, payload: id });
  } catch (e) {
    dispatch({ type: T.TPL_DELETE_ERR, error: e.response?.data?.error || e.message });
  }
};

// Detail + paginated rows
export const fetchTemplaterowsDetail = (id) => async (dispatch) => {
  dispatch({ type: T.TPL_DETAIL_REQ });
  try {
    const { data } = await axiosInstance.get(`/template/${id}/rows`);
    console.log(data);

    dispatch({ type: T.TPL_DETAIL_OK, payload: data });
  } catch (e) {
    dispatch({ type: T.TPL_DETAIL_ERR, error: e.response?.data?.message || e.message });
  }
};

export const fetchtemplatefield = (id) => async (dispatch) => {
  dispatch({ type: T.TPL_DETAIL_REQ });
  try {
    const { data } = await axiosInstance.get(`/template/${id}`);
    dispatch({ type: T.TPL_FIELD_DETAIL_OK, payload: data.template });
  } catch (e) {
    dispatch({ type: T.TPL_DETAIL_ERR, error: e.response?.data?.message || e.message });
  }
};


export const createTemplateRow = (id, row) => async dispatch => {
  dispatch({ type: T.TPL_ROW_CREATE_REQ });
  try {

    const { data } = await axiosInstance.post(`/template/${id}/rows`, { data: row });
    dispatch({ type: T.TPL_ROW_CREATE_OK, payload: data.row });
  } catch (e) {
    dispatch({ type: T.TPL_ROW_CREATE_ERR, error: e.response?.data?.message || e.message });
  }
};

// Access Matrix (admin)
export const fetchAccessMatrix = () => async dispatch => {
  dispatch({ type: T.TPL_ACCESS_MATRIX_REQ });
  try {
    const { data } = await axiosInstance.get("/template/admin/access-matrix");
    dispatch({ type: T.TPL_ACCESS_MATRIX_OK, payload: data });
  } catch (e) {
    dispatch({ type: T.TPL_ACCESS_MATRIX_ERR, error: e.response?.data?.error || e.message });
  }
};

export const saveTemplateAccess = (templateId, body) => async dispatch => {
  dispatch({ type: T.TPL_ACCESS_SAVE_REQ });
  try {
    const { data } = await axiosInstance.post(`/template/${templateId}/access`, body);
    dispatch({ type: T.TPL_ACCESS_SAVE_OK, payload: data.template });
  } catch (e) {
    dispatch({ type: T.TPL_ACCESS_SAVE_ERR, error: e.response?.data?.error || e.message });
  }
};
