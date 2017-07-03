(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单详情
         */
        $stateProvider.state("main.rentOrder.detail", {
            url: '/detail?rentOrder&rentOrderType',
            views: {
                "@": {
                    templateUrl: 'views/main/rentOrder/detail/index.root.html',
                    controller: detailController
                }
            }
        });
    }]);
    detailController.$inject = ['$timeout', '$scope', '$http', '$state', '$httpParamSerializer',  'appConfig', 'imgService', "alertService"];
    function detailController($timeout, $scope, $http, $state, $httpParamSerializer,  appConfig, imgService, alertService) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.imgUrl = appConfig.imgUrl;  // 图片地址的URL
        $scope.simpleImg = imgService.simpleImg;
        $scope.s = $state.params.s;
        // 回退页面
        $scope.fallbackPage = function () {
            $state.go("main.unionOrder", {status: $state.params.status}, {reload: true});
        };
        $scope.rentOrder = $state.params.rentOrder;
        if (!$scope.rentOrder) {
            $scope.fallbackPage();
            return;
        }
        // 进度条进行显示几个
        $scope.classActive = {
            css: [false, false, false, false, false],
            status: 0,
            view: false,
            confirm: "确认收货"
        };
        $scope.classIndexActive = function (index) {
            $scope.classActive.css = [false, false, false, false, false];
            $scope.classActive.status = index;
            for (var i = 0; i < index; i++) {
                $scope.classActive.css[i] = true;
            }
            $scope.classActive.view = true;
        };
        $scope.queryDetail = function () {
            $http({
                method: 'GET',
                url: appConfig.apiPath + '/rentOrder/detail?orderId=' + $scope.rentOrder
            }).then(function (resp) {
                var data = resp.data;
                $scope.order = data;
                $scope.actives();
                for (var i = 0; i < $scope.order.rentList.length; i++) {
                    if ($scope.order.rentList[i].refund) {
                        $scope.classActive.confirm = "确认";
                        break;
                    }
                }
                if ($scope.order.status === 'UNPAYED') {
                    $scope.classIndexActive(1);
                }
                if ($scope.order.status === 'UNCONFIRMED' || $scope.order.status === 'CANCELING') {
                    $scope.classIndexActive(2);
                }
                if ($scope.order.status === 'UNSHIPPED' || $scope.order.status === 'UNRECEIVED') {
                    $scope.classIndexActive(3);
                }
                if ($scope.order.status === 'UNCOMMENTED') {
                    $scope.classIndexActive(4);
                }
                if ($scope.order.status === 'FINISHED') {
                    $scope.classIndexActive(5);
                }
            }, function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        $scope.queryDetail();
        // 前往评价页面
        $scope.orderComment = function () {
            // 进行不同订单的评价界面
            $state.go("main.order.comment", {
                rentOrder: $scope.order.id
            }, {reload: true});
        };
        // 查看订单的评价
        $scope.commentDetail = function () {
            $state.go("main.order.commentDetail", {
                rentOrder: $scope.order.id
            }, {reload: true});
        };

        // 订单再次购买
        $scope.againOrder = function () {
            $http.get(appConfig.apiPath + '/rentOrder/again?orderId=' + $scope.order.id)
                .success(function (data) {
                    $state.go("main.order.checkOrder", {
                        id: data.orderId
                    }, {reload: true});
                })
                .error(function (data) {
                    if (data.code === "NOT_LOGINED") {
                        $state.go("main.newLogin", {backUrl: window.location.href});
                    }
                });
        };
        // 查询订单的物流信息
        $scope.queryLogistics = function () {
            $state.go("main.order.logistics", {id: $scope.order.id, num: 3}, {reload: true});
        };
        // //请求租赁订单最新消息
        $http({
            method: 'GET',
            url: appConfig.apiPath + '/rentOrder/orderTrack?id=' + $scope.rentOrder
        }).then(function (resp) {
            var data = resp.data;
            $scope.logistics = data;
        }, function (resp) {
            var data = resp.data;
            if (data.code === "NOT_LOGINED") {
                $state.go("main.newLogin", {backUrl: window.location.href});
            }
        });
        //订单指定满减活动算总额
        $scope.actives = function () {
            $scope.minusPrice = 0;
            for (var i = 0; i < $scope.order.rentList.length; i++) {
                if ($scope.order.rentList[i].activityPrice) {
                    $scope.minusPrice += $scope.order.rentList[i].activityPrice;
                }
            }
        };
        // 前往付款
        $scope.orderPay = function () {

            if (!$scope.select) {
                alertService.msgAlert("exclamation-circle", "您尚未同意租赁协议");
                return;
            }

            var datas = {rentOrder: [$scope.order.id]};
            // 生成支付订单来
            $http({
                method: "POST",
                url: appConfig.apiPath + '/unionOrder/qhPay',
                data: datas
            }).then(function (resp) {
                $state.go("main.unionOrder.pay", {
                    orderId: resp.data.id,
                    s: "detail",
                    id: "$scope.order.id"
                }, {reload: true});
                // 重新计算价格（要求当前商品是选中状态）
            }, function () {
                //error
            });
        };
        //未提交订单重新提交
        $scope.commitOrder = function () {
            if ($scope.order.status === 'UNCOMMITED') {
                $state.go("main.order.checkOrder", {
                    rentOrder: $scope.order.id,
                    s: 'rent'
                }, {reload: true});
            }
        };
        // 删除订单
        $scope.deleteOrder = function () {
            /*alertService.confirm(null, "确认删除订单")*/
            alertService.confirm(null, "", "确认删除订单", "取消", "确定").then(function (data) {
                if (data) {
                    // 删除订单
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/rentOrder/deleteOrder',
                        data: $httpParamSerializer({orderId: $scope.order.id}),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).success(function () {
                        alertService.msgAlert("success", "删除成功");
                        $timeout(function () {
                            $scope.fallbackPage();
                        }, 1000);
                    }).error(function (data) {
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                }
            });
        };
        // 查看商品的详情
        $scope.itemDetail = function (orderItem) {
            $state.go("main.item", {itemId: orderItem.itemId, skuId: orderItem.id});
        };
        // 申请退货
        $scope.orderRefund = function (rentItem) {
            if ($state.params.rentOrderType === 'RENT') {
                $state.go("main.leasingAsset", {
                    /*  orderId: $scope.order.id*/
                }, {reload: true});
            } else {
                $state.go("main.rentOrder.refund", {
                    id: rentItem.rentItemId,
                    rentOrder: $scope.order.id
                }, {reload: true});
            }
        };
        // 查看退款详情
        $scope.refundDetail = function (id) {
            $state.go("main.order.refundDetail", {
                id: id
            }, {reload: true});
        };
        //取消订单
        $scope.orderCancel = function () {
            var status = 1;
            if ($scope.order.status === 'UNPAYED') {
                status = 0;
            }
            if (status === 1) {
                $state.go("main.unionOrder.refund", {
                    orderId: $scope.order.id,
                    type: "RENT"
                }, {backUrl: window.location.href});
            } else {
                /*alertService.confirm(ev, "确认取消订单")*/
                alertService.confirm(null, "", "确认取消订单", "取消", "确定").then(function (data) {
                    if (data) {
                        // 租赁的订单和普通的订单，处理退款是不一样的流程
                        $http({
                            method: "POST",
                            url: appConfig.apiPath + "/rentOrder/cancel",
                            params: {orderId: $scope.order.id}
                        }).success(function () {
                            $scope.queryDetail();
                        }).error(function () {
                        });
                    }
                });
            }
        };
        // 订单确认收货
        $scope.orderConfirm = function () {
            /*alertService.confirm(ev, "是否确认收货")*/
            alertService.confirm(null, "", "是否确认收货", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/rentOrder/confirm',
                        params: {id: $scope.order.id}
                    }).success(function () {
                        $timeout(function () {
                            // 进行不同订单的评价界面
                            $state.go("main.order.comment", {
                                rentOrder: $scope.order.id
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

        $scope.select = true;
        $scope.changeSelect = function () {
            $scope.select = !$scope.select;
        };


        $scope.goRentPage = function () {
            var type = "";
            for (var i = 0; i < $scope.order.rentList.length; i++) {
                if ($scope.order.rentList[i].type === 'RENT_QUILT') {
                    type = "RENTH";
                    break;
                } else if ($scope.order.rentList[i].type === 'STUDENT_RENT') {
                    type = "RENT";
                    break;
                }
            }
            if (type) {
                $http({
                    method: 'GET',
                    url: appConfig.apiPath + "/common/rentAgreement?type=" + type
                }).then(function (resp) {
                    var data = resp.data;
                    var id = data.data.id;
                    if (id) {
                        $state.go("main.cms.detail", {id: id, backUrl: window.location.href});
                    }

                }, function () {
                    alertService.msgAlert("exclamation-circle", "协议信息获取失败了！");
                });
            }
        };
    }
})();