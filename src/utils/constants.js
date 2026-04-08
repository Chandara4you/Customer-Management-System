// src/utils/constants.js
// BRANCH: feat/supabase-client (Gabriel B. Antonino — M3)

export const PAY_TERMS = ['COD', '30D', '45D'];

export const USER_TYPES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
};

export const RECORD_STATUSES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  AUTH_CALLBACK: '/auth/callback',
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: '/customers/:custNo',
  REPORTS: '/reports',
  ADMIN: '/admin',
  DELETED_ITEMS: '/deleted-items',
};

export const PAY_TERM_BADGE_CLASSES = {
  COD: 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200',
  '30D': 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200',
  '45D': 'bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200',
};

export const PAGE_SIZE = 10;
