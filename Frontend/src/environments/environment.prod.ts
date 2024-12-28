import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  basePath:"http://regaykar.ignisitsolutions.com/backend/api/"
};
