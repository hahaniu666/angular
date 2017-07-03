(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.hotel", {
                url: "/hotel",
                views: {
                    "@": {
                        templateUrl: 'views/main/hotel/index.root.html',
                        controller: hotelController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    hotelController.$inject = ['$scope', '$http', '$state', 'appConfig', "imgService"];
    function hotelController($scope, $http, $state, appConfig, imgService) {
        var vm = this;

        $scope.imgUrl = appConfig.imgUrl;
        $scope.simpleImg = imgService.simpleImg;
        $scope.slideImg = imgService.slideImg;

        $scope.getList = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/org/list",
                params: {
                    type: 'HOTEL',
                    curPage: 1,
                    pageSize: 99
                }
            }).then(function (resp) {
                    $scope.data = resp.data;
                }, function () {
                }
            );
        };
        $scope.getList();

        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();