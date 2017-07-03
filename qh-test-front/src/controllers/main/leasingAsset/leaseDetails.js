(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.leasingAsset.leaseDetails", {
            url: '/leaseDetails?id&refundId&lishi',
            views: {
                "@": {
                    templateUrl: 'views/main/leasingAsset/leaseDetails/index.root.html',
                    controller:leaseDetailsController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    leaseDetailsController.$inject = ['$scope', '$http', '$state',  'appConfig','alertService','$httpParamSerializer','$filter'];
    function leaseDetailsController($scope, $http, $state, appConfig,alertService,$httpParamSerializer,$filter) {

        $scope.imgUrl=appConfig.imgUrl;
        //回退页面
        var vm = this;
        vm.fallbackPage = function () {
            $state.go("main.leasingAsset", {
                toptrueOrFalse:null
            }, {reload: true});

        };
        $http({
            method: 'GET',
            url: appConfig.apiPath + "/rentItem/item",
            params:{
                id:$state.params.id
            }
        }).then(function (resp) {
            $scope.data = resp.data;

        }, function () {

        });
        //跳转到商品页面
        $scope.itemLink=function () {
            $state.go("main.item", {
                itemId: $scope.data.sku.itemId,
                skuId: $scope.data.sku.id

             }, {reload: true});
        };
        //跳转到订单详情页面rentOrder
        $scope.orderLink=function () {
            if(!$scope.data.orderId){
               return false;
            }else{
                $state.go("main.rentOrder.detail", {
                    rentOrder:$scope.data.orderId
                }, {reload: true});
            }
        };
        //申请退租
        $scope.tuizu = function () {
            $state.go("main.leasingAsset.RequestOf", {
                id: $scope.data.id,
                totalPrice:$scope.data.totalPrice,
                overDate: $filter("date")(new Date($scope.data.endDate), "yyyy-MM-dd")
            }, {reload: true});
        };
        //取消退租
        $scope.refundId = {};
        $scope.quxiaotuizu = function () {
            alertService.confirm(null, "", "您确定要取消退租?", "点错了", "确定").then(function (data) {
                if (data) {
                    $scope.refundId =$state.params.id,
                        $scope.queding();
                }
            });
        };
        //取消退租调用API
        $scope.queding = function () {
            if(!$state.params.refundId){
                return;
            }
            $http({
                method: 'POST',
                url: appConfig.apiPath + "/unionOrder/cancelRefund",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data:$httpParamSerializer({
                    id: $state.params.refundId
                })
            }).then(function () {
                $state.go("main.leasingAsset", {}, {reload: true});
            }, function () {
            });
        };

        //删除历史调用API
        $scope.shanchu = function () {
            alertService.confirm(null, "", "您确定要删除?", "点错了", "确定").then(function (data) {
                if (data) {
                    $scope.shachu();
                }
            });
        };
        $scope.shachu = function () {
            $http({
                method: 'POST',
                url: appConfig.apiPath + "/rentItem/deleteMany",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: $httpParamSerializer({
                    ids: $state.params.id
                })
            }).then(function () {
                $state.go("main.leasingAsset", {
                    TOF: 'shanchu'
                }, {reload: true});
            }, function () {

            });
        };
    };

})();
