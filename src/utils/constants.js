// feat/supabase-client — M3: Gabriel Antonino
export const ROLES = {
  USER:       'USER',
  ADMIN:      'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
};

export const RECORD_STATUS = {
  ACTIVE:   'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const PAY_TERMS = {
  COD: 'COD',
  '30D': '30D',
  '45D': '45D',
};

export const PAY_TERM_LABELS = {
  COD:  'Cash on Delivery',
  '30D': 'Net 30 Days',
  '45D': 'Net 45 Days',
};

export const ROUTES = {
  LOGIN:          '/login',
  REGISTER:       '/register',
  AUTH_CALLBACK:  '/auth/callback',
  CUSTOMERS:      '/customers',
  CUSTOMER_DETAIL: (id) => `/customers/${id}`,
  REPORTS:        '/reports',
  ADMIN:          '/admin',
  DELETED:        '/deleted-items',
};

// Nav items per role — used in Sidebar
export const NAV_ITEMS = [
  { label: 'Customers',     path: ROUTES.CUSTOMERS,  icon: 'Users',       roles: [ROLES.USER, ROLES.ADMIN, ROLES.SUPERADMIN] },
  { label: 'Reports',       path: ROUTES.REPORTS,    icon: 'BarChart2',   roles: [ROLES.USER, ROLES.ADMIN, ROLES.SUPERADMIN] },
  { label: 'Deleted Items', path: ROUTES.DELETED,    icon: 'Trash2',      roles: [ROLES.ADMIN, ROLES.SUPERADMIN] },
  { label: 'Admin Panel',   path: ROUTES.ADMIN,      icon: 'ShieldCheck', roles: [ROLES.SUPERADMIN] },
];

export const PAGE_SIZE = 10;
