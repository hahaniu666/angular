/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.finishAssess", {
                url: "/finishAssess",
                views: {
                    "@": {
                        templateUrl: 'biz/finishAssess/finishAssess.html',
                        controller: finishAssessController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            finishAssessController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
            function finishAssessController($scope, $http, $state, $element, $rootScope) {
            }

        }]);


})();