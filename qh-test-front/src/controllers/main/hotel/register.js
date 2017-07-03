(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.hotel.register", {
                url: "/register",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/hotel/register/index.root.html',
                        controller: hotelRegisterController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    hotelRegisterController.$inject = [ '$http', '$state', 'appConfig', 'alertService'];
    function hotelRegisterController( $http, $state, appConfig, alertService) {
        var vm = this;


        // 回退页面
        vm.fallbackPage = function () {
            $state.go("main.index", null, {reload: true});
        };

        vm.PHONE_REGEXP = /^[\d]{11}$/i;
        //手机号blur事件:
        vm.addPhone = function () {
            vm.phoneRed = false;
            vm.PHONE_REGEXP = /^[\d]{11}$/i;
            if (!vm.PHONE_REGEXP.test(vm.hotelPhone)) {
                alertService.msgAlert("exclamation-circle", "请填写正确的手机号");
            }
        };
        //街道blur事件:
        vm.addStreet = function () {
            vm.streetRed = false;
            if (!vm.street) {
                alertService.msgAlert("exclamation-circle", "请填写详细地址");
                vm.streetRed = true;
            }
        };

        //获取省市
        vm.queryAddress = function (id, element) {
            $http({
                method: "GET",
                url: appConfig.apiPath + '/address/select?id=' + id
            }).then(function (resp) {
                switch (element) {
                    case 1:
                        vm.provinces = resp.data.adcs;
                        break;
                    case 2:
                        vm.citys = resp.data.adcs;
                        break;
                    case 3:
                        vm.areas = resp.data.adcs;
                        break;
                }
            }, function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        vm.queryAddress(null, 1);
        vm.queryAddress('330000', 2);
        vm.queryAddress('330100', 3);
        vm.provinceId = '330000';
        vm.cityId = '330100';

        vm.save = function () {

            if (!vm.street) {
                alertService.msgAlert("exclamation-circle", "请详细地址");
                vm.streetRed = true;
                return;
            }

            //收货人姓名长度不能少于2大于10
            if (vm.hotelContact.length < 2 || vm.hotelContact.length > 10) {
                vm.contactRed = true;
                alertService.msgAlert("exclamation-circle", "联系人姓名为2到10个字符");
                return;
            }
            // 电话需要填写
            if (!vm.hotelPhone) {
                alertService.msgAlert("cancle", "联系电话不能为空");
                vm.phoneRed = true;
                return;
            }
            //手机号码格式必须匹配
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
                    vm.adc = vm.areaId;
                }
            } else if (vm.citys && vm.citys.length > 0) {
                //  直辖区等地
                if (!vm.cityId) {
                    alertService.msgAlert("exclamation-circle", "请选择完整地址");
                    return;
                } else {
                    vm.adc = vm.cityId;
                }
            } else {
                // 进行对省赋值 (香港 澳门等地)
                if (!vm.provinceId) {
                    alertService.msgAlert("exclamation-circle", "请选择完整地址");
                    return;
                } else {
                    vm.adc = vm.provinceId;
                }
            }
            //修改地址
            $http({
                method: "POST",
                url: appConfig.apiPath + "/org/save",
                data: {
                    title: vm.title,
                    adc: vm.adc,
                    street: vm.street,
                    hotelContact: vm.hotelContact,
                    hotelPhone: vm.hotelPhone,
                    phone: vm.phone
                }
            }).then(function () {
                alertService.msgAlert("ks-success", "添加成功");
            }, function (resp) {
                if (resp.data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
    }
})();