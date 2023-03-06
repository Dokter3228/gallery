declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGO_URL?: string;
            JWT_SECRET_KEY: string;
            MONGO_TEST_URL?: string;
            NODE_ENV: 'development' | 'production' | 'test';
            PORT?: string;
            PWD: string;
        }
    }
}

export default global;