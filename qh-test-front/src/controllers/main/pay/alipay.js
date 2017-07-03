(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单付款
         */
        $stateProvider.state("main.pay.alipay", {
            url: '/alipay', // orderId代表的是qhPay的支付Id.id只有在详情页面进来的时候才有值,payType支付方式
            views: {
                "@": {
                    templateUrl: 'views/main/pay/alipay/index.root.html',
                    controller: orderPayController,
                    controllerAs: "vm"
                }
            }
        });
    }]);
    orderPayController.$inject = ['alertService', '$httpParamSerializer', '$scope', '$http', '$state', '$log', '$timeout', '$rootScope', '$interval', 'appConfig', '$mdDialog', 'payService'];
    function orderPayController(alertService, $httpParamSerializer, $scope, $http, $state, $log, $timeout, $rootScope, $interval, appConfig, $mdDialog, payService) {
        // ios APP下面,对于没有安装微信的sdk方法,进行隐藏
        var vm = this;
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
            if (ua.match(/IPHONE/i)) {
                vm.ua = "ios";
            } else {
                vm.ua = "android";
            }
            vm.backShow = true;
        }
        vm.qhPay = {};
        $http({
            method: 'GET',
            url: appConfig.apiPath + "/unionOrder/queryOrder?id=" + $state.params.payId
        }).then(function (resp) {
            var data = resp.data;
            vm.qhPay = data;
        }, function () {
            $timeout(function () {
                $scope.fallbackPage();
            }, 500);
        });
        // 防止支付重复请求
        $scope.payRepeat = false;
        // 进行支付
        vm.payment = function () {
            // //弹窗显示
            payService.pay($state.params.payId, "ALIPAY", $state.params.s, $state.params.param).then(function () {
            }, function () {
            });
        };
        vm.fallbackPage = function () {
            if ($state.params.s) {
                $state.go($state.params.s, $state.params.param, {reload: true});
            } else if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        }
    }
})();