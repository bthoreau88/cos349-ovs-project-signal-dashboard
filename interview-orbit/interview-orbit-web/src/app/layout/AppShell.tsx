import { Link, NavLink } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { AppFooter } from "../../components/AppFooter";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <Link to="/" className="brand">Interview Orbit</Link>
          <p className="brand-subtitle">Mock interview practice tool</p>
        </div>
        <nav className="nav">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/practice">Practice</NavLink>
          <NavLink to="/history">History</NavLink>
        </nav>
      </header>
      <main className="app-main">{children}</main>
      <AppFooter />
    </div>
  );
}
