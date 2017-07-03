
(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state("main.extension.help", {
            url: "/help",
            views: {
                "@": {
                    templateUrl: 'views/main/extension/help/index.root.html',
                    controller: helpController
                }
            }
        });
    }]);

    helpController.$inject= ['$scope', '$state', 'appConfig'];
    function helpController($scope, $state, appConfig) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.maxSize = appConfig.maxSize;
        //页面展示页数   5
        $scope.pageSize = appConfig.pageSize;
        //页面展示条数   10
        $scope.imgUrl = appConfig.imgUrl;  // 图片地址的URL

        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();