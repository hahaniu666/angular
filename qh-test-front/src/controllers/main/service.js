/* FIXME - 如果该文件有在用（比如重新修改），则请删除该行。今后会择机根据该是否有该行，来删除该文件。*/

(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        /**
         * 服务大厅
         */
        $stateProvider.state("main.service", {
            url: "/service?s",
            views: {
                "@": {
                    templateUrl: 'views/main/service/index.root.html',
                    controller: ['$scope', '$http', 'appConfig', "$state", function ($scope, $http, appConfig, $state) {
                        $scope.gotoTop = function () {
                            window.scrollTo(0, 0);//滚动到顶部
                        };
                        $scope.gotoTop();
                        // 回退页面
                        $scope.fallbackPage = function () {

                            $state.go("main.index", null, {reload: true});

                        };
                    }]
                }
            }
        });
    }]);
})();

