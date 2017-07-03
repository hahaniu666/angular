(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.leasingAsset.pay", {
            url: '/pay?id?paySize',
            views: {
                "@": {
                    templateUrl: 'views/main/leasingAsset/pay/index.root.html',
                    controller: payController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    payController.$inject = ['$scope', '$http', '$state', 'appConfig', 'alertService', '$httpParamSerializer',
        '$filter', 'curUser', 'payService', '$rootScope', '$interval', '$timeout'];
    function payController($scope, $http, $state, appConfig, alertService, $httpParamSerializer,
                           $filter, curUser, payService, $rootScope, $interval, $timeout) {

        $scope.imgUrl = appConfig.imgUrl;
        $scope.user = curUser.data;
        //回退页面
        var vm = this;
        //支付方式
        if ($state.params.paySize) {
            vm.paySize = $state.params.paySize;
        } else {
            vm.paySize = '2';
        }
        //qhpay的id
        vm.backfall = false;
        vm.pay = {
            payType: 0
        };
        vm.fallbackPage = function () {
            $state.go("main.leasingAsset.record");
        };
        vm.getQhPay = function () {
            $http({
                method: "POST",
                url: appConfig.apiPath + "/hotel/qhPay",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: $httpParamSerializer({
                    id: $state.params.id
                })
            }).then(function (resp) {
                vm.pays = resp.data;
                vm.payId = vm.pays.qhPayId;
            });
        };
        vm.getQhPay();

        vm.choosePay = function () {
            $state.go("main.leasingAsset.hotelMethod", {paySize: vm.paySize, id: $state.params.id}, {reload: true});
        };
        vm.payment = function () {
            switch (vm.paySize) {
                case '0':
                    payService.pay(vm.payId, "BALANCE", "main.leasingAsset.record");
                    break;
                case '1':
                    payService.pay(vm.payId, "WEIXIN", "main.leasingAsset.record");
                    break;
                case '2':
                    payService.pay(vm.payId, "ALIPAY", "main.leasingAsset.record");
                    break;
                case '3':
                    payService.scanPay("WEIXIN", vm.payId).then(function (data) {
                        if (data !== "error") {
                            vm.codeUrl = data;
                        }
                    });
                    vm.openBack();
                    vm.getPayStatus(vm.payId);
                    break;
                case '4':
                    payService.scanPay("ALIAPY", vm.payId).then(function (data) {
                        if (data !== "error") {
                            vm.codeUrl = data;
                        }
                    });
                    vm.openBack();
                    vm.getPayStatus(vm.payId);
                    break;
            }
        };

        /**
         * 轮询支付状态
         * @param qhPayId
         */
        vm.getPayStatus = function (qhPayId) {
            $rootScope.intervalStop = $interval(function () {
                $http({
                    method: 'GET',
                    url: appConfig.apiPath + '/payment/findPay?id=' + qhPayId
                }).then(function (resp) {
                    var data = resp.data;
                    if (data.pay || data.pay === true) {
                        $scope.paySuccess = true;
                        $timeout(function () {
                            alertService.msgAlert("success", "支付成功");
                            $state.go("main.leasingAsset.record", null, {reload: true});
                        }, 1000);
                        $interval.cancel($rootScope.intervalStop);
                        $rootScope.intervalStop = undefined;
                    }
                }, function () {

                });
            }, 3000);
        };
        vm.openBack = function () {
            vm.backfall = !vm.backfall;
        };
    }

})();
