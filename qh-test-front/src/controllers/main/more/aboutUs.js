(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            /**
             * 关于我们
             */
            $stateProvider.state("main.more.aboutUs", {
                url: '/aboutUs',
                views: {
                    "@": {
                        templateUrl: 'views/main/more/aboutUs/index.root.html',
                        controller: AboutUsController

                    }
                }
            });
        }]);
    AboutUsController.$inject = ['$scope', '$state', 'appConfig'];
    function AboutUsController($scope, $state, appConfig) {
        $scope.version = appConfig.appVersion;
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