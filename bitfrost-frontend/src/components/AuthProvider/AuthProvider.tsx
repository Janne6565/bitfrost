import type { ReactNode } from "react";

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  return <>{children}</>;
};

export default AuthProvider;
