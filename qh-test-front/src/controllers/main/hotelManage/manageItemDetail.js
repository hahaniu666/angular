(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.hotelManage.manageItemDetail", {
                url: "/manageItemDetail?orgItem&skuId&userOrg&itemId&s",
                views: {
                    "@": {
                        templateUrl: 'views/main/hotelManage/manageItemDetail/index.root.html',
                        controller: manageItemDetailController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    manageItemDetailController.$inject = ['$httpParamSerializer', '$http', '$state', 'appConfig', 'alertService', '$mdBottomSheet', "imgService", '$timeout'];
    function manageItemDetailController($httpParamSerializer, $http, $state, appConfig, alertService, $mdBottomSheet, imgService, $timeout) {
        var vm = this;
        vm.tab = 1;
        vm.tabs = function (num) {
            vm.tab = num;
        };

        vm.imgUrl = appConfig.imgUrl;
        vm.slideImg = imgService.slideImg;
        vm.simpleImg = imgService.simpleImg;
        vm.itemImg = imgService.itemImg;
        vm.orgItem = $state.params.orgItem;
        vm.itemId = $state.params.itemId;
        vm.userOrg = $state.params.userOrg;


        vm.swiper = {};
        vm.selected = false;
        vm.change = function () {
            vm.selected = !vm.selected;
        };

        vm.getMsg = function () {
            if (vm.orgItem) {
                $http({
                    method: "GET",
                    url: appConfig.apiPath + "/orgItem/detail",
                    params: {
                        orgItem: vm.orgItem
                    }
                }).then(function (resp) {
                        vm.detail = resp.data.result;
                        if (vm.detail.sku.length <= 0) {
                            alertService.msgAlert("exclamation-circle", "商品已下架");
                            return;
                        }
                        // 默认选取第一个,有skuId则选取对应的SKU
                        vm.checkSku = null;
                        if ($state.params.skuId) {
                            for (var i = 0; i < vm.detail.sku.length; i++) {
                                if (vm.detail.sku[i].sku === $state.params.skuId) {
                                    vm.checkSku = vm.detail.sku[i];
                                    $timeout(function () {
                                        vm.swiper.update();
                                    });
                                    break;
                                }
                            }
                        }
                        if (!vm.checkSku) {
                            vm.checkSku = vm.detail.sku[0];
                            $timeout(function () {
                                vm.swiper.update();
                            });
                        }
                    }, function () {

                    }
                );
            } else if (vm.itemId) {
                $http({
                    method: "GET",
                    url: appConfig.apiPath + "/item/detail",
                    params: {
                        itemId: vm.itemId
                    }
                }).then(function (resp) {
                        vm.detail = resp.data;
                        if (vm.detail.sku.length <= 0) {
                            alertService.msgAlert("exclamation-circle", "商品已下架");
                            return;
                        }
                        // 默认选取第一个,有skuId则选取对应的SKU
                        vm.checkSku = null;
                        if ($state.params.skuId) {
                            for (var i = 0; i < vm.detail.sku.length; i++) {
                                if (vm.detail.sku[i].sku === $state.params.skuId) {
                                    vm.checkSku = vm.detail.sku[i];
                                    $timeout(function () {
                                        vm.swiper.update();
                                    });
                                    break;
                                }
                            }
                        }
                        if (!vm.checkSku) {
                            vm.checkSku = vm.detail.sku[0];
                            $timeout(function () {
                                vm.swiper.update();
                            });
                        }
                    }, function () {

                    }
                );
            }
        };
        vm.getMsg();
        vm.skuNum = 1;


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

        vm.checkSkuDialog = function (ev) {
            $mdBottomSheet.show({
                    templateUrl: 'views/main/hotelManage/manageItemDetail/specDialog/index.root.html',
                    parent: '.ks-main',
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: false,
                    locals: {key: vm.detail},
                    controllerAs: "vmd",
                    bindToController: true,
                    controller: ['alertService', function (alertService) {
                        var vmd = this;
                        vmd.appConfig = appConfig;
                        vmd.imgService = imgService;
                        vmd.isShow = true;
                        vmd.detail = vmd.locals.key;
                        vmd.skuNum = 1;
                        vmd.specClick = [];
                        if (vmd.detail.sku.length <= 0) {
                            alertService.msgAlert("exclamation-circle", "商品已下架");
                            return;
                        }
                        // 默认选取第一个,有skuId则选取对应的SKU
                        vmd.checkSku = null;
                        vmd.tempCheckSku = null;
                        if ($state.params.skuId) {
                            for (var i = 0; i < vmd.detail.sku.length; i++) {
                                if (vmd.detail.sku[i].sku === $state.params.skuId) {
                                    vmd.checkSku = vmd.detail.sku[i];
                                    break;
                                }
                            }
                        }
                        if (!vmd.checkSku) {
                            vmd.checkSku = vmd.detail.sku[0];
                        }

                        // 计算商品数量。进行加减
                        vmd.skuNumCount = function (num) {

                            if (vmd.skuNum === 1 && num === 0) {
                                return;
                            }
                            if (num === 0) {
                                vmd.skuNum--;
                            } else {
                                vmd.skuNum++;
                            }
                        };


                        vmd.clearCheck = function () {
                            // 现将所有选中过的全部清除，在重新选中
                            // 清除当前选中状态  传过的ID要清除选中状态
                            for (var i = 0; i < vmd.detail.specs.length; i++) {
                                for (var k = 0; k < vmd.detail.specs[i].specValues.length; k++) {
                                    vmd.detail.specs[i].specValues[k].stock = false;
                                    vmd.detail.specs[i].specValues[k].check = false;
                                }
                            }
                        };
                        vmd.clearCheck();
                        // 初始化选中已经选过的图标
                        vmd.init_Spec = function () {
                            for (var c = 0; c < vmd.checkSku.specs.length; c++) {
                                for (var i = 0; i < vmd.detail.specs.length; i++) {
                                    for (var k = 0; k < vmd.detail.specs[i].specValues.length; k++) {
                                        if (vmd.detail.specs[i].specValues[k].id === vmd.checkSku.specs[c].propId) {
                                            vmd.detail.specs[i].specValues[k].check = true;
                                            var oneSpec = {};
                                            oneSpec.id = vmd.detail.specs[i].specId;
                                            oneSpec.valueId = vmd.detail.specs[i].specValues[k].id;
                                            vmd.specClick.push(oneSpec);
                                        }
                                    }
                                }
                            }
                            vmd.tempCheckSku = vmd.checkSku;
                        };
                        vmd.init_Spec();

                        // 清除当前选取的spec值value的点中
                        vmd.clearSpecs = function (specId) {
                            for (var i = 0; i < vm.detail.specs.length; i++) {
                                if (vm.detail.specs[i].specId === specId) {
                                    for (var k = 0; k < vm.detail.specs[i].specValues.length; k++) {
                                        vm.detail.specs[i].specValues[k].check = false;
                                    }
                                }
                            }
                        };
                        // 得到本次选中的规格SKU
                        vmd.clickedSpec = function (spec, specValue) {
                            if (specValue.stock) {
                                // 点击上一个规格的时候,这个value的库存没有,直接返回
                                return;
                            }
                            vmd.tempCheckSku = null;
                            // 本次点击的事件ID
                            var oneSpec = {};
                            oneSpec.id = spec.specId;
                            oneSpec.valueId = specValue.id;
                            // 记录本次点击的是以点击过的,还是未点击的spec.未点击的spec直接添加
                            var boo = true;

                            for (var i = 0; i < vmd.specClick.length; i++) {
                                if (vmd.specClick[i].id === spec.specId) {
                                    boo = false;
                                    vmd.specClick.splice(i, 1);
                                    // 点击不同value,同一个spec,删除原有的spec的value.添加新的value
                                    vmd.clearSpecs(spec.specId);
                                    specValue.check = true;
                                    vmd.specClick.push(oneSpec);
                                    break;
                                    //}
                                }
                            }
                            // 未点击过得.直接添加
                            if (boo) {
                                // 本次点击显示红色边框
                                specValue.check = true;
                                vmd.specClick.push(oneSpec);
                            }
                            vmd.isShow = false;
                            // 点击完所有的规格.直接添加
                            if (vmd.specClick.length === vmd.detail.specs.length) {
                                // 进行计算价格的操作
                                // 循环tempsku进行比对
                                for (var i = 0; i < vmd.detail.sku.length; i++) {
                                    var num = 0;
                                    for (var y = 0; y < vmd.detail.sku[i].specs.length; y++) {
                                        // 循环SKU的规格
                                        for (var s = 0; s < vmd.specClick.length; s++) {
                                            // 如果sku中的规格有当前最后一次点击的规格,并且库存大于0,则加入tempsku中
                                            if (vmd.specClick[s].valueId === vmd.detail.sku[i].specs[y].propId) {
                                                // 有一次不符合跳出循环,进行下一次
                                                num++;
                                            }
                                        }
                                    }
                                    if (num < vmd.specClick.length) {
                                        // 有一次不符合跳出循环,进行下一次
                                        continue;
                                    }
                                    // 本次商品规格和选择的规格相同，则不用在查找,将商品添加上选择中去
                                    vmd.tempCheckSku = vmd.detail.sku[i];
                                    vmd.isShow = true;
                                    break;
                                }
                            }
                        };
                        vmd.cancel = function () {
                            $mdBottomSheet.hide(false);
                        };
                        vmd.checkSubmit = function (status) {
                            // status===0;是进行加入购物车，status===1是进行购买还是确定
                            if (vmd.tempCheckSku) {
                                $mdBottomSheet.hide({status: status, sku: vmd.tempCheckSku, num: vmd.skuNum});
                            } else {
                                if (vmd.specClick.length < vmd.itemDetail.specs.length) {
                                    alertService.msgAlert("exclamation-circle", "请选择相应规格");
                                } else {
                                    alertService.msgAlert("exclamation-circle", "当前商品缺货");
                                }
                            }
                        };
                    }]
                })
                .then(function (data) {
                    if (data) {
                        vm.skuNum = data.num;
                        vm.checkSku = data.sku;
                        vm.checkSubmitSku();
                        if (data.status === 1) {
                            vm.itemPayBuy(1);
                        } else {
                            $timeout(function () {
                                vm.swiper.update();
                            });
                            // 为0是加入购物车
                            vm.itemPayBuy(0);
                        }
                    }
                })
        };

        // 规格选择完成进行计算
        vm.checkSubmitSku = function () {
            if (!vm.checkSku) {
                alertService.msgAlert("exclamation-circle", "商品选择错误");
                return;
            }
        };

        /**
         * 当前商品的单位
         * @type {string}
         */
        vm.queryItemDetail = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/orgItem/detail",
                params: {
                    orgItem: vm.orgItem
                }
            }).then(function (resp) {
                    vm.data = resp.data.result;
                }, function () {

                }
            );
        };


        // 对已经计算好的进行购买
        vm.itemPayBuy = function (status) {
            if (!vm.checkSku.sku) {
                return;
            }
            // 判断商品是否已经下架，但是下架的商品返回的库存都是0.二次校验防止出错
            if (vm.checkSku.delete) {
                alertService.msgAlert("exclamation-circle", "商品已下架");
                return;
            }

            if (status === 0) {
                vm.cart();
            } else {
                vm.checkOrder();
            }
        };

        // 加入购物车中
        vm.cart = function () {
            var skuData = [{
                skuId: vm.checkSku.sku,
                num: vm.skuNum
            }];

            $http({
                method: "POST",
                url: appConfig.apiPath + "/cart/add",
                data: {
                    data: skuData,
                    type: "ORG",
                    userOrg: vm.userOrg
                }
            }).then(function () {
                    // 获取购物车数量有多少个SKU
                    $http
                        .get(appConfig.apiPath + "/cart/cartNum")
                        .success(function (data) {
                            vm.cartData = data;
                            alertService.msgAlert("success", "加入进货单成功");
                        });
                }, function () {

                }
            );
        };

        //直接下单
        vm.checkOrder = function () {
            $http({
                method: "POST",
                url: appConfig.apiPath + "/managerOrder/check",
                data: $httpParamSerializer({
                    sku: vm.checkSku.sku,
                    num: vm.skuNum,
                    org: vm.userOrg
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

        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else if($state.params.s){
                $state.go("main.hotelManage.itemManage", {tab:$state.params.s}, {reload: true});
            }else{
                history.back();
            }
        };
    }
})();