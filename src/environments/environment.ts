// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // api_baseurl: "https://2022.ecolink.com/api/",
  api_baseurl: "http://ecolink.brandtalks.in/api/",
  // api_baseurl: "https://brandtalks.in/ecolink/api/",
  // api_baseurl: "http://localhost:8000/api/",
  profile_image : 'http://ecolink.brandtalks.in/storage/profile_image',
  assetsurl : 'http://ecolinkfrontend.brandtalks.in/assets/',
  calltoaction : 'http://ecolinkfrontend.brandtalks.in/',
  adminurl : 'http://ecolink.brandtalks.in',
  appVersion: require('../../package.json').version
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
