import { useContext, useMemo } from "react";
import { AuthContext } from "@/components/AuthProvider/AuthProvider.tsx";
import axios from "axios";

const useAxiosInstance = (baseUrl: string) => {
  const { jwt } = useContext(AuthContext);

  return useMemo(() => {
    const instance = axios.create({ baseURL: baseUrl });

    const authHeader = jwt ? `Bearer ${jwt}` : null;
    instance.interceptors.request.use((config) => {
      config.headers.Authorization = authHeader;
      return config;
    });
    return instance;
  }, [baseUrl, jwt]);
};

export default useAxiosInstance;
