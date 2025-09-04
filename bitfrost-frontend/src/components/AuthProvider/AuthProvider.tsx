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
import { Button, CssVarsProvider, FormControl, FormLabel, Input, Link, Sheet, Typography } from "@mui/joy";

interface AuthContextType {
  authenticated: boolean;
  user: User | null;
  logout: () => void;
  jwt: string | null;
  refreshIdentityToken: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  user: null,
  jwt: null,
  logout: () => {
    console.warn("Logout triggered before loaded");
  },
  refreshIdentityToken: () => {},
  isLoading: false,
  setIsLoading: () => {},
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
  const [error, setError] = useState<string | null>(null);
  const logout = () => {};
  const { fetchToken, login } = useApi();

  useEffect(() => {
    login("jabbekeipert2@gmail.com", "test1234");
    refreshIdentityToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const success = await login(email, password);
      if (success) {
        await refreshIdentityToken();
        setAuthenticated(true);
      }
      else {
        setError("Invalid email or password");
      }
    }
    catch (err) {
      console.error("Login failed:", err);
      setError("An unexpected error occurred");
    }
    finally {
      setIsLoading(false);
    }
  };

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
      value={{
        jwt,
        user,
        authenticated,
        logout,
        refreshIdentityToken,
        isLoading,
        setIsLoading,
      }}
    >
      <DataLoader />
      {authenticated ? children :
      <CssVarsProvider>
        <Sheet variant="outlined" sx={{
          width: 500,
          position: 'absolute',
          top: '50%',
          left: '50%',
          py: 3,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 'sm',
          boxShadow: 'md',
          transform: 'translate(-50%, -50%)'
        }}
        >
          <div style={{ width: '100%', textAlign: 'center', marginBottom: 16 }}>
            <img src="/icon.png" alt="Logo" style={{ width: 100, height: 100, objectFit: "contain", marginBottom: 8 }} />
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: 'center' }}><Typography level="h4" component="h1">Welcome!</Typography><Typography level="body-sm">Sign in to continue.</Typography></div>
            <FormControl required sx={{ mt: 1 }}><FormLabel>Email</FormLabel><Input name="email" type="email" placeholder="johndoe@email.com" onChange={(e) => setEmail(e.target.value)} /></FormControl>
            <FormControl required sx={{ mt: 1 }}><FormLabel>Password</FormLabel><Input name="password" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} /></FormControl>
            {error && <Typography color="danger" sx={{ mt: 1 }}>{error}</Typography>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15}}>
              <Typography endDecorator={<Link href="/sign-up">Sign up</Link>} fontSize="sm" sx={{ alignSelf: 'center' }}>Don't have an account?</Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button sx={{ mt: 2 }} type="submit">Login</Button></div>
          </form>
        </Sheet>
      </CssVarsProvider>}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
