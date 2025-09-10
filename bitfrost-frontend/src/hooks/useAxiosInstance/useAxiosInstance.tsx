import { useContext, useMemo } from "react";
import { AuthContext } from "@/components/AuthProvider/AuthProvider.tsx";
import axios from "axios";

const useAxiosInstance = (baseUrl: string) => {
  const { jwt } = useContext(AuthContext);

  const authHeader = jwt ? `Bearer ${jwt}` : null;

  return useMemo(() => {
    const instance = axios.create({ baseURL: baseUrl });

    //const authHeader = jwt ? `Bearer ${jwt}` : null; //undo commenting after login implementation
    instance.interceptors.request.use((config) => {
      if (authHeader) {
        config.headers.Authorization = authHeader;
      }
      return config;
    });

    return instance;
  }, [baseUrl, authHeader]); //remove authHeader after login implementation and use jwt
};

export default useAxiosInstance;
