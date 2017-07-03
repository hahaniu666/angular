(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.groupOrder.groupOrderConfirm", {
                url: "/groupOrderConfirm?activityId&unionGroupOrderId&skuId&num&orderId&groupOrderId&buyStatus&backAddr&id&orgId",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/groupOrder/groupOrderConfirm/index.root.html',
                        controller: groupOrderConfirmController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);
    // ----------------------------------------------------------------------------
    groupOrderConfirmController.$inject = ['$scope', '$cookies', '$http', '$state', 'appConfig', 'alertService', '$mdBottomSheet', "imgService", '$timeout'];
    function groupOrderConfirmController($scope, $cookies, $http, $state, appConfig, alertService, $mdBottomSheet, imgService, $timeout) {
        $cookies.orgId = '584662c0dc8d4c2a21c37234';
        var vm = this;
        vm.imgUrl = appConfig.imgUrl;
        vm.id = $state.params.activityId;
        vm.unionGroupOrderId = $state.params.unionGroupOrderId;
        vm.skuId = $state.params.skuId;
        vm.num = $state.params.num;
        vm.orderId = $state.params.orderId ? $state.params.orderId : '';
        vm.buyStatus = $state.params.buyStatus;
        vm.backAddr = $state.params.backAddr;
        vm.orgId = $state.params.orgId;

        vm.id = $state.params.id;
        vm.skuId = $state.params.skuId;
        $scope.getData = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/groupOrder/check ",
                params: {
                    unionGroupOrderId: '',
                    groupOrderId: $state.params.groupOrderId,
                    orderId: vm.orderId
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                    var data = resp.data;
                    vm.address = data.shippingAddr;
                    vm.groupOrder = data.groupOrder;
                    vm.itemSku = data.itemSku;
                    vm.order = data.order;
                }, function () {

                }
            );
        };
        $scope.getData();


        /*
         * 提交订单
         * */
        $scope.createOrder = function () {
            if (!vm.address.contact) {
                alertService.msgAlert("exclamation-circle", "请选择地址");
                return;
            }
            //$scope.pay($scope.orderId);       //测试支付，可把该行注释打开，下面请求注释，以免提交订单失败
            $http({
                method: "GET",
                url: appConfig.apiPath + "/groupOrder/create",
                params: {
                    memo: vm.memo,
                    orderId: vm.order.id
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                vm.payId = resp.data.qhPay;
                $state.go("main.pay", {
                    payId: vm.payId,
                    s: "main.groupOrder.startGroup",
                    param: angular.toJson({
                        payId: vm.payId,
                        groupOrderId: $state.params.groupOrderId,
                        id: vm.id,
                        skuId: vm.skuId,
                        orgId: vm.orgId
                    })
                });
            }, function (resp) {
                alertService.msgAlert('exclamation-circle', resp.data.message)
            });
        };


        //初始化numWords
        $scope.numWords = 200;
        //补充说明里面, 字数限制.
        $scope.checkText = function () {
            if ($scope.order.buyerMemo.length > 200) {
                $scope.order.buyerMemo = $scope.order.buyerMemo.substr(0, 200);
            }
            //剩余字数
            $scope.numWords = 200 - $scope.order.buyerMemo.length;
        };
        // 进行后退
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", {orgId: '584662c0dc8d4c2a21c37234'}, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();