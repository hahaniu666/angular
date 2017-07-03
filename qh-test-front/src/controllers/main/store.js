(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.store", {
                url: "/store",
                views: {
                    "@": {
                        templateUrl: 'views/main/store/index.root.html',
                        controller: storeController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    storeController.$inject = ['$scope', '$state', 'appConfig', 'imgService', '$http'];
    function storeController($scope, $state, appConfig, imgService, $http) {
        var vm = this;
        vm.appConfig = appConfig;
        vm.imgService = imgService;
        vm.backdrop = false;
        vm.orderList = {};

        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        // 展示子商品
        vm.showOrder = function (obj) {
            if (vm.STOrder) {
                // 初始化点击的子商品
                for (var i = 0; i < vm.STOrder.modeList.length; i++) {
                    vm.STOrder.modeList[i].selectd = false;
                }
            }
            vm.STOrder = null;
            vm.backdrop = !vm.backdrop;
            if (obj) {
                vm.STOrder = obj;
            }
            // 初始化订单的数据
            vm.orderList = {};
            vm.totalPrice = 0;
        };
        vm.getTypeList = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/clean/category?curPage=1&pageSize=20"
            }).then(function (resp) {
                vm.data = resp.data;
            });
        };
        vm.getTypeList();
        // 总价格
        vm.totalPrice = 0;
        //选取的指令
        $scope.nos = [];
        //添加购物车
        vm.addList = function (obj) {
            var nos = vm.orderList[vm.STOrder.id];
            obj.selectd = !obj.selectd;
            if (nos) {
                for (var i = 0; i < $scope.nos.length; i++) {
                    if ($scope.nos[i] === obj.no && !obj.selectd) {
                        $scope.nos.splice(i, 1);
                        vm.totalPrice = vm.totalPrice - obj.price;
                        vm.orderList[vm.STOrder.id] = $scope.nos;
                        vm.reduce();
                        return;
                    }
                }
            }
            $scope.nos.push(obj.no);
            vm.orderList[vm.STOrder.id] = $scope.nos;
            vm.totalPrice = vm.totalPrice + obj.price;
            vm.reduce();
        };
        vm.reduce = function () {
            vm.showPrice = 0;
            var temp = 0;
            var _p = 0;
            var p = vm.totalPrice;
            var lg = vm.data.reduceList;
            for (var j = 0; j < lg.length; j++) {
                if (temp < lg[j].requeryMoney && p >= lg[j].requeryMoney) {
                    temp = lg[j].requeryMoney;
                    _p = lg[j].reduceMoney;
                }
            }
            vm.showPrice = p - _p;
        };
        /**
         * 进行下单
         */
        vm.checkOrder = function () {
            var json = angular.toJson(vm.orderList);
            $http({
                method: "GET",
                url: appConfig.apiPath + "/qhOrder/check?clean=" + json
            }).then(function (resp) {
                var data = resp.data;
                $state.go("main.order.checkOrder", {id: data.orderId}, {reload: true});
            },function (resp) {
                if(resp.data.code==='NOT_LOGINED'){
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
    }
})();