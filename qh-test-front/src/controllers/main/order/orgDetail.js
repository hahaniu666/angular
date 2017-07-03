(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单详情
         */
        $stateProvider.state("main.order.orgDetail", {
            url: '/orgDetail?orderId',
            views: {
                "@": {
                    templateUrl: 'views/main/order/orgDetail/index.root.html',
                    controller: detailControll
                }
            }
        });
    }]);
    detailControll.$inject = ['$timeout', '$scope', '$http', '$state', '$httpParamSerializer', 'appConfig', 'imgService', "alertService"];
    function detailControll($timeout, $scope, $http, $state, $httpParamSerializer, appConfig, imgService, alertService) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.imgUrl = appConfig.imgUrl;  // 图片地址的URL
        $scope.simpleImg = imgService.simpleImg;
        $scope.s = $state.params.s;
        $scope.showGiftAmout = $state.params.showGiftAmout;
        // 回退页面
        $scope.fallbackPage = function () {
            $state.go("main.unionOrder", {status: $state.params.status}, {reload: true});
        };
        $scope.orderId = $state.params.orderId;
        if (!$scope.orderId) {
            $scope.fallbackPage();
            return;
        }
        // 进度条进行显示几个
        $scope.classActive = {
            css: [false, false, false, false, false, false],
            status: 0,
            view: false,
            confirm: "确认收货"
        };
        $scope.classIndexActive = function (index) {
            $scope.classActive.css = [false, false, false, false, false, false];
            $scope.classActive.status = index;
            for (var i = 0; i < index; i++) {
                $scope.classActive.css[i] = true;
            }
            $scope.classActive.view = true;
        };
        // 查看商品的详情
        $scope.itemDetail = function (orderItem) {
            $state.go("main.item", {itemId: orderItem.itemId, skuId: orderItem.id,userOrg:$scope.order.userOrgId});
        };
        // 查看商品的具体详情
        $scope.queryDetail = function () {
            $http({
                method: 'GET',
                url: appConfig.apiPath + '/orgOrder/detail?orderId=' + $scope.orderId
            }).then(function (resp) {
                var data = resp.data;
                $scope.order = data.result;
                if ($scope.order.orderList) {
                    $scope.order.orderItems = $scope.order.orderList;
                    $scope.order.orderList = null;
                } else {
                    $scope.order.orderItems = $scope.order.serviceList;
                    $scope.order.serviceList = null;
                }
                $scope.actives();
                if ($scope.order.type === 'SALE') {
                    if ($scope.order.status === 'UNPAYED') {
                        $scope.classIndexActive(1);
                    }
                    if ($scope.order.status === 'UNCONFIRMED' || $scope.order.status === 'CANCELING'|| $scope.order.status === 'PAYED') {
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
                }
                //判断配送方式
                $scope.setType();
            }, function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        $scope.queryDetail();
        $scope.setType = function () {
            if ($scope.order.logisticsType === "STOCK"){
                $scope.lagis = "现货";
            } else if ($scope.order.logisticsType === "TWO"){
                $scope.lagis = "2小时达";
            }else if ($scope.order.logisticsType === "TWENTYFOUR"){
                $scope.lagis = "24小时达";
            }else if ($scope.order.logisticsType === "LOGISTICS"){
                $scope.lagis = "普通快递";
            }
        };
        $scope.orderComment = function () {
            $state.go("main.order.comment", {orgOrder: $scope.order.id}, {reload: true});
        };
        $scope.commentDetail = function () {
            $state.go("main.order.commentDetail", {
                orgOrder: $scope.order.id
            }, {reload: true});
        };
        // 查询订单的物流信息
        $scope.queryLogistics = function () {
            $state.go("main.order.logistics", {id: $scope.order.logistics, num: 1}, {reload: true});
        };
        //填写物流打开模态窗口
        $scope.inputLogistics = function (refund) {
            $state.go("main.order.refundDetail.logistics", {id: refund.id});
        };
        // 订单再次购买
        $scope.againOrder = function () {
            $http({
                method: 'GET',
                url: appConfig.apiPath + '/order/again?orderId=' + $scope.order.id
            }).then(function (resp) {
                var data = resp.data;
                $state.go("main.order.checkOrder", {
                    id: data.orderId
                }, {reload: true});
            }, function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        // 前往付款
        $scope.orderPay = function () {
            // 生成支付订单来
            $http({
                method: "POST",
                url: appConfig.apiPath + '/orgOrder/qhPay',
                data: $httpParamSerializer({
                    orderId: $scope.order.id
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                var param = angular.toJson({orderId: $scope.order.id, status: $state.params.status});
                $state.go("main.pay", {
                    payId: resp.data.qhPayId,
                    s: "main.order.orgDetail",
                    param: param
                });
            }, function () {
            });
        };
        //未提交订单重新提交
        $scope.commitOrder = function () {
            if ($scope.order.status === 'UNCOMMITED') {
                $state.go("main.order.checkOrder", {
                    orderId: $scope.order.id,
                    s: 'detail'
                }, {reload: true});
            }
        };
        //订单指定满减活动算总额
        $scope.actives = function () {
            $scope.minusPrice = 0;
            for (var i = 0; i < $scope.order.orderItems.length; i++) {
                if ($scope.order.orderItems[i].activityPrice) {
                    $scope.minusPrice += $scope.order.orderItems[i].activityPrice;
                }
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
                        url: appConfig.apiPath + '/order/deleteOrder',
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
                        data = data.data;
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                }
            });
        };
        // 单个SKu确认收货
        $scope.refundSkuSign = function (refund) {
            alertService.confirm("商品已签收", $scope).then(function (data) {
                if (data) {
                    // 删除订单
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/order/refundSku',
                        data: $httpParamSerializer({refundId: refund.id, status: 'SENDING'}),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        $scope.queryDetail();
                    }, function (resp) {
                        var data = resp.data;
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                }
            });
        };
        // 单个SKu确认收货
        $scope.refundSkuDenied = function (refund) {
            alertService.confirm("商品已拒签", $scope).then(function (data) {
                if (data) {
                    // 删除订单
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/order/refundSku',
                        data: $httpParamSerializer({refundId: refund.id, status: 'RECEIVED'}),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        $scope.queryDetail();
                    }, function (resp) {
                        var data = resp.data;
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                }
            });
        };
        // 申请退货
        $scope.orderRefund = function (sku) {
            $state.go("main.order.orgRefund", {
                s: "detail",
                orderId: $scope.order.id,
                no: sku.no,
                type: $scope.order.type,
                status: $scope.order.status,
                sku: sku.id
            }, {reload: true});
        };
        // 查看退款详情
        $scope.refundDetail = function (orderItem) {
            if (!orderItem.refund) {
                return;
            }
            $state.go("main.order.refundDetail", {
                id: orderItem.refund.id
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
                    type: $scope.order.type
                }, {backUrl: window.location.href});
            } else {
                alertService.confirm(null, "", "确认取消订单", "取消", "确定").then(function (data) {
                    if (data) {
                        // 租赁的订单和普通的订单，处理退款是不一样的流程
                        $http({
                            method: "POST",
                            url: appConfig.apiPath + "/orgRefund/cancel",
                            data: {orderId: $scope.order.id}
                        }).then(function () {
                            $scope.queryDetail();
                            $scope.classActive.view = false;
                        }, function () {
                            //error
                        });
                    }
                });
            }
        };
        // 订单确认收货
        $scope.orderConfirm = function () {
            /*alertService.confirm(null, "确认收货")*/
            alertService.confirm(null, "", "确认收货", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/orgOrder/confirm',
                        data: $httpParamSerializer({
                            orderId: $scope.order.id
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        $timeout(function () {
                            $state.go("main.unionOrder", null, {reload: true});
                        }, 1000);
                    }, function () {

                    });
                }
            });
        };
        //服务订单用户寄出快递
        $scope.hadtoMail = function (id) {
            $state.go("main.order.deliver", {orderId: id}, {reload: true});
        };
        //查看消毒柜
        $scope.machine = function () {
            $state.go("main.store.machine", {id: $scope.order.id}, {reload: true});
        };
    }
})();