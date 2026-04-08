// src/components/layout/Navbar.jsx
// BRANCH: feat/routing-skeleton (Jomar A. Auditor — M2)
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROUTES, USER_TYPES } from '../../utils/constants.js';

const ROLE_BADGE_CLASSES = {
  [USER_TYPES.USER]: 'bg-slate-100 text-slate-700 ring-slate-200',
  [USER_TYPES.ADMIN]: 'bg-blue-100 text-blue-800 ring-blue-200',
  [USER_TYPES.SUPERADMIN]: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
};

function getDisplayName(profile, fallbackEmail) {
  if (!profile) return fallbackEmail ?? 'User';
  const first = profile.first_name?.trim();
  const last = profile.last_name?.trim();
  if (first || last) return `${first ?? ''} ${last ?? ''}`.trim();
  return profile.email ?? fallbackEmail ?? 'User';
}

export function Navbar({ onMenuClick }) {
  const { userProfile, currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = getDisplayName(userProfile, currentUser?.email);
  const role = userProfile?.user_type ?? USER_TYPES.USER;
  const badgeClass = ROLE_BADGE_CLASSES[role] ?? ROLE_BADGE_CLASSES[USER_TYPES.USER];

  const handleLogout = async () => {
    await signOut();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-slate-800 sm:text-base">
          Customer Management
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-800">{displayName}</p>
          {userProfile?.email && (
            <p className="text-xs text-slate-500">{userProfile.email}</p>
          )}
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeClass}`}
        >
          {role}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
