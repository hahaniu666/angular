(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.vip.orderDetail", {
                url: "/orderDetail?id",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/vip/orderDetail/index.root.html',
                        controller: orderDetailController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    orderDetailController.$inject = ['$scope', '$http', '$state', 'appConfig', 'alertService', '$httpParamSerializer', 'imgService'];
    function orderDetailController($scope, $http, $state, appConfig, alertService, $httpParamSerializer, imgService) {
        var vm = this;
        $scope.swiper = {};
        // 图片轮播图
        vm.slideImg = imgService.slideImg;
        vm.simpleImg = imgService.simpleImg;
        vm.itemImg = imgService.itemImg;
        vm.imgUrl = appConfig.imgUrl;
        //定义头部订单状态默认属性
        $scope.classActive = {
            css: [false, false, false, false]
        };
        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        // 初始化订单
        vm.initOrder = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/integral/orderDetail?id=" + $state.params.id
            }).then(function (resp) {
                if (resp.data.code === 'SUCCESS') {
                    vm.data = resp.data.result;
                    vm.goStatus(vm.data.status);
                }
            });

        };
        vm.initOrder();
        vm.goStatus = function (status) {
            $scope.classActive.css = [false, false, false, false];
            if (status === 'UNSHIPPED') {
                //待发货 已支付
                vm.num = 1;
            } else if (status === 'SUCCESS') {
                //完成
                vm.num = 3;
            } else if (status === 'UNRECEIVED') {
                //待收货 已发货
                vm.num = 2;
            } else {
                vm.num = 0;
            }
            for (var i = 0; i <= vm.num; i++) {
                $scope.classActive.css[i] = true;
            }
        };
        //查看附近门店
        vm.searchShops = function () {
            $state.go("main.vip.baiduMap", {id: vm.data.item.id}, {reload: true});
        };
        // 确认收货
        vm.confirm = function () {
            alertService.confirm(null, null, "确认收货", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/integral/confirm',
                        data: $httpParamSerializer({
                            id: vm.data.id
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function (resp) {
                        var data = resp.data;
                        vm.data.status = data.status;
                        vm.goStatus(vm.data.status);
                    }, function () {
                    });
                }
            });
        };
    }
})();