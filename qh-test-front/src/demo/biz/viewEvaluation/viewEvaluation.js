/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.viewEvaluation", {
                url: "/viewEvaluation",
                views: {
                    "@": {
                        templateUrl: 'biz/viewEvaluation/viewEvaluation.html',
                        controller: viewEvaluationController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            viewEvaluationController.$inject = ['$scope', '$http', '$state', '$element'];
            function viewEvaluationController($scope, $http, $state, $element) {
            }

        }]);


})();