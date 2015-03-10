/**
 * Created by ohthehugemanatee on 20/02/15.
 */

(function(){
    var app = angular.module('drupalgrapher', []);

    app.controller('UserController', function() {
       this.activeUser =
           {
               name: 'Test User',
               uid: '5',
               url: 'https://drupal.org/user/5'
           };

    });

    /**
     * Service: DrupalOrgUser
     * Get a drupal user object from UID.
     */
    app.factory('drupalOrgUser', ['$http', '$q', function ($http, $q) {
        // Get a user.
        return function (uid) {
            // If this was a non-numeric UID, reject the promise.
            if (!isFinite(uid)) {
                return $q.reject(new TypeError("UID should be numeric, got" + uid));
            }

            // since the UID is numeric, let's make our API call.
            $request = $http.get('https://www.drupal.org/api-d7/user.json', {
                params: {
                    uid: +uid
                }
            });
            // When request changes state, either return the user object or reject.
            $request.then(function(data) {
               if (data.data.list[0]) {
                   // if there's a result set, take the first result as our user object.
                   return data.data.list[0];
               } else {
                   // even though $http.get was successful, we got no results. What a let down.
                   return $q.reject(new Error("No user with uid " + uid));
               }
            }, function(reason) {
                // http request failed, apparently.
                return $q.reject(new Error("HTTP request failed with reason: " + reason));
            });
        }
    }]);

    /**
     * Directive: UserController
     * Take the form input Event and use it to dump the user object into $scope.
     */
    app.controller('UserController', ['$scope', 'drupalOrgUser', function($scope, getUser) {
        $scope.selectUser = function($event) {
            // Don't fire if it's default value, or if the form is invalid.
            $event.preventDefault();

            if (!$scope.userForm.$valid) {
                return;
            }

            getUser($scope.uid).then(function(user) {
                $scope.user = user;
            });
        }
    }]);

    app.directive('userForm', function() {
        return {
            restrict: 'E',
            templateUrl: 'angular/components/user-form.html'
        };
    });

    app.directive('userInfo', function() {
       return {
           restrict: 'E',
           templateUrl: 'angular/components/user-info.html'
       };
    });

})();