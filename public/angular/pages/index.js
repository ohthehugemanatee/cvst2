/**
 * Created by ohthehugemanatee on 20/02/15.
 */

(function(){
    var app = angular.module('statevsstate', []);

    /**
     * Service: DrupalOrgUser
     * Get a drupal user object from UID.
     */
    app.factory('USStates', ['$http', '$q', function ($http, $q) {
        // Get a user.
        return function (stateid) {
            // Make the API call.
            var request = $http.get('http://10.11.12.14/states.json', {
                params: {
                    stateid: +stateid
                }
            });
            // When request changes state, either return the user object or reject.
            return request.then(function(data) {
               if (data.data.list[0]) {
                   // if there's a result set, take the first result as our state object.
                   return data.data.list[0];
               } else {
                   // even though $http.get was successful, we got no results. What a let down.
                   return $q.reject(new Error("No state with state ID " + stateid));
               }
            }, function(reason) {
                // http request failed, apparently.
                return $q.reject(new Error("HTTP request failed with reason: " + reason));
            });
        }
    }]);

    /**
     * Directive: USStateController
     * Take the form input Event and use it to dump the user object into $scope.
     */
    app.controller('USStateController', ['$scope', 'USStates', function($scope, getState) {
        $scope.selectStates = function($event) {
            // Don't fire if it's the default value, or if the form is invalid.
            $event.preventDefault();
            if (!$scope.usStateForm.$valid) {
                return;
            }

            getState($scope.stateid1).then(function(state) {
                $scope.state1 = state;
            });

            getState($scope.stateid2).then(function(state) {
                $scope.state2 = state;
            });
        }
    }]);

})();