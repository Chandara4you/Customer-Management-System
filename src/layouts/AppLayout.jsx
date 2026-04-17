// feat/routing-skeleton — M2: Jomar Auditor
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS, ROUTES } from '../utils/constants';

// ─── Icon mini-set (inline SVG — no external lib needed) ─────────────────────
const icons = {
  Users: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  BarChart2: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Trash2: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Menu: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  LogOut: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
};

// ─── Sidebar nav link ─────────────────────────────────────────────────────────
function SideNavItem({ item, collapsed, onClick }) {
  const Icon = icons[item.icon] ?? (() => null);
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
         ${isActive
           ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
           : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
         }`
      }
    >
      <span className="flex-shrink-0"><Icon /></span>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
export default function AppLayout() {
  const { currentUser, profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen]       = useState(false); // mobile overlay
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapse

  const visibleNav = NAV_ITEMS.filter(item =>
    !item.roles || item.roles.includes(role)
  );

  const initials = currentUser?.email
    ? currentUser.email.slice(0, 2).toUpperCase()
    : '??';

  async function handleSignOut() {
    await signOut();
    navigate(ROUTES.LOGIN);
  }

  const SidebarContent = ({ collapsed = false, onClose }) => (
    <div className={`flex flex-col h-full ${collapsed ? 'items-center px-2' : 'px-4'} py-6`}>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 mb-8 ${collapsed ? 'justify-center' : ''}`}>
        <div className="h-8 w-8 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">H</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-semibold text-sm leading-none">HopePMS</p>
            <p className="text-slate-400 text-xs mt-0.5">Customer Management</p>
          </div>
        )}
        {onClose && (
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-white p-1">
            <icons.X />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1 w-full">
        {visibleNav.map(item => (
          <SideNavItem
            key={item.path}
            item={item}
            collapsed={collapsed}
            onClick={() => onClose?.()}
          />
        ))}
      </nav>

      {/* User footer */}
      <div className={`border-t border-slate-700/50 pt-4 w-full ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-brand-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{currentUser?.email}</p>
              <p className="text-slate-400 text-xs">{role ?? 'USER'}</p>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <icons.LogOut />
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700/60 transition-colors"
          >
            <icons.LogOut />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside className={`
        hidden md:flex flex-col flex-shrink-0 bg-slate-800
        transition-all duration-200
        ${sidebarCollapsed ? 'w-16' : 'w-60'}
      `}>
        <SidebarContent collapsed={sidebarCollapsed} />

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(c => !c)}
          className="absolute left-0 bottom-24 translate-x-full -translate-y-1/2
                     hidden md:flex h-6 w-6 items-center justify-center
                     bg-slate-800 border border-slate-700 rounded-r-lg
                     text-slate-400 hover:text-white transition-colors z-10"
          style={{ left: sidebarCollapsed ? 64 : 240 }}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            {sidebarCollapsed
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            }
          </svg>
        </button>
      </aside>

      {/* ── Mobile Overlay Sidebar ───────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-slate-800 z-50 animate-slide-in">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main content area ────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 bg-white border-b border-slate-100 flex items-center px-4 gap-3 flex-shrink-0 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-slate-500 hover:text-slate-900 transition-colors"
          >
            <icons.Menu />
          </button>

          <div className="flex-1" />

          {/* User pill */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
            <div className="h-6 w-6 rounded-full bg-brand-600 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">{initials}</span>
            </div>
            <span className="text-sm text-slate-600 font-medium hidden sm:block max-w-[160px] truncate">
              {currentUser?.email}
            </span>
            <span className="badge-blue text-xs hidden sm:inline">{role ?? 'USER'}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
