(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 获取用户的地址
         */
        $stateProvider.state("main.address", {
            url: '/address?s&orderId',
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(true, true);
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/address/index.root.html',
                    controller: addressController
                }
            }
        });
    }]);
    addressController.$inject = ['$scope', '$http', '$state', '$httpParamSerializer', 'appConfig', "alertService"];
    function addressController($scope, $http, $state, $httpParamSerializer, appConfig, alertService) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        //置顶按钮
        $scope.top = angular.element(".toTop");
        $scope.win1 = angular.element(window);
        $scope.win1.scroll(function () {
            ($scope.win1.scrollTop() > 380) ? $scope.top.show(100) : $scope.top.hide(100);
        });
        $scope.status = $state.params.s;
        console.log($scope.status);
        // 判断获取地址是从哪个入口进来的，返回不同的入口
        $scope.order = true;
        $scope.orderfalse = true;
        if ($scope.status === 'order') {
            $scope.order = false;
            $scope.orderfalse = false;
        } else {
            $scope.address = true;
        }


        $scope.addressDefault = 0;   //设置初始地址下标
        // 获取用户地址列表
        $scope.queryAddressList = function () {

            $http
                .get(appConfig.apiPath + '/address/list', {notShowError: true})
                .success(function (data) {
                    $scope.list = data;
                    if ($scope.list.addressList.length > 0) {
                        $scope.list.addressList[0].updateDefault = true;
                        $scope.addressDefault = 0;
                    }
                }).error(function (data) {
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
                $scope.list = data;
            });
        };

        $scope.queryAddressList();
        // 省一级的ID
        $scope.provinceId = null;
        // 市一级ID
        $scope.cityId = null;
        // 市一级ID
        $scope.areaId = null;


        // 订单详情页进来的修改订单详情的地址
        $scope.orderUpdateAddress = function (addr) {
            //
            for (var i = 0; i < $scope.list.addressList.length; i++) {
                $scope.list.addressList[i].xzbhok = false;
            }

            if (!$state.params.orderId) {
                return;
            }
            var url = "/unionOrder";
            if ($scope.status === 'qhOrder') {
                url = "/qhOrder";
            } else if ($scope.status === "vipOrder") {
                url = "/integral";
            } else if ($scope.status === 'group') {
                url = "/unionOrder";
            }
            $http({
                method: "POST",
                url: appConfig.apiPath + url + '/updateAddress',
                data: $httpParamSerializer({
                    //订单编号传过去，后台会做处理，就能知道确认订单里面 哪个订单编号了，
                    orderId: $state.params.orderId,
                    //然后我们把addr等信息提交，这样相对应的订单的地址就会改变。
                    adcId: addr.adcId,
                    street: addr.street,
                    phone: addr.phone,
                    contact: addr.contact,
                    status: $scope.status
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function () {
                $scope.fallbackPage();
            }).error(function (data) {
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        $scope.deleteAddress = function (ev, id) {
            /*alertService.confirm(ev, "是否确认删除该地址")*/
            alertService.confirm(null, "", "是否确认删除该地址", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/address/delete',
                        data: $httpParamSerializer({id: id}),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).success(function () {
                        $scope.queryAddressList();
                        alertService.msgAlert("success", "删除成功");
                    }).error(function (data) {
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                }
            });
        };

        // 设为默认地址
        $scope.setDefault = function (addressList, index) {
            //这里为什么要传addressList参数 这个参数你可以理解成我们当前点击的这个addressList!
            $http({
                method: "POST",
                url: appConfig.apiPath + '/address/setDefaultAddress',
                data: $httpParamSerializer({id: addressList.id}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function () {
                // 判断 state的params 中 srcState 有没有，没有则返回到主页
                // 需要注意： $state.go(srcState,{},{reload:true})
                $scope.list.addressList[index].updateDefault = true;
                $scope.list.addressList[$scope.addressDefault].updateDefault = false;
                $scope.addressDefault = index;
            }).error(function (data) {
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };

        ////////////////////////////////////////////
        //弹窗
        $scope.openadddialog = function (ev, chanewaddress, index) {

            ////第三个参数换成了index，如若要是下面注释掉的mddialog，请把index改成address，并把对应的html页面参数修改
            if (chanewaddress === 0) {
                //0是添加新地址
                $state.go("main.address.update", null, {reload: true});
            } else {
                //1为编辑地址
                $state.go("main.address.update", {
                    edit: true,
                    id: $scope.list.addressList[index].id,
                    updateDefault: $scope.list.addressList[index].updateDefault
                }, {reload: true});
            }
        };
        // 回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();