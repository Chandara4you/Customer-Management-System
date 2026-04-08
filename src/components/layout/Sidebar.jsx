// src/components/layout/Sidebar.jsx
// BRANCH: feat/routing-skeleton (Jomar A. Auditor — M2)
import { NavLink } from 'react-router-dom';
import { Users, BarChart2, ShieldCheck, Trash2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROUTES, USER_TYPES } from '../../utils/constants.js';

/**
 * Role-based visibility (Sprint 1 rules):
 *   USER       → /customers, /reports
 *   ADMIN      → /customers, /reports, /deleted-items
 *   SUPERADMIN → /customers, /reports, /deleted-items, /admin
 */
function buildNavItems(userType) {
  const items = [
    { to: ROUTES.CUSTOMERS, label: 'Customers', icon: Users },
    { to: ROUTES.REPORTS, label: 'Reports', icon: BarChart2 },
  ];
  if (userType === USER_TYPES.ADMIN || userType === USER_TYPES.SUPERADMIN) {
    items.push({ to: ROUTES.DELETED_ITEMS, label: 'Deleted Items', icon: Trash2 });
  }
  if (userType === USER_TYPES.SUPERADMIN) {
    items.push({ to: ROUTES.ADMIN, label: 'Admin', icon: ShieldCheck });
  }
  return items;
}

export function Sidebar({ isOpen, onClose }) {
  const { userProfile } = useAuth();
  const navItems = buildNavItems(userProfile?.user_type);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-800 text-slate-100 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              H
            </div>
            <span className="text-sm font-semibold tracking-wide">HopePMS</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-700 px-5 py-4 text-xs text-slate-500">
          <p>HopePMS · Group 2</p>
          <p>Customer Management</p>
        </div>
      </aside>
    </>
  );
}
