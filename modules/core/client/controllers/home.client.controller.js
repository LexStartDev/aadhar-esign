'use strict';

angular.module('core').controller('HomeController', ['$scope', '$state', 'Authentication','ListUsers',
  function ($scope,$state, Authentication,users) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    if (Authentication.user) {
      $state.go('home');
    }
    else {   
      $state.go('authentication.signin');
    }
    // users.fetchUserDetails().success(function(response){
    //   $scope.userDetail = response;
    // });
  }
]);
