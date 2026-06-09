import ProjectCard from "./ProjectCard";

function Dashboard({ projects, allProjects }) {
  const totalProjects = allProjects.length;
  const activeProjects = allProjects.filter((project) => project.status === "Active").length;
  const averageProgress = Math.round(
    allProjects.reduce((sum, project) => sum + project.progress, 0) / totalProjects
  );
  const totalBlockers = allProjects.reduce((sum, project) => sum + project.blockers, 0);

  return (
    <section className="dashboard">
      <div className="metrics-grid">
        <article className="metric-card"><span>Total Projects</span><strong>{totalProjects}</strong></article>
        <article className="metric-card"><span>Active Projects</span><strong>{activeProjects}</strong></article>
        <article className="metric-card"><span>Average Progress</span><strong>{averageProgress}%</strong></article>
        <article className="metric-card warning"><span>Total Blockers</span><strong>{totalBlockers}</strong></article>
      </div>

      <div className="project-grid">
        {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </section>
  );
}

export default Dashboard;
