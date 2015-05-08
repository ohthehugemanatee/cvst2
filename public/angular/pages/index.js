/**
 * Created by ohthehugemanatee
 */

(function(){
    var app = angular.module('statevsstate', []);

    /**
     * Directive: USStateController
     * Take the form input Event and use it to dump the state object into $scope.
     */
    app.controller('USStateController', ['$scope', 'USStates', 'USStatesList', function($scope, getState, getStatesList) {
        getStatesList().then(function (states) {
            $scope.stateslist = states;
        });

        $scope.selectState = function($event) {
            // Don't fire if it's the default value, or if the form is invalid.
            $event.preventDefault();
            if (!$scope.usStateForm.$valid) {
                return;
            }

            getState.getter($scope.stateid1).then(function(data) {
                var state = getState.reducer(data);
                $scope.state1 = state;
            });

            getState.getter($scope.stateid2).then(function(data) {
                var state = getState.reducer(data);
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
                //console.log(data.data);
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


    /**
     * Service: USStates
     * Get a US state object from state ID.
     */
    app.factory('USStates', ['$http', '$q', function ($http, $q) {
        var service = {};
        service.getter = function (stateid) {
            // Make the API call.
            var request = $http.get('http://cvst-backend.dev.nodesymphony.com/state-data/', {
                params: {
                    stateid: +stateid
                }
            });
            // When request changes state, either return the state object or reject.
            return request.then(function(result) {
                if (result.data) {
                    // If there's a result set, return it.
                    return result.data;
                } else {
                    // even though $http.get was successful, we got no results. What a let down.
                    return $q.reject(new Error("No state with state ID " + stateid));
                }
            }, function(reason) {
                // http request failed, apparently.
                return $q.reject(new Error("HTTP request failed with reason: " + reason));
            });
        };

        // Takes a multi-node result set and reduces it down to a single object, handling duplicate fields reasonably.
        service.reducer = function (data) {
            var reduced = {};
            // Iterate over the nodes.
            for (var result in data) {
                if (data[result]) {
                    // Iterate over the fields.
                    for (key in data[result]) {
                        // If the field isn't empty, add it to the "reduced" array.
                        if (data[result][key].length > 0) {
                            var value = data[result][key];
                            if (!reduced[key]) {
                                // If we don't have a value for this field yet, just set it.
                                reduced[key] = value;
                            }
                            else {
                                // We already have a value for this field, so try appending numbers to the field name until
                                // we find one that's not set yet. So duplicate values will look like reduced.field_value and
                                // reduced.field_value2.
                                var i = 0;
                                while (data[result][key]) {
                                    var ourkey = key +i;
                                    if (!reduced[ourkey]) {
                                        reduced[ourkey] = value;
                                        data[result][key] = null;
                                    }
                                    i++;
                                }
                            }
                        }
                    }
                }
            }
            return reduced;
        };
        return service;

    }]);

})();