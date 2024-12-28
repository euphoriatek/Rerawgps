import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,
  basePath:"http://localhost:8000/api/",
  AdminbasePath:"http://localhost:8000/api/admin/"
};
