'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('new_doc', {
      url: '/new_doc',
      templateUrl: 'modules/core/client/views/new_doc.client.view.html'
    })
    .state('drafts', {
      url: '/drafts',
      templateUrl: 'modules/core/client/views/drafts.client.view.html'
    })
    .state('sent', {
      url: '/sent',
      templateUrl: 'modules/core/client/views/sent.client.view.html'
    })
    .state('received', {
      url: '/received',
      templateUrl: 'modules/core/client/views/received.client.view.html'
    })
    .state('completed', {
      url: '/completed',
      templateUrl: 'modules/core/client/views/completed.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);
