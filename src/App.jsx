import { useState } from "react";
import projectData from "./data/projects.json";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import StatusFilter from "./components/StatusFilter";
import ReflectionPanel from "./components/ReflectionPanel";
import "./styles/main.css";

function App() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const projects = projectData.projects;

  const filteredProjects =
    selectedStatus === "All"
      ? projects
      : projects.filter((project) => project.status === selectedStatus);

  return (
    <main className="app-shell">
      <Header />
      <StatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
      <Dashboard projects={filteredProjects} allProjects={projects} />
      <ReflectionPanel />
    </main>
  );
}

export default App;
