(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            /**
             * 登录
             */
            $stateProvider.state("main.newLogin.wxLogin", {
                url: '/wxLogin&s',
                views: {
                    "@": {
                        templateUrl: 'views/main/newLogin/wxLogin/index.root.html',
                        controller: loginController
                    }
                }
            });
        }]);
    loginController.$inject = ['$scope',  '$http',  '$state', "alertService",  'appConfig'];
    function loginController($scope, $http, $state, alertService, appConfig) {
        $scope.srcState = $state.params.backUrl;

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
                            // you may use response.code to get the access token.
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
                        //redirect(uri: defaultBackUrl + "#/register/wx?backUrl=" + backUrlEncode);
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
    }
})();