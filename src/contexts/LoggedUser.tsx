// LoggedUserContext.js
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { login as apiLogin } from "../hooks/useUser";
import * as jwt from "jwt-decode";

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
  const [status, setStatus] = useState(() => {
    const savedStatus = localStorage.getItem('status');
    return savedStatus ? JSON.parse(savedStatus) :false;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  });

  useEffect(() => {
    // Verifica a expiração do token
    if (token) {
      try {
        const decodedToken: any = jwt.jwtDecode(token);
        const currentTime = Date.now() / 1000; // Em segundos
        if (decodedToken.exp < currentTime) {
          logout();
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        logout();
      }
    }
    localStorage.setItem("status", JSON.stringify(status));
    localStorage.setItem("token", token);
  }, [status, token]);

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
    localStorage.removeItem("status");
    localStorage.removeItem("token");
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
