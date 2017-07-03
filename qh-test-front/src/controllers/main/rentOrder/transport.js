

(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单详情
         */
        $stateProvider.state("main.rentOrder.transport", {
            url: '/transport?rentOrder',
            views: {
                "@": {
                    templateUrl: 'views/main/rentOrder/transport/index.root.html',
                    controller:transportController
                }
            }
        });
    }]);
    transportController.$inject=['$scope', '$http', '$state', 'appConfig'];
    function transportController( $scope, $http, $state, appConfig) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        // 回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        $scope.rentOrder = $state.params.rentOrder;
        if (!$scope.rentOrder) {
            $scope.fallbackPage();
            return;
        }
        $scope.queryDetail = function () {

            $http({
                method:'GET',
                url:appConfig.apiPath + '/rentOrder/transport?orderId=' + $scope.rentOrder
            }).then(function (resp) {
                var data=resp.data;
                $scope.transport = data;
            },function (resp) {
                var data=resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        $scope.queryDetail();


    }
})();