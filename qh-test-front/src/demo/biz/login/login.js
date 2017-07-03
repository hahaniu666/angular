/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.login", {
                url: "/login",
                views: {
                    "@": {
                        templateUrl: 'biz/login/login.html',
                        controller: loginController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    loginController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
    function loginController($scope, $http, $state, $element, $rootScope) {
    }


})();