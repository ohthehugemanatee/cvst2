/**
 * Created by ohthehugemanatee
 */

(function(){
    var app = angular.module('statevsstate', []);

    /**
     * Service: USStates
     * Get a US state object from state ID.
     */
    app.factory('USStates', ['$http', '$q', function ($http, $q) {
        return function (stateid) {
            // Make the API call.
            var request = $http.get('http://10.11.12.14/states.json', {
                params: {
                    stateid: +stateid
                }
            });
            // When request changes state, either return the state object or reject.
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
     * Take the form input Event and use it to dump the state object into $scope.
     */
    app.controller('USStateController', ['$scope', 'USStates', 'USStatesList', function($scope, getState, getStatesList) {
        $scope.stateslist = getStatesList();

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
		
    /**
     * Service: USStatesList
     * Get a US statelist.
     **/
    app.factory('USStatesList', ['$http', '$q', function ($http, $q) {
        return function (stateslist) {
            // Make the API call.
            var request = $http.get('http://cvst-backend.dev.nodesymphony.com/states');

            // When request changes state, either return the state object or reject.
            return request.then(function(data) {
                console.log(data.data);
                if (data.data[0]) {
                    // if there's a result set, take it..
                    return data.data;
                } else {
                    // even though $http.get was successful, we got no results. What a let down.
                    return $q.reject(new Error("No results returned for the states list."));
                }
            }, function(reason) {
                // http request failed, apparently.
                return $q.reject(new Error("HTTP request failed with reason: " + reason));
            });
        }
    }]);

})();