(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state("main.extension", {
            url: "/extension",
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(false, true);
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/extension/index.root.html',
                    controller: ['$scope', '$http', '$state', '$element', 'appConfig', 'curUser', function ($scope, $http, $state, $element, appConfig, curUser) {
                        $scope.gotoTop = function () {
                            window.scrollTo(0, 0);//滚动到顶部
                        };
                        $scope.gotoTop();
                        $scope.fallbackPage = function () {
                            if (history.length === 1) {
                                $state.go("main.index", null, {reload: true});
                            } else {
                                history.back();
                            }
                        };
                        //+ $scope.user.userInfo.userId   5639bee8f14c85cd463e80f8
                        $scope.user = curUser.data;
                        /**
                         * 用户需要扫描的二维码
                         * @type {string}
                         */
                        $scope.codeUrl = appConfig.share + "?inviterId=" + $scope.user.userInfo.userId;
                        /**
                         * 用户引入会员数
                         */
                        $http.get(appConfig.apiPath + "/user/queryExtension")
                            .success(function (data) {
                                $scope.counts = data;
                            });
                    }]
                }
            }
        });
    }]);
})();