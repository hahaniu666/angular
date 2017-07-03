/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.back.list", {
                url: "/list",
                views: {
                    "@": {
                        templateUrl: 'biz/back/back.list.html',
                        controller: BackListController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            BackListController.$inject = ['$scope', '$state'];
            function BackListController($scope, $state) {
            }

        }]);


})();