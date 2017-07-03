(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            /**
             * 登录
             */
            $stateProvider.state("main.gift", {
                url: '/gift?id&giftNo&s',
                views: {
                    "@": {
                        controller: loginGiftwxGzController
                    }
                }
            });
        }]);
    loginGiftwxGzController.$inject = ['$scope',  '$http',  '$state',  'wxService', 'appConfig'];
    function loginGiftwxGzController($scope,  $http,  $state,  wxService, appConfig) {
        $scope.srcState = $state.params.backUrl;
        //微信登录
        $scope.loginUrl = $state.params.url ? $state.params.url : "";
        $scope.param = {};
        $scope.wxLogin = function () {
            var login = "/newGift?id=" + $state.params.id + "&giftNo=" + $state.params.giftNo;
            wxService.wxLogin("https:" + appConfig.rootPath + "#" + login, login);
        };
        if ($state.params.s) {
            $http
                .get(appConfig.apiPath + '/common/sysConfMin?key=' + $state.params.s)
                .then(function (resp) {
                    $scope.setCookie(resp.data.result, "brandId");
                    $scope.setCookie(resp.data.result, "orgId");
                    $scope.wxLogin();
                });
        } else {
            $scope.wxLogin();
        }
        $scope.setCookie = function (params, key) {
            var indexOfBrand = params.indexOf(key);
            // 有品牌的参数进行放入cookie
            if (params.indexOf(key) > -1) {
                // 从品牌处分割
                params = params.substring(indexOfBrand);
                // 获取当前的参数
                // 有其他参数则进行分割
                if (params.indexOf("&") > -1) {
                    params = params.substring(0, params.indexOf("&"));
                }
                // 分割字符串
                var paramMap = params.split("=");
                // 参数正确才进行设置
                if (paramMap.length === 2) {
                    if (paramMap[1] === 'null') {
                        paramMap[1] = '-1';
                    }
                    document.cookie = paramMap[0] + '=' + paramMap[1];
                }
            } else {
                document.cookie = key + '=;-1';
            }
        };
    }
})();