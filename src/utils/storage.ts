
import { User } from "@/types/user";

// User storage helpers
export const storeUser = (user: User): void => {
  localStorage.setItem('svu_user', JSON.stringify(user));
};

export const retrieveUser = (): User | null => {
  const storedUser = localStorage.getItem('svu_user');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Users list storage helpers
export const storeUsers = (users: User[]): void => {
  localStorage.setItem('svu_users', JSON.stringify(users));
};

export const retrieveUsers = (): User[] | null => {
  const storedUsers = localStorage.getItem('svu_users');
  return storedUsers ? JSON.parse(storedUsers) : null;
};

// Clear all storage
export const clearStorage = (): void => {
  localStorage.removeItem('svu_user');
  localStorage.removeItem('svu_users');
};
