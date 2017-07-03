(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state("main.cart", {
            url: '/cart',
            resolve: {},
            views: {
                "@": {
                    controller: CartController,
                    templateUrl: 'biz/cart/cart.html'
                }
            }
        });
    }]);

    // ----------------------------------------------------------------------------
    CartController.$inject = ['$scope'];
    function CartController($scope) {

        $scope.go = true;
        $scope.changeGo = function () {
            $scope.go = !$scope.go;
            console.log("----------------------"+$scope.go);
        };


        // // iscroll 设置 （有问题，暂时不用）
        // $scope.cartIscrollParam = {
        //     mouseWheel: true,
        //     bounce: true,
        //     scrollY: true,
        //     scrollbars: true,
        //     fadeScrollbars: true,
        //
        //     refreshInterval: 500,
        //     asyncRefreshDelay: 500
        // };
        // iScrollService.state.useIScroll = true;
        // iScrollService.enable();
        // $scope.iScrollState = iScrollService.state;

        // view state
        $scope.vs = {
            cartEmpty: false, // 购物车是否为空
            logined: false  // 是否已经登录
        };


        // 模拟推荐商品
        $scope.recItems = new Array(6);

        // 模拟空购物车中商品
        $scope.cartItems = new Array(6);
        $scope.cartItemCount = 3;


    }

})();