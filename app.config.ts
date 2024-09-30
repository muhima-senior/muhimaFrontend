import 'dotenv/config';

export interface AppConfig {
  REACT_APP_API_URL: string,
  API_TOKEN: string,
}

export default {
  name: 'Muhima App',
  version: '1.0.0',
  extra: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    API_TOKEN: process.env.API_TOKEN,
  },
};