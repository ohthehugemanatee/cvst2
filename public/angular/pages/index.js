/**
 * Created by ohthehugemanatee
 */

(function(){
    var app = angular.module('statevsstate', []);

    /**
     * Controller: USStateController
     * Initialize variables.
     */
    app.controller('USStateController', ["$scope", 'USStatesList', function($scope, getStatesList) {
        getStatesList().then(function (states) {
            $scope.stateslist = states;
        });

        $scope.stateid1 = '';
        $scope.stateid2 = '';

        $scope.statedata = {};
    }]);

    /**
     * Directive: stateForm
     * Take the form input Event and use it to dump the state object into $scope.
     */
    app.directive('stateForm', [function() {
        return {
            restrict: 'E',
            templateUrl: 'angular/elements/state-form.html',
            scope: {
                stateslist: '=',
                statedata: '=',
                winner: '='
            },
            controller: function($scope, USStates, winnerTally) {
                $scope.selectState = function ($event) {
                    // Don't fire if it's the default value, or if the form is invalid.
                    $event.preventDefault();
                    if (!$scope.usStateForm.$valid) {
                        return;
                    }

                    // Don't fire if the two states are identical, or if one is undefined.
                    if ($scope.stateid1 == $scope.stateid2
                    || !$scope.stateid1
                    || !$scope.stateid2) {
                        return;
                    }

                    USStates.getter($scope.stateid1).then(function (data) {
                        var state = USStates.reducer(data);
                        $scope["statedata"]["state1"] = state;
                        $scope["winner"] = winnerTally.tally($scope["statedata"]["state1"], $scope["statedata"]["state2"]);
                    });

                    USStates.getter($scope.stateid2).then(function (data) {
                        var state = USStates.reducer(data);
                        $scope["statedata"]["state2"] = state;
                        $scope["winner"] = winnerTally.tally($scope["statedata"]["state1"], $scope["statedata"]["state2"]);
                    });



                }
            }
        }
    }]);

    /**
     * Directive: stateResult
     * Show the values associated with a state attribute.
     */
    app.directive('stateResult', [function() {
        return {
            restrict: 'E',
            templateUrl: 'angular/elements/state-result.html',
            scope: {
                state: '=',
                winner: '='
            }
        }
    }]);

    /**
     * Service: WinnerTally
     * Compare the two sets of state results and declare an overall winner.
     */
    app.factory('winnerTally', function () {
        var service = {};
        // Compare two values, and pick a winner. Returns 1 or 2 for a winner, 3 for a tie.
        service.vote = function (value1, value2) {
            if (parseFloat(value1) > parseFloat(value2)) {
                return 1;
            }
            if (parseFloat(value1) < parseFloat(value2)) {
                return 2;
            }
            // neither matched, this must be a tie.
            return 3;
        };

        // take two state results and tally the votes.
        service.tally = function (state1, state2) {
            if (!state1 || !state2) {
                return;
            }

            // Set statenum for convenience.
            state1["statenum"] = 1;
            state2["statenum"] = 2;

            var score = {
                1:0,
                2:0,
                3:0
            };

            var winner = {};

            for (var key in state1) {
                if (key == 'name') {
                    continue;
                }
                // Get the winner from each field.
                var result = this.vote(state1[key], state2[key]);
                // Add the point to the scoreboard.
                score[result]++;
                // Set a variable to indicate when a state wins for each field.
                winner[key] = result;
            }
            // Set a variable to indicate who wins overall.
            var leader = 1;
            for (current in score) {
                if (score[current] > score[leader]) {
                    leader = current;
                }
            }
            winner["victory"] = leader;
            return winner;
        };
        return service;
    });


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