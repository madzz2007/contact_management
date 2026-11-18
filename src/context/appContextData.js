import { createContext } from 'react';

/* Context object lives in its own file so the provider file only exports
 * React components (keeps Fast Refresh + the linter happy). */
export const AppContext = createContext();