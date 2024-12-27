import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  basePath:"https://regaykar.ignisitsolutions.com/api/",
  AdminbasePath:"https://regaykar.ignisitsolutions.com/api/admin/"
};
