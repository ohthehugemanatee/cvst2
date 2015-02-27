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

    app.directive('userForm', function() {
        return {
            restrict: 'E',
            templateUrl: 'angular/components/user-form.html',
            controller: function() {
                this.user = {};
                this.selectUser = function(target) {
                    target.uid = this.user.uid;
                    this.user = {};
                };
            },
            controllerAs: 'userFormCtrl'
        };
    });

    app.directive('userInfo', function() {
       return {
           restrict: 'E',
           templateUrl: 'angular/components/user-info.html'
       };
    });

})();