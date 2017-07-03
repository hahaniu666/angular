(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            /**
             * 登录
             */
            $stateProvider.state("main.wxLogin", {
                url: '/wxLogin?backUrl&url',
                views: {
                    "@": {
                        controller: loginwxGzController
                    }
                }
            });
        }]);
    loginwxGzController.$inject = ['$scope',  '$http', '$state', "alertService", 'wxService', 'appConfig'];
    function loginwxGzController($scope, $http, $state, alertService, wxService, appConfig) {
        $scope.srcState = $state.params.backUrl;
        //微信登录
        window.navigator.userAgent.toLowerCase();
        $scope.loginUrl = $state.params.url ? $state.params.url : "";
        $scope.wxLogin = function () {
            var url = "";
            if ($scope.srcState) {
                // 在这里要重新给url解码后在重新编码
                url = decodeURIComponent($scope.srcState);
                url = encodeURIComponent(url);
            }
            wxService.wxLogin(url, $scope.loginUrl);
        };
        $scope.wxLogin();
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