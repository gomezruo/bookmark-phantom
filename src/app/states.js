export default routesConfig;

/** @ngInject */
function routesConfig(
  $httpProvider,
  $stateProvider,
  $urlRouterProvider,
) {

  $urlRouterProvider.rule(($i, $location) => {
    const path = $location.path();
    const normalized = path.toLowerCase();
    if (path !== normalized) return normalized;
  });

  $stateProvider

    .state('overview', {
      url: '/',
      component: 'cmpOverview',
    })
    .state('results', {
      url: '/results',
      component: 'cmpResults',
      params: {
        bookmark: {},
      },
    });

  $urlRouterProvider
    .when('', '/');

  $urlRouterProvider.otherwise($injector => {
    const $state = $injector.get('$state');

    $state.go('overview');
  });
}
