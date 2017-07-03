(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        /**
         * 我的订单
         */
        $stateProvider.state("main.unionOrder", {
            url: '/unionOrder?status&s&hide&orgId',
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(true, true);
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/unionOrder/index.root.html',
                    controller: 'orderController',
                    controllerAs: "vm"
                }
            }
        });

    }]);
    angular.module('qh-test-front')
        .controller('orderController', ['$timeout', '$scope', '$http', '$state', '$filter', '$rootScope', '$interval', '$httpParamSerializer', 'appConfig', "errorService", 'imgService', 'alertService',
            function ($timeout, $scope, $http, $state, $filter, $rootScope, $interval, $httpParamSerializer, appConfig, errorService, imgService, alertService) {
                var vm = this;
                vm.hide = $state.params.hide;
                vm.orgId = $state.params.orgId;
                vm.imgService = imgService;
                //页面展示页数   5
                vm.appConfig = appConfig;
                // 当前请求的是哪个status ，待付款还是全部。。。
                vm.queryStatus = parseInt($state.params.status);
                vm.s = $state.params.s;

                // 初始化查询是哪个状态
                if (!vm.queryStatus || isNaN(vm.queryStatus)) {
                    vm.queryStatus = 1;
                }
                vm.tableIndex = vm.queryStatus - 1;
                vm.gotoTop = function () {
                    window.scrollTo(0, 0);//滚动到顶部
                };
                vm.gotoTop();

                vm.classStatus = [false, false, false, false, false];
                // 初始化选中状态
                vm.initClass = function (num) {
                    num = num - 1;
                    for (var i = 0; i < vm.classStatus.length; i++) {
                        vm.classStatus[i] = false;
                    }
                    vm.classStatus[num] = true;
                };
                // 订单待付款计算离今天还有多少时间，24小时自动取消
                vm.startTime = function () {
                    $rootScope.intervalStop = $interval(function () {
                        var date = new Date().getTime();
                        for (var i = 0; i < vm.orders.orders.length; i++) {
                            if (vm.orders.orders[i].status === "UNPAYED" || vm.orders.orders[i].status === "UNCOMMITED") {
                                var oldTodayDate = new Date($filter("date")(vm.orders.orders[i].lastUpdated, "yyyy/MM/dd HH:mm:ss")).getTime();
                                var oldDate = new Date(oldTodayDate.valueOf() + 1 * 24 * 60 * 60 * 1000);
                                // 倒计时到零时，停止倒计时
                                var rest = oldDate - date;
                                if (rest <= 0) {
                                    vm.orders.orders[i].lastUpdatedTime = "已超时";
                                    continue;
                                }
                                //计算出小时数
                                var leave1 = rest % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
                                var hours = Math.floor(leave1 / (3600 * 1000));
                                //计算相差分钟数
                                var leave2 = rest % (3600 * 1000);        //计算小时数后剩余的毫秒数
                                var minutes = Math.floor(leave2 / (60 * 1000));

                                //计算相差秒数
                                var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
                                var seconds = Math.round(leave3 / 1000);
                                vm.orders.orders[i].lastUpdatedTime = hours + "小时" + minutes + "分" + seconds + "秒";
                            }
                        }
                    }, 1000);
                };
                // 查询订单的物流信息
                vm.queryLogistics = function (orderId) {
                    $state.go("main.order.logistics", {id: orderId, num: 2}, {reload: true});
                };
                //租赁的num传3
                vm.queryLogisticsrent = function (orderId) {
                    $state.go("main.order.logistics", {id: orderId, num: 3}, {reload: true});
                };
                // 查询所有的订单 curPage第几页,status什么状态的,number 是什么的请求,boo是否要重新初始化
                vm.queryAll = function (curPage, status, number, boo) {
                    vm.initClass(number);
                    $http
                        .get(appConfig.apiPath + '/unionOrder/order?status=' + status + '&curPage=' + curPage + '&pageSize=' + appConfig.pageSize)
                        .success(function (data) {
                            //去除商品标题的分号
                            for (var i = 0; i < data.orders.length; i++) {
                                if (data.orders[i].orderItems && data.orders[i].type !== 'RESTITUTION') {
                                    for (var j = 0; j < data.orders[i].orderItems.length; j++) {
                                        data.orders[i].orderItems[j].title = data.orders[i].orderItems[j].title.replace(/;/g, ' ');
                                    }
                                }
                            }
                            if (!vm.orders || !vm.orders.orders || boo) {
                                vm.orders = data;
                            } else {
                                for (var i = 0; i < data.orders.length; i++) {
                                    vm.orders.orders.push(data.orders[i]);
                                }
                            }
                            var page = parseInt(vm.orders.totalCount / vm.orders.pageSize);
                            if (vm.orders.totalCount % vm.orders.pageSize > 0) {
                                page++;
                            }
                            if (page <= vm.orders.curPage) {
                                vm.orders.pageEnd = true;
                            } else {
                                //controller
                                vm.orders.curPage++;
                            }
                        }).error(function (data) {
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                };
                // 导航请求，比如vm.queryStatus == 1的时候，
                // 那么执行 vm.queryCheckAll(vm.orders.curPage)方法！ 请看上面具体方法！
                vm.pageChanged = function (boo) {
                    if (!vm.orders || boo) {
                        // 初始值默认
                        vm.orders = {curPage: 1};
                    }
                    if (vm.queryStatus === 1) {
                        vm.queryAll(vm.orders.curPage, "", 1, boo);
                    } else if (vm.queryStatus === 2) {
                        vm.queryAll(vm.orders.curPage, "UNPAYED", 2, boo);
                    } else if (vm.queryStatus === 3) {
                        vm.queryAll(vm.orders.curPage, "UNSHIPPED", 3, boo);
                    } else if (vm.queryStatus === 4) {
                        vm.queryAll(vm.orders.curPage, "UNRECEIVED", 4, boo);
                    } else {
                        vm.queryAll(vm.orders.curPage, "UNCOMMENTED", 5, boo);
                    }
                    // 返回顶部
                    if (vm.orders.curPage > 1) {
                        vm.gotoTop();
                    }
                };
                vm.pageChanged();//默认查询
                vm.statusQueryAll = function (status) {
                    vm.queryStatus = status;
                    vm.orders = null;
                    vm.pageChanged();//默认查询
                };

                /**
                 * 取消订单，确认接单之前都能取消，接单之后是退货退款，须点击查看商品详情后，再退货
                 * @param ev
                 * @param order
                 * @param status 0,未付款;1,已付款
                 */
                vm.orderCancel = function (ev, order, status) {
                    if (status === 1) {
                        $state.go("main.unionOrder.refund", {
                            orderId: order.id,
                            type: order.type
                        }, {backUrl: window.location.href});
                    } else {
                        /*alertService.confirm(null, "确认取消订单")*/
                        alertService.confirm(null, "", "确认取消订单?", "取消", "确定").then(function (data) {

                            if (data) {
                                if (order.type === 'ORGORDER') {
                                    var url = "/orgRefund/cancel";
                                    $http({
                                        method: "POST",
                                        url: appConfig.apiPath + url,
                                        data: {orderId: order.id}
                                    }).success(function () {
                                        vm.pageChanged(true);
                                    }).error(function () {
                                    });
                                } else if (order.type === 'GROUPORDER') {
                                    var url = '/groupOrder/cancel';
                                    $http({
                                        method: "POST",
                                        url: appConfig.apiPath + url,
                                        params: {groupOrderId: order.id}
                                    }).success(function (data) {
                                        vm.pageChanged(true);
                                    }).error(function (data) {
                                        if (data.code === "NOT_LOGINED") {
                                            $state.go("main.newLogin", {backUrl: window.location.href});
                                        }
                                    });
                                } else {
                                    // 租赁的订单和普通的订单，处理退款是不一样的流程
                                    var url = "/order/cancel";
                                    if (order.type === 'RENT') {
                                        url = "/rentOrder/cancel";
                                    } else if (order.type === 'CLEAN') {
                                        url = "/clean/cancel";
                                    }
                                    $http({
                                        method: "POST",
                                        url: appConfig.apiPath + url,
                                        data: $httpParamSerializer({orderId: order.id}),
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                        }
                                    }).success(function () {
                                        vm.pageChanged(true);
                                    }).error(function () {
                                    });
                                }
                            }
                        });
                    }
                };
                vm.deleteOrder = function (order) {
                    /*alertService.confirm(null, "确认删除订单?")*/
                    alertService.confirm(null, "", "确认删除订单?", "取消", "确定").then(function (data) {
                        if (data) {
                            // 租赁的订单和普通的订单，处理退款是不一样的流程
                            var url = "/order/deleteOrder";
                            if (order.type === 'RENT') {
                                url = "/rentOrder/deleteOrder";
                            }
                            $http({
                                method: "POST",
                                url: appConfig.apiPath + url,
                                data: $httpParamSerializer({
                                    orderId: order.id
                                }),
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                }
                            }).success(function () {
                                vm.pageChanged(true);
                            }).error(function () {
                            });
                        }
                    });
                };
                // 查询商品的详细信息
                vm.queryItem = function (itemId) {
                    $state.go("main.item", {
                        itemId: itemId,
                        //id: vm.id,
                        //categoryId: vm.categoryId,
                        itemName: vm.keyWord
                    }, {reload: true});
                };
                // 确定收货
                vm.orderConfirm = function (ev, order) {
                    /*alertService.confirm(ev, "是否确认收货")*/
                    alertService.confirm(null, "", "是否确认收货?", "取消", "确定").then(function (data) {
                        if (data) {
                            var url;
                            var params;
                            //这接口参数，有毒
                            if (order.type === 'RENT') {
                                url = '/rentOrder/confirm';
                                params = {id: order.id};
                            } else if (order.type === 'ORGORDER') {
                                url = '/orgOrder/confirm';
                                params = {orderId: order.id};
                            } else if (order.type === 'GROUPORDER') {
                                url = '/groupOrder/confirm';
                                params = {groupOrderId: order.id};
                            } else {
                                url = '/order/confirm';
                                params = {orderId: order.id};
                            }
                            $http({
                                method: "POST",
                                url: appConfig.apiPath + url,
                                params: params
                            }).success(function (data) {
                                console.log('1111111111111111111111111111111111111111data====', data);
                                $timeout(function () {
                                    if (order.type === 'RENT') {
                                        $state.go("main.order.comment", {
                                            rentOrder: data.orderId,
                                            status: vm.queryStatus
                                        }, {reload: true});
                                    } else if (order.type === 'ORGORDER') {
                                        $state.go("main.order.comment", {
                                            orgOrder: data.orderId,
                                            status: vm.queryStatus
                                        }, {reload: true});
                                    } else if (order.type === 'GROUPORDER') {
                                        // vm.pageChanged();
                                        $state.go("main.order.comment", {
                                            groupOrder: data.orderId,
                                            status: vm.queryStatus
                                        }, {reload: true});
                                    } else {
                                        $state.go("main.order.comment", {
                                            orderId: data.orderId,
                                            status: vm.queryStatus
                                        }, {reload: true});
                                    }

                                }, 1000);
                            }).error(function (data) {
                                if (data.code === "NOT_LOGINED") {
                                    $state.go("main.newLogin", {backUrl: window.location.href});
                                }
                            });
                        }
                    });
                };
                //再次下单
                vm.againOrder = function (order) {
                    //再次下单
                    var url = "/order/again";
                    if (order.type === 'RENT') {
                        url = "/rentOrder/again";
                    }
                    $http.get(appConfig.apiPath + url + '?orderId=' + order.id)
                        .success(function (data) {
                            if (order.type === 'RENT') {
                                $state.go("main.order.checkOrder", {
                                    id: data.orderId
                                }, {reload: true});
                            } else {
                                $state.go("main.order.checkOrder", {
                                    id: data.orderId
                                }, {reload: true});
                            }
                        })
                        .error(function (data) {
                            if (data.code === "NOT_LOGINED") {
                                $state.go("main.newLogin", {backUrl: window.location.href});
                            }
                        });
                };

                // 转到订单详情页面
                vm.orderDetail = function (order) {
                    if (order.type === 'RENT') {
                        $state.go("main.rentOrder.detail", {
                            rentOrder: order.id,
                            status: vm.queryStatus,
                            rentOrderType: order.type
                        }, {reload: true});
                    } else if (order.type === 'RESTITUTION') {
                        $state.go("main.order.extraDetail", {
                            orderId: order.id,
                            status: vm.queryStatus
                        }, {reload: true});
                    } else if (order.type === 'ORGORDER') {
                        $state.go("main.order.orgDetail", {
                            orderId: order.id,
                            status: vm.queryStatus
                        }, {reload: true});
                    } else if (order.type === 'GROUPORDER') {
                        console.log(order.id);
                        $state.go("main.groupOrder.groupOrderStatus", {
                            groupOrderId: order.id,
                            status: vm.queryStatus
                        }, {reload: true});
                    } else {
                        $state.go("main.order.detail", {orderId: order.id, status: vm.queryStatus}, {reload: true});
                    }

                };
                /**
                 * 申请退款
                 */
                vm.refundPayment = function (order) {
                    $state.go("main.order.extraRefund", {orderId: order.id}, {reload: true});
                };
                //前往付款
                vm.orderPay = function (order) {
                    if (!order) {
                        alertService.msgAlert("exclamation-circle", "请选择订单");
                        return;
                    }

                    if (order.type === "ORGORDER") {
                        // 如果是展柜订单就用这个支付
                        $http({
                            method: "POST",
                            url: appConfig.apiPath + '/orgOrder/qhPay',
                            data: $httpParamSerializer({
                                orderId: order.id
                            }),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            }
                        }).then(function (resp) {
                            var data = resp.data;
                            var datas = {
                                seq: order.seq,
                                price: resp.data.price,
                                id: data.id
                            };
                            var jsons = angular.toJson(datas);
                            $state.go("main.pay", {
                                payId: data.qhPayId,
                                // id: order.id,
                                s: "main.unionOrder",
                                param: jsons
                            });
                            // 重新计算价格（要求当前商品是选中状态）
                        }, function () {

                        });
                    } else if (order.type === "GROUPORDER") {
                        $state.go("main.pay", {
                            payId: order.payId,

                            s: "main.groupOrder.groupOrderStatus",
                            param: angular.toJson({
                                groupOrderId: order.id,
                            })
                        });
                    } else {
                        var datas;
                        if (order.type === "RENT") {
                            datas = {rentOrder: [order.id]};
                        } else if (order.type === "RESTITUTION") {
                            datas = {restitution: [order.id]};
                        } else {
                            datas = {order: [order.id]};
                        }
                        // 生成支付订单来
                        $http({
                            method: "POST",
                            url: appConfig.apiPath + '/unionOrder/qhPay',
                            data: datas
                        }).then(function (resp) {
                            var data = resp.data;
                            $state.go("main.pay", {
                                payId: data.id,
                                // id: order.id,
                                s: "main.unionOrder"
                            });
                            // 重新计算价格（要求当前商品是选中状态）
                        }, function () {

                        });
                    }
                };
                //消毒柜付款
                vm.orderCleanPay = function (order) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + "/unionOrder/clearQhPay",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        data: $httpParamSerializer({id: order.id})
                    }).then(function (resp) {
                        $state.go("main.pay", {
                            payId: resp.data.id,
                            s: "main.order.detail"
                        });
                    });
                };
                // 前往评价页面
                vm.orderComment = function (order) {
                    // 进行不同订单的评价界面
                    if (order.type === 'RENT') {
                        $state.go("main.order.comment", {rentOrder: order.id, status: vm.queryStatus}, {reload: true});
                    } else if (order.type === 'GROUPORDER') {
                        $state.go("main.order.comment", {groupOrder: order.id, status: vm.queryStatus}, {reload: true});
                    } else {
                        $state.go("main.order.comment", {orderId: order.id, status: vm.queryStatus}, {reload: true});
                    }
                };
                //前往评价详情页面
                vm.commentDetail = function (order) {
                    // 进行不同订单的评价界面
                    if (order.type === 'RENT') {
                        $state.go("main.order.commentDetail", {
                            rentOrder: order.id,
                            status: vm.queryStatus
                        }, {reload: true});
                    } else {
                        $state.go("main.order.commentDetail", {
                            orderId: order.id,
                            status: vm.queryStatus
                        }, {reload: true});
                    }
                };
                //服务订单用户已发货
                vm.hadtoMail = function (id) {
                    $state.go("main.order.deliver", {orderId: id}, {reload: true});
                };
                // 回退页面
                vm.fallbackPage = function () {
                    $state.go("main.center", null, {reload: true});
                };
            }]);

})();