(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.groupOrder.groupOrderStatus", {
                url: "/groupOrderStatus?groupOrderId&id&orgId",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/groupOrder/groupOrderStatus/index.root.html',
                        controller: groupOrderStatusController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    groupOrderStatusController.$inject = ['$scope', '$cookies', '$http', '$state', 'appConfig', 'alertService', '$mdBottomSheet', "imgService", '$timeout'];
    function groupOrderStatusController($scope, $cookies, $http, $state, appConfig, alertService, $mdBottomSheet, imgService, $timeout) {
        var vm = this;
        $scope.order = {};
        $cookies.orgId = '584662c0dc8d4c2a21c37234';
        $scope.classActive = {};
        $scope.classActive.view = true;
        // $scope.order.status ='UNPAYED';
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        vm.orgId = $state.params.orgId;
        $scope.imgUrl = appConfig.imgUrl;  // 图片地址的URL
        $scope.simpleImg = imgService.simpleImg;
        $scope.s = $state.params.s;
        $scope.showGiftAmout = $state.params.showGiftAmout;
        $scope.imgUrl = appConfig.imgUrl;  // 图片地址的URL
        $scope.simpleImg = imgService.simpleImg;
        $scope.s = $state.params.s;
        $scope.showGiftAmout = $state.params.showGiftAmout;
        // 回退页面
        $scope.fallbackPage = function () {
            $state.go("main.unionOrder", {
                status: $state.params.status,
                orgId: '584662c0dc8d4c2a21c37234'
            }, {reload: true});
        };
        $scope.groupOrderId = $state.params.groupOrderId;
        //id不存在自动回退
        if (!$scope.groupOrderId) {
            alert($state.params.groupOrderId);
            $scope.fallbackPage();
            return;
        }

        //跳转到拼团详情
        $scope.goStartGroup = function () {
            $state.go("main.groupOrder.startGroup", {
                payId: $scope.order.groupOrder.payId,
                id: $scope.order.groupOrder.activityId,
            }, {reload: true});
        };

        //填写物流打开模态窗口
        $scope.inputLogistics = function (refund) {
            $state.go("main.order.refundDetail.logistics", {id: refund.id});
        };
        $scope.queryDetail = function () {
            $http({
                method: 'GET',
                url: appConfig.apiPath + '/groupOrder/groupOrderDetail?groupOrderId=' + $scope.groupOrderId
            }).then(function (resp) {
                $scope.order.groupOrder = resp.data;
                $scope.order.peopleNum = resp.data.unionOrder.activityNum - resp.data.unionOrder.currentNum;
                // 拼团中,还差{{order.peopleNum}}人即可成团
            }, function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        $scope.queryDetail();


        $scope.orderRefund = function (sku) {
            $state.go("main.groupOrder.refund", {
                groupOrderId: $scope.groupOrderId,
                status: $scope.order.groupOrder.status
            }, {reload: true});
        };
        /*
         * 提交订单
         * */
        $scope.createOrder = function () {
            $state.go("main.pay", {
                payId: $scope.order.groupOrder.payId,
                s: "main.groupOrder.groupOrderStatus",
                param: angular.toJson({
                    payId: $scope.order.groupOrder.payId,
                    groupOrderId: $state.params.groupOrderId,
                    id: vm.id
                })
            });
        };
        //取消订单
        $scope.orderCancel = function ($event) {
            alertService.confirm(null, "", "是否取消订单?", "取消", "确定").then(function (data) {
                if (data) {
                    var url = '/groupOrder/cancel';
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + url,
                        params: {groupOrderId: $scope.groupOrderId}
                    }).success(function (data) {
                        $scope.queryDetail();
                    }).error(function (data) {
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                }
            });
        };

        //确认收货
        $scope.orderConfirm = function (r) {
            /*alertService.confirm(ev, "是否确认收货")*/
            alertService.confirm(null, "", "是否确认收货?", "取消", "确定").then(function (data) {
                if (data) {
                    var url = '/groupOrder/confirm';
                    var params = {groupOrderId: $scope.order.groupOrder.id};
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + url,
                        params: params
                    }).success(function (data) {
                        // $scope.queryDetail();
                        $timeout(function () {
                            $state.go("main.order.comment", {
                                groupOrder: $scope.order.groupOrder.id,
                                status: vm.queryStatus
                            }, {reload: true});
                        }, 1000);
                    }).error(function (data) {
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                }
            });
        };

        //去评价
        $scope.orderComment = function (order) {
            $state.go("main.order.comment", {
                groupOrder: $scope.order.groupOrder.id,
                status: vm.queryStatus
            }, {reload: true});
        }
        //遮罩打开与关闭
        vm.mask = false;
        vm.maskShow = function () {
            vm.mask = true;
        };
        vm.maskHide = function () {
            vm.mask = false;
        }
    }
})();