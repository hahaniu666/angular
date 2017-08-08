(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        /**
         * 主页
         */
        $stateProvider.state("main.index", {
            url: "/",
            views: {
                "@": {
                    templateUrl: 'views/main/index.html',
                    controller: IndexController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);

    // ----------------------------------------------------------------------------
    SidenavController.$inject = ['$scope'];
    function SidenavController($scope) {
        $scope.leftOpen = true;
        $scope.openLeftMenu = function () {
            $scope.leftOpen = !$scope.leftOpen;
        };
    }

    IndexController.$inject = ['$scope', '$state', '$cookies', '$templateCache', '$http', 'appConfig', "imgService", "$timeout", "urlbackService", '$rootScope', '$interval', '$filter', 'orderService', '$mdDialog', '$httpParamSerializer', 'wxService', '$location'];
    function IndexController($scope, $state, $cookies, $templateCache, $http, appConfig, imgService, $timeout, urlbackService, $rootScope, $interval, $filter, orderService, $mdDialog, $httpParamSerializer, wxService, $location) {
        alert(111);

    }
})();



