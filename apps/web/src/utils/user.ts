import { User } from '../contexts/AuthContext';

export const getDisplayName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};

export const getInitials = (user: User): string => {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
};
