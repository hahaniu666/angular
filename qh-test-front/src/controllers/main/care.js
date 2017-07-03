/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.care", {
                url: "/care?myjson&title",
                views: {
                    "@": {
                        templateUrl: 'views/main/care/index.root.html',
                        controller: cleansilkController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    cleansilkController.$inject = ['$scope', '$http', '$state', 'appConfig', 'imgService', '$httpParamSerializer', '$mdBottomSheet', 'alertService', 'orderService'];
    function cleansilkController($scope, $http, $state, appConfig, imgService, $httpParamSerializer, $mdBottomSheet, alertService, orderService) {
        $scope.pageSize = 20;
        $scope.maxSize = appConfig.maxSize;
        $scope.imgUrl = appConfig.imgUrl;
        $scope.simpleImg = imgService.simpleImg;
        $scope.myjson = $state.params.myjson;
        $scope.jsons = JSON.parse($scope.myjson);
        $scope.basket = orderService.basket;
        //json格式转码
        var codes = $scope.jsons;
        var codeString = "";
        for (var i = 0; i < codes.length; i++) {
            codeString += "&code=" + codes[i].category;
        }

        //顶部标题
        $scope.topTitle = $state.params.title;
        //同上,这里是取cms的

        //code,获取所有的大类
        $http({
            method: "GET",
            url: appConfig.apiPath + "/category/list?children=1" + codeString
        }).then(function (resp) {
            var data = resp.data;
            if (data.code === "SUCCESS") {
                $scope.list = data.recList;
                $scope.code = $scope.list[0].code;
                $scope.childcode = $scope.list[0].children[0].code;
                $scope.changeType($scope.code, $scope.childcode);
                $scope.initBasket();
            }
        }, function () {
            $scope.fallbackPage();
        });

        //提示语后台设定
        $scope.contactUs = '';       //联系我们,下单后客服会在2小时内与您联系
        $http.get(appConfig.apiPath + "/common/sysConf?key=cleanContactUs")
            .success(function (data) {
                $scope.contactUs = data.value;
            });

        $scope.fallbackPage = function () {
            orderService.resetOrderBaseOn();
            $state.go("main.index", null, {reload: true});
        };
        //遍历标题设置为false状态
        $scope.initList = function () {
            for (var j = 0; j < $scope.list.length; j++) {
                for (var i = 0; i < $scope.list[j].children.length; i++) {
                    $scope.list[j].children[i].check = false;
                }
                $scope.list[j].check = false;
            }
        };
        //这个是给子类切换用的状态,用来ngIf
        $scope.initActive = function () {
            for (var j = 0; j < $scope.list.length; j++) {
                for (var i = 0; i < $scope.list[j].children.length; i++) {
                    $scope.list[j].children[i].active = false;
                }
            }
        };
        //选中则添加两个名字
        $scope.checkList = function () {
            for (var j = 0; j < $scope.list.length; j++) {
                for (var i = 0; i < $scope.list[j].children.length; i++) {
                    if ($scope.list[j].children[i].check) {
                        $scope.childname = $scope.list[j].children[i].name;
                    }
                }
                if ($scope.list[j].check) {
                    $scope.name = $scope.list[j].name;
                }
            }
        };
        //切换小类
        $scope.changeLike = function (uId) {
            $scope.initActive();
            for (var j = 0; j < $scope.list.length; j++) {
                for (var s = 0; s < $scope.list[j].children.length; s++) {
                    if ($scope.list[j].children[s].code === uId) {
                        $scope.list[j].children[s].active = true;
                    }
                }
            }
        };
        //评论分页
        $scope.pageChange = function (page) {
            $http({
                method: "POST",
                data: $httpParamSerializer({
                    prop: "codes:" + $scope.code,
                    curPage: page,
                    pageSize: $scope.pageSize
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                url: appConfig.apiPath + "/item/commentSearch"
            }).then(function (resp) {
                var data = resp.data;
                if (data.code === "SUCCESS") {
                    if ($scope.curPage > 1) {
                        for (var i = 0; i < data.commentList.length; i++) {
                            $scope.comment.commentList.push(data.commentList[i]);
                        }
                        $scope.comment.curPage = page;
                    } else {
                        $scope.comment = data;
                    }
                    $scope.curPage = data.curPage + 1;
                    $scope.totalCount = data.totalCount;
                    /**
                     * 判断是否是最后一页
                     */
                    if (data.totalCount % $scope.pageSize !== 0) {
                        if (Math.floor(data.totalCount / $scope.pageSize) + 1 === data.curPage) {
                            $scope.pageEnd = true;
                        }
                    } else {
                        if (Math.floor(data.totalCount / $scope.pageSize) === data.curPage) {
                            $scope.pageEnd = true;
                        }
                    }
                    //如果只有一页
                    if (data.totalCount <= $scope.pageSize) {
                        $scope.pageEnd = true;
                        $scope.curPage = 1;
                    }
                }
            }, function () {
                $scope.fallbackPage();
            });
        };
        //切换大类
        $scope.changeType = function (info, c_info) {
            //code是用来查询大类的评价\详情,c_code是子类商品
            $scope.code = info;
            $scope.childcode = c_info;
            $scope.curPage = 1;
            $scope.comment = {};
            $scope.initActive();
            $scope.initList();
            $scope.initNums();
            //获取评论
            $scope.pageChange(1);
            //获取大类的详情
            for (var i = 0; i < codes.length; i++) {
                if (codes[i].category === 'info' || codes[i].category === info) {
                    $scope.cms = codes[i].cmsId;
                }
            }
            //商品详情
            $http({
                method: "GET",
                url: appConfig.apiPath + "/helpCenter/pageText?id=" + $scope.cms
            }).then(function (resp) {
                var data = resp.data;
                if (data.code === "SUCCESS") {
                    $scope.htmls = data.content;
                }
            }, function () {
                $scope.fallbackPage();
            });
            //判断商品是不是已经请求过了
            for (var k = 0; k < $scope.list.length; k++) {
                $scope.list[k].shows = false;
            }
            for (var j = 0; j < $scope.list.length; j++) {
                if ($scope.list[j].code === info) {
                    $scope.list[j].shows = true;
                    $scope.list[j].check = true;
                }
                for (var s = 0; s < $scope.list[j].children.length; s++) {
                    if ($scope.list[j].children[s].code === c_info) {
                        $scope.list[j].children[s].active = true;
                        $scope.list[j].children[s].check = true;
                        if ($scope.list[j].children[s].service_item) {
                            return;
                        }
                    }
                }
            }
            //获取商品
            $http({
                method: "POST",
                data: $httpParamSerializer({
                    prop: "itemCategoryCodes:" + $scope.childcode,
                    curPage: 0,
                    pageSize: 0,
                    detail: 1
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                url: appConfig.apiPath + "/item/search"
            }).then(function (resp) {
                var data = resp.data;
                if (!data.items) {
                    return;
                }
                for (var j = 0; j < $scope.list.length; j++) {
                    for (var l = 0; l < $scope.list[j].children.length; l++) {
                        if ($scope.list[j].children[l].code === c_info) {
                            //定义sku数组
                            if ($scope.list[j].code === info) {
                                $scope.list[j].shows = true;
                            }
                            $scope.list[j].children[l].service_item = data.items;
                            $scope.list[j].children[l].active = true;
                            for (var i = 0; i < $scope.list[j].children[l].service_item.length; i++) {
                                for (var k = 0; k < $scope.list[j].children[l].service_item[i].sku.length; k++) {
                                    $scope._tempsku = $scope.list[j].children[l].service_item[i].sku[k];
                                    var tmp = $scope._tempsku.title.split(';');
                                    $scope._tempsku.title = tmp[tmp.length - 1];
                                    $scope._tempsku.num = 0;
                                }
                            }
                        }
                    }
                }
            }, function () {
                $scope.fallbackPage();
            });
        };

        $scope.initBasket = function () {
            if ($scope.basket.length === 0) {
                for (var j = 0; j < $scope.list.length; j++) {
                    var initCode = {code: $scope.list[j].code, value: []};
                    $scope.basket.push(initCode);
                }
            }
        };

        $scope.initNums = function () {
            $scope.price = 0;
            $scope.nums = 0;
            for (var i = 0; i < $scope.basket.length; i++) {
                for (var j = 0; j < $scope.basket[i].value.length; j++) {
                    $scope.nums += $scope.basket[i].value[j].num;
                    $scope.price += $scope.basket[i].value[j].price * $scope.basket[i].value[j].num;
                }
            }
        };
        //添加到洗衣篮 cl:单个sku l:list的所有 s:item
        $scope.addBasket = function (cl, l) {
            $scope.cl = cl;
            $scope.cl.num += 1;
            $scope.basList = l;
            $scope.cl.checked = true;
            $scope.checkList();
            $scope.cl.name = $scope.name;
            $scope.cl.childname = $scope.childname;
            for (var i = 0; i < $scope.basket.length; i++) {
                if ($scope.basket[i].code === $scope.basList.code && $scope.basket[i].value.indexOf(cl) < 0) {
                    $scope.basket[i].value.push($scope.cl);
                }
            }
            //计算篮子中新的长度和总价
            $scope.initNums();
        };
        //直接下单
        $scope.goods = [];
        $scope.buyDisabled = false;
        $scope.getBuy = function () {
            if ($scope.buyDisabled) {
                return;
            }
            $scope.buyDisabled = true;
            for (var i = 0; i < $scope.basket.length; i++) {
                for (var j = 0; j < $scope.basket[i].value.length; j++) {
                    if ($scope.basket[i].value[j].checked) {
                        $scope._temps = $scope.basket[i].value[j];
                        $scope.goodsItem = {sku: $scope._temps.sku, num: $scope._temps.num};
                        $scope.goods.push($scope.goodsItem);
                    }
                }
            }
            $scope.data = angular.toJson($scope.goods);
            $http({
                method: "GET",
                url: appConfig.apiPath + "/qhOrder/check",
                params: {
                    data: $scope.data
                }
            }).then(function (resp) {
                var data = resp.data;
                if (data.code === "SUCCESS") {
                    $scope.getInfo = data;
                    // 直接进行购买
                    $state.go("main.order.checkOrder", {
                        id: $scope.getInfo.orderId
                    }, {reload: true});
                }
            }, function (resp) {
                $scope.buyDisabled = false;
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        $scope.userAvatarUpdate = function () {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'views/main/cleansilk/dialog/index.root.html',
                controllerAs: "vm",
                clickOutsideToClose: true,
                controller: ["$httpParamSerializer", "FileUploader", "appConfig", function ($httpParamSerializer, FileUploader, appConfig) {
                    var vm = this;
                    vm.simpleImg = imgService.simpleImg;
                    vm.contactUs = $scope.contactUs;

                    vm.qingkong = function () {
                        alertService.confirm(null, "", "您确定要删除这些宝贝吗?", "取消", "确定").then(function (data) {
                            if (data) {
                                orderService.resetOrderBaseOn();
                                $state.reload();
                            }
                        });
                    };
                    vm.nums = $scope.nums;
                    vm.priceAll = $scope.price;
                    vm.skus = $scope.basket;
                    vm.imgUrl = appConfig.imgUrl;
                    //减少数量
                    vm.bujinLeft = function (skuId) {
                        if (skuId.num > 1) {
                            skuId.num--;
                            vm.nums--;
                            vm.priceAll = vm.priceAll - skuId.price;
                        } else if (skuId.num === 1) {
                            skuId.num--;
                            vm.nums--;
                            vm.priceAll = vm.priceAll - skuId.price;
                            for (var i = 0; i < $scope.basket.length; i++) {
                                for (var j = 0; j < $scope.basket[i].value.length; j++) {
                                    if ($scope.basket[i].value[j].sku === skuId.sku) {
                                        $scope.basket[i].value.splice(j, 1);
                                    }
                                }
                            }
                            if (vm.nums === 0) {
                                vm.close();
                            }
                        }
                    };

                    //增加数量
                    vm.bujinRight = function (sku) {
                        if (sku.num > 0) {
                            sku.num++;
                            vm.nums++;
                            vm.priceAll = vm.priceAll + sku.price;
                        }
                    };
                    //关闭弹窗
                    vm.close = function () {
                        $mdBottomSheet.hide({nums: vm.nums, priceAll: vm.priceAll});
                    };
                    //购买
                    vm.goods = [];
                    vm.buyDisabled = false;
                    vm.getBuy = function () {
                        if (vm.buyDisabled) {
                            return;
                        }
                        vm.buyDisabled = true;
                        for (var i = 0; i < vm.skus.length; i++) {
                            for (var j = 0; j < vm.skus[i].value.length; j++) {
                                if (vm.skus[i].value[j].checked) {
                                    vm._temps = vm.skus[i].value[j];
                                    var goodsItem = {sku: vm._temps.sku, num: vm._temps.num};
                                    vm.goods.push(goodsItem);
                                }
                            }
                        }
                        if (vm.goods.length > 0) {
                            vm.data = angular.toJson(vm.goods);
                            $http({
                                method: "GET",
                                url: appConfig.apiPath + "/qhOrder/check",
                                params: {
                                    data: vm.data
                                }
                            }).then(function (resp) {
                                var data = resp.data;
                                if (data.code === "SUCCESS") {
                                    $scope.getInfo = data;
                                    // 直接进行购买
                                    $state.go("main.order.checkOrder", {
                                        id: $scope.getInfo.orderId
                                    }, {reload: true});
                                }
                            }, function (resp) {
                                var data = resp.data;
                                vm.buyDisabled = false;
                                if (data.code === "NOT_LOGINED") {
                                    $state.go("main.newLogin", null);
                                }
                            });
                        } else {
                            alertService.msgAlert("ks-cancle", "请至少选择一件商品下单");
                        }
                    };
                }],
                parent: '.ks-main'
            }).then(function (resp) {
                $scope.nums = resp.nums;
                $scope.price = resp.priceAll;
            }, function () {
            });
        };
    }
})();