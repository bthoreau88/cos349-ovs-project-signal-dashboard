import { Link, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import PracticePage from "./pages/PracticePage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
    return (
        <div style={{ padding: "24px", color: "white", background: "#111", minHeight: "100vh" }}>
            <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <Link to="/">Dashboard</Link>
                <Link to="/practice">Practice</Link>
                <Link to="/history">History</Link>
            </nav>

            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/practice" element={<PracticePage />} />
                <Route path="/history" element={<HistoryPage />} />
            </Routes>
        </div>
    );
}