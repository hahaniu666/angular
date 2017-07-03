(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         *
         */
        $stateProvider.state("main.previewTemplate.sayLove", {
            url: '/sayLove?orgId',
            views: {
                "@": {
                    templateUrl: 'views/main/previewTemplate/sayLove/index.root.html',
                    controller: previewTemplateSayLoveController
                }
            }
        });
    }]);
    previewTemplateSayLoveController.$inject = ['$scope', 'appConfig', 'imgService', '$http', '$state'];
    function previewTemplateSayLoveController($scope, appConfig, imgService, $http, $state) {


        $scope.appConfig = appConfig;
        $scope.imgService = imgService;
        $scope.slideImg = imgService.slideImg;
        $scope.imgUrl = appConfig.imgUrl;
        $scope.simpleImg = imgService.simpleImg;

        $scope.orgId = $state.params.orgId;
        $scope.getGroupOrder = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/groupBuy/groupBuyList?pageSize=30"
            }).then(function (resp) {
                $scope.orderList = resp.data;
                console.log('$scope.orderList====>>>', $scope.orderList);
            });
        };
        $scope.getGroupOrder();
        $scope.fallbackPage = function () {
            $state.go("main.index", {orgId: '584662c0dc8d4c2a21c37234'}, {reload: true});
        };
    }
})();
