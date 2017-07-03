/**
 * Module : 侧边栏
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.sidenav", {
                url: "/sidenav",
                views: {
                    "@": {
                        templateUrl: 'biz/sidenav/sidenav.html',
                        controller: SidenavController
                    }
                }
            });


        }]);
    // ----------------------------------------------------------------------------
    SidenavController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope', '$log', '$mdSidenav'];
    function SidenavController($scope, $http, $state, $element, $rootScope, $log, $mdSidenav) {

        $scope.leftOpen = true;
        $scope.openLeftMenu = function () {
            //$mdSidenav('left').toggle();
            $scope.leftOpen = !$scope.leftOpen;
        };
    }

})();