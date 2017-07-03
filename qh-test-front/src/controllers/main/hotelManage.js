(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.hotelManage", {
                url: "/hotelManage",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/hotelManage/index.root.html',
                        controller: hotelManageController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    hotelManageController.$inject = ['$scope', '$http', '$state', 'appConfig', 'alertService', '$httpParamSerializer', "imgService", "$timeout", "urlbackService"];
    function hotelManageController($scope, $http, $state, appConfig, alertService, $httpParamSerializer, imgService, $timeout, urlbackService) {
        var vm = this;

        vm.getMsg = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + '/managerOrg/index'
            }).then(function (resp) {
                vm.data = resp.data;
            });
        };
        vm.getMsg();
        // 店铺信息
        vm.gotoHotelShare = function () {
            if (vm.data.userOrg) {
                $state.go("main.hotelManage.hotelShare");
            } else {
                alertService.msgAlert("ks-cancle", "商铺功能未开通，请联系业务经理");
            }

        };
        // 商品管理
        vm.gotoItemManage = function () {
            if (vm.data.userOrg) {
                $state.go("main.hotelManage.itemManage");
            } else {
                alertService.msgAlert("ks-cancle", "商铺功能未开通，请联系业务经理");
            }

        };
        // 订单管理
        vm.gotoHotelOrder = function () {
            if (vm.data.userOrg) {
                $state.go("main.hotelManage.hotelOrder");
            } else {
                alertService.msgAlert("ks-cancle", "商铺功能未开通，请联系业务经理");
            }

        };
        // 回退页面
        vm.fallbackPage = function () {
            $state.go("main.index", null, {reload: true});
        };
        //跳转链接
        vm.goUrl = function (url) {
            if (!url) {
                return;
            }
            urlbackService.urlBack(url);
        };
    }
})
();