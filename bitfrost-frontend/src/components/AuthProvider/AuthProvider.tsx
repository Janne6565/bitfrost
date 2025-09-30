import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useApi from "@/hooks/useApi/useApi.ts";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading.tsx";
import LoginInterface from "@/components/LoginInterface/LoginInterface.tsx";

interface AuthContextType {
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  userUuid: string | null;
  setUserUuid: (userUuid: string | null) => void;
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
  userUuid: null,
  setUserUuid: () => {},
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

const loadUserUuidFromJwt = (jwt: string | null): string | null => {
  if (!jwt) return null;

  try {
    const payloadBase64 = jwt.split(".")[1];
    if (!payloadBase64) return null;

    // Convert from Base64URL to Base64
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(
      atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")),
    );

    return decodedPayload.sub ?? null;
  } catch (err) {
    console.error("Failed to parse JWT", err);
    return null;
  }
};

const DataLoader = () => {
  const { initialLoading } = useDataLoading();
  const { authenticated, setIsLoading, jwt, setUserUuid } =
    useContext(AuthContext);

  useEffect(() => {
    if (authenticated) {
      setIsLoading(true);
      setUserUuid(loadUserUuidFromJwt(jwt));
      initialLoading().then(() => setIsLoading(false));
    }
  }, [initialLoading, authenticated, setIsLoading, jwt]);

  return <></>;
};

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { fetchToken, logout: logoutApi } = useApi();

  const logout = () => {
    logoutApi().then(() => {
      window.location.reload();
    });
  };

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
        userUuid,
        setUserUuid,
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
