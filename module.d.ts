declare namespace NodeJS {
  export interface ProcessEnv {
    JWT_SECRET_KEY: string;
    REFRESH_SECRET_KEY: string;
  }
}
