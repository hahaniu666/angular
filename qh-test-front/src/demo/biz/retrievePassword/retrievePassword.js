/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.retrievePassword", {
                url: "/retrievePassword",
                views: {
                    "@": {
                        templateUrl: 'biz/retrievePassword/retrievePassword.html',
                        controller: RetrievePasswordController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    RetrievePasswordController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
    function RetrievePasswordController($scope, $http, $state, $element, $rootScope) {
    }


})();