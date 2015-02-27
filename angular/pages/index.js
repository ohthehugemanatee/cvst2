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

    app.directive('userForm', ['$http', function($http) {
        return {
            restrict: 'E',
            templateUrl: 'angular/components/user-form.html',
            controller: function() {
                this.submission = {};
                this.selectUser = function(target) {
                    newuser = $http.get('https://www.drupal.org/api-d7/user.json?uid=' + this.submission.uid).success(function(data) {
                        target = data.list[0];
                    });
                    this.submission = {};
                };
            },
            controllerAs: 'userFormCtrl'
        };
    }]);

    app.directive('userInfo', function() {
       return {
           restrict: 'E',
           templateUrl: 'angular/components/user-info.html'
       };
    });

})();