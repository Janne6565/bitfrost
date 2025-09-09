import { useContext, useMemo } from "react";
import { AuthContext } from "@/components/AuthProvider/AuthProvider.tsx";
import axios from "axios";

const useAxiosInstance = (baseUrl: string) => {
  const { jwt } = useContext(AuthContext);

  // TODO: change after login Implementation
  const devToken = "eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTczODI1NzUsImF1ZCI6ImJpdGZyb3N0Iiwic3ViIjoiN2I5NjY1YWUtMzIzZC00MjMwLTk2YjctZmVkZGE5ZWMzZDVmIiwiZXhwIjoxNzU3NDE4NTc1LCJ0eXBlIjoiSURFTlRJVFlfVE9LRU4iLCJlbWFpbCI6ImFkbWluQGFkbWluLmRlIiwicm9sZSI6IkFETUlOIn0.NOrFF1I-dwHz4ypGx7yc8G_3Gb5XNVgZdaZSskLHLatAgPlsZNY1F7mHBQjTypDPowfuUJt3k0Bxx1jrfemTg8smPaMn07MQJOPxW7pZqRTIrwM-1iCg3nNQiFXnlujG8yU6c_D5BS4MPmcZfxFpeFgfc1iiDPVEk27ZIlUJ3lTqKm_gVGW4ugOvw-vaHBXxVUhjjL6DPLOXCLilQdqu5cRsjFT8V17MJ8-3cd8QLqcC1mQeX6zfyB2T9Gr-eloO-tAAvR5rchrK6UELVpSLfeBMZghanSmwUD5mhzqzRpYd10_RYQ5nBalMtkxxEmID47OUgoSICut4uCks9sK2oA";
  
  
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
