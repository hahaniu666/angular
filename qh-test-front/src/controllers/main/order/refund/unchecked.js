

(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单初次申请退货
         */
        $stateProvider.state("main.order.refund.unchecked", {
            url: '/unchecked',
            views: {
                "@": {
                    templateUrl: 'views/main/order/refund/unchecked/index.root.html',
                    controller: uncheckController
                }
            }
        });
    }]);
    uncheckController.$inject=['$scope',  '$state'];
    function uncheckController($scope, $state) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        // 回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();