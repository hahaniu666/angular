/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.cleansilk", {
                //这里跟cleansilk地址互换
                url: "/cleansilk?myjson&orgId",
                views: {
                    "@": {
                        templateUrl: 'views/main/cleansilk/index.root.html',
                        controller: careController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    careController.$inject = ['$scope', '$http', '$state', 'appConfig', 'imgService', '$httpParamSerializer', '$mdBottomSheet', 'alertService', 'orderService'];
    function careController($scope, $http, $state, appConfig, imgService, $httpParamSerializer, $mdBottomSheet, alertService, orderService) {
        $scope.pageSize = 20;
        $scope.maxSize = appConfig.maxSize;
        $scope.imgUrl = appConfig.imgUrl;
        $scope.simpleImg = imgService.simpleImg;
        $scope.myjson = $state.params.myjson;
        $scope.jsons = JSON.parse($scope.myjson);

        $scope.orgId = $state.params.orgId;
        console.log($scope.orgId);

        //json格式转码
        var codes = $scope.jsons;
        var codeString = "";
        for (var i = 0; i < codes.length; i++) {
            codeString += "&code=" + codes[i].category;
        }
        // 获取购物车数量有多少个SKU
        $http
            .get(appConfig.apiPath + "/cart/cartNum")
            .success(function (data) {
                $scope.cartSize = data;
            });
        //code,获取所有的大类
        $http({
            method: "GET",
            url: appConfig.apiPath + "/category/list?children=1" + codeString
        }).then(function (resp) {
            var data = resp.data;
            if (data.code === "SUCCESS") {
                $scope.list = data.recList;
                $scope.code = $scope.list[0].code;
                $scope.childcode = $scope.list[0].code;
                $scope.changeType($scope.code, $scope.childcode);
            }
        }, function () {
            $scope.fallbackPage();
        });


        $scope.fallbackPage = function () {
            orderService.resetOrderBaseOn();
            if ($scope.orgId) {
                $state.go("main.index", {orgId: $scope.orgId}, {reload: true});
            } else {
                $state.go("main.index", null, {reload: true});
            }

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
        //切换大类
        $scope.changeType = function (info, c_info) {
            //code是用来查询大类的评价\详情,c_code是子类商品
            $scope.code = info;
            $scope.childcode = c_info;
            $scope.curPage = 1;
            $scope.comment = {};
            $scope.initActive();
            $scope.initList();
            //获取大类的详情
            for (var i = 0; i < codes.length; i++) {
                if (codes[i].category === 'info' || codes[i].category === info) {
                    $scope.cms = codes[i].cmsId;
                }
            }
            //判断商品是不是已经请求过了
            for (var k = 0; k < $scope.list.length; k++) {
                $scope.list[k].shows = false;
            }
            for (var j = 0; j < $scope.list.length; j++) {
                if ($scope.list[j].code === info) {
                    $scope.list[j].shows = true;
                    $scope.list[j].check = true;
                    if ($scope.list[j].service_item) {
                        return;
                    }
                }
            }
            //获取商品
            $http({
                method: "POST",
                data: $httpParamSerializer({
                    prop: "itemCategoryCodes:" + $scope.childcode,
                    sort: "minSkuPrice+",
                    curPage: 1,
                    pageSize: 99,
                    detail: 1
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                url: appConfig.apiPath + "/item/search"
            }).then(function (resp) {
                var data = resp.data;
                $scope.initList();
                if (!data.items) {
                    return;
                }
                for (var j = 0; j < $scope.list.length; j++) {
                    if ($scope.list[j].code === c_info) {
                        //定义sku数组
                        if ($scope.list[j].code === info) {
                            $scope.list[j].shows = true;
                        }
                        $scope.list[j].service_all = [];
                        $scope.list[j].check = true;
                        $scope.list[j].check = true;
                        $scope.list[j].service_item = data.items;
                        $scope.list[j].active = true;
                        for (var i = 0; i < $scope.list[j].service_item.length; i++) {
                            for (var k = 0; k < $scope.list[j].service_item[i].sku.length; k++) {
                                $scope._tempsku = $scope.list[j].service_item[i].sku[k];
                                var tmp = $scope._tempsku.title.split(';');
                                $scope._tempsku.title = tmp[tmp.length - 1];
                                $scope.list[j].service_all.push($scope._tempsku);
                                $scope._tempsku.num = 0;
                            }
                        }
                    }
                    // }
                }

            }, function () {
                $scope.fallbackPage();
            });
        };
        $scope.getItem = function (order) {
            $state.go("main.item", {itemId: order.itemId}, {reload: true});
        };
    }
})();