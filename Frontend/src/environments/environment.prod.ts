import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  basePath:"http://127.0.0.1:8000/api/"
};
