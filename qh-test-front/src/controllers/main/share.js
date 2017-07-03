
(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state("main.share", {
            url: '/share?backUrl&inviterId',
            views: {
                "@": {
                    controller: shareController
                }
            }
        });
    }]);
    shareController.$inject = ['$scope', '$http', '$state', 'appConfig', "userService"];
    function shareController($scope, $http, $state, appConfig, userService) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        // 判断是否已经登陆
        if (userService.isLogined()) {
            if ($state.params.backUrl) {
                location.href = $state.params.backUrl + "&s=fx";
            } else {
                $state.go("main.index", null, {reload: true});
            }
        } else {
            var url = "";
            if ($state.params.backUrl) {
                url = encodeURIComponent($state.params.backUrl + "&s=fx");
            }
            if ($state.params.inviterId) {
                // 设置cookie
                /**
                 * 在微信浏览器中 使用cookStore不能种下cookie
                 * @type {string}
                 */
                document.cookie = 'inviterId=' + $state.params.inviterId;
                //$http
                //    .get(appConfig.apiPath + '/user/setCookie?inviterId=' + $state.params.inviterId)//$state.params.backUrl
                //    .success(function (data, status, headers, config) {
                // cookie设置完转发注册或者分享
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                    // 将参数进行组装传回
                    $http
                        .get(appConfig.apiPath + '/weiXin/wxOauthLogin?backUrl=' + url)//$state.params.backUrl
                        .success(function (data) {
                            window.location.href = data.uri;
                        });
                } else {
                    $state.go("main.register", {
                        //inviterId: $state.params.inviterId,
                        backUrl: url,
                        s: "index"
                    });
                }
                //});
            } else {
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                    // 将参数进行组装传回
                    $http
                        .get(appConfig.apiPath + '/weiXin/wxOauthLogin?backUrl=' + url)//$state.params.backUrl
                        .success(function (data) {
                            window.location.href = data.uri;
                        });
                } else {
                    $state.go("main.register", {
                        //inviterId: $state.params.inviterId,
                        backUrl: url,
                        s: "index"
                    });
                }
            }
        }

        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();