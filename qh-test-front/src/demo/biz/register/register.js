/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.register", {
                url: "/register",
                views: {
                    "@": {
                        templateUrl: 'biz/register/register.html',
                        controller: registerController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    registerController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
    function registerController($scope, $http, $state, $element, $rootScope) {
    }


})();