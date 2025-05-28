/**
 * Helper functions for the application
 */

import { CLevelType, TaskStatus } from '@/types';

/**
 * Formats date to a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Returns color for task status
 */
export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Returns the task status name
 */
export const getStatusName = (status: TaskStatus): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    default:
      return 'Unknown';
  }
};

/**
 * Returns the full name for C-Level type
 */
export const getCLevelFullName = (type: CLevelType): string => {
  switch (type) {
    case 'CEO':
      return 'Chief Executive Officer';
    case 'COO':
      return 'Chief Operating Officer';
    case 'CMO':
      return 'Chief Marketing Officer';
    case 'CCO':
      return 'Chief Commercial Officer';
    case 'CTO':
      return 'Chief Technology Officer';
    case 'CFO':
      return 'Chief Financial Officer';
    default:
      return type;
  }
};

/**
 * Truncates text to specified length
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generates a random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Formats currency values
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};
