(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.hotelManage.hotelSettle", {
                url: "/hotelSettle?id&unionId",
                views: {
                    "@": {
                        templateUrl: 'views/main/hotelManage/hotelSettle/index.root.html',
                        controller: hotelSettleController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    hotelSettleController.$inject = ['$http', '$state', 'appConfig',  '$httpParamSerializer'];
    function hotelSettleController( $http, $state, appConfig,  $httpParamSerializer) {
        var vm = this;
        vm.imgUrl = appConfig.imgUrl;  // 图片地址的URL
        vm.orderId = $state.params.id;
        vm.unionId = $state.params.unionId;
        vm.getDetail = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/orgOrder/detail",
                params: {
                    orderId: vm.orderId
                }
            }).then(function (resp) {
                    vm.data = resp.data.result;
                }, function () {

                }
            );
        };
        vm.getDetail();

        vm.getPrice = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/orgOrder/account"
            }).then(function (resp) {
                    vm.price = resp.data;
                }, function () {

                }
            );
        };
        vm.getPrice();

        vm.goPay = function () {
            if (vm.data.status === 'UNPAYED') {
                vm.pay();
            } else {
                vm.createPay();
            }

        };

        vm.createPay = function () {
            $http({
                method: "POST",
                url: appConfig.apiPath + "/qhOrder/create",
                data: $httpParamSerializer({
                    orderId: vm.unionId
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                    var data = resp.data;
                    if (data.code === 'SUCCESS') {
                        vm.pay();
                    }
                }, function () {

                }
            );
        };

        vm.pay = function () {

            $http({
                method: "POST",
                url: appConfig.apiPath + "/orgOrder/qhPay",
                data: $httpParamSerializer({
                    orderId: vm.orderId
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                    vm.qhPayId = resp.data.qhPayId;
                    $state.go("main.pay", {
                        payId: vm.qhPayId,
                        s: "main.hotelManage.hotelOrder",
                        param: angular.toJson({
                            type: 'BUY',
                            status: 'ALL'
                        })
                    });
                }, function () {

                }
            );
        };


        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();