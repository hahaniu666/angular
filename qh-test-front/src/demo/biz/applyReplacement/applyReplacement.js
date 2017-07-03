/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.applyReplacement", {
                url: "/applyReplacement",
                views: {
                    "@": {
                        templateUrl: 'biz/applyReplacement/applyReplacement.html',
                        controller: applyReplacementController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            applyReplacementController.$inject = ['$scope', '$http', '$state'];
            function applyReplacementController($scope, $http, $state, $element) {
            }

        }]);

})();