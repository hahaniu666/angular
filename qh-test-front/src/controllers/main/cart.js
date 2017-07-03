(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state("main.cart", {
            url: '/cart',
            views: {
                "@": {
                    templateUrl: 'views/main/cart/index.root.html',
                    controller: CartController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    // ----------------------------------------------------------------------------
    CartController.$inject = ['alertService', '$scope', '$http', '$state', '$httpParamSerializer', '$rootScope', '$interval', '$filter', 'appConfig', 'imgService', '$timeout'];
    function CartController(alertService, $scope, $http, $state, $httpParamSerializer, $rootScope, $interval, $filter, appConfig, imgService, $timeout) {
        var vm = this;
        vm.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        vm.gotoTop();

        vm.login = function () {
            var url = window.location.href;
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                // 微信浏览器内直接进行微信登陆
                $http
                    .get(appConfig.apiPath + '/weiXin/wxOauthLogin?backUrl=' + encodeURIComponent(url))
                    .success(function (data) {
                        window.location.href = data.uri;
                    });
                return;
            }
            $state.go("main.newLogin", {backUrl: window.location.href});
        };

        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };

        vm.simpleImg = imgService.simpleImg;
        // 定义页面中使用的参数
        vm.pageSize = appConfig.pageSize;  // 每页显示多少条记录
        vm.numberTotal = 0; // 当前选中多少记录
        vm.totalPrice = 0;  //当前总价
        vm.maxSize = appConfig.maxSize; // 每页多条数据
        vm.imgUrl = appConfig.imgUrl; // 定义图片的URL
        // 不阻塞首页的界面的加载

        vm.noLogin = true;
        $http.get(appConfig.apiPath + '/user/userInfo', {
            skipGlobalErrorHandler: false,
            showLoginError: false,
            notShowError: false,
            timeout: 10000
        }).then(function (resp) {
            vm.curUser = resp.data;
            //  如果已经登陆 则把旁边的进行显示
            vm.noLogin = false;
        }, function (resp) {
            vm.curUser = resp.data;
            vm.noLogin = true;
        });


        // 订单待付款计算离今天还有多少时间，24小时自动取消
        vm.startTime = function () {
            $rootScope.intervalStop = $interval(function () {
                var date = new Date().getTime();
                if (!vm.cart.recList) {
                    $interval.cancel($rootScope.intervalStop);//解除计时器
                    $rootScope.intervalStop = null;
                }
                for (var i = 0; i < vm.cart.recList.length; i++) {
                    //限时特价
                    if (vm.cart.recList[i].activity) {
                        var oldDate = new Date($filter("date")(vm.cart.recList[i].activity.deadTime, "yyyy/MM/dd HH:mm:ss")).getTime();
                        // 倒计时到零时，停止倒计时
                        var rest = oldDate - date;
                        if (rest <= 0) {
                            vm.cart.recList[i].activity.lastUpdatedTime = "已超时";
                            continue;
                        }
                        var days = parseInt(rest / (24 * 3600 * 1000));
                        //计算出小时数
                        var leave1 = rest % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
                        var hours = Math.floor(leave1 / (3600 * 1000));
                        //计算相差分钟数
                        var leave2 = rest % (3600 * 1000);        //计算小时数后剩余的毫秒数
                        var minutes = Math.floor(leave2 / (60 * 1000));

                        //计算相差秒数
                        var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
                        var seconds = Math.round(leave3 / 1000);
                        vm.cart.recList[i].activity.lastUpdatedTime = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
                    }
                    //满减满赠
                    if (vm.cart.recList[i].activitys) {
                        var oldDate1 = new Date($filter("date")(vm.cart.recList[i].activitys.deadTime, "yyyy/MM/dd HH:mm:ss")).getTime();
                        // 倒计时到零时，停止倒计时
                        var rest1 = oldDate1 - date;
                        if (rest1 <= 0) {
                            vm.cart.recList[i].activitys.lastUpdatedTime1 = "已超时";
                            continue;
                        }
                        var days1 = parseInt(rest1 / (24 * 3600 * 1000));
                        //计算出小时数
                        var leave11 = rest1 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
                        var hours1 = Math.floor(leave11 / (3600 * 1000));
                        //计算相差分钟数
                        var leave21 = rest1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
                        var minutes1 = Math.floor(leave21 / (60 * 1000));

                        //计算相差秒数
                        var leave31 = leave21 % (60 * 1000);      //计算分钟数后剩余的毫秒数
                        var seconds1 = Math.round(leave31 / 1000);
                        vm.cart.recList[i].activitys.lastUpdatedTime1 = days1 + "天" + hours1 + "小时" + minutes1 + "分" + seconds1 + "秒";
                    }
                }
            }, 1000);
        };

        // 获取我的购物车数据
        vm.cart = {};
        // 用户为收藏产品的时候进行推荐
        vm.queryHotItem = function () {
            $http.get(appConfig.apiPath + '/item/hotItem', {notShowError: true})
                .success(function (data) {
                    vm.hotItem = data.recList;
                }).error(function () {
                //当获取我的购物车数据时候 为error的时候。购物车数据为空的时候
            });
        };

        /*      vm.testAdd = function () {
         var skuData = new Array({
         skuId: '57062d72f14c50e774e2d570',
         num: 2,
         day: 2
         }, {
         skuId: '5721aacdf14c9e23f2fe4d1a',
         num: 2,
         day: 2
         }, {
         skuId: '56526e91f14cc89a51a77b62',
         num: 2,
         day: 2
         });
         // 加入购物车中
         $http
         .post(appConfig.apiPath + '/cart/add', {data: skuData, type: "cart"})
         .success(function () {
         // 获取购物车数量有多少个SKU
         $http
         .get(appConfig.apiPath + "/cart/cartNum")
         .success(function (data) {
         alertService.msgAlert("success", "加入购物车成功");
         $scope.cartSize = data;
         });
         }).error(function (data) {
         if (data.code === "NOT_LOGINED") {
         $scope.notLogin();
         }
         });
         }*/

        // 购物车是不是有商品
        vm.queryPageCart = function (curPage, boo) {
            $http.get(appConfig.apiPath + '/cart/cart?curPage=' + curPage + '&pageSize=' + vm.pageSize, {notShowError: true})
                .success(function (data) {
                    /**
                     * 对数据进行添加 而不是覆盖
                     */
                    if (vm.cart.cartId && !boo) {
                        vm.cart.recList = data.recList;
                    } else {
                        vm.cart = data;
                        vm.cart.item = [];
                        vm.cart.rentItem = [];
                        vm.cart.service = [];
                    }
                    if (vm.cart.recList.length > 0) {
                        // 有商品才进行排序
                        /**
                         * 将后台传过来的商品进行分类
                         */
                        vm.cartNotNull = true;
                        for (var i = 0; i < vm.cart.recList.length; i++) {
                            if (vm.cart.recList[i].type === 'QUILT' ||
                                vm.cart.recList[i].type === 'QUILT_COVER') {
                                if (vm.cart.recList[i].storage < 1) {
                                    vm.cart.recList[i].isSelected = true;
                                }
                                vm.cart.item.push(vm.cart.recList[i]);
                            } else if (vm.cart.recList[i].type === 'RENT_QUILT' ||
                                vm.cart.recList[i].type === 'STUDENT_RENT') {
                                vm.cart.rentItem.push(vm.cart.recList[i]);
                            } else if (vm.cart.recList[i].type === 'SERVICE') {
                                vm.cart.service.push(vm.cart.recList[i]);
                            }
                            /**
                             * 放入后，删除原有的数据
                             */
                            vm.cart.recList.splice(i, 1);
                            i--;
                        }
                        vm.calcTotalPrice();
                    } else {
                        vm.cartNotNull = false;
                        // 购物车没有商品，进行推荐热门
                        vm.queryHotItem();
                    }
                    /**
                     * 计算好页数
                     * @type {Number}
                     */
                    var page = parseInt(vm.cart.totalCount / vm.cart.pageSize);
                    if (vm.cart.totalCount % vm.cart.pageSize > 0) {
                        page++;
                    }
                    if (page <= vm.cart.curPage) {
                        vm.cart.pageEnd = true;
                    } else {
                        vm.cart.curPage = vm.cart.curPage + 1;
                    }
                    vm.checkStorage();
                    vm.calcTotalPrice();
                })
                .error(function () {
                    //当获取我的购物车数据时候 为error的时候。购物车数据为空的时候
                    vm.cart = {};
                    vm.cart.resList = [];
                    vm.cartNotNull = false;
                    vm.queryHotItem();
                });


        };
        vm.queryPageCart(1); //初始化分页
        // 租赁商品的增加天数
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
                    cartId: vm.cart.cartId,
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
                    cartId: vm.cart.cartId,
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
        }
        // 判断库存是否足，可以进行选中
        vm.checkStorage = function (boo) {
            if (vm.cart && vm.cart.item) {
                for (var i = 0; i < vm.cart.item.length; i++) {
                    if (!boo) {
                        // 编辑状态可以进行解除 选中
                        if (vm.cart.item[i].storage < vm.cart.item[i].num) {
                            vm.cart.item[i].isSelected = true;
                            vm.cart.item[i].selected = false;
                        } else {
                            vm.cart.item[i].isSelected = false;
                        }
                    } else {
                        vm.cart.item[i].isSelected = false;
                    }
                }
            }
            ;
            if (vm.cart && vm.cart.service) {
                for (var i = 0; i < vm.cart.service.length; i++) {
                    if (!boo) {
                        // 编辑状态可以进行解除 选中
                        if (vm.cart.service[i].storage < vm.cart.service[i].num) {
                            vm.cart.service[i].isSelected = true;
                            vm.cart.service[i].selected = false;
                        } else {
                            vm.cart.service[i].isSelected = false;
                        }
                    } else {
                        vm.cart.service[i].isSelected = false;
                    }
                }
            }
            if (vm.cart && vm.cart.rentItem) {
                for (var i = 0; i < vm.cart.rentItem.length; i++) {
                    if (!boo) {
                        // 编辑状态可以进行解除 选中
                        if (vm.cart.rentItem[i].storage < vm.cart.rentItem[i].num) {
                            vm.cart.rentItem[i].isSelected = true;
                            vm.cart.rentItem[i].selected = false;
                        } else {
                            vm.cart.rentItem[i].isSelected = false;
                        }
                    } else {
                        vm.cart.rentItem[i].isSelected = false;
                    }
                }
            }
            // 重新计算一下 防止出错
            vm.calcTotalPrice();
        }
        // 重新计算价格（要求当前商品是选中状态）
        vm.calcTotalPrice = function (boo) {
            var totalPrice = 0;
            var numberTotal = 0;
            if (vm.cart && vm.cart.item) {
                for (var i = 0; i < vm.cart.item.length; i++) {
                    var cartItem = vm.cart.item[i];
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
            if (vm.cart && vm.cart.rentItem) {
                for (var y = 0; y < vm.cart.rentItem.length; y++) {
                    var rentItem = vm.cart.rentItem[y];
                    if (rentItem.selected) {
                        if (rentItem.activity && rentItem.activity.name) {
                            totalPrice += rentItem.activity.price * rentItem.day * rentItem.num;
                        } else {
                            totalPrice += rentItem.price * rentItem.day * rentItem.num;
                        }
                        numberTotal += 1;
                    }
                }
            }
            if (vm.cart && vm.cart.service) {
                for (var y = 0; y < vm.cart.service.length; y++) {
                    var service = vm.cart.service[y];
                    if (service.selected) {
                        if (service.activity && service.activity.name) {
                            totalPrice += service.activity.price * service.num;
                        } else {
                            totalPrice += service.price * service.num;
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
        // 判断全选是否已经选择中
        vm.clickAllChanged = function () {
            var boo = true;
            if (vm.cart && vm.cart.item) {
                for (var i = 0; i < vm.cart.item.length; i++) {
                    if (!vm.cart.item[i].selected) {
                        boo = false;
                        break;
                    }
                }
            }
            // 循环下一个，同时保证上一个是已经全部选中的结果
            if (vm.cart && vm.cart.service && boo) {
                for (var i = 0; i < vm.cart.service.length; i++) {
                    if (!vm.cart.service[i].selected) {
                        boo = false;
                        break;
                    }
                }
            }
            // 循环下一个，同时保证上一个是已经全部选中的结果
            if (vm.cart && vm.cart.rentItem && boo) {
                for (var i = 0; i < vm.cart.rentItem.length; i++) {
                    if (!vm.cart.rentItem[i].selected) {
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
            if (vm.cart && vm.cart.item) {
                for (var i = 0; i < vm.cart.item.length; i++) {
                    if (vm.cart.item[i].isSelected) {
                        continue;
                    }
                    if (vm.allSelected === true) {
                        vm.cart.item[i].selected = true;
                    } else if (vm.allSelected === false) {
                        vm.cart.item[i].selected = false;
                    }
                }
            }
            if (vm.cart && vm.cart.service) {
                for (var i = 0; i < vm.cart.service.length; i++) {
                    if (vm.cart.service[i].isSelected) {
                        continue;
                    }
                    if (vm.allSelected === true) {
                        vm.cart.service[i].selected = true;
                    } else if (vm.allSelected === false) {
                        vm.cart.service[i].selected = false;
                    }
                }
            }
            if (vm.cart && vm.cart.rentItem) {
                for (var i = 0; i < vm.cart.rentItem.length; i++) {
                    if (vm.cart.rentItem[i].isSelected) {
                        continue;
                    }
                    if (vm.allSelected === true) {
                        vm.cart.rentItem[i].selected = true;
                    } else if (vm.allSelected === false) {
                        vm.cart.rentItem[i].selected = false;
                    }
                }
            }
            vm.calcTotalPrice(true);
        };

        ///////////////////////////  对购物车进行编辑
        vm.editCartClick = {name: "编辑", click: false, button: "去结算"};
        vm.editCart = function () {
            if (vm.editCartClick.click) {
                vm.editCartClick.click = false;
                vm.editCartClick.name = "编辑";
                vm.editCartClick.button = "去结算";
                vm.checkStorage(false);
            } else {
                vm.editCartClick.click = true;
                vm.editCartClick.name = "完成";
                vm.editCartClick.button = "删除";
                vm.checkStorage(true);
            }
        };

        //移除购物车商品
        vm.removeCartItem = function (ev) {
            var skuId = [];
            if (vm.cart.item) {
                for (var i = 0; i < vm.cart.item.length; i++) {
                    if (vm.cart.item[i].selected) {
                        skuId.push(vm.cart.item[i].skuId);
                    }
                }
            }
            if (vm.cart.service) {
                for (var i = 0; i < vm.cart.service.length; i++) {
                    if (vm.cart.service[i].selected) {
                        skuId.push(vm.cart.service[i].skuId);
                    }
                }
            }
            if (vm.cart.rentItem) {
                for (var i = 0; i < vm.cart.rentItem.length; i++) {
                    if (vm.cart.rentItem[i].selected) {
                        skuId.push(vm.cart.rentItem[i].skuId);
                    }
                }
            }
            if (skuId.length < 1) {
                alertService.msgAlert("exclamation-circle", "请选择要删除的商品!");
                return;
            }
            var cartId = vm.cart.cartId;
            alertService.confirm(null, null, "确认删除", "取消", "确认").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/cart/removeItem',
                        data: $httpParamSerializer({
                            cartId: cartId,
                            skuId: skuId
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        notShowError: true
                    }).success(function () {
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
            var skuIndex = 0;
            if (vm.cart && vm.cart.item) {
                for (var i = 0; i < vm.cart.item.length; i++) {
                    var cartItem = vm.cart.item[i];
                    if (cartItem.selected) {
                        skuIds[skuIndex] = cartItem.skuId;
                        skuIndex++;
                    }
                }
            }
            if (vm.cart && vm.cart.rentItem) {
                for (var f = 0; f < vm.cart.rentItem.length; f++) {
                    if (vm.cart.rentItem[f].selected) {
                        skuIds[skuIndex] = vm.cart.rentItem[f].skuId;
                        skuIndex++;
                    }
                }
            }
            if (vm.cart && vm.cart.service) {
                for (var z = 0; z < vm.cart.service.length; z++) {
                    if (vm.cart.service[z].selected) {
                        skuIds[skuIndex] = vm.cart.service[z].skuId;
                        skuIndex++;
                    }
                }
            }
            if (skuIds.length === 0) {
                alertService.msgAlert("exclamation-circle", "您还没有选择任何商品哦");
                return;
            }
            var skuId = "";
            for (var b = 0; b < skuIds.length; b++) {
                skuId += "&skuIds=" + skuIds[b];
            }
            var url = "cartId=" + vm.cart.cartId + skuId;
            // 获取该商品的属性
            $http.get(appConfig.apiPath + "/qhOrder/check?" + url)
                .then(function (resp) {

                    if (resp.data.code === "NOT_ORG") {

                        alertService.msgAlert("exclamation-circle", "请提交学生资质");
                        $timeout(function () {
                            $state.go("main.leaseApplication.leaseFirst");
                        }, 500);
                    }
                    else {
                 
                        // 直接进行购买
                        $state.go("main.order.checkOrder", {
                            id: resp.data.orderId
                        }, {reload: true});
                    }
                }, function (resp) {
                    if (resp.data.code === "NOT_LOGINED") {
                        $state.go("main.newLogin", {backUrl: window.location.href});
                    }
                });
            return;
        };
        vm.removeOrCreate = function (ev) {
            if (vm.editCartClick.click) {
                vm.removeCartItem(ev);
            } else {
                vm.orderCreate();
            }
        };
    }
})();