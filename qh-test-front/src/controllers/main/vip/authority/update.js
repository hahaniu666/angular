(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.vip.authority.update", {
                url: "/update?order",
                views: {
                    "@": {
                        templateUrl: 'views/main/vip/authority/update/index.root.html',
                        controller: updateController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    updateController.$inject = ['$scope', '$http', '$state', 'appConfig'];
    function updateController($scope, $http, $state, appConfig) {
        // 回退页面
        $scope.order = $state.params.order;
        $scope.tab = $state.params.tab;
        $scope.order = $scope.tab;
        $scope.fallbackPage = function () {
            $state.go("main.vip.authority", {tab: $scope.tab}, {reload: true});
        };

        var vm = this;
        $http({
            method: "GET",
            url: appConfig.apiPath + "/integral/user"
        }).then(function (resp) {
            vm.data = resp.data;
        }, function () {
        });
    }
})();