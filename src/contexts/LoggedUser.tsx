// LoggedUserContext.js
import { createContext, ReactNode, useContext, useState } from "react";
import { login as apiLogin } from "../hooks/useUser";

type ContextType = {
  status: boolean;
  token: string;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const initialContext: ContextType = {
  status: false,
  token: "",
  loginUser: async () => {},
  logout: () => {},
};

export const LoggedUserContext = createContext<ContextType>(initialContext);

export const LoggedUserProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState(false);
  const [token, setToken] = useState("");

  const loginUser = async (email: string, password: string) => {
    try {
      const loginSuccess: any = await apiLogin(email, password);
      if (loginSuccess && loginSuccess.status === true) {
        setStatus(true);
        setToken(loginSuccess.token);
      } else {
        throw new Error("Falha no login");
      }
    } catch (error) {
      throw new Error("Erro ao realizar login");
    }
  };

  const logout = () => {
    setStatus(false);
    setToken("");
  };

  return (
    <LoggedUserContext.Provider value={{ status, token, loginUser, logout }}>
      {children}
    </LoggedUserContext.Provider>
  );
};

export const useLoggedUser = () => {
  const context = useContext(LoggedUserContext);
  if (!context) {
    throw new Error("useLoggedUser must be used within a LoggedUserProvider");
  }
  return context;
};
