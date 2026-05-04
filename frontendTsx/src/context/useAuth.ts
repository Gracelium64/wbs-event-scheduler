import { useContext, createContext } from "react";
import type { AuthContextType } from "../schemas";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = (): AuthContextType | undefined => {
  return useContext(AuthContext);
};
