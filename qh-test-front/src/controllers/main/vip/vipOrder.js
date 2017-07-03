(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.vip.vipOrder", {
                url: "/vipOrder?id",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/vip/vipOrder/index.root.html',
                        controller: vipOrderController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    vipOrderController.$inject = ['$scope', '$http', '$state', 'appConfig', 'alertService', '$httpParamSerializer', 'imgService', 'payMenthod', 'payService'];
    function vipOrderController($scope, $http, $state, appConfig, alertService, $httpParamSerializer, imgService, payMenthod, payService) {
        var vm = this;
        // 图片轮播图
        vm.slideImg = imgService.slideImg;
        vm.simpleImg = imgService.simpleImg;
        vm.itemImg = imgService.itemImg;
        vm.imgUrl = appConfig.imgUrl;
        vm.select = true;
        vm.changeSelect = function () {
            vm.select = !vm.select;
        };
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
        vm.payMenthod = payMenthod;
        // 获取商品的详细信息
        $http({
            method: "GET",
            url: appConfig.apiPath + "/integral/orderDetail?id=" + $state.params.id
        }).then(function (resp) {
            vm.data = resp.data.result;
            if (vm.data.status !== 'UNCOMMITED') {
                $state.go("main.newVip", {}, {});
                return;
            }
            if (!vm.payMenthod.pay) {
                if (vm.data.integral > 0) {
                    vm.payMenthod.pay = payService.JF_PAY;
                } else {
                    // 判断 如果是app当中的，有安装微信，则使用微信支付，没有安装微信，则使用支付宝支付
                    vm.payMenthod.pay = payService.RMB;
                }
            }
        }, function () {
        });
        //去收货地址
        vm.updateAddress = function () {
            $state.go("main.address", {s: "vipOrder", orderId: $state.params.id}, {reload: true});
        };
        //去选择支付方式
        vm.changePay = function () {
            vm.payMenthod.item = {
                integral: vm.data.integral,
                price: vm.data.price,
                accountIntegral: vm.data.account.integral
            };
            $state.go("main.vip.pay", null, null);
        };
        // 查看附近的门店
        vm.orgAddress = function () {
            $state.go("main.vip.baiduMap", {id: vm.data.item.id}, {reload: true});
        };
        // 进行支付订单
        vm.createOrder = function () {
            if (!vm.select) {
                alertService.msgAlert("ks-exclamation-circle", "您未同意协议");
                return;
            }
            //如果没收货地址就直接去新增收获地址
            if (vm.data.item.type === 'ITEM' && (!vm.data.address || vm.data.address === null)) {
                vm.updateAddress();
                return;
            }
            // 如果是钱币支付和余额支付需要输入支付密码
            if (vm.payMenthod.pay.payType === "JF_PAY") {
                if (!vm.data.payPassword) {
                    $state.go("main.user.setPay", null, {reload: true});
                    return;
                }
                payService.payPassword().then(function (pwd) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/integral/create',
                        data: $httpParamSerializer({
                            id: vm.data.id,
                            password: pwd
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function (resp) {
                        if (resp.data.code === 'ERROR') {
                            alertService.confirm(null, "", resp.data.msg, "重新输入", "忘记密码").then(function (data) {
                                if (data) {
                                    $state.go("main.user.setPay", {status: 0});     //跳去忘记密码页
                                } else {
                                    vm.createOrder();
                                }
                            });
                        } else if (resp.data.code === 'SUCCESS') {
                            $state.go("main.vip.record", {}, {});
                        }
                    }, function () {
                    });
                });
            } else {
                $http({
                    method: "POST",
                    url: appConfig.apiPath + '/integral/create',
                    data: $httpParamSerializer({
                        id: vm.data.id,
                        payType: "QH_PAY"
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(function (resp) {
                    $state.go("main.pay", {payId: resp.data.qhPay, s: "main.vip"});
                }, function () {
                });

            }
            vm.payPassword = null;
        };


        /**
         * 协议
         */
        vm.goRentPage = function () {
            $state.go("main.vip.vipOrder.agreement");
        };
    }
})();