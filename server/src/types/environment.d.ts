declare global {
  namespace NodeJS {
    type ProcessEnv = {
      MONGO_URL: string;
      JWT_SECRET_KEY: string;
      MONGO_TEST_URL: string;
      NODE_ENV: "development" | "production" | "test";
      PORT: string;
    };
  }
}

export {};
