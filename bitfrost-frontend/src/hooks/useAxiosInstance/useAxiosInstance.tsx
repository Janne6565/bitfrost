import { useContext, useMemo } from "react";
import { AuthContext } from "@/components/AuthProvider/AuthProvider.tsx";
import axios from "axios";

const useAxiosInstance = (baseUrl: string) => {
  const { jwt } = useContext(AuthContext);

  // TODO: change after login Implementation
  const devToken = "eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTcyOTQ2NjMsImF1ZCI6ImJpdGZyb3N0Iiwic3ViIjoiN2I5NjY1YWUtMzIzZC00MjMwLTk2YjctZmVkZGE5ZWMzZDVmIiwiZXhwIjoxNzU3MzMwNjYzLCJ0eXBlIjoiSURFTlRJVFlfVE9LRU4iLCJlbWFpbCI6ImFkbWluQGFkbWluLmRlIiwicm9sZSI6IkFETUlOIn0.EiTwDJm7oR0zRGQUPgjJlxzBSFczv7oCsQhHvZ8RTX0CITU9-MXeq4A6ERziGUtEqTp_b6VOwlZJzbrmRh3EMF3hKy2jOiVxwKebolnIsuiXwI_PfQXJ3yYGUfALqSo8wt1FMohH1tWr8N_VPYWHsmG1wyOsPd1San3-bvPwAACVY_5gy6Mwu34RsovDNT18Za1Dgq8NTu_6hvVpVMOgfbcCnV03B7_CRKrd80X_HmAmEi7MRxSNhbPZKHLDlp9qPpwSnib_68zJq7vISSDLNN3etM8aPy7NJQnYUSjzKqbeiRTrY-2CPpsAApdJXXLZqO25aOwfH1rcIqm3HIfaXQ";
  
  
  const authHeader = jwt
    ? `Bearer ${jwt}`
    : devToken
    ? `Bearer ${devToken}`
    : null;

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
  }, [baseUrl, authHeader /* jwt */]); //remove authHeader after login implementation and use jwt
};

export default useAxiosInstance;
