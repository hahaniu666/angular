/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.ksTheme", {
                url: "/ksTheme",
                views: {
                    "@": {
                        templateUrl: 'biz/ksTheme/ksTheme.html',
                        controller: KsThemeController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            KsThemeController.$inject = ['$scope'];
            function KsThemeController($scope) {
                $scope.vs = {
                    checked: true,
                    radio: false
                };
            }
        }]);
})();