(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 获取确认订单数据
         */
        $stateProvider.state("main.order.checkOrder", {
            url: '/checkOrder?id&orderId&rentOrder',
            views: {
                "@": {
                    templateUrl: 'views/main/order/checkOrder/index.root.html',
                    controller: 'checkOrderController'
                }
            }
        });
    }]);
    angular.module('qh-test-front')
        .controller('checkOrderController', ['$scope', '$http', '$state', "$stateParams", '$httpParamSerializer', '$rootScope', '$interval', '$filter', 'appConfig', 'orderService', 'alertService', 'imgService', '$timeout',
            function ($scope, $http, $state, $stateParams, $httpParamSerializer, $rootScope, $interval, $filter, appConfig, orderService, alertService, imgService, $timeout) {
                $scope.desc = "赠品乳白色";
                $scope.imgUrl = appConfig.imgUrl;
                $scope.simpleImg = imgService.simpleImg;
                $scope.select = true;
                //返回顶部
                $scope.gotoTop = function () {
                    window.scrollTo(0, 0);//滚动到顶部
                };
                $scope.gotoTop();
                $scope.changeSelect = function () {
                    $scope.select = !$scope.select;
                };
                $scope.ser_user = function () {
                    $http({
                        method: "GET",
                        url: appConfig.apiPath + "/common/sysConf?key=servicePhone"
                    }).then(function (resp) {
                        $scope.phone = resp.data;
                    });
                };
                $scope.ser_user();
                $scope.ser_addr = function () {
                    $http({
                        method: "GET",
                        url: appConfig.apiPath + "/common/sysConf?key=serviceAddr"
                    }).then(function (resp) {
                        $scope.addr = resp.data;
                    });
                };
                $scope.ser_addr();
                // 进行后退
                $scope.fallbackPage = function () {
                    if (history.length === 1) {
                        $state.go("main.index", null, {reload: true});
                    } else {
                        history.back();
                    }
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
                // 订单待付款计算离今天还有多少时间，24小时自动取消
                $scope.startTime = function () {
                    if ($scope.order.orderItems.length > 0) {
                        $rootScope.intervalStop = $interval(function () {
                            var date = new Date().getTime();
                            for (var i = 0; i < $scope.order.orderItems.length; i++) {
                                if ($scope.order.orderItems[i].activity && $scope.order.orderItems[i].activity.deadTime) {
                                    var oldDate = new Date($filter("date")($scope.order.orderItems[i].activity.deadTime, "yyyy/MM/dd HH:mm:ss")).getTime();
                                    // 倒计时到零时，停止倒计时
                                    var rest = oldDate - date;
                                    if (rest <= 0) {
                                        $scope.order.orderItems[i].activityTime = "已超时";
                                        continue;
                                    }
                                    // 天
                                    var days = parseInt(rest / (24 * 3600 * 1000));
                                    //计算出小时数
                                    var leave1 = rest % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
                                    var hours = Math.floor(leave1 / (3600 * 1000));
                                    //计算相差分钟数
                                    var leave2 = rest % (3600 * 1000);        //计算小时数后剩余的毫秒数
                                    var minutes = Math.floor(leave2 / (60 * 1000));

                                    //计算相差秒数
                                    var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
                                    var seconds = Math.round(leave3 / 1000);
                                    $scope.order.orderItems[i].activityTime = days + "天" + hours + "时" + minutes + "分" + seconds + "秒";
                                }
                            }
                        }, 1000);
                    }
                    //赠品
                    if ($scope.order.activitys && $scope.order.activitys.length > 0) {
                        $rootScope.intervalStop = $interval(function () {
                            var date = new Date().getTime();
                            for (var i = 0; i < $scope.order.activitys.length; i++) {
                                if ($scope.order.activitys && $scope.order.activitys[i].deadTime) {
                                    var oldDate1 = new Date($filter("date")($scope.order.activitys[i].deadTime, "yyyy/MM/dd HH:mm:ss")).getTime();
                                    // 倒计时到零时，停止倒计时
                                    var rest1 = oldDate1 - date;
                                    if (rest1 <= 0) {
                                        $scope.order.activitys[i].activityTime1 = "已超时";
                                        continue;
                                    }
                                    // 天
                                    var days = parseInt(rest1 / (24 * 3600 * 1000));
                                    //计算出小时数
                                    var leave1 = rest1 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
                                    var hours = Math.floor(leave1 / (3600 * 1000));
                                    //计算相差分钟数
                                    var leave2 = rest1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
                                    var minutes = Math.floor(leave2 / (60 * 1000));

                                    //计算相差秒数
                                    var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
                                    var seconds = Math.round(leave3 / 1000);
                                    $scope.order.activitys[i].activityTime1 = days + "天" + hours + "时" + minutes + "分" + seconds + "秒";
                                }
                            }
                        }, 1000);
                    }
                };
                $scope.maxOldIntegral = 0;
                /**
                 * 订单是商品的还是租赁的
                 * @type {string}
                 */
                $scope.type = null;
                // 依据不同的状态，进行选择使用不同的url
                $scope.urls = {create: "/qhOrder", union: "/qhOrder", id: "x"};
                if ($state.params.id) {
                    $scope.type = "qhOrder";
                    $scope.urls.id = $state.params.id;
                } else if ($state.params.orderId) {
                    $scope.type = "order";
                    $scope.urls = {create: "/order", union: "/unionOrder", id: $state.params.orderId};
                } else if ($state.params.rentOrder) {
                    $scope.type = "rent";
                    $scope.urls = {create: "/rentOrder", union: "/unionOrder", id: $state.params.rentOrder};
                } else {
                    $scope.fallbackPage();
                    return;
                }
                $scope.orderUseGift = false;       //是否使用礼品卡
                $scope.orderRealUseGift = false;    //真正状态，用来提交
                $scope.canUseGift = true;       //是否能使用礼品卡
                $scope.showGiftAmout = 0;       //用于显示的礼品卡余额

                $scope.showCoupon = true;      //是否显示优惠券操作栏

                //校验订单
                $scope.checkOrder = function () {
                    //判断是修改订单详情，还是从购物车中重新生成订单详情，优先使用参数中的值重新生成
                    // 优先判断订单是否是未提交来的订单
                    $http({
                        method: 'GET',
                        url: appConfig.apiPath + $scope.urls.create + "/check?orderId=" + $scope.urls.id
                    }).then(function (resp) {
                        var data = resp.data;
                        $scope.order = data;
                        $scope.canSelectGift = data.canSelectGift;
                        $scope.canIntegralChoose = data.canIntegralChoose;
                        console.log(' $scope.canIntegralChoose', $scope.canIntegralChoose);
                        $scope.actives();
                        if (!$scope.order.orderList && !$scope.order.serviceList && !$scope.order.rentList && !$scope.order.cleanOrder) {
                            $scope.fallbackPage();
                            return;
                        }
                        //去除服务商品标题的分号
                        if ($scope.order.serviceList) {
                            for (var i = 0; i < $scope.order.serviceList.length; i++) {
                                $scope.order.serviceList[i].title = $scope.order.serviceList[i].title.replace(/;/g, ' ');
                            }
                        }
                        //判断是否使用礼品卡
                        if (data.userGiftAmount === 0) {
                            $scope.canUseGift = false;
                            $scope.orderUseGift = false;
                            $scope.showGiftAmout = 0;
                        } else {
                            $scope.canUseGift = data.canUseGift;
                            if (data.selectedGiftAmount > 0) {
                                //金额大于0，使用了礼品卡
                                $scope.orderUseGift = true;
                                $scope.showGiftAmout = data.selectedGiftAmount;
                            } else {
                                $scope.orderUseGift = false;
                                //未使用礼品卡，判断显示的金额大小
                                if (data.paymentAmount > data.userGiftAmount) {
                                    $scope.showGiftAmout = data.canUseGiftAmount;
                                } else {
                                    // $scope.showGiftAmout = data.paymentAmount;
                                    $scope.showGiftAmout = data.canUseGiftAmount;
                                }
                            }
                        }
                        $scope.orderRealUseGift = $scope.orderUseGift;

                        ////优惠券相关操作
                        if ($scope.order.rentList && !$scope.order.orderList && !$scope.order.serviceList && $scope.order.paymentAmount === 0) {
                            //只有租赁，并且价格为0，隐藏选择优惠券
                            $scope.showCoupon = false;
                        } else {
                            $scope.showCoupon = true;
                        }
                    }, function (resp) {
                        var data = resp.data;
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        } else {
                            $state.go("main.unionOrder");
                        }
                    });
                };
                $scope.checkOrder();

                // 总金额计算，每次更改数据重新计算
                $scope.totalPriceAll = function () {
                    if ($scope.order && $scope.order.orderItems) {
                        if (!$scope.order.usedIntegral) {
                            $scope.order.usedIntegral = 0;
                        }
                        // 判断输入是否是整数
                        $scope.order.usedIntegral = parseInt($scope.order.usedIntegral);
                        if (isNaN($scope.order.usedIntegral)) {
                            $scope.order.usedIntegral = "";
                            return;
                        }
                        // 如果使用的钱币大于现有的钱币，则等于最大钱币
                        if ($scope.order.usedIntegral > $scope.order.userIntegral) {
                            $scope.order.usedIntegral = $scope.order.userIntegral;
                        }
                        // 计算钱币
                        if ($scope.order.usedIntegral >= 0) {
                            $scope.order.orderPrice = $scope.order.orderPrice - $scope.order.usedIntegral + $scope.maxOldIntegral;
                            // 如果钱币超出订单价格,则钱币不能超过当前订单的价格
                            if ($scope.order.orderPrice < 0) {
                                $scope.order.orderPrice = $scope.order.orderPrice + $scope.order.usedIntegral;
                                $scope.order.usedIntegral = $scope.order.orderPrice;
                                if ($scope.order.usedIntegral < 0) {
                                    $scope.order.usedIntegral = 0;
                                }
                                $scope.order.orderPrice = $scope.order.orderPrice - $scope.order.usedIntegral;
                            }
                            $scope.maxOldIntegral = $scope.order.usedIntegral;
                        }
                    }
                };

                //使用礼品卡
                $scope.useGiftCard = function () {
                    $scope.orderRealUseGift = !$scope.orderRealUseGift;
                    $http({
                        method: "GET",
                        url: appConfig.apiPath + '/qhOrder/useGiftAmount',
                        params: {
                            orderId: $scope.urls.id,
                            use: $scope.orderRealUseGift
                        }
                    }).then(function (resp) {
                        var data = resp.data;
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                            return;
                        }
                        $scope.checkOrder();
                    }, function (resp) {
                        var data = resp.data;
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                };

                // 到其他页面更改参数
                // 更改地址 s为此页面传过去的参数
                $scope.updateAddress = function () {
                    $state.go("main.address", {s: $scope.type, orderId: $scope.order.id}, {reload: true});
                };
                // 更改发票抬头
                $scope.updateInvoice = function () {
                    $state.go("main.invoice", {s: $scope.type, orderId: $scope.order.id}, {reload: true});
                };
                // 更改优惠卷的使用
                $scope.updateCoupon = function () {
                    /** 未选择优惠券，跳转到选取页;若已选择优惠券，不可点击 */
                    if (!$scope.order.coupon) {
                        $state.go("main.chooseCoupon", {s: $scope.type, orderId: $scope.order.id}, {reload: true});
                    }
                };
                // 订单不使用发票
                $scope.removeInvoice = function () {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + $scope.urls.union + '/removeInvoice',
                        data: $httpParamSerializer({
                            orderId: $scope.order.id,
                            status: $scope.type
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        $scope.order.invoiceTitle = "";
                    }, function (resp) {
                        var data = resp.data;
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                };
                // 订单不使用优惠卷
                $scope.removeCoupon = function () {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + $scope.urls.union + '/removeCoupon',
                        data: $httpParamSerializer({
                            orderId: $scope.order.id,
                            status: $scope.type
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function (resp) {
                        var data = resp.data;
                        $scope.order.paymentAmount = data.totalPrice;
                        $scope.order.coupon = null;
                        $scope.checkOrder();
                    }, function (resp) {
                        var data = resp.data;
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                };
                $scope.actives = function () {
                    $scope.minusPrice = 0;
                    if ($scope.order.orderList) {
                        for (var i = 0; i < $scope.order.orderList.length; i++) {
                            if ($scope.order.orderList[i].activityPrice) {
                                $scope.minusPrice += $scope.order.orderList[i].activityPrice;
                            }
                        }
                        return;
                    }
                    if ($scope.order.rentList) {
                        for (var j = 0; j < $scope.order.rentList.length; j++) {
                            if ($scope.order.rentList[j].activityPrice) {
                                $scope.minusPrice += $scope.order.rentList[j].activityPrice;
                            }
                        }
                        return;
                    }
                    if ($scope.order.serviceList) {
                        for (var s = 0; s < $scope.order.serviceList.length; s++) {
                            if ($scope.order.serviceList[s].activityPrice) {
                                $scope.minusPrice += $scope.order.serviceList[s].activityPrice;
                            }
                        }
                        return;
                    }
                };

                //是否能点击提交
                $scope.createDisabled = false;
                //生成订单 进行付款
                $scope.createOrder = function () {
                    if ($scope.createDisabled) {

                        return;
                    }
                    if (!$scope.order.id) {
                        alertService.msgAlert("exclamation-circle", "订单错误,请重新刷新");
                        return;
                    }
                    if (!$scope.order.cleanOrder && ( !$scope.order.address || !$scope.order.address.contact)) {
                        alertService.msgAlert("exclamation-circle", "请填写地址");
                        return;
                    }
                    if (!$scope.select) {
                        alertService.msgAlert("exclamation-circle", "您尚未同意租赁协议");
                        return;
                    }
                    //判断订单金额是否为0，金额为0，弹窗确认，直接支付完成
                    if ($scope.order.paymentAmount === 0) {
                        alertService.confirm(null, "", "您确定要提交订单吗?", "点错了", "确定").then(function (data) {
                            if (data) {
                                $scope.realCreate();
                                return;
                            }
                        });
                    } else {
                        $scope.realCreate();
                    }
                };

                $scope.chooseInteral = function (orderItem, isChoose) {
                    // console.log(typeof isChoose);
                    $http({
                        method: "GET",
                        url: appConfig.apiPath + '/qhOrder/calSurplusIntegral',
                        params: {
                            unionOrderId: $state.params.id,
                            status: isChoose,
                            skuId: orderItem.id,
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function (resp) {
                        var data = resp.data;
                        // console.log('data', data);
                        $scope.interalData = data;
                        // console.log('$scope.interalData.integralPrice',$scope.interalData.integralPrice);
                        $scope.checkOrder();
                    }, function (resp) {
                    });
                };

                /**
                 * 真正的创建订单
                 */
                $scope.realCreate = function () {
                    $scope.createDisabled = true;          //提交订单按钮失效
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + $scope.urls.create + "/create",
                        data: $httpParamSerializer({
                            orderId: $scope.order.id,
                            memo: $scope.order.buyerMemo,
                            integral: $scope.order.userIntegral
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function (resp) {
                        if (resp.data.price === 0) {
                            $timeout(function () {
                                $state.go("main.unionOrder.pay.paySuccess", {
                                    seq: resp.data.seq,
                                    price: resp.data.price
                                });
                            }, 1000);
                            return;
                        }
                        var data = resp.data;
                        $state.go("main.pay", {
                            payId: data.qhPay,
                            s: "main.unionOrder"
                        });
                        // 重新计算价格（要求当前商品是选中状态）
                    }, function (resp) {
                        var data = resp.data;
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
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
            }]);
})();