angular.module('core').factory("ListUsers", ['$http',function($http){  
    var obj = {};
    obj.fetchUserDetails = function(){ 
      return $http.get('api/users');
    }
    return obj;
  }]);