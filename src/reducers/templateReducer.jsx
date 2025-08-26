import * as T from "../actionTypes/templateTypes";

const initial = {
    items: [],
    loading: false,
    field: null,
    error: null,
    detail: null,      // { template, rows, page, pages, total }
    detailLoading: false,
    access: { templates: [], users: [], access: {} },
    accessLoading: false,
};

export default function templateReducer(state = initial, action) {
    switch (action.type) {
        case T.TPL_LIST_REQ: return { ...state, loading: true, error: null };
        case T.TPL_LIST_OK: return { ...state, loading: false, items: action.payload };
        case T.TPL_LIST_ERR: return { ...state, loading: false, error: action.error };

        case T.TPL_CREATE_OK: return { ...state, items: [action.payload, ...state.items] };
        case T.TPL_UPDATE_OK:
            return {
                ...state,
                items: state.items.map(t => t._id === action.payload._id ? action.payload : t),
                detail: state.detail && state.detail.template?._id === action.payload._id
                    ? { ...state.detail, template: action.payload }
                    : state.detail
            };
        case T.TPL_DELETE_OK:
            return { ...state, items: state.items.filter(t => t._id !== action.payload) };

        case T.TPL_DETAIL_REQ: return { ...state, detailLoading: true, error: null };
        case T.TPL_DETAIL_OK: return { ...state, detailLoading: false, detail: action.payload };
        case T.TPL_DETAIL_ERR: return { ...state, detailLoading: false, error: action.error };
        case T.TPL_FIELD_DETAIL_OK: return { ...state, detailLoading: false, field: action.payload };

        case T.TPL_ROW_CREATE_OK:
            return state.detail
                ? { ...state, detail: { ...state.detail, rows: [action.payload, ...state.detail.rows] } }
                : state;

        case T.TPL_ACCESS_MATRIX_REQ: return { ...state, accessLoading: true, error: null };
        case T.TPL_ACCESS_MATRIX_OK: return { ...state, accessLoading: false, access: action.payload };
        case T.TPL_ACCESS_MATRIX_ERR: return { ...state, accessLoading: false, error: action.error };

        default: return state;
    }
}
