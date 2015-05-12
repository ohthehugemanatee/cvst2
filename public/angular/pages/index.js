/**
 * Created by ohthehugemanatee
 */

(function(){
    var app = angular.module('statevsstate', []);

    /**
     * Controller: USStateController
     * Initialize variables.
     */
    app.controller('USStateController', ["$scope", function($scope) {
        $scope.stateslist = [
            'Alabama',
            'Arkansas',
            'Hawaii'
        ];

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
            controller: function($scope, winnerTally) {
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

                    $scope["statedata"] = {
                        "state1": {
                            "statenum": 1,
                            "name": $scope.stateid1,
                            "field_fiber": '12345',
                            "field_singles": '99999',
                            "field_toilets" : '12345'
                        },
                        "state2": {
                            "statenum": 2,
                            "name": $scope.stateid2,
                            "field_fiber": '55555',
                            "field_singles": '12345',
                            "field_toilets" : '99999'
                        }
                    };

                    $scope["winner"] = winnerTally.tally($scope["statedata"]["state1"], $scope["statedata"]["state2"]);
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

})();