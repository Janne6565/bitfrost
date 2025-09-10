import {
  Box,
  Button,
  CssVarsProvider,
  FormControl,
  FormLabel,
  Input,
  Link,
  Sheet,
  Typography,
} from "@mui/joy";
import { useContext, useState } from "react";
import { AuthContext } from "@/components/AuthProvider/AuthProvider.tsx";
import useApi from "@/hooks/useApi/useApi.ts";

const LoginInterface = () => {
  const {
    setIsLoading,
    email,
    setEmail,
    password,
    setPassword,
    refreshIdentityToken,
    setAuthenticated,
  } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const { login } = useApi();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        await refreshIdentityToken();
        setAuthenticated(true);
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("An error occurred during login. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <CssVarsProvider>
      <Sheet
        variant="outlined"
        sx={{
          width: 500,
          position: "absolute",
          top: "50%",
          left: "50%",
          py: 3,
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box sx={{ width: "100%", textAlign: "center", marginBottom: 16 }}>
          <img
            src="/icon.png"
            alt="Logo"
            style={{
              width: 100,
              height: 100,
              objectFit: "contain",
              marginBottom: 8,
            }}
          />
        </Box>
        <form onSubmit={handleSubmit}>
          <Box sx={{ textAlign: "center" }}>
            <Typography level="h4" component="h1">
              Welcome!
            </Typography>
            <Typography level="body-sm">Sign in to continue.</Typography>
          </Box>
          <FormControl required sx={{ mt: 1 }}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="johndoe@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl required sx={{ mt: 1 }}>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          {error && (
            <Typography color="danger" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 15,
            }}
          >
            <Typography
              endDecorator={<Link href="/sign-up">Sign up</Link>}
              fontSize="sm"
              sx={{ alignSelf: "center" }}
            >
              Don't have an account?
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button sx={{ mt: 2 }} type="submit">
              Login
            </Button>
          </Box>
        </form>
      </Sheet>
    </CssVarsProvider>
  );
};

export default LoginInterface;
