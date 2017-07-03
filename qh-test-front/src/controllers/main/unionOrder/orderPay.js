(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单付款
         */
        $stateProvider.state("main.unionOrder.pay", {
            url: '/pay?orderId&id&payType&payId', // orderId代表的是qhPay的支付Id.id只有在详情页面进来的时候才有值,payType支付方式
            views: {
                "@": {
                    templateUrl: 'views/main/unionOrder/pay/index.root.html',
                    controller: orderPayController
                }
            }
        });
    }]);
    orderPayController.$inject = ['alertService', '$httpParamSerializer', '$scope', '$http', '$state', '$log', '$timeout', '$rootScope', '$interval', 'appConfig', '$mdDialog', '$mdBottomSheet'];
    function orderPayController(alertService, $httpParamSerializer, $scope, $http, $state, $log, $timeout, $rootScope, $interval, appConfig, $mdDialog, $mdBottomSheet) {
        // ios APP下面,对于没有安装微信的sdk方法,进行隐藏
        $scope.orderId = $state.params.orderId;
        $scope.pay = $state.params.payId;
        $scope.wxIconFunction = true;
        if (!$scope.pay) {
            //window.cordova
            if (window.cordova) {
                //app中，默认支付宝支付
                $scope.pay = '2';
                $state.params.payType = '支付宝支付';
            } else {
                $scope.pay = '1';
                $state.params.payType = '微信支付';
            }
        }
        // 选则不同的支付
        $scope.checkPay = function (status) {
            $scope.pay = status;
            if ($scope.pay === '0') {
                // 余额
                $scope.wxpay = false;
            } else if ($scope.pay === '1') {
                //微信付
                $scope.wxpay = true;
            } else if ($scope.pay === undefined || $scope.pay === '2') {
                // 默认付款方式支付宝支付
                $scope.pay = '2';
            }
        };
        $scope.checkPay($scope.pay);
        $scope.ccc = '2';
        if ($scope.pay) {
            $scope.ccc = $scope.pay;
        }

        //余额支付，先校验账户，再打开密码框
        $scope.checkSetPay = function () {
            $http({
                method: 'GET',
                url: appConfig.apiPath + '/payment/check',
                data: $httpParamSerializer({
                    out_trade_no: $state.params.orderId
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                var data = resp.data;
                if (data.code === "NOT_PAY_PASS") {
                    $state.go("main.user.setPay");
                } else if (data.code === "BALANCE") {
                    alertService.confirm(null, "", "余额不足,请充值!", "取消", "去充值").then(function (data) {
                        if (data) {
                            $state.go("main.wallet.recharge");
                        } else {
                            $mdBottomSheet.hide();
                        }
                    });
                } else if (data.code === 'SUCCESS') {
                    $scope.details();
                }
            }, function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                } else if (data.code === "AMOUNT_ZERO") {
                    $timeout(function () {
                        $state.go("main.unionOrder", {status: 6});
                    }, 500);
                }
            });
        };

        //弹出6位密码输入框
        $scope.details = function () {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'views/main/unionOrder/pay/payPasswordDialog.html',
                controllerAs: "vm",
                controller: ["$httpParamSerializer", "FileUploader", function ($httpParamSerializer, FileUploader) {
                    var vm = this;
                    vm.cancel = function () {
                        $mdBottomSheet.hide(false);
                    };

                    //设置密码存储
                    vm.pwds = [];
                    vm.pwdsString = vm.pwds.join(".");
                    //设置密码显示方式
                    vm.dots = [false, false, false, false, false, false];

                    //点击数字
                    vm.num = function (num) {
                        if (vm.pwds.length < 6) {
                            vm.pwds.push(num);
                        }
                        var pwd = "";
                        for (var i = 0; i < vm.pwds.length; i++) {
                            vm.dots[i] = true;
                            pwd += vm.pwds[i];
                        }
                        if (vm.pwds.length === 6) {
                            //向后台发请求
                            vm.submit(pwd);
                        }
                    };
                    //删除密码
                    vm.deletePwds = function () {
                        vm.pwds.pop();
                        vm.dots = [false, false, false, false, false, false];
                        for (var i = 0; i < vm.pwds.length; i++) {
                            vm.dots[i] = true;
                        }
                    };

                    //进行支付
                    vm.submit = function (pwd) {
                        $http({
                            method: 'POST',
                            url: appConfig.apiPath + '/payment/pay',
                            data: $httpParamSerializer({
                                out_trade_no: $state.params.orderId,
                                password: pwd
                            }),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            }
                        }).then(function (resp) {
                            var data = resp.data;
                            if (data.code === "SUCCESS" || data.code === "AMOUNT_ZERO") {
                                alertService.msgAlert("success", "支付成功");
                                $timeout(function () {
                                    $state.go("main.unionOrder.pay.paySuccess", {
                                        seq: $scope.qhPay.seq,
                                        price: $scope.qhPay.price
                                    });
                                }, 1000);
                            } else if (data.code === "BALANCE") {
                                alertService.confirm(null, "", "余额不足,请充值!", "取消", "去充值").then(function (data) {
                                    if (data) {
                                        $state.go("main.wallet.recharge");
                                    } else {
                                        $mdBottomSheet.hide();
                                    }
                                });
                            } else if (data.code === "ERROR") {
                                alertService.confirm(null, "", data.msg, "重新输入", "忘记密码").then(function (data) {
                                    if (data) {
                                        $state.go("main.user.setPay", {status: 0});     //跳去忘记密码页
                                    } else {
                                        vm.dots = [false, false, false, false, false, false];
                                        vm.pwds = [];
                                    }
                                });
                            }
                        }, function (resp) {
                            var data = resp.data;
                            if (data.code === "NOT_LOGINED") {
                                $state.go("main.newLogin", {backUrl: window.location.href});
                            } else if (data.code === "AMOUNT_ZERO") {
                                $timeout(function () {
                                    $state.go("main.unionOrder", {status: 6});
                                }, 500);
                            }
                        });
                    };

                    vm.updateAvatar = function () {
                        angular.element("#uploaderFile").click();
                    };
                    var uploader = vm.uploader = new FileUploader({
                        url: appConfig.apiPath + '/common/uploadImgS',
                        autoUpload: true
                    });
                    // FILTERS
                    uploader.filters.push({
                        name: 'customFilter',
                        fn: function () {
                            return this.queue.length < 30;
                        }
                    });

                    uploader.onSuccessItem = function (fileItem, response) {
                        $http({
                            method: "POST",
                            url: appConfig.apiPath + '/user/updateUserInfo',
                            data: $httpParamSerializer({yunFileId: response.id}),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            }
                        }).then(function () {
                            $mdBottomSheet.hide(response);
                        }, function (resp) {
                            var data = resp.data;
                            if (data.code === "NOT_LOGINED") {
                                $state.go("main.newLogin", {backUrl: window.location.href});
                            }
                        });
                    };
                }],
                parent: '.ks-main'
            }).then(function (response) {
                if (response) {
                    $scope.user.userInfo.avatar = response.avatar;
                }
            });
        };


        //设置支付密码点信息
        $scope.pwds = [];
        $scope.dots = [false, false, false, false, false, false];
        $scope.num = function (num) {
            if ($scope.pwds.length < 6) {
                $scope.pwds.push(num);
            }
            for (var i = 0; i < $scope.pwds.length; i++) {
                $scope.dots[i] = true;
            }
        };


        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.isPayLogin = false;
        $scope.id = $state.params.id;
        // 是服务订单购买还是订单购买
        $scope.s = $state.params.s;

        // 微信支付是否在微信内的浏览器打开，在其他浏览器暂时不给显示
        $scope.payWXWay = false;
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
            // 处于微信浏览器，打开微信支付
            $scope.payWXWay = true;
        }
        // 在微信内支付进行操作
        if ($scope.payWXWay) {
            // 先获取 微信 JS SDK 的配置
            $http({
                method: 'GET',
                url: appConfig.apiPath + '/weiXin/jsSdkConf',
                params: {
                    url: location.href.split('#')[0]
                }
            }).then(function (resp) {
                resp.data.jsApiConf.debug = false;
                $log.info("已经获取了微信JS SDK 的配置对象", resp.data.jsApiConf);
                $scope.wxReady = true;
                wx.config(resp.data.jsApiConf);
                wx.error(function (res) {
                    $log.info("微信调用出错了 ", res);
                });
                return resp.data;
            });
        }


        // 回退页面
        $scope.fallbackPage = function () {
            if ($scope.isLogin) {
                $state.go("main.unionOrder", {status: 3}, {reload: true});
            } else if ($scope.id && $state.params.s === 'detail') {
                history.back();
            } else {
                $state.go("main.unionOrder", null, {reload: true});
            }
        };

        /**
         * 选择支付方式
         */

        $scope.choosePayMethod = function () {
            if ($scope.qhPay.price === 0) {
                //订单金额为零，只能用余额支付
                $scope.pay = '0';
                return;
            }
            $state.go("main.unionOrder.pay.payMethod", {
                id: $scope.orderId,
                payType: $state.params.payType,
                payId: $scope.pay
            }, {reload: true});
        };

        $scope.qhPay = {};

        $scope.goTitle = "去支付";

        $http({
            method: 'GET',
            url: appConfig.apiPath + "/unionOrder/queryOrder?id=" + $state.params.orderId
        }).then(function (resp) {
            var data = resp.data;
            $scope.qhPay = data;
            if ($scope.qhPay.price === 0) {
                $scope.goTitle = "下一步";
            }
        }, function () {
            $timeout(function () {
                $scope.fallbackPage();
            }, 500);
        });
        // 防止支付重复请求
        $scope.payRepeat = false;
        // 进行支付
        $scope.payment = function () {
            if ($scope.payRepeat) {
                return;
            }
            /**if($scope.qhPay.price == 0){
                //订单金额为零，只能用余额支付
                $scope.pay = 0;
            }*/
            if ($scope.pay === '2') {
                if (window.cordova && window.alipay) {
                    $scope.payRepeat = true;
                    // 支付宝支付
                    // 服务订单使用其他url
                    $http({
                        method: 'POST',
                        url: appConfig.apiPath + '/payment/aliPay',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        data: $httpParamSerializer({
                            type: 'APP',
                            out_trade_no: $state.params.orderId,
                            version: 2
                        })
                    }).then(function (resp) {
                        window.alipay.pay(resp.data, function () {
                            alertService.msgAlert("success", "支付成功");
                            $timeout(function () {
                                $scope.fallbackPage();
                            }, 1000);
                        }, function () {
                            $scope.payRepeat = false;
                        });
                    }, function (resp) {
                        var data = resp.data;
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        } else if (data.code === "AMOUNT_ZERO") {
                            $timeout(function () {
                                $state.go("main.unionOrder", {status: 6});
                            }, 500);
                        }
                        $scope.payRepeat = false;
                    });
                } else {
                    $scope.payRepeat = true;
                    // 支付宝支付
                    // 服务订单使用其他url
                    var url = "/payment/aliPay?version=2&out_trade_no=" + $state.params.orderId;
                    $http({
                        method: 'POST',
                        url: appConfig.apiPath + url,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function (resp) {
                        var data = resp.data;
                        var urldecode = decodeURIComponent(data.uri);
                        window.location.href = urldecode;
                    }, function (resp) {
                        var data = resp.data;
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        } else if (data.code === "AMOUNT_ZERO") {
                            $timeout(function () {
                                $state.go("main.unionOrder", {status: 6});
                            }, 500);
                        }
                        $scope.payRepeat = false;
                    });
                }
            } else if ($scope.pay === '1') {
                if (window.cordova) {
                    window.Wechat.isInstalled(function (installed) {
                        if (!installed) {
                            alertService.msgAlert("cancle", "您尚未安装微信!");
                            return;
                        }
                        $scope.payRepeat = true;
                        $http({
                            method: 'POST',
                            url: appConfig.apiPath + '/weiXin/buy',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            },
                            data: $httpParamSerializer({
                                type: $scope.s,
                                orderId: $state.params.orderId,
                                wxType: 'qhApp'
                            })
                        }).then(function (resp) {
                            var data = resp.data;
                            var payParams = data.payParams;
                            Wechat.sendPaymentRequest(payParams, function () {
                                $scope.isLogin = true;
                                alertService.msgAlert("success", "支付成功");
                                $timeout(function () {
                                    $scope.fallbackPage();
                                }, 1000);
                            }, function () {
                                $scope.payRepeat = false;

                            });
                        }, function (data) {
                            data = data.data;
                            if (data.code === 'NOT_WEIXIN') {
                                var scope = "snsapi_userinfo";
                                window.Wechat.isInstalled(function () {
                                    // 获取登录用的 state
                                    $http({
                                        method: "POST",
                                        url: appConfig.apiPath + '/weiXin/genLoginState',
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                        }
                                    }).success(function (genState) {
                                        // 调用微信 APP 进行登录
                                        window.Wechat.auth(scope, genState.state, function (response) {
                                            $log.log("====== Wechat.auth = " + JSON.stringify(response));
                                            // you may use response.code to get the access token.
                                            // 获取该商品的属性
                                            $http({
                                                method: 'GET',
                                                url: appConfig.apiPath + "/weiXin/wxLoginVerify?code=" + response.code + "&state=" + response.state + "&wxType=qhApp"
                                            }).then(function () {

                                                $scope.isLogin = true;
                                                $scope.fallbackPage();
                                            }, function (resp) {
                                                var data = resp.data;
                                                if (data.code === "NOT_WEIXIN") {
                                                    $state.go("main.newLogin", {backUrl: $state.params.backUrl}, null);
                                                }
                                            });
                                        }, function () {
                                        });
                                    }).error(function () {
                                        //redirect(uri: defaultBackUrl + "#/register/wx?backUrl=" + backUrlEncode);
                                    });

                                }, function () {
                                    alertService.msgAlert("cancle", "您尚未安装微信");
                                });
                            } else if (data.code === "AMOUNT_ZERO") {
                                $timeout(function () {
                                    $state.go("main.unionOrder", {status: 1});
                                }, 500);
                            }
                            $scope.payRepeat = false;
                        });
                    }, function () {
                        alertService.msgAlert("cancle", "您尚未安装微信!");
                    });
                } else if ($scope.payWXWay) {
                    // 微信内支付
                    if (!$scope.wxReady) {
                        return;
                    }
                    $scope.payRepeat = true;
                    $http({
                        method: 'POST',
                        url: appConfig.apiPath + '/weiXin/buy',
                        data: $httpParamSerializer({
                            orderId: $state.params.orderId
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function (resp) {
                        $scope.payRepeat = false;
                        var data = resp.data;
                        var payParams = data.payParams;
                        payParams.success = function () {
                            $scope.payRepeat = false;
                            $scope.isLogin = true;
                            $scope.fallbackPage();
                        };
                        payParams.fail = function () {
                            $scope.payRepeat = false;
                        };
                        wx.chooseWXPay(payParams);
                    }, function (resp) {
                        var data = resp.data;
                        if (data.code === 'NOT_WEIXIN') {
                            var url = encodeURIComponent(location.href);
                            $http({
                                method: 'GET',
                                url: appConfig.apiPath + '/weiXin/wxOauthLogin?backUrl=' + url
                            }).then(function (resp) {
                                var data = resp.data;
                                window.location.href = data.uri;
                            }, function () {

                            });
                        } else if (data.code === "AMOUNT_ZERO") {
                            $timeout(function () {
                                $state.go("main.unionOrder", {status: 1});
                            }, 500);
                        }
                        $scope.payRepeat = false;
                    });
                } else {
                    $scope.payRepeat = true;
                    // 扫码支付
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/weiXin/buy',
                        data: $httpParamSerializer({
                            type: $scope.s,
                            orderId: $state.params.orderId,
                            wxType: "qhPubScan"
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        notShowError: true
                    }).success(function (data) {
                        $scope.payRepeat = false;
                        if (data.code === "AMOUNT_ZERO") {
                            $timeout(function () {
                                $scope.fallbackPage();
                            }, 500);
                            return;
                        }
                        $mdDialog.show({
                            templateUrl: 'views/main/unionOrder/pay/dialog/index.root.html',
                            parent: angular.element(document.body).find('#qh-wap'),
                            targetEvent: null,
                            clickOutsideToClose: true,
                            fullscreen: false,
                            controller: [function () {
                                var vm = this;
                                vm.cancel = function () {
                                    $mdDialog.cancel();
                                };
                                vm.payUrl = data;
                                $rootScope.intervalStop = $interval(function () {
                                    $http({
                                        method: 'GET',
                                        url: appConfig.apiPath + '/weiXin/findBuy?id=' + vm.payUrl.id
                                    }).then(function (resp) {
                                        var data = resp.data;
                                        if (data.pay) {
                                            $scope.paySuccess = true;
                                            $timeout(function () {
                                                $mdDialog.hide(true);
                                            }, 1000);
                                            $interval.cancel($rootScope.intervalStop);
                                            $rootScope.intervalStop = undefined;
                                        }
                                    }, function () {

                                    });
                                }, 1500);
                            }],
                            controllerAs: "vm"
                        }).then(function (answer) {
                            if (answer) {
                                $scope.fallbackPage();
                            }
                        }, function () {
                            if ($rootScope.intervalStop) {
                                $interval.cancel($rootScope.intervalStop);
                                $rootScope.intervalStop = undefined;
                            }
                        });
                    }).error(function (data) {
                        if (data.code === 'NOT_WEIXIN') {
                            var url = encodeURIComponent(location.href);
                            var ua = window.navigator.userAgent.toLowerCase();
                            if (ua.match(/MicroMessenger/i)) {
                                alertService.msgAlert("exclamation-circle", "该订单已经支付完成,返回商品订单中查看");
                                $http({
                                    method: 'POST',
                                    url: appConfig.apiPath + '/weiXin/wxOauthLogin',
                                    data: $httpParamSerializer({
                                        backUrl: url
                                    }),
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                    }
                                }).then(function (resp) {
                                    var data = resp.data;
                                    window.location.href = data.uri;
                                }, function () {

                                });
                            } else {
                                $http({
                                    method: 'POST',
                                    url: appConfig.apiPath + '/weiXin/wxWebLogin',
                                    data: $httpParamSerializer({
                                        backUrl: url
                                    }),
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                    }
                                }).then(function (resp) {
                                    var data = resp.data;
                                    window.location.href = data.uri;
                                }, function () {

                                });
                            }
                        } else if (data.code === "AMOUNT_ZERO") {
                            $timeout(function () {
                                $state.go("main.unionOrder", {status: 6});
                            }, 500);
                        }
                        $scope.payRepeat = false;
                    });
                }
            }
            else {
                // 信息错误返回
                return;
            }
        };

    }
})();