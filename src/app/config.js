export default appConfig;

/** @ngInject */
function appConfig(
  $locationProvider,
) {
  $locationProvider.html5Mode(true);
}
