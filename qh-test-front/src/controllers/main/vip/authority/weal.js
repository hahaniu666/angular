(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.vip.authority.weal", {
                url: "/weal?order",
                views: {
                    "@": {
                        templateUrl: 'views/main/vip/authority/weal/index.root.html',
                        controller: wealController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    wealController.$inject = ['$scope', '$state', 'vipMsg'];
    function wealController($scope,  $state, vipMsg) {
        // 回退页面
        $scope.order = $state.params.order;
        $scope.tab = $state.params.tab;

        for (var i = 0; i < vipMsg.data.agents.length; i++) {
            $scope.msg = vipMsg.data.agents[i].weifare;
            if (vipMsg.data.agent == vipMsg.data.agents[i].id) {
                vipMsg.sd = vipMsg.data.agents[$scope.tab-1].weifare;
            }
        }

        $(".txtMsg").html(vipMsg.sd);
        $scope.fallbackPage = function () {
            $state.go("main.vip.authority", {tab: $scope.tab}, {reload: true});
        };
    }
})();