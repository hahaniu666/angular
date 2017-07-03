(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.hotelManage.hotelCart", {
                url: "/hotelCart?userOrg&s",
                views: {
                    "@": {
                        templateUrl: 'views/main/hotelManage/hotelCart/index.root.html',
                        controller: hotelCartController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    hotelCartController.$inject = [ '$http', '$state', 'appConfig', 'alertService', '$httpParamSerializer'];
    function hotelCartController( $http, $state, appConfig, alertService, $httpParamSerializer) {
        var vm = this;
        vm.imgUrl = appConfig.imgUrl;
        vm.tab = 1;
        vm.tabs = function (num) {
            vm.tab = num;
        };
        vm.userOrg = $state.params.userOrg;
        vm.data = {};
        vm.editCartClick = false;
        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else if ($state.params.s) {
                $state.go("main.hotelManage.itemManage", {tab: $state.params.s}, {reload: true});
            } else {
                history.back();
            }
        };
        vm.queryPageCart = function (curPage) {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/cart/cart",
                params: {
                    curPage: curPage,
                    pageSize: appConfig.pageSize,
                    cartType: 'ORG'
                }
            }).then(function (resp) {
                    vm.data = resp.data;
                }, function () {

                }
            );
        };

        vm.edit = function () {
            vm.editCartClick = !vm.editCartClick;
        };

        // 对当前购物车数量进行增加和减少
        vm.add = function (cartItem, count) {

            if (cartItem.num === 1 && count === 0) {
                return;
            }

            if (count === 0) {
                cartItem.num--;
            } else {
                cartItem.num++;
            }
            if (cartItem.num > cartItem.storage) {
                if (count === 0) {
                    cartItem.num++;
                } else {
                    cartItem.num--;
                }
                alertService.msgAlert("cancle", "库存不足");
                return;
            }
            // 非租赁商品是添加购买数量
            var num = cartItem.num;
            // }
            $http({
                method: "POST",
                url: appConfig.apiPath + '/cart/updateNum',
                data: $httpParamSerializer({
                    cartId: vm.data.cartId,
                    skuId: cartItem.skuId,
                    num: num
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function () {
                vm.checkStorage(true);
                vm.calcTotalPrice();
                // 重新计算价格（要求当前商品是选中状态）
            }).error(function () {
                if (count === 0) {
                    cartItem.num++;
                } else {
                    cartItem.num--;
                }
            });
        };
        vm.editNum = function (cartItem) {
            $http({
                method: "POST",
                url: appConfig.apiPath + '/cart/updateNum',
                data: $httpParamSerializer({
                    cartId: vm.data.cartId,
                    skuId: cartItem.skuId,
                    num: cartItem.num
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function () {
                vm.checkStorage(true);
                vm.calcTotalPrice();
                // 重新计算价格（要求当前商品是选中状态）
            }).error(function () {
            });
        };

        vm.queryPageCart(1);

        vm.checkStorage = function (boo) {
            if (vm.data && vm.data.recList) {
                for (var i = 0; i < vm.data.recList.length; i++) {
                    if (!boo) {
                        // 编辑状态可以进行解除 选中
                        if (vm.data.recList[i].storage < vm.data.recList[i].num) {
                            vm.data.recList[i].isSelected = true;
                            vm.data.recList[i].selected = false;
                        } else {
                            vm.data.recList[i].isSelected = false;
                        }
                    } else {
                        vm.data.recList[i].isSelected = false;
                    }
                }
            }
            ;
            // 重新计算一下 防止出错
            vm.calcTotalPrice();
        };

        vm.numberTotal = 0;
        vm.totalPrice = 0;
        // 重新计算价格（要求当前商品是选中状态）
        vm.calcTotalPrice = function (boo) {
            var totalPrice = 0;
            var numberTotal = 0;
            if (vm.data && vm.data.recList) {
                for (var i = 0; i < vm.data.recList.length; i++) {
                    var cartItem = vm.data.recList[i];
                    if (cartItem.selected) {
                        if (cartItem.activity && cartItem.activity.name) {
                            totalPrice += cartItem.activity.price * cartItem.num;
                        } else {
                            totalPrice += cartItem.price * cartItem.num;
                        }
                        numberTotal += 1;
                    }
                }
            }
            vm.numberTotal = numberTotal;
            vm.totalPrice = totalPrice;
            // 选择全选的则不用在进来判断了
            if (!boo) {
                vm.clickAllChanged();
            }
        };
        vm.allSelected = false;
        // 判断全选是否已经选择中
        vm.clickAllChanged = function () {
            var boo = true;
            if (vm.data && vm.data.recList) {
                for (var i = 0; i < vm.data.recList.length; i++) {
                    if (!vm.data.recList[i].selected) {
                        boo = false;
                        break;
                    }
                }
            }
            vm.allSelected = boo;
        };

        //对当前商品进行全选
        // 是否全部选中
        vm.allSelected = false;
        vm.selectAllChanged = function () {
            if (vm.data && vm.data.recList) {
                for (var i = 0; i < vm.data.recList.length; i++) {
                    if (vm.data.recList[i].isSelected) {
                        continue;
                    }
                    if (vm.allSelected === true) {
                        vm.data.recList[i].selected = true;
                    } else if (vm.allSelected === false) {
                        vm.data.recList[i].selected = false;
                    }
                }
            }
            vm.calcTotalPrice(true);
        };

        vm.removeOrCreate = function (ev) {
            if (vm.editCartClick) {
                vm.removeCartItem(ev);
            } else {
                vm.orderCreate();
            }
        };

        //移除购物车商品
        vm.removeCartItem = function () {
            var skuId = [];
            if (vm.data.recList) {
                for (var i = 0; i < vm.data.recList.length; i++) {
                    if (vm.data.recList[i].selected) {
                        skuId.push(vm.data.recList[i].skuId);
                    }
                }
            }
            if (skuId.length < 1) {
                alertService.msgAlert("exclamation-circle", "请选择要删除的商品!");
                return;
            }
            var cartId = vm.data.cartId;
            alertService.confirm(null, null, "确认删除", "取消", "确认").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/cart/removeItem',
                        data: $httpParamSerializer({
                            cartId: cartId,
                            skuId: skuId,
                            type: "ORG"
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        notShowError: true
                    }).success(function () {
                            vm.numberTotal = 0;
                            vm.totalPrice = 0;
                            vm.queryPageCart(1, true);
                        })
                        .error(function () {
                            vm.numberTotal = 0;
                            vm.totalPrice = 0;
                        });
                }
            });

        };

        // 生成订单
        vm.orderCreate = function () {
            var skuIds = [];
            if (vm.data.recList) {
                for (var i = 0; i < vm.data.recList.length; i++) {
                    if (vm.data.recList[i].selected) {
                        skuIds.push(vm.data.recList[i].skuId);
                    }
                }
            }
            if (skuIds.length === 0) {
                alertService.msgAlert("exclamation-circle", "您还没有选择任何商品哦");
                return;
            }
            $http({
                method: "POST",
                url: appConfig.apiPath + "/managerOrder/check",
                data: $httpParamSerializer({
                    cartId: vm.data.cartId,
                    skuIds: skuIds,
                    num: vm.skuNum,
                    userOrg: vm.userOrg
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                    var data = resp.data;
                    if (data.code === 'SUCCESS') {
                        var orgOrder = data.orgOrder;
                        var unionId = data.orderId;
                        $state.go("main.hotelManage.hotelSettle", {id: orgOrder, unionId: unionId});
                    }
                }, function () {

                }
            );
        };
    }
})();