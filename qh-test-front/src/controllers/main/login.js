(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            /**
             * 登录
             */
            $stateProvider.state("main.login", {
                url: '/login?s&backUrl&wx',
                views: {
                    "@": {
                        templateUrl: 'views/main/login/index.root.html',
                        controller: loginController

                    }
                }
            });
        }]);
    loginController.$inject = ['$scope', '$state', '$http', '$httpParamSerializer', 'appConfig', "alertService", 'wxService', '$log'];
    function loginController($scope, $state, $http, $httpParamSerializer, appConfig, alertService, wxService, $log) {
        // ios APP下面,对于没有安装微信的sdk方法,进行隐藏
        $scope.wxIconFunction = false;
        if (window.cordova) {
            if (cordova.platformId === 'ios') {
                window.Wechat.isInstalled(function (installed) {
                    if (installed) {
                        $scope.wxIconFunction = true;
                    }
                }, function () {
                    $scope.wxIconFunction = false;
                });
            } else {
                $scope.wxIconFunction = true;
            }
        } else {
            $scope.wxIconFunction = true;
        }
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.user = {
            j_username: "",
            j_password: ""
        };
        $scope.srcState = $state.params.backUrl;
        /**
         * 给予初始化
         * @type {boolean}
         */


        $scope.loginpass = true;
        $scope.loginuser = true;
        //当用户名有的时候
        $scope.userLogin = function () {

            if (!$scope.user.j_username) {
                alertService.msgAlert("exclamation-circle", "请输入用户名");
                $scope.loginuser = true;
            } else {
                $scope.loginuser = false;
            }
        };
        //当密码有的时候
        $scope.passLogin = function () {
            if (!$scope.user.j_password) {
                alertService.msgAlert("exclamation-circle", "请输入密码");
                $scope.loginpass = true;
            } else {
                $scope.loginpass = false;
            }
        };
        $scope.isLogin = false;
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
        // 清除字符串
        $scope.user.type = "password";
        $scope.user.icon = "eye-o";
        $scope.clearText = function (num) {
            if (num === 1) {
                $scope.user.j_username = "";
            } else {
                /*$scope.user.type = "text"*/
                if ($scope.user.type === 'text') {
                    $scope.user.icon = "eye-o";
                    $scope.user.type = "password";
                } else {
                    $scope.user.icon = "ks-eye";
                    $scope.user.type = "text";
                }
            }
        };
        // 进行登陆
        $scope.login = function () {
            if (!$scope.user.j_username) {
                alertService.msgAlert("exclamation-circle", "请输入账号");
                $scope.loginuser = true;
                return;
            }
            if (!$scope.user.j_password) {
                alertService.msgAlert("exclamation-circle", "请输入密码");
                $scope.loginpass = true;
                return;
            }
            $http({
                method: "POST",
                url: appConfig.apiPath + '/j_spring_security_check',
                data: $httpParamSerializer($scope.user),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function () {
                // 判断 state的params 中 srcState 有没有，没有则返回到主页
                // 需要注意： $state.go(srcState,{},{reload:true})
                wxService.initShare();
                $scope.isLogin = true;
                $scope.fallbackPage();
            }).error(function () {
            });
        };
        //微信登录
        var ua = window.navigator.userAgent.toLowerCase();
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
                            $log.log("====== Wechat.auth = " + JSON.stringify(response));
                            // you may use response.code to get the access tok0en.
                            // 进行微信登陆
                            $http.get(appConfig.apiPath + "/weiXin/wxLoginVerify?code=" + response.code + "&state=" + response.state + "&wxType=qhApp")
                                .success(function () {
                                    $scope.isLogin = true;
                                    $scope.fallbackPage();
                                }).error(function (data) {
                                if (data.code === "NOT_WEIXIN") {
                                    $state.go("main.register", {backUrl: $state.params.backUrl}, null);
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

        //跳转到注册
        $scope.toRegister = function () {
            $state.go('main.register', {backUrl: $state.params.backUrl, s: 'center'});
        };

        /**
         * 跳转微信登陆
         */
        if ($state.params.wx === 'true') {
            $scope.wxLogin();
        }
    }
})();