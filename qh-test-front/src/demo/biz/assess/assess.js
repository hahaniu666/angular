/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.assess", {
                url: "/assess",
                views: {
                    "@": {
                        templateUrl: 'biz/assess/assess.html',
                        controller: assessController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            assessController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
            function assessController($scope, $http, $state, $element, $rootScope) {
            }

        }]);


})();