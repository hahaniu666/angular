(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.groupOrder.groupOrderDetail", {
                url: "/groupOrderDetail?id&skuId&orgId&lastStap",
                views: {
                    "@": {
                        templateUrl: 'views/main/groupOrder/groupOrderDetail/index.root.html',
                        controller: groupOrderDetailController,
                        controllerAs: "vm"
                    }
                },
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, false);
                    }]
                },
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    groupOrderDetailController.$inject = ['$cookies', '$http', '$state', 'appConfig', 'alertService', '$mdBottomSheet', "imgService", '$filter', '$rootScope', '$interval'];
    function groupOrderDetailController($cookies, $http, $state, appConfig, alertService, $mdBottomSheet, imgService, $filter, $rootScope, $interval) {
        var vm = this;
        $cookies.orgId = '584662c0dc8d4c2a21c37234';
        vm.orgId = $state.params.orgId;
        vm.imgUrl = appConfig.imgUrl;
        vm.slideImg = imgService.slideImg;
        vm.simpleImg = imgService.simpleImg;
        vm.itemImg = imgService.itemImg;
        vm.id = $state.params.id;
        vm.lastStap = $state.params.lastStap;
        vm.skuId = $state.params.skuId;
        vm.rest = {};
        vm.groupWrap = [];
        vm.getData = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/groupBuy/detail",
                params: {
                    activityId: vm.id
                }
            }).then(function (resp) {
                vm.detail = resp.data;
                $rootScope.intervalStop = [];
                for (var i = 0; i < vm.detail.unionGroupOrders.length; i++) {
                    var now = new Date().getTime();
                    var payTime = new Date($filter("date")(vm.detail.unionGroupOrders[i].payTime, "yyyy/MM/dd HH:mm:ss")).getTime();
                    var overTime = payTime + 24 * 60 * 60 * 1000;
                    // 倒计时到零时，停止倒计时
                    var rest = overTime - now;

                    if (vm.detail.unionGroupOrders[i].groupNum - vm.detail.unionGroupOrders[i].curSize > 0 && rest > 0) {
                        vm.groupWrap.push(vm.detail.unionGroupOrders[i]);
                        // console.log(' vm.groupWrap', vm.groupWrap);
                        for (var j = 0; j < vm.groupWrap.length; j++) {
                            vm.groupWrap[j].activityCheck = {};
                            test(j)
                        }
                    }
                    // console.log('payTime===========>>>>>>', payTime);

                }
                // vm.checkSku1 = resp.data.item[0];
            });
        };
        vm.getData();

        vm.skuDetail = {};
        // 缓存该商品的详情
        vm.getSkuDetail = function () {
            // 获取该商品的详情
            $http({
                method: "GET",
                url: appConfig.apiPath + "/item/skuText",
                params: {
                    skuId: $state.params.skuId
                }
            }).then(function (resp) {
                    vm.skuDetail = resp.data;
                }, function () {

                }
            );
        };
        vm.getSkuDetail();

        vm.swiper = {};
        vm.checkSkuDialog = function (ev, buyStatus) {
            $mdBottomSheet.show({
                templateUrl: 'views/main/groupOrder/groupOrderDetail/specDialog/index.root.html',
                parent: '.ks-main',
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false,
                locals: {key: vm.detail.item[0], status: buyStatus},
                controllerAs: "vmd",
                bindToController: true,
                controller: ['alertService', 'appConfig', function (alertService, appConfig) {
                    var vmd = this;
                    //赋值列表数据

                    vmd.imgUrl = appConfig.imgUrl;
                    vmd.detail = vmd.locals.key;
                    vmd.buyStatus = vmd.locals.status;
                    //当前已选中的规格值,spec.value specId为key，id为值
                    vmd.selectSpecs = {};
                    vmd.skuNum = 1;
                    // 默认选取第一个,有skuId则选取对应的SKU
                    vmd.checkedSku = vmd.detail.skuList[0];
                    //默认选中一个
                    for (var i in vmd.checkedSku.specs) {
                        vmd.selectSpecs[vmd.checkedSku.specs[i].id] = vmd.checkedSku.specs[i].propId;
                    }
                    // 计算商品数量。进行加减
                    vmd.skuNumCount = function (num) {
                        vmd.skuNum += num;
                        if (vmd.skuNum == 0) {
                            vmd.skuNum = 1;
                        }
                    };
                    ////点击规格
                    vmd.clickedSpec = function (spec, curValue) {
                        ////原有规格值备份
                        var propIdBak = vmd.selectSpecs[spec.specId];
                        //修改当前规格状态
                        vmd.selectSpecs[spec.specId] = curValue.id;
                        var hasSku = false;
                        //匹配sku
                        for (var i in vmd.detail.skuList) {
                            var sku = vmd.detail.skuList[i];
                            var boo = true;
                            for (var j in sku.specs) {
                                if (vmd.selectSpecs[sku.specs[j].id] != sku.specs[j].propId) {
                                    boo = false;
                                    break;
                                }
                            }
                            if (boo) {
                                vmd.checkedSku = sku;
                                hasSku = true;
                                break;
                            }
                        }
                        if (!hasSku) {
                            alertService.msgAlert("exclamation-circle", "当前规格缺货");
                            vmd.selectSpecs[spec.specId] = propIdBak;
                        }
                    };

                    vmd.cancel = function () {
                        $mdBottomSheet.hide(false);
                    };

                    vmd.checkSubmit = function (status) {
                        //$mdBottomSheet.hide({num: vmd.skuNum});
                        // status==0,是进行加入购物车;
                        // status==1,是进行购买还是确定
                        if (vmd.checkedSku) {
                            $mdBottomSheet.hide({
                                status: status,
                                skus: vmd.checkedSku,
                                num: vmd.skuNum,
                                buyStatus: vmd.buyStatus
                            });
                        } else {
                            alertService.msgAlert("exclamation-circle", "当前商品缺货");
                        }
                    };
                }]
            }).then(function (data) {
                if (data) {
                    vm.skuNum = data.num;
                    vm.checkSku = data.skus;
                    vm.buyStatus = data.buyStatus;
                    vm.itemPayBuy();
                }
            })
        };
        // 对已经计算好的进行购买
        vm.itemPayBuy = function () {
            if (!vm.checkSku.id) {
                return;
            }
            // 判断商品是否已经下架，但是下架的商品返回的库存都是0.二次校验防止出错
            if (vm.checkSku.storage <= 0) {
                alertService.msgAlert("exclamation-circle", "商品已下架");
                return;
            }
            vm.checkOrder();
        };


        //直接下单
        vm.checkOrder = function () {
            if (vm.buyStatus == '2') {
                $http({
                    method: "GET",
                    url: appConfig.apiPath + "/groupOrder/generateOrder ",
                    params: {
                        activityId: vm.id,
                        unionGroupOrderId: '',
                        skuId: vm.checkSku.id,
                        num: vm.skuNum,
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(function (resp) {
                        var data = resp.data;
                        if (data.code === 'SUCCESS') {
                            $state.go("main.groupOrder.groupOrderConfirm", {
                                groupOrderId: data.groupOrderId,
                                orderId: data.orderId,
                                buyStatus: vm.buyStatus,
                                id: vm.id,
                                skuId: vm.skuId,
                                orgId: vm.orgId
                            });
                        }
                        else {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    }, function () {

                    }
                );
            } else if (vm.buyStatus == '1') {
                $http({
                    method: "GET",
                    url: appConfig.apiPath + "/qhOrder/check",
                    params: {
                        sku: vm.checkSku.id,
                        num: vm.skuNum,
                        day: 30,
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(function (resp) {
                        var data = resp.data;
                        if (data.code === 'SUCCESS') {
                            $state.go("main.order.checkOrder", {
                                id: data.orderId
                            }, {reload: true});
                            // $state.go("main.groupOrder.groupOrderConfirm", {
                            //     groupOrderId: data.groupOrderId,
                            //     orderId: data.orderId,
                            //     buyStatus: vm.buyStatus
                            // });
                        }
                    }, function (resp) {
                        var data = resp.data;
                        if (data.code === 'NOT_LOGINED') {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    }
                );
            }
        };

        function test(j) {
            $rootScope.intervalStop[j] = $interval(function () {
                var now = new Date().getTime();
                var payTime = new Date($filter("date")(vm.groupWrap[j].payTime, "yyyy/MM/dd HH:mm:ss")).getTime();
                var overTime = payTime + 24 * 60 * 60 * 1000;
                // 倒计时到零时，停止倒计时
                var rest = overTime - now;
                if (rest <= 0) {
                    vm.groupWrap[j].activityCheck = null;
                    $interval.cancel($rootScope.intervalStop[j]);
                    $rootScope.intervalStop[j] = null;
                    return;
                }
                var leftsecond = parseInt(rest / 1000);
                var day1 = Math.floor(leftsecond / (60 * 60 * 24));
                var hour1 = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
                var minute1 = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour1 * 3600) / 60);
                var second1 = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour1 * 3600 - minute1 * 60);
                vm.groupWrap[j].activityCheck.day = day1;
                vm.groupWrap[j].activityCheck.hour = hour1;
                vm.groupWrap[j].activityCheck.minute = minute1;
                vm.groupWrap[j].activityCheck.second = second1;
            }, 1000);
        }

        //联系客服
        vm.contactService = function () {
            //
            // if (curUser.data.code == 'SUCCESS') {
            //     ysf.config({
            //         uid: curUser.data.userInfo.userId,
            //         name: curUser.data.userInfo.name,
            //         email: curUser.data.userInfo.email,
            //         mobile: curUser.data.userInfo.phone,
            //         // staffid: '123', // 客服id
            //         // groupid: '123' // 客服组id
            //     });
            // }
            //
            // var itemDesc = "";
            // for (var i in  vm.checkSku1.specs) {
            //     itemDesc += vm.checkSku1.specs[i].value + "  ";
            // }
            //
            // ysf.product({
            //     show: 1,                       // 1为打开， 其他参数为隐藏（包括非零元素）
            //     title: vm.checkSku.title,
            //     desc: itemDesc,
            //     picture: appConfig.imgUrl + vm.checkSku1.imgs[0].key,
            //     note: '￥' + ( vm.checkSku1.skuList[0].price / 100.0),
            //     url: appConfig.rootPath + "#/groupOrder/groupOrderDetail?id=" + $state.params.id
            // });
            //ysf.open();
            location.href = ysf.url();
        };

        // 回退页面
        vm.fallbackPage = function () {
            if (vm.lastStap == 'saveLove') {
                $state.go("main.previewTemplate.sayLove", {orgId: '584662c0dc8d4c2a21c37234'}, {reload: true});
            } else if (history.length === 1) {
                $state.go("main.index", {orgId: '584662c0dc8d4c2a21c37234'}, {reload: true});
            } else {
                $state.go("main.index", {orgId: '584662c0dc8d4c2a21c37234'}, {reload: true});
            }
        };
    }
})();