import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DashboardPage from "../pages/DashboardPage";
import PracticePage from "../pages/PracticePage";
import HistoryPage from "../pages/HistoryPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <DashboardPage /> },
            { path: "practice", element: <PracticePage /> },
            { path: "history", element: <HistoryPage /> },
        ],
    },
]);