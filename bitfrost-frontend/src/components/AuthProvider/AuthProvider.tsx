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

interface AuthContextType {
  authenticated: boolean;
  user: User | null;
  logout: () => void;
  jwt: string | null;
  refreshIdentityToken: () => void;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  user: null,
  jwt: null,
  logout: () => {
    console.warn("Logout triggered before loaded");
  },
  refreshIdentityToken: () => {},
});

const DataLoader = () => {
  const { initialLoading } = useDataLoading();
  const { authenticated } = useContext(AuthContext);

  useEffect(() => {
    if (authenticated) {
      initialLoading();
    }
  }, [initialLoading, authenticated]);

  return <></>;
};

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const logout = () => {};
  const { fetchToken, login } = useApi();

  useEffect(() => {
    login("jabbekeipert@gmail.com", "test1234");
    refreshIdentityToken();
  }, []);

  const refreshIdentityToken = useCallback(async () => {
    const token = await fetchToken();
    if (token) {
      setJwt(token);
      setAuthenticated(true);
    }
  }, [fetchToken]);

  useEffect(() => {});

  return (
    <AuthContext.Provider
      value={{ jwt, user, authenticated, logout, refreshIdentityToken }}
    >
      <DataLoader />
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
