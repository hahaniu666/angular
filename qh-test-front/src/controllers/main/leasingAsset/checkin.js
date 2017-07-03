(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.leasingAsset.checkin", {
            url: '/checkin?id',
            views: {
                "@": {
                    templateUrl: 'views/main/leasingAsset/checkin/index.root.html',
                    controller: checkinController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    checkinController.$inject = ['$scope', '$http', '$state', 'appConfig', 'alertService', '$httpParamSerializer', '$filter', 'curUser'];
    function checkinController($scope, $http, $state, appConfig, alertService, $httpParamSerializer, $filter, curUser) {

        $scope.imgUrl = appConfig.imgUrl;
        $scope.user = curUser.data;


        //回退页面
        var vm = this;
        vm.useList = {orderItems: []};

        vm.creatList = {};
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }

        };
        vm.getUseList = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/hotel/check"
            }).then(function (resp) {
                vm.useList = resp.data.result;
                for (var i = 0; i < vm.useList.orderItems.length; i++) {
                    if (vm.useList.orderItems[i].num === undefined) {
                        vm.useList.orderItems[i].num = 0;
                    }
                }
            });
        };
        vm.getUseList();
        vm.creatHotel = function () {
            var code = vm.useList.orderItems;
            for (var i = 0; i < code.length; i++) {
                if (code[i].num > 0) {
                    vm.creatList[code[i].id] = code[i].num;
                }
            }
            vm.pushList();
        };

        /**
         * 减少
         * @param index
         */

        vm.reduce = function (index) {
            if (vm.useList.orderItems[index].num <= 0) {
                return;
            }
            if (vm.useList.orderItems[index].num === undefined || vm.useList.orderItems[index].num === 0) {
                return;
            } else {
                vm.useList.orderItems[index].num--;
            }
            vm.getTotalPrice();
        };
        /**
         * 添加
         * @param index
         */
        vm.add = function (index) {

            if (vm.useList.orderItems[index].num === undefined) {
                vm.useList.orderItems[index].num = 1;
            } else {
                vm.useList.orderItems[index].num++;
            }
            vm.getTotalPrice();

        };


        /**
         * 获取总价格
         */
        vm.totalPrice = 0;
        vm.getTotalPrice = function () {
            var code = vm.useList.orderItems;
            var price = 0;
            for (var i = 0; i < code.length; i++) {
                if (code[i].num >= 0) {
                    vm.creatList[code[i].id] = code[i].num;
                    price += code[i].price * code[i].num;
                }
            }
            vm.totalPrice = price;
        };


        //提交订单
        vm.pushList = function () {
            $http({
                method: "POST",
                url: appConfig.apiPath + "/hotel/create",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: $httpParamSerializer({
                    data: vm.creatList
                })
            }).then(function (resp) {
                $state.go("main.pay", {payId: resp.data.qhPayId, s: "main.leasingAsset.record"});
            });
        };
    }

})();
