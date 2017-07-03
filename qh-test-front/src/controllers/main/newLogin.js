(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            /**
             * 登录
             */
            $stateProvider.state("main.newLogin", {
                url: '/newLogin?backUrl&inviterId&from&lottery',
                views: {
                    "@": {
                        templateUrl: 'views/main/newLogin/index.root.html',
                        controller: newLoginController
                    }
                }
            });
        }]);
    newLoginController.$inject = ['$scope', '$rootScope', '$http', '$interval', '$state', "alertService", 'appConfig', '$httpParamSerializer'];
    function newLoginController($scope, $rootScope, $http, $interval, $state, alertService, appConfig, $httpParamSerializer) {

        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.params = {
            wxLogin: false,
            phoneLogin: false
        };
        //来自哪个路由
        $scope.stateNameFrom = $state.params.from;

        $scope.lottery = $state.params.lottery;

        $scope.bindPhoneLogin = function (url) {
            $scope.params.phoneLogin = true;
            $scope.params.title = '手机号登录';
            $scope.confirm = '登录';
            $scope.user = {};
            $scope.fsyzm = "发送验证码";
            $scope.state = 1;
            $scope.sendCode = function () {
                //发送验证码
                $http.get(appConfig.apiPath + "/user/sendCode?codeType=USER_REG&account=" + $scope.user.phone + "&regType=PHONE")
                    .success(function () {
                        alertService.msgAlert("success", "已发送");
                        if ($rootScope.intervalStop) {
                            $interval.cancel($rootScope.intervalStop);//解除计时器
                        }
                        var i = 60;
                        $rootScope.intervalStop = $interval(function () {
                            i--;
                            $scope.fsyzm = i + 'S';
                            $scope.state = 2;
                            if (i <= 0) {
                                $scope.fsyzm = "重新发送";
                                $scope.state = 1;
                                $interval.cancel($rootScope.intervalStop);//解除计时器
                                $rootScope.intervalStop = null;
                            }
                        }, 1000);
                    })
                    .error(function () {

                    });

            };
            $scope.isPhoneNumTrue = false;
            //限制手机号输入，只能输入以1开头的数字，不做正则验证
            $scope.checkPhone = function () {
                var phone = $scope.user.phone + '';
                //如果未输入
                if (!phone || phone === '' || phone === 'null') {
                    $scope.isPhoneNumTrue = false;
                    return -1;
                }
                //如果不是数字、不是以小数点结尾或者不是以1开头，抹去最后一位
                if (isNaN(phone) || phone.substr(0, 1) !== '1') {
                    $scope.user.phone = phone.substr(0, phone.length - 1);
                    $scope.isPhoneNumTrue = false;
                    return -1;
                }
                //如果长度超过11，抹去最后一位
                if (phone.length > 11) {
                    $scope.user.phone = phone.substr(0, phone.length - 1);
                    $scope.isPhoneNumTrue = true;
                    return -1;
                }
                if (phone.length !== 11) {
                    $scope.isPhoneNumTrue = false;
                    return -1;
                }
                $scope.isPhoneNumTrue = true;
                return 0;
            };

            //点击发送验证码，执行此函数
            $scope.openDialogCode = function (ev) {
                $scope.checkPhone();
                if (!$scope.isPhoneNumTrue) {
                    alertService.msgAlert("cancle", "请输入正确的手机号码");
                    return;
                }
                if ($scope.waitShow) {
                    return;
                }
                $scope.sendCode(ev);       //打开弹窗
            };

            $scope.isCodeNumTrue = false;
            //限制验证码输入
            $scope.checkCode = function () {
                var code = $scope.user.code + '';
                //如果未输入
                if (!code || code === '' || code === 'null') {
                    $scope.isCodeNumTrue = false;
                    return -1;
                }
                //如果不是数字，抹去最后一位
                if (isNaN(code)) {
                    $scope.user.code = code.substr(0, code.length - 1);
                    $scope.isCodeNumTrue = false;
                    return -1;
                }
                //如果长度超过11，抹去最后一位
                if (code.length > 6) {
                    $scope.user.code = code.substr(0, code.length - 1);
                    $scope.isCodeNumTrue = true;
                    return -1;
                }
                if (code.length !== 6) {
                    $scope.isCodeNumTrue = false;
                    return -1;
                }
                $scope.isCodeNumTrue = true;
                return 0;
            };

            $scope.submit = function () {
                //提交数据
                $http({
                    method: 'POST',
                    url: appConfig.apiPath + '/user/loginPhone',
                    data: $httpParamSerializer({
                        phone: $scope.user.phone,
                        code: $scope.user.code
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(function () {
                    $scope.isLogin = true;
                    if ($scope.isLogin && $state.params.backUrl) {
                        // 登陆成功才能返回刚才的url
                        var urldecode = decodeURIComponent($state.params.backUrl);
                        location.href = urldecode;
                    }
                    else {
                        history.go(-1);
                    }
                });
            };
            //租赁协议
            $scope.goRent = function () {
                $http({
                    method: 'GET',
                    url: appConfig.apiPath + "/common/rentAgreement?type=USER"
                }).then(function (resp) {
                    var data = resp.data;
                    var id = data.data.id;
                    if (id) {
                        $state.go("main.cms.detail", {id: id, backUrl: window.location.href});
                    }
                }, function () {
                    alertService.msgAlert("exclamation-circle", "协议信息获取失败了！");
                });

            };
        };
        $scope.wxLogin = function () {
            $scope.params.wxLogin = true;
            $scope.srcState = $state.params.backUrl;
            $scope.params.title = '登录';
            //微信登录
            window.navigator.userAgent.toLowerCase();
            $scope.wxLogin = function () {
                var url = "";
                if ($scope.srcState) {
                    // 在这里要重新给url解码后在重新编码
                    url = decodeURIComponent($scope.srcState);
                    url = encodeURIComponent(url);
                }
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                    $http
                        .get(appConfig.apiPath + '/weiXin/wxOauthLogin?backUrl=' + url)
                        .success(function (data) {
                            window.location.href = data.uri;
                            $scope.isLogin = true;
                        });
                } else if (window.cordova) {
                    var scope = "snsapi_userinfo";
                    window.Wechat.isInstalled(function (installed) {
                        if (!installed) {
                            alertService.msgAlert("cancle", "您尚未安装微信!");
                            return;
                        }
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
                                // 进行微信登陆
                                $http.get(appConfig.apiPath + "/weiXin/wxLoginVerify?code=" + response.code + "&state=" + response.state + "&wxType=qhApp")
                                    .then(function (resp) {
                                        if (resp.data.code === "NOT_WEIXIN") {
                                            $state.go("main.newLogin.bindPhone", {backUrl: $state.params.backUrl}, null);
                                            return;
                                        }
                                        $scope.isLogin = true;
                                        $scope.fallbackPage();
                                    }, function (resp) {
                                        if (resp.data.code === "NOT_WEIXIN") {
                                            $state.go("main.newLogin.bindPhone", {backUrl: $state.params.backUrl}, null);
                                        }
                                    });
                            }, function () {
                            });
                        }).error(function () {
                        });
                    }, function () {
                        alertService.msgAlert("cancle", "您尚未安装微信!");
                    });

                } else {
                    $http
                        .get(appConfig.apiPath + '/weiXin/wxWebLogin?backUrl=' + url)
                        .success(function (data) {
                            window.location.href = data.uri;
                        });
                }
            };
        };
        // 回退页面
        $scope.fallbackPage = function () {
            if ($scope.isLogin && $state.params.backUrl) {
                // 登陆成功才能返回刚才的url
                var urldecode = decodeURIComponent($state.params.backUrl);
                location.href = urldecode;
            } else if ($state.params.s === "index" || history.length <= 2 || $scope.isLogin) {
                $state.go("main.index", null, {reload: true});
                return;
            } else {
                history.back();
            }
        };
        var url = "";
        if ($state.params.backUrl) {
            url = encodeURIComponent($state.params.backUrl);
        }
        //ua.match判断浏览器类型来进行选择登录类型
        var ua = window.navigator.userAgent.toLowerCase();
        if (window.cordova) {
            window.Wechat.isInstalled(function (installed) {
                if (installed) {        //若是安装了微信，则进行微信登录，否则进行手机号登录
                    $scope.wxLogin();
                    $scope.$apply();
                } else {    //没安装微信，进行进行手机号登录
                    $scope.bindPhoneLogin(url);
                    $scope.$apply();
                }
            }, function () {
                $scope.bindPhoneLogin(url);
                $scope.$apply();
            });
        } else if (ua.match(/MicroMessenger/i) || ua.match(/windows/i) || ua.match(/mac/i) || ua.match(/linux/i)) {    //不是web浏览器，手机内进行判断
            $scope.wxLogin();
            if ($scope.stateNameFrom === 'staffactivity') {
                $scope.wxLogin();
            }
        } else {
            $scope.bindPhoneLogin(url);
        }

        if ($scope.lottery) {
            $scope.wxLogin();
        }
    }
})();