(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单付款
         */
        $stateProvider.state("main.pay", {
            // ba传任意值，则余额支付隐藏
            //payId支付号码，s返回哪里，直接输入main.order/mian.unionOrder param,跳转携带的参数，json格式
            url: '/pay?payId&s&param&ba',
            views: {
                "@": {
                    templateUrl: 'views/main/pay/index.root.html',
                    controller: orderPayController,
                    controllerAs: "vm"
                }
            }
        });
    }]);
    orderPayController.$inject = [ '$scope', '$http', '$state',  '$timeout', 'payService', 'appConfig'];
    function orderPayController( $scope, $http, $state, $timeout, payService, appConfig) {
        var vm = this;
        // ios APP下面,对于没有安装微信的sdk方法,进行隐藏
        // 显示支付
        vm.list = [
            payService.WEIXIN,
            payService.ALIPAY,
            payService.BALANCE,
            payService.WXCODE,
            payService.ALICODE
        ];
        // 隐藏余额支付
        if ($state.params.ba) {
            vm.list.splice(2, 1);
        }
        $scope.showMore = false;
        /**
         * 选择一个支付方式
         * @param pay
         */
        vm.choosePay = function (pay) {
            for (var i = 0; i < vm.list.length; i++) {
                vm.list[i].checked = false;
            }
            pay.checked = true;
        };
        /**
         * 确定选择的支付方式
         * @param pay
         */
        vm.checkedPay = function () {
            for (var i = 0; i < vm.list.length; i++) {
                if (vm.list[i].checked) {
                    return vm.list[i].payType;
                }
            }
        };
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
            // 默认选择一个支付
            vm.choosePay(vm.list[0]);
        } else {
            // 默认选择一个支付
            vm.choosePay(vm.list[1]);
        }
        // app里面，判断微信是否存在
        if (window.cordova && window.Wechat) {
            window.Wechat.isInstalled(function (installed) {
                if (!installed) {
                    vm.list.splice(0, 1);
                }
            }, function () {
                vm.list.splice(0, 1);
            });
        }
        //更多支付方式
        vm.showMores = function () {
            $scope.showMore = true;
        };

        vm.qhPay = {};
        $http({
            method: 'GET',
            url: appConfig.apiPath + "/unionOrder/queryOrder?id=" + $state.params.payId
        }).then(function (resp) {
            vm.qhPay = resp.data;
        }, function () {
            $timeout(function () {
                vm.fallbackPage();
            }, 500);
        });
        // 防止支付重复请求
        vm.payRepeat = false;
        // 进行支付
        vm.payment = function () {
            var ua = window.navigator.userAgent.toLowerCase();
            var payType = vm.checkedPay();
            if (payType === 'BALANCE' && !vm.qhPay.pay) {
                $state.go("main.user.setPay", null, {reload: true});
                return;
            }
            if (vm.payRepeat) {
                return;
            }
            vm.payRepeat = true;
            if (payType === 'ALIPAY' && ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                var url = "#/pay/alipay?payId=" + $state.params.payId;
                if ($state.params.s) {
                    url = url + "&s=" + encodeURIComponent($state.params.s);
                }
                if ($state.params.param) {
                    url = url + "&param=" + encodeURIComponent($state.params.param);
                }
                location.href = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search + "&t=1" + url;
            } else {
                payService.pay($state.params.payId, payType, $state.params.s, $state.params.param).then(function () {
                }, function () {
                    vm.payRepeat = false;
                });
            }
        };
        vm.fallbackPage = function () {
            var param = {};
            if ($state.params.param) {
                param = angular.fromJson($state.params.param);
            }
            if ($state.params.s) {
                $state.go($state.params.s, param, {reload: true});
            } else if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();