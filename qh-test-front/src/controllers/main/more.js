(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            /**
             * 更多
             */
            $stateProvider.state("main.more", {
                url: "/more",
                views: {
                    "@": {
                        templateUrl: 'views/main/more/index.root.html',
                        controller: moreController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    moreController.$inject = ['$scope', '$state', 'appConfig'];
    function moreController($scope, $state, appConfig) {
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