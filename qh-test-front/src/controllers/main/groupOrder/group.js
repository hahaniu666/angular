(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.groupOrder.group", {
                url: "/group?unionGroupOrderId&id&payId&skuId&orgId&fromLocal",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/groupOrder/group/index.root.html',
                        controller: groupController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    groupController.$inject = ['$rootScope', '$http', '$state', 'appConfig', 'alertService', '$mdBottomSheet', "imgService", '$interval', '$filter', '$cookies'];
    function groupController($rootScope, $http, $state, appConfig, alertService, $mdBottomSheet, imgService, $interval, $filter, $cookies) {
        var vm = this;
        $cookies.orgId = '584662c0dc8d4c2a21c37234';
        vm.unionGroupOrderId = $state.params.unionGroupOrderId;
        vm.id = $state.params.id;
        vm.qhPayId = $state.params.payId;
        vm.skuId = $state.params.skuId;
        vm.orgId = $state.params.orgId;
        vm.fromLocal = $state.params.fromLocal;
        vm.imgUrl = appConfig.imgUrl;
        vm.slideImg = imgService.slideImg;
        vm.simpleImg = imgService.simpleImg;
        vm.itemImg = imgService.itemImg;

        console.log(vm.fromLocal);
        $rootScope.intervalStop = [];

        vm.getDetail = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/groupOrder/groupStatus",
                params: {
                    unionGroupOrderId: vm.unionGroupOrderId,
                    qhPayId: vm.qhPayId
                }
            }).then(function (resp) {
                vm.groupLeader = resp.data;
                vm.groupDetail = resp.data.currentGroupOrder;
                vm.groupDetail.activityCheck = {};
                vm.leaveNum = vm.groupDetail.groupNum - vm.groupDetail.curSize;
                vm.comments = new Array(vm.leaveNum);
            });
        };
        vm.getDetail();
        vm.getData = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/groupBuy/detail",
                params: {
                    activityId: vm.id
                }
            }).then(function (resp) {
                vm.detail = resp.data;
            });
        };
        vm.getData();


        vm.swiper = {};
        vm.checkSkuDialog = function (ev) {
            $mdBottomSheet.show({
                templateUrl: 'views/main/groupOrder/groupOrderDetail/specDialog/index.root.html',
                parent: '.ks-main',
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false,
                locals: {key: vm.detail.item[0]},
                controllerAs: "vmd",
                bindToController: true,
                controller: ['alertService', 'appConfig', function (alertService, appConfig) {
                    var vmd = this;
                    //赋值列表数据
                    vmd.imgUrl = appConfig.imgUrl;
                    vmd.detail = vmd.locals.key;

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
            $http({
                method: "GET",
                url: appConfig.apiPath + "/groupOrder/generateOrder ",
                params: {
                    activityId: vm.id,
                    unionGroupOrderId: vm.unionGroupOrderId,
                    skuId: vm.checkSku.id,
                    num: vm.skuNum,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                    var data = resp.data;
                    if (data.code === 'SUCCESS') {
                        // $state.go("main.groupOrder.groupOrderConfirm", {
                        //     groupOrderId: data.groupOrderId,
                        //     orderId: data.orderId,
                        //     backAddr: 'fromGroup'
                        // });
                        $state.go("main.groupOrder.groupOrderConfirm", {
                            groupOrderId: data.groupOrderId,
                            orderId: data.orderId,
                            buyStatus: vm.buyStatus,
                            id: vm.id,
                            skuId: vm.skuId,
                            orgId: vm.orgId,
                            backAddr: 'fromGroup'
                        });
                    }
                }, function () {

                }
            );
        };


        $rootScope.intervalStop = $interval(function () {
            var now = new Date().getTime();
            var payTime = new Date($filter("date")(vm.groupDetail.payTime, "yyyy/MM/dd HH:mm:ss")).getTime();
            var overTime = payTime + 24 * 60 * 60 * 1000;
            // 倒计时到零时，停止倒计时
            var rest = overTime - now;
            if (rest <= 0) {
                vm.detail.activityCheck = null;
                $interval.cancel($rootScope.intervalStop);
                $rootScope.intervalStop = null;
                return;
            }
            var leftsecond = parseInt(rest / 1000);
            var day1 = Math.floor(leftsecond / (60 * 60 * 24));
            var hour1 = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
            var minute1 = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour1 * 3600) / 60);
            var second1 = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour1 * 3600 - minute1 * 60);
            vm.groupDetail.activityCheck.day = day1;
            vm.groupDetail.activityCheck.hour = hour1;
            vm.groupDetail.activityCheck.minute = minute1;
            vm.groupDetail.activityCheck.second = second1;
        }, 1000);


        // vm.calTime = function (year, month, day) {
        //     if (vm.endDate < vm.startDate) {
        //         window.clearInterval(timer);
        //         return;
        //     }
        //     vm.startDate = new Date();
        //     vm.endDate = new Date(year, month - 1, day);
        //     vm.remainingTime = vm.endDate.getTime() - vm.startDate.getTime();
        //     vm.remainingSecond = parseInt(vm.remainingTime / 1000);
        //     vm.day = Math.floor(vm.remainingSecond / (60 * 60 * 24));
        //     vm.hour = Math.floor((vm.remainingSecond - vm.day * 24 * 60 * 60) / 3600);
        //     vm.minute = Math.floor((vm.remainingSecond - vm.day * 24 * 60 * 60 - vm.hour * 3600) / 60);
        //     vm.second = Math.floor(vm.remainingSecond - vm.day * 24 * 60 * 60 - vm.hour * 3600 - vm.minute * 60);
        //     // angular.element('#time')[0].innerHTML = vm.hour + ' : ' + vm.minute + ' : ' + vm.second;
        //     // console.log(angular.element('#time')[0].innerHTML);
        //     $rootScope.$digest();
        //     // console.log('vm.startDate===>>>', vm.startDate);
        //     // console.log('vm.endDate===>>>', vm.endDate);
        // };
        //
        // var timer = window.setInterval(function () {
        //     vm.calTime(2017, 5, 27);
        // }, 1000);
        //
        // $rootScope.aaa = function () {
        //     window.clearInterval(timer);
        // };

        // 回退页面
        vm.fallbackPage = function () {
            if (vm.fromLocal) {
                history.back();
            } else {
                $state.go("main.index", {orgId: '584662c0dc8d4c2a21c37234'}, {reload: true});
            }
        };
    }
})();