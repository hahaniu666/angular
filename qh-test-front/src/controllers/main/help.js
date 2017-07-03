(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 帮助中心
         */
        $stateProvider.state("main.help", {
            url: "/help?s",
            views: {
                "@": {
                    templateUrl: 'views/main/help/index.root.html',
                    controller:helpController
                }
            }
        });
    }]);
    helpController.$inject = ['$httpParamSerializer', '$state', '$scope', '$http', 'appConfig'];
    function helpController($httpParamSerializer, $state, $scope, $http, appConfig) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.pageSize = appConfig.pageSize;
        $scope.maxSize = appConfig.maxSize;
        $scope.imgUrl = appConfig.imgUrl;
        $scope.titleName = "帮助中心";
        $scope.queryHelp = function (curPage) {
            $http({
                method: "get",
                url: appConfig.apiPath + '/helpCenter/pageList?curPage=' + curPage + '&pageSize=' + $scope.pageSize,
                data: $httpParamSerializer(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (data) {
                $scope.categorys = data;
            });
        };


        $scope.queryHelp(1);
        // 分页
        $scope.pageChanged = function () {
            $scope.queryHelp($scope.categorys.curPage);
        };
        $scope.goContent = function (category) {
            $state.go('main.help.cmsPage', {
                id: category.id,
                titleName: category.name
            }, {reload: true});
        };
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();



