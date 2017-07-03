(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 我的资产
         */
        $stateProvider.state("main.myAssets", {
            url: "/myAssets",
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(true, true);
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/myAssets/index.root.html',
                    controller:myAssetsController
                }
            }
        });
    }]);
    myAssetsController.$injext = ['$scope', '$http', 'appConfig', "$state"];
    function myAssetsController($scope, $http, appConfig, $state) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $http
            .get(appConfig.apiPath + '/user/myAsset')
            .success(function (data) {
                $scope.myAssets = data;
            }).error(function (data) {
            if (data.code === "NOT_LOGINED") {
                $state.go("main.newLogin", {backUrl: window.location.href});
            }
        });
        // 回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();

