(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单付款
         */
        $stateProvider.state("main.leasingAsset.orderpay", {
            url: '/orderpay?orderId&id&payType&payId', // orderId代表的是qhPay的支付Id.id只有在详情页面进来的时候才有值,payType支付方式
            views: {
                "@": {
                    templateUrl: 'views/main/leasingAsset/orderpay/index.root.html',
                    controller: orderPayController
                }
            }
        });
    }]);
    orderPayController.$inject = ['$scope', '$http', '$state', '$log', 'alertService', '$httpParamSerializer',
        '$timeout', '$rootScope', '$interval', 'appConfig', '$mdDialog', 'payService'];
    function orderPayController($scope, $http, $state, $log, alertService, $httpParamSerializer,
                                $timeout, $rootScope, $interval, appConfig, $mdDialog, payService) {
        $scope.list = [
            {
                name: '支付宝支付',
                icon: 'ks-alipay'
            }
        ];
        $scope.orderId = $state.params.orderId;
        $scope.pay = $state.params.payId;
        $scope.state = {};
        // ios APP下面,对于没有安装微信的sdk方法,进行隐藏
        if (window.cordova) {
            $scope.qqq = '支付宝支付';
            $scope.pay = '2';
            // 默认付款方式
            $scope.state['支付宝支付'] = true;
            // 选中的支付方式
            var cur = '支付宝支付';
            if (cordova.platformId === 'ios') {
                window.Wechat.isInstalled(function (installed) {
                    if (installed) {
                        $scope.list.push({
                            name: '微信支付',
                            icon: 'ks-weixin'
                        });
                        $scope.$apply();
                    }
                }, function () {

                });
            } else {
                $scope.list.push({
                    name: '微信支付',
                    icon: 'ks-weixin'
                });
            }
        } else {
            $scope.list.unshift({
                name: '微信支付',
                icon: 'ks-weixin'
            });
            $scope.qqq = '微信支付';
            $scope.pay = '1';
            // 默认付款方式
            $scope.state['微信支付'] = true;
            // 选中的支付方式
            var cur = '微信支付';
        }
        $scope.list.push({
            name: '余额支付',
            icon: 'ks-rmb-symbol'
        }, {
            name: '生成微信支付码',
            icon: 'ks-qrcode'
        }, {
            name: '生成支付宝支付码',
            icon: 'ks-qrcode'
        });
        $scope.choose = function (name) {
            $scope.state[cur] = false;
            $scope.state[name] = true;
            cur = name;
            $scope.qqq = name;
            $scope.pay = '0';
            if ($scope.qqq === '余额支付') {
                $scope.pay = '0';
            }
            if ($scope.qqq === '微信支付') {
                $scope.pay = '1';
            }
            if ($scope.qqq === '支付宝支付') {
                $scope.pay = '2';
            }
            if ($scope.qqq === '生成微信支付码') {
                $scope.pay = '3';
            }
            if ($scope.qqq === '生成支付宝支付码') {
                $scope.pay = '4';
            }
        };
        $scope.getQhPay = function () {
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
                $scope.pays = resp.data;
                $scope.payId = $scope.pays.qhPayId;
            });
        };
        $scope.getQhPay();
        $scope.payment = function () {
            switch ($scope.pay) {
                case '0':
                    payService.pay($scope.payId, "BALANCE", "main.leasingAsset.record");
                    break;
                case '1':
                    payService.pay($scope.payId, "WEIXIN", "main.leasingAsset.record");
                    break;
                case '2':
                    payService.pay($scope.payId, "ALIPAY", "main.leasingAsset.record");
                    break;
                case '3':
                    payService.scanPay("WEIXIN", $scope.payId).then(function (data) {
                        if (data !== "error") {
                            $scope.codeUrl = data;
                        }
                    });
                    $scope.openBack();
                    $scope.getPayStatus($scope.payId);
                    break;
                case '4':
                    payService.scanPay("ALIAPY", $scope.payId).then(function (data) {
                        if (data !== "error") {
                            $scope.codeUrl = data;
                        }
                    });
                    $scope.openBack();
                    $scope.getPayStatus($scope.payId);
                    break;
            }
        };
        /**
         * 轮询支付状态
         * @param qhPayId
         */
        $scope.getPayStatus = function (qhPayId) {
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
        $scope.openBack = function () {
            $scope.backfall = !$scope.backfall;
        };
        // 回退页面
        $scope.fallbackPage = function () {
            if ($scope.isLogin) {
                $state.go("main.leasingAsset.record", null, {reload: true});
            } else {
                history.back();
            }
        };

    }
})();