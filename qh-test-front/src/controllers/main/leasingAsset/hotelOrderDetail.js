(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.leasingAsset.hotelOrderDetail", {
            url: '/hotelOrderDetail?id',
            views: {
                "@": {
                    templateUrl: 'views/main/leasingAsset/hotelOrderDetail/index.root.html',
                    controller: hotelOrderDetailController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    hotelOrderDetailController.$inject = ['$scope', '$http', '$state', 'appConfig', 'alertService', '$httpParamSerializer', '$filter', 'curUser'];
    function hotelOrderDetailController($scope, $http, $state, appConfig, alertService, $httpParamSerializer, $filter, curUser) {

        $scope.imgUrl = appConfig.imgUrl;
        $scope.user = curUser.data;
        $scope.detail = {
            id: $state.params.id
        };
        //回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }

        };
        $scope.getDetails = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/hotel/detail?id=" + $scope.detail.id
            }).then(function (resp) {
                $scope.order = resp.data.result;
            });
        };
        $scope.getDetails();
        $scope.orderPay = function (id) {
            $http({
                method: "POST",
                url: appConfig.apiPath + "/hotel/qhPay",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: $httpParamSerializer({
                    id: id
                })
            }).then(function (resp) {
                var param = angular.toJson({id: id});
                $state.go("main.pay", {
                    payId: resp.data.qhPayId,
                    s: "main.leasingAsset.record",
                    param: param
                }, {reload: true});
            });
        };
    }

})();
