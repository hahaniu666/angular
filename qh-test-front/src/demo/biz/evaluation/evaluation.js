/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.evaluation", {
                url: "/evaluation",
                views: {
                    "@": {
                        templateUrl: 'biz/evaluation/evaluation.html',
                        controller: evaluationController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            evaluationController.$inject = ['$scope', '$http', '$state', '$element'];
            function evaluationController($scope, $http, $state, $element) {
            }

        }]);


})();