'use client'
import axios, { type AxiosInstance, type AxiosError } from 'axios';

// 1. Extract the error interceptor into a standalone function
//    so we can reuse it across multiple instances
const handleErrorInterceptor = (error: AxiosError) => {
  // Any status codes outside the 2xx range trigger this function
  let errorMessage = 'An unexpected error occurred';

  if (error.response) {
    // The request was made and the server responded with a 4xx or 5xx status code
    errorMessage = error.message;
  } else if (error.request) {
    // The request was made but no response was received (e.g., network error)
    errorMessage = 'No response from server. Check network connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message;
  }

  return Promise.reject(new Error(errorMessage));
};

// 2. Create a "factory function"
//    It takes a baseURL and returns a configured Axios instance
const createApiClient = (baseURL: string | undefined): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json'
    //   'Authorization': `Bearer ${localStorage.getItem('user_token')}`
    },
  });
  console.log(`Connect Service on :${baseURL}`)


  // 3. Attach our unified error handling to this new instance
  instance.interceptors.response.use(
    (response) => response, // Successful 2xx responses pass through
    handleErrorInterceptor // Failed responses are handled by our interceptor
  );

  return instance;
};

// --- 4. Create and export your service-specific API clients ---

// Note: These variables MUST start with NEXT_PUBLIC_
// to be accessible on the client (browser)

export const userServiceApi = createApiClient(
  process.env.NEXT_PUBLIC_USER_SERVICE_API_BASE_URL
);

export const contentServiceApi = createApiClient(
  process.env.NEXT_PUBLIC_CONTENT_SERVICE_API_BASE_URL
);

export const learningServiceApi = createApiClient(
  process.env.NEXT_PUBLIC_LEARNING_SERVICE_API_BASE_URL
);

// (Optional) You can group them into a single object
const apiClients = {
  user: userServiceApi,
  content: contentServiceApi,
  learning: learningServiceApi,
};

export default apiClients;