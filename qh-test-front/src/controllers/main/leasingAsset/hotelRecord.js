(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.leasingAsset.record", {
            url: '/record',
            views: {
                "@": {
                    templateUrl: 'views/main/leasingAsset/record/index.root.html',
                    controller: recordController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    recordController.$inject = ['$scope', '$http', '$state', 'appConfig', '$httpParamSerializer',  'curUser'];
    function recordController($scope, $http, $state, appConfig,  $httpParamSerializer,  curUser) {

        $scope.imgUrl = appConfig.imgUrl;
        $scope.user = curUser.data;
        $scope.orders = [];
        $scope.page = {curPage: 0, pageSize: 10, totalCount: 0};
        //回退页面
        $scope.fallbackPage = function () {
            $state.go("main.leasingAsset", null, {reload: true});
        };
        $scope.getList = function () {
            $scope.page.curPage++;
            $http({
                method: "GET",
                url: appConfig.apiPath + "/hotel/orderList",
                params: {
                    curPage: $scope.page.curPage,
                    pageSize: $scope.page.pageSize
                }
            }).then(function (resp) {
                for (var i = 0; i < resp.data.recList.length; i++) {
                    $scope.orders.push(resp.data.recList[i]);
                }
                $scope.page.curPage = resp.data.curPage;
                $scope.page.pageSize = resp.data.pageSize;
                $scope.page.totalCount = resp.data.totalCount;
                if ($scope.page.curPage * $scope.page.pageSize >= $scope.page.totalCount) {
                    $scope.page.pageEnd = true;
                }
            });
        };
        $scope.getList();
        // 去详情页
        $scope.goDetails = function (id) {
            $state.go("main.leasingAsset.hotelOrderDetail", {id: id}, {reload: true});
        };
        $scope.orderPay = function (order) {
            $http({
                method: "POST",
                url: appConfig.apiPath + "/hotel/qhPay",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: $httpParamSerializer({
                    id: order.id
                })
            }).then(function (resp) {
                $state.go("main.pay", {payId: resp.data.qhPayId, s: "main.leasingAsset.record"});
            });
        };
    }

})();
