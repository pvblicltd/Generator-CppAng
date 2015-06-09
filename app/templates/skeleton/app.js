angular.module('<%= _.camelize(appname) %>', [
  'config',
  'ui.bootstrap',
  'ui.utils',
  'angularUtils.directives.dirPagination',
  'angulartics',
  'angulartics.google.analytics',
  'ui.router',
  'ngAnimate',
  'ngSanitize',
  'ngToast',
  'ngFx',
  'ui.cpp'
]);
angular.module('<%= _.camelize(appname) %>').config(function (ENV, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, paginationTemplateProvider, ngToastProvider, datepickerConfig) {

  datepickerConfig.startingDay = 6;
  datepickerConfig.showButtonBar = false;
  paginationTemplateProvider.setPath('bower_components/angular-utils-pagination/dirPagination.tpl.html');

  ngToastProvider.configure({
    verticalPosition: 'bottom',
    horizontalPosition: 'center',
    maxNumber: 5,
    dismissOnTimeout: true,
    timeout: 2000
  });

  $locationProvider.html5Mode(false);

  $stateProvider.state('home', { url: '/', templateUrl: 'partial/home/home.html', data: { pageTitle: 'Home' } });
  /* Add New States Above */

  $urlRouterProvider.otherwise('/');

  $httpProvider.defaults.withCredentials = ENV.name === 'production';
  $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
  $httpProvider.defaults.transformRequest = function (data) {
    return data === undefined ? data : $.param(data);
  };

});

angular.module('<%= _.camelize(appname) %>').run(function ($rootScope) {

  $rootScope.safeApply = function(fn) {
    var phase = $rootScope.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

});
