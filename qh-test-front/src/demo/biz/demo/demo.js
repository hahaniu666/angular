/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.uiList", {
                url: "/",
                views: {
                    "@": {
                        templateUrl: 'biz/demo/demo.html',
                        controller: DemoController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            DemoController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope', 'uiList'];
            function DemoController($scope, $http, $state, $element, $rootScope, uiList) {
                $scope.uiList = uiList;
                $rootScope.title = "UI列表";
            }
        }]);


})();