const statuses = ["All", "Active", "Planning", "Research"];

function StatusFilter({ selectedStatus, onStatusChange }) {
  return (
    <section className="filter-panel" aria-label="Project status filter">
      <span>Filter by status:</span>
      <div className="filter-buttons">
        {statuses.map((status) => (
          <button
            key={status}
            className={selectedStatus === status ? "active" : ""}
            onClick={() => onStatusChange(status)}
          >
            {status}
          </button>
        ))}
      </div>
    </section>
  );
}

export default StatusFilter;
