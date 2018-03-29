'use strict';

angular.module('users').controller('AuthenticationController', ['$rootScope', '$scope', '$state', '$http', '$location', '$window', '$modal', 'Authentication', 'PasswordValidator', '$sce',
  function ($rootScope, $scope, $state, $http, $location, $window, $modal, Authentication, PasswordValidator, $sce) {
    $scope.authentication = Authentication;
    $scope.esigndocmodel = {"name":null,"email":null};
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();
    $scope.esign = function () {
      var mailid = angular.element('#email').val();
      //console.log("Email is :" + $scope.esigndocmodel.email);
      $http.get('/api/getEsignDocByEmail?email='+mailid).success(function (response) {

        var vals = [];
        for (var i = 0; i < response.length; i++){
          console.log(response[i].signUrl);
          vals.push(response[i].signUrl);
        };
        $('.links-wrapper2').show();
        console.log(vals);
        $scope.url = vals;
        $rootScope.url2=response;

    })
  };
    $scope.modal_close = function () {
      $rootScope.modalInstance.close();
    }
    $scope.esignproceed = function (x) {
      console.log("hello");
      console.log(x);
      console.log(x.signUrl);
      $window.open(x.signUrl);
   /*    
      $rootScope.uniqurl = x.signUrl;
      console.log($rootScope.uniqurl);
        $rootScope.uniqurl_Notrust = $sce.trustAsResourceUrl($rootScope.uniqurl);

      $rootScope.modalInstance = $modal.open({
        templateUrl: 'modules/users/client/views/authentication/signmodal.html',
        size: 'md',
        backdrop: 'static',
        keyboard: 'false'

      });
      */


      
    }
    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }


      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);
