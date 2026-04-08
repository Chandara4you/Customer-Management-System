// src/components/ui/LoadingSpinner.jsx
// BRANCH: feat/routing-skeleton (Jomar A. Auditor — M2)
import { Loader2 } from 'lucide-react';

const SIZE_CLASSES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;
  return (
    <Loader2
      className={`${sizeClass} animate-spin text-blue-600 ${className}`}
      aria-hidden="true"
    />
  );
}
