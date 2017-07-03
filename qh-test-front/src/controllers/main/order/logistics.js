(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 物流详情.和商品订单的共用
         */
        $stateProvider.state("main.order.logistics", {
            url: '/logistics?id&num',
            views: {
                "@": {
                    templateUrl: 'views/main/order/logistics/index.root.html',
                    controller: logisticsController
                }
            }
        });
    }]);
    logisticsController.$inject=['$scope', '$http', '$state', 'appConfig'];
    function logisticsController($scope, $http, $state, appConfig) {
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

        //获取该orderId的物流信息
        $scope.id = $state.params.id;
        $scope.num = $state.params.num;
        if (!$scope.num) {
            $scope.num = 1;
        }
        if (!$scope.id) {
            $scope.fallbackPage();
            return;
        }
        if($scope.num!=='3'){
            $http({
                method:'GET',
                url:appConfig.apiPath + '/order/orderTrack?id=' + $scope.id
            }).then(function (resp) {
                var data=resp.data;
                $scope.logistics = data;
            },function (resp) {
                var data=resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        }
        //租赁订单状态是3.其他的请求商品的接口
        if($scope.num===3||$scope.num==='3'){
            $http({
                method:'GET',
                url:appConfig.apiPath + '/rentOrder/orderTrack?id=' + $scope.id
            }).then(function (resp) {
                var data=resp.data;
                $scope.logistics = data;
            },function (resp) {
                var data=resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        }


    }
})();