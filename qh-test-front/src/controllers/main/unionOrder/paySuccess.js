(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 支付成功
         */
        $stateProvider.state("main.unionOrder.pay.paySuccess", {
            url: '/pay/paySuccess?price&seq&status&s',
            views: {
                "@": {
                    templateUrl: 'views/main/unionOrder/pay/paySuccess/index.root.html',
                    controller: paySuccessController
                }
            }
        });
    }]);
    paySuccessController.$inject = ['$scope', '$state'];
    function paySuccessController($scope, $state) {
        $scope.qhPay = {};
        $scope.qhPay.price = $state.params.price;
        $scope.qhPay.seq = $state.params.seq;



        // 回退页面
        $scope.fallbackPage = function () {
            $state.go("main.center", null, {reload: true});
        };

    }
})();
