(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.vip.detail", {
                url: "/detail?id&tab", 
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/vip/detail/index.root.html',
                        controller: vipDetailController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    vipDetailController.$inject = ['$scope', '$http', '$state', 'appConfig', 'alertService', '$httpParamSerializer', 'imgService', '$timeout', 'payService'];
    function vipDetailController($scope, $http, $state, appConfig, alertService, $httpParamSerializer, imgService, $timeout, payService) {
        var vm = this;
        $scope.tab = $state.params.tab;
        $scope.swiper = {};
        // 图片轮播图
        vm.slideImg = imgService.slideImg;
        vm.simpleImg = imgService.simpleImg;
        vm.itemImg = imgService.itemImg;
        vm.imgUrl = appConfig.imgUrl;


        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        if (!$state.params.id) {
            alertService.msgAlert(null, "请选择商品").then(function () {
                vm.fallbackPage();
            });
            return;
        }
        // 获取商品的详细信息
        $http({
            method: "GET",
            url: appConfig.apiPath + "/integral/item?id=" + $state.params.id
        }).then(function (resp) {
            vm.data = resp.data.result;
            $timeout(function () {
                $scope.swiper.update();
            });
        }, function () {
        });
        // 进行判断，然后兑换商品
        vm.exchangeOrder = function (pwd) {
            $http({
                method: "POST",
                url: appConfig.apiPath + '/integral/check',
                data: $httpParamSerializer({
                    id: vm.data.id,
                    password: pwd
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                var data = resp.data;
                if (data.status === "SUCCESS") {
                    alertService.msgAlert(null, "兑换成功");
                    $state.go("main.vip.record", {}, {reload: true});
                } else {
                    $state.go("main.vip.vipOrder", {id: data.id}, {reload: true});
                }
            }, function () {
            });
        };
        // 进行兑换商品
        vm.exchange = function () {
            if (!vm.data.integralShop || !vm.data.levelShop) {
                return;
            }
            if (vm.data.type === "COUPON" || vm.data.type === "CARD") {
                if (!vm.data.payPassword) {
                    $state.go("main.user.setPay",null,{reload:true});
                     return;
                }
                alertService.confirm(null, null, "确认兑换", "取消", "确定").then(function (data) {
                    if (data) {
                        payService.payPassword().then(function (pwd) {
                            vm.exchangeOrder(pwd);
                            vm.payPassword = null;
                        });
                    }
                });

            } else {
                vm.exchangeOrder(null);
            }
        };

    }
})();