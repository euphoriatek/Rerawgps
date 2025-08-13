import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  basePath:"https://regaykar.com/backend/api/",
  AdminbasePath:"https://regaykar.com/backend/api/admin/",
  apiBaseUrl: "https://regaykar.com/backend" 
};
