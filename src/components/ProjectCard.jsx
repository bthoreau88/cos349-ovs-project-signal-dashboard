function ProjectCard({ project }) {
  const taskCompletion = Math.round((project.tasksDone / project.tasksTotal) * 100);

  return (
    <article className="project-card">
      <div className="project-card-topline">
        <span className="project-type">{project.type}</span>
        <span className={`status-pill ${project.status.toLowerCase()}`}>{project.status}</span>
      </div>

      <h2>{project.title}</h2>
      <p>{project.summary}</p>

      <div className="project-meta">
        <span>Priority: {project.priority}</span>
        <span>Tasks: {project.tasksDone}/{project.tasksTotal}</span>
        <span>Blockers: {project.blockers}</span>
      </div>

      <div className="progress-section">
        <div className="progress-label"><span>Project Progress</span><strong>{project.progress}%</strong></div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${project.progress}%` }} /></div>
      </div>

      <div className="progress-section">
        <div className="progress-label"><span>Task Completion</span><strong>{taskCompletion}%</strong></div>
        <div className="progress-track"><div className="progress-fill secondary" style={{ width: `${taskCompletion}%` }} /></div>
      </div>
    </article>
  );
}

export default ProjectCard;
