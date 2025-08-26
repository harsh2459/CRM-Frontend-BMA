import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTemplateRow, fetchTemplateDetail, fetchtemplatefield, fetchTemplaterowsDetail } from "../actions/templateActions";
import TemplateRowsTable from "../components/templates/TemplateRowsTable";
import TemplateRowModal from "../components/templates/TemplateRowModal";
import "../style/templates.css";
import { useParams } from "react-router-dom";

export default function TemplateDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { detail, detailLoading, field } = useSelector((state) => state.template || {});
  const [showAdd, setShowAdd] = useState(false);
  const [page, setPage] = useState(1);
  useEffect(() => {
    dispatch(fetchTemplaterowsDetail(id, page));
    dispatch(fetchtemplatefield(id));
  }, [dispatch, id, page]);

  const onCreate = (row) => {
    dispatch(createTemplateRow(id, row));
    setShowAdd(false);
  };
  if (detailLoading || !field|| !detail) return <div className="page">Loading…</div>;

  return (
    <div className="page">
      <div className="page-bar">
        <h2>{field.name}</h2>
        <div>
          <button className="btn btn-ghost mr-10" onClick={() => window.history.back()}>
            Go Back
          </button>
          <button className="btn btn-accent" onClick={() => setShowAdd(true)}>
            Add Row
          </button>
        </div>
      </div>

      <TemplateRowsTable fields={field} rows={detail.rows} />

      <div className="pager">
        <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span className="muted">Page {page} / {detail.pages}</span>
        <button className="btn btn-ghost" disabled={page >= detail.pages} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>

      {showAdd && (
        <TemplateRowModal
          fields={field.fields}
          onCreate={onCreate}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>

  );
}
