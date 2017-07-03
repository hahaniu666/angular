(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.giftCommon.giftSuccess", {
            url: '/giftSuccess',
            views: {
                "@": {
                    templateUrl: 'views/main/giftCommon/giftSuccess/index.root.html',
                    controller: giftSuccessController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    giftSuccessController.$inject = ['$scope', '$http', '$state', 'appConfig', '$compile'];
    function giftSuccessController($scope, $http, $state, appConfig, $compile) {
        $scope.imgUrl = appConfig.imgUrl;
        $scope.style = {};
        $scope.notLogin = false;
        $scope.id = $state.params.id;
        $http({
            method: "GET",
            url: appConfig.apiPath + '/giftPackage/info',
            params: ({
                id: $scope.id
            })
        }).then(function (resp) {
            $scope.data = resp.data.data;
            $scope.successMainhtmls = $scope.data.successMainImg;

            var ele = $compile($scope.data.successMainImg)($scope);
            angular.element('#parent').append(ele);
        }, function () {


        });

        // 回退页面
        $scope.fallbackPage = function () {
            $state.go("main.index", null, {reload: true});
        };

    }
})();
