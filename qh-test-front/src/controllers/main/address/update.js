(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 更新地址，如果address.js文件选择的是用弹出框，则该js无用
         */
        $stateProvider.state("main.address.update", {
            url: '/update?edit&id&updateDefault',
            views: {
                "@": {
                    controller: 'updateAddressController',
                    templateUrl: 'views/main/address/adddialog/index.root.html',
                    controllerAs: "vm"
                }
            }
        });
    }]);
    angular.module('qh-test-front')
        .controller('updateAddressController',
            ['$scope', '$http', '$state', '$log', "$element", "$timeout", 'appConfig', "alertService",
                '$httpParamSerializer',
                function ($scope, $http, $state, $log, $element, $timeout, appConfig, alertService,
                          $httpParamSerializer) {

                    $scope.gotoTop = function () {
                        window.scrollTo(0, 0);//滚动到顶部
                    };
                    $scope.gotoTop();
                    $scope.orderId = $state.params.orderId;

                    // 回退页面
                    $scope.fallbackPage = function () {

                        if (history.length === 1) {

                            $state.go("main.index", null, {reload: true});
                        } else {
                            history.back();
                        }
                    };
                    var vm = this;
                    vm.newadd = 0;
                    var address = {};

                    $scope.switchDisable = false;       //设为默认地址，滑块，当编辑默认地址时，不可设为非默认地址

                    /**
                     * 开始执行js，在最后一行调用了,控制js顺序
                     */
                    vm.start = function () {
                        if ($state.params.edit && $state.params.id) {
                            vm.newadd = 1;
                            $http({
                                method: "GET",
                                url: appConfig.apiPath + '/address/info?id=' + $state.params.id
                            }).then(function (resp) {
                                var d = resp;
                                address = d.data.address;
                                vm.init();
                            }, function (resp) {
                                var data = resp.data;
                                if (data.code === "NOT_LOGINED") {
                                    $state.go("main.newLogin", {backUrl: window.location.href});
                                }
                                address = data.address;
                            });
                        } else {
                            vm.init();
                        }
                    };

                    vm.PHONE_REGEXP = /^[\d]{11}$/i;
                    //收货人blur事件:
                    vm.addressContact = function () {
                        vm.contactRed = false;
                        if (!vm.address.contact) {
                            alertService.msgAlert("exclamation-circle", "请填写收货人姓名");
                            vm.contactRed = true;
                        }
                        //收货人姓名长度不能少于2大于10
                        else if (vm.address.contact.length < 2 || vm.address.contact.length > 10) {
                            vm.contactRed = true;
                            alertService.msgAlert("exclamation-circle", "收货人姓名为2到10个字符");
                        }
                    };
                    //手机号blur事件:
                    vm.addressPhone = function () {
                        vm.phoneRed = false;
                        vm.PHONE_REGEXP = /^[\d]{11}$/i;
                        if (!vm.PHONE_REGEXP.test(vm.address.phone)) {
                            alertService.msgAlert("exclamation-circle", "请填写正确的手机号");
                        }
                    };
                    //街道blur事件:
                    vm.addressStreet = function () {
                        vm.streetRed = false;
                        if (!vm.address.street) {
                            alertService.msgAlert("exclamation-circle", "请填写街道地址");
                            vm.streetRed = true;
                        }
                    };
                    // 修改时获取省市区地址

                    vm.queryUpdateAddress = function (id) {
                        $http({
                            method: "GET",
                            url: appConfig.apiPath + '/address/editAddress?id=' + id
                        }).then(function (resp) {
                            var data = resp.data;
                            vm.provinces = data.provinces;
                            vm.citys = data.citys;
                            vm.areas = data.areas;
                            vm.provinceId = data.address.proId;
                            vm.cityId = data.address.cityId;
                            vm.areaId = data.address.areaId;
                        }, function (data) {
                            if (data.code === "NOT_LOGINED") {
                                $state.go("main.newLogin", {backUrl: window.location.href});
                            }
                        });
                    };
                    //获取省市
                    vm.queryAddress = function (id, element) {
                        if (element === 0) {
                            vm.provinces = null;
                            vm.provinceId = null;
                            vm.citys = null;
                            vm.areas = null;
                            vm.cityId = null;
                            vm.areaId = null;
                            $http({
                                method: "GET",
                                url: appConfig.apiPath + '/address/select?id=' + id
                            }).then(function (resp) {
                                var data = resp.data;
                                vm.provinces = data.adcs;
                            }, function (resp) {
                                var data = resp.data;
                                if (data.code === "NOT_LOGINED") {
                                    $state.go("main.newLogin", {backUrl: window.location.href});
                                }
                            });
                        } else if (element === 1) {
                            vm.citys = null;
                            vm.areas = null;
                            vm.cityId = null;
                            vm.areaId = null;
                            if (id) {
                                $http({
                                    method: "GET",
                                    url: appConfig.apiPath + '/address/select?id=' + id
                                }).then(function (resp) {
                                    var data = resp.data;
                                    // 页面返回至进来的页面
                                    vm.citys = data.adcs;
                                }, function (resp) {
                                    var data = resp.data;
                                    if (data.code === "NOT_LOGINED") {
                                        $state.go("main.newLogin", {backUrl: window.location.href});
                                    }
                                });
                            }
                        } else {
                            vm.areas = null;
                            vm.areaId = null;
                            if (id) {
                                $http({
                                    method: "GET",
                                    url: appConfig.apiPath + '/address/select?id=' + id
                                }).then(function (resp) {
                                    var data = resp.data;
                                    vm.areas = data.adcs;
                                }, function (resp) {
                                    var data = resp.data;
                                    if (data.code === "NOT_LOGINED") {
                                        $state.go("main.newLogin", {backUrl: window.location.href});
                                    }
                                });
                            }
                        }
                    };
                    //判断是新增地址还是修改地址 newadd 为0的时候就是新增地址 为1的时候就是修改地址
                    vm.init = function () {
                        if (vm.newadd === 0) {
                            vm.addrTitle = "新增收货地址";
                            vm.queryAddress(null, 0);
                            //初始化
                            vm.address = {
                                id: null,
                                street: null,
                                phone: null,
                                contact: null,
                                default: false
                            };
                        } else if (vm.newadd === 1) {
                            //当点击修改的时候，
                            vm.addrTitle = "修改收货地址";
                            vm.address = {
                                id: address.id,
                                street: address.street,
                                phone: address.phone,
                                contact: address.contact,
                                default: address.updateDefault
                            };
                            if ($state.params.updateDefault === 'true') {
                                vm.address.default = true;
                                $scope.switchDisable = true;
                            }
                            vm.queryUpdateAddress(address.adcId);
                        }
                    };

                    vm.updateOrInsertAddress = function () {
                        if (!vm.address.street) {
                            alertService.msgAlert("exclamation-circle", "请填写街道");
                            vm.streetRed = true;
                            return;
                        }
                        // 收货人姓名需要填写
                        if (!vm.address.contact) {
                            vm.contactRed = true;
                            alertService.msgAlert("exclamation-circle", "请填写收货人姓名");
                            return;
                        }
                        //收货人姓名长度不能少于2大于10
                        if (vm.address.contact.length < 2 || vm.address.contact.length > 10) {
                            vm.contactRed = true;
                            alertService.msgAlert("exclamation-circle", "收货人姓名为2到10个字符");
                            return;
                        }
                        // 电话需要填写
                        if (!vm.address.phone) {
                            alertService.msgAlert("cancle", "手机号码不能为空");
                            vm.phoneRed = true;
                            return;
                        }
                        //手机号码格式必须匹配
                        if (!vm.PHONE_REGEXP.test(vm.address.phone)) {
                            alertService.msgAlert("cancle", "请填写正确的手机号");
                            vm.phoneRed = true;
                            return;
                        }
                        // 地址不能为空
                        if (!vm.provinceId) {
                            alertService.msgAlert("exclamation-circle", "请选择完整地址");
                            return;
                        }
                        if (vm.areas != null && vm.areas.length > 0) {
                            if (!vm.areaId) {
                                alertService.msgAlert("exclamation-circle", "请选择完整地址");
                                return;
                            } else {
                                vm.address.adc = vm.areaId;
                            }
                        } else if (vm.citys && vm.citys.length > 0) {
                            //  直辖区等地
                            if (!vm.cityId) {
                                alertService.msgAlert("exclamation-circle", "请选择完整地址");
                                return;
                            } else {
                                vm.address.adc = vm.cityId;
                            }
                        } else {
                            // 进行对省赋值 (香港 澳门等地)
                            if (!vm.provinceId) {
                                alertService.msgAlert("exclamation-circle", "请选择完整地址");
                                return;
                            } else {
                                vm.address.adc = vm.provinceId;
                            }
                        }
                        var url = "update";
                        if (vm.newadd === 0) {
                            url = "save";
                        }
                        //修改地址
                        $http({
                            method: "POST",
                            url: appConfig.apiPath + '/address/' + url,
                            data: $httpParamSerializer(vm.address),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            }
                        }).then(function () {
                            // 判断 state的params 中 srcState 有没有，没有则返回到主页
                            // 需要注意： $state.go(srcState,{},{reload:true})

                            $scope.fallbackPage();
                        }, function (resp) {
                            if (resp.data.code === "NOT_LOGINED") {
                                $state.go("main.newLogin", {backUrl: window.location.href});
                            }
                        });
                    };
                    vm.cancel = function () {
                        $scope.fallbackPage();
                    };
                    vm.start();
                }
            ]
        );
})();