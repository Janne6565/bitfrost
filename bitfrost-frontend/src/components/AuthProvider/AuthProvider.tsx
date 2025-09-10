import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@/@types/backendTypes.ts";
import useApi from "@/hooks/useApi/useApi.ts";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading.tsx";
import LoginInterface from "@/components/LoginInterface/LoginInterface.tsx";

interface AuthContextType {
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  user: User | null;
  logout: () => void;
  jwt: string | null;
  refreshIdentityToken: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  setAuthenticated: () => {},
  user: null,
  jwt: null,
  logout: () => {
    console.warn("Logout triggered before loaded");
  },
  refreshIdentityToken: () => {},
  isLoading: false,
  setIsLoading: () => {},
  email: "",
  setEmail: () => {},
  password: "",
  setPassword: () => {},
});

const DataLoader = () => {
  const { initialLoading } = useDataLoading();
  const { authenticated, setIsLoading } = useContext(AuthContext);

  useEffect(() => {
    if (authenticated) {
      setIsLoading(true);
      initialLoading().then(() => setIsLoading(false));
    }
  }, [initialLoading, authenticated]);

  return <></>;
};

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const logout = () => {};
  const { fetchToken, login } = useApi();

  const refreshIdentityToken = useCallback(async () => {
    const token = await fetchToken();
    if (token) {
      setJwt(token);
      setAuthenticated(true);
    }
  }, [fetchToken]);

  useEffect(() => {
    refreshIdentityToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        jwt,
        user,
        authenticated,
        setAuthenticated,
        logout,
        refreshIdentityToken,
        isLoading,
        setIsLoading,
        email,
        setEmail,
        password,
        setPassword,
      }}
    >
      <DataLoader />
      {authenticated ? children : <LoginInterface />}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
