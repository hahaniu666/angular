(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单付款
         */
        $stateProvider.state("main.leasingAsset.hotelMethod", {
            url: '/payMethod?paySize&id',
            views: {
                "@": {
                    templateUrl: 'views/main/leasingAsset/hotelMethod/index.root.html',
                    controller: hotelMethodController
                }
            }
        });
    }]);
    hotelMethodController.$inject = ['$scope', '$state', '$stateParams'];
    function hotelMethodController($scope, $state, $stateParams) {

        $scope.payType = $stateParams.payType;
        $scope.paySize = $state.params.paySize;
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.id = $state.params.id;
        $scope.list = [
            {
                name: '支付宝支付',
                icon: 'ks-alipay'
            }
        ];
        $scope.state = {};
        var cur = null;
        // ios APP下面,对于没有安装微信的sdk方法,进行隐藏
        // window.cordova
        if (window.cordova) {
            // 默认付款方式
            if ($scope.payType == undefined) {
                $scope.payType = '支付宝支付';
            }
            $scope.state['支付宝支付'] = true;
            // 选中的支付方式
            cur = '支付宝支付';
            $scope.qqq = '支付宝支付';
            $scope.pay = 2;

            //cordova.platformId === 'ios'
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
            // 默认付款方式
            $scope.state['微信支付'] = true;
            // 选中的支付方式
            cur = '微信支付';
            $scope.qqq = '微信支付';
            $scope.pay = 1;

            if ($scope.payType == undefined) {
                $scope.payType = '支付宝支付';
            }
        }
        if ($scope.paySize) {
            switch ($scope.paySize) {
                case "0":
                    $scope.payType = "余额支付";
                    break;
                case "1":
                    $scope.payType = "微信支付";
                    break;
                case "2":
                    $scope.payType = "支付宝支付";
                    break;
                case "3":
                    $scope.payType = "生成微信支付码";
                    break;
                case "4":
                    $scope.payType = "生成支付宝支付码";
                    break;
            }
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
            $scope.pay = 0;
            if ($scope.qqq === '余额支付') {
                $scope.pay = 0;
            }
            if ($scope.qqq === '微信支付') {
                $scope.pay = 1;
            }
            if ($scope.qqq === '支付宝支付') {
                $scope.pay = 2;
            }
            if ($scope.qqq === '生成微信支付码') {
                $scope.pay = 3;
            }
            if ($scope.qqq === '生成支付宝支付码') {
                $scope.pay = 4;
            }

        };

        $scope.choose($scope.payType);

        $scope.submit = function () {
            $state.go("main.leasingAsset.pay", {
                id: $scope.id,
                paySize: $scope.pay
            }, {reload: true});
        };

        // 回退页面
        $scope.fallbackPage = function () {
            if ($state.params.s === 'fx') {
                $state.go("main.index", null, {reload: true});
            } else {
                if (history.length === 1) {
                    $state.go("main.index", null, {reload: true});
                } else {
                    history.back();
                }
            }

        };
    }
})();


