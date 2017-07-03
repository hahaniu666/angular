(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单付款
         */
        $stateProvider.state("main.paymentMethod", {
            url: '/paymentMethod',
            views: {
                "@": {
                    templateUrl: 'views/main/paymentMethod/index.root.html',
                    controller: paymentMethodController
                }
            }
        });
    }]);
    paymentMethodController.$inject = ['$scope', '$state'];
    function paymentMethodController($scope, $state) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();

        $scope.list = [
            {
                name: '余额支付',
                icon: 'ks-rmb-symbol'
            },
            {
                name: '微信支付',
                icon: 'ks-weixin'
            },
            {
                name: '支付宝支付',
                icon: 'ks-alipay'
            },
            {name: 'd'},
            {name: 'e'},
            {name: 'f'}
        ];
        $scope.state = {};
        for (var tmp in $scope.list) {
            var bb = $scope.list[tmp];
            $scope.state[bb.name] = false;
        }
        // 默认付款方式
        $scope.state['余额支付'] = true;
        for (tmp in $scope.list) {
            bb = $scope.list[tmp];
        }
        // 选中的支付方式
        var cur = '余额支付';
        $scope.qqq = '余额支付';
        $scope.choose = function (name) {
            $scope.state[cur] = false;
            $scope.state[name] = true;
            cur = name;
            $scope.qqq = name;
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