(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.imgWrap", {
                url: "/imgWrap?itemId&itemName&s&skuId&type&num&sku&fromId",
                views: {
                    "@": {
                        templateUrl: 'views/main/imgWrap/index.root.html',
                        controller: imgWrapController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);

    // ----------------------------------------------------------------------------
    imgWrapController.$inject = ['$scope', '$http', '$state', 'appConfig', "imgService"];
    function imgWrapController($scope, $http, $state, appConfig, imgService) {
        $scope.slideImg = imgService.slideImg;
        $scope.simpleImg = imgService.simpleImg;
        $scope.itemImg = imgService.itemImg;
        $scope.imgUrl = appConfig.imgUrl;
        $scope.itemId = $state.params.itemId;
        $scope.fromId = $state.params.fromId;
        $scope.queryItemDetail = function () {
            $http.get(appConfig.apiPath + "/item/detail?itemId=" + $scope.itemId + "&userId=" + $scope.fromId)
                .success(function (data) {
                    $scope.data = data;
                    // console.log(data);
                });
        };
        $scope.url = location.href.replace(/imgWrap/, 'item');
        $scope.url1 = location.href;
        $scope.getShortUrl = function () {
            $http({
                method: "post",
                url: appConfig.dwzApiPath,
                data: {
                    url: $scope.url,
                }
            }).then(function (resp) {
                var data = resp.data;
                // console.log('data', data);
                $scope.qrCodeKey = data.data;
                $scope.qrCodeUrl = appConfig.dwzUrlPath + $scope.qrCodeKey;
                // console.log($scope.qrCodeUrl)
            });
        };
        $scope.getShortUrl();
        $scope.queryItemDetail();
    }
})();