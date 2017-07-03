/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.back.aaa", {
                url: "/aaa",
                views: {
                    "@": {
                        templateUrl: 'biz/back/back.aaa.html',
                        controller: BackAaaController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            BackAaaController.$inject = ['$scope', "$state"];
            function BackAaaController($scope, $state) {
            }

        }]);


})();