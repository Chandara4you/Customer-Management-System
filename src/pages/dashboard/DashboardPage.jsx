// feat/ui-dashboard — M2: Jomar Auditor (Bonus)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRights } from '../../context/UserRightsContext';
import { getCustomerStats } from '../../services/customerService';
import { ROUTES } from '../../utils/constants';

function StatCard({ title, value, icon, color = 'brand' }) {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600'
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <div className={`h-12 w-12 rounded-2xl ${colorMap[color]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ title, description, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-5 text-left hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <svg className="h-5 w-5 text-slate-400 group-hover:text-brand-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const { rights } = useRights();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await getCustomerStats();
      setStats(data);
      setLoading(false);
    }
    load();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {greeting()}, {profile?.user_type || 'User'}! 👋
        </h1>
        <p className="text-slate-500 mt-1">Welcome to Hope, Inc. Customer Management System</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={loading ? '—' : stats?.total || 0}
          color="brand"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          title="Cash on Delivery"
          value={loading ? '—' : stats?.COD || 0}
          color="emerald"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          title="Net 30 Days"
          value={loading ? '—' : stats?.['30D'] || 0}
          color="blue"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Net 45 Days"
          value={loading ? '—' : stats?.['45D'] || 0}
          color="amber"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickAction
            title="View Customers"
            description="Browse and manage customer records"
            onClick={() => navigate(ROUTES.CUSTOMERS)}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <QuickAction
            title="Product Catalogue"
            description="View products and current prices"
            onClick={() => navigate(ROUTES.PRODUCTS)}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
          {rights.CUST_VIEW && (
            <QuickAction
              title="Sales Reports"
              description="View customer sales summaries"
              onClick={() => navigate(ROUTES.REPORTS)}
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          )}
          {(profile?.user_type === 'ADMIN' || profile?.user_type === 'SUPERADMIN') && (
            <QuickAction
              title="Deleted Customers"
              description="View and recover inactive customers"
              onClick={() => navigate(ROUTES.DELETED)}
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            />
          )}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">System Information</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Your Role</dt>
            <dd className="mt-1">
              <span className="badge-blue">{profile?.user_type || 'USER'}</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Access Level</dt>
            <dd className="mt-1 text-sm text-slate-900">
              {rights.CUST_ADD ? 'Full Access' : rights.CUST_VIEW ? 'Read Only' : 'Limited'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Last Updated</dt>
            <dd className="mt-1 text-sm text-slate-900">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
