/**
 * Created by ohthehugemanatee on 20/02/15.
 */

(function(){
    var app = angular.module('drupalgrapher', []);

    /**
     * Service: DrupalOrgUser
     * Get a drupal user object from UID.
     */
    app.factory('drupalOrgUser', ['$http', '$q', function ($http, $q) {
        // Get a user.
        return function (uids) {
            // Clear out any prior requests hanging around.
            var request = array;

            // Strip any whitespaces.
            uids = uids.replace(' ', '');
            // Make the list of UIDs into an array.
            if (uids.indexOf(',') != -1) {
                var uidArray = uids.split(",");
            }
            else {
                var uidArray = array;
                uidArray[0] = uids;
            }

            uidArray.forEach(function(uid) {
               // If this was a non-numeric UID, reject the promise.
               if (!isFinite(uid)) {
                 return $q.reject(new TypeError("UIDs should be numeric, got" + uid));
               }
                /// Since the UID is numeric, let's make our API call.
                // Multiple filter values aren't supported, so this has to happen in the loop. :(
                var requests = array;
                requests[] = $http.get('https://www.drupal.org/api-d7/user.json', {
                    params: {
                        uid: +uid
                    }
                });
            });


            // What do I do here? I have an array of promises. I should start returning right away and just adding to
            // the array of results. I think Angular's 2 way data binding will just update the results as they come in... right?
            // maybe what I really need is a controller to take the form input and run the service once for each UID,
            // dumping returns into the array. Yeah, that sounds right...


            // When request changes state, either return the user object or reject.
            return request.then(function(data) {
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