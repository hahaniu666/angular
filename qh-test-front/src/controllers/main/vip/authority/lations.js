(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.vip.authority.latinos", {
                url: "/latinos?order",
                views: {
                    "@": {
                        templateUrl: 'views/main/vip/authority/latinos/index.root.html',
                        controller: latinosController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    latinosController.$inject = ['$scope', '$http', '$state', 'appConfig', 'alertService', '$httpParamSerializer', 'imgService', 'vipMsg'];
    function latinosController($scope, $http, $state, appConfig, alertService, $httpParamSerializer, imgService, vipMsg) {
        // 回退页面

        $scope.order = $state.params.order;
        $scope.tab = $state.params.tab;


        for (var i = 0; i < vipMsg.data.agents.length; i++) {
            $scope.msg = vipMsg.data.agents[i].power;
            if (vipMsg.data.agent === vipMsg.data.agents[i].id) {
                vipMsg.power = vipMsg.data.agents[$scope.tab - 1].power;
            }
        }
        $("#text").html(vipMsg.power);

        $scope.fallbackPage = function () {
            $state.go("main.vip.authority", {tab: $scope.tab}, {reload: true});
        };
    }
})();