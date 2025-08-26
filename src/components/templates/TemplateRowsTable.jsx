export default function TemplateRowsTable({ fields, rows }) {
  if (!fields || !rows) {
    return <div>Loading...</div>; // Handle undefined or null fields and rows gracefully
  }

  // Corrected the way you access fields and rows
  const cols = fields.fields; // fields should be directly an array
  const row = rows; // rows should be directly an array

  return (
    <div className="tbl">
      <div className="tbl-head">
        {cols.map((f) => (
          <div key={f.fieldName} className="th">
            {f.fieldName} {/* Using fieldName from fields */}
          </div>
        ))}
        <div className="th th--meta">Created</div>
      </div>
      <div className="tbl-body">
        {row.map((r) => (
          <div key={r._id} className="tr">
            {cols.map((col) => (
              <div key={col.fieldName} className="td">
                {formatCell(r.data?.[col.fieldName])} 
              </div>
            ))}
            <div className="td td--meta">{new Date(r.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatCell(v) {
  if (Array.isArray(v)) return v.join(", ");
  if (v === null || v === undefined) return "";
  return String(v);
}