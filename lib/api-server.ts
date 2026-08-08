import axios from 'axios';
import { cookies } from 'next/headers';

export const apiServer = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true
});

// Automatically inject server-side cookies into every outgoing request
apiServer.interceptors.request.use(async (config) => {
  try {
    const cookieStore = await cookies();
    
    // Example: Forward all cookies to your backend
    config.headers.Cookie = cookieStore.toString();

    // Or grab a specific token like XSRF
    const csrfToken = cookieStore.get('XSRF-TOKEN')?.value;
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
  } catch (error) {
    console.error('Failed to attach server cookies:', error);
  }
  
  return config;
});