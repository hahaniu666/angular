(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.newPage", {
                url: "/newPage?type",
                views: {
                    "@": {
                        templateUrl: 'views/main/newPage/index.root.html',
                        controller: newPageController,
                        controllerAs: "vm"
                    }
                },
            });
        }]);


    // ----------------------------------------------------------------------------
    newPageController.$inject = ['$scope', '$http', '$state', 'appConfig', 'alertService', 'imgService', "$timeout", "$mdDialog"];
    function newPageController($scope, $http, $state, appConfig, alertService, imgService, $timeout, $mdDialog) {
        $scope.comments = new Array(3);
        $scope.appConfig = appConfig;
        $scope.imgService = imgService;
        $scope.slideImg = imgService.slideImg;
        $scope.imgUrl = appConfig.imgUrl;
        $scope.simpleImg = imgService.simpleImg;
        $scope.indexBelowImg = imgService.indexBelowImg;
        $scope.type = $state.params.type;

        console.log($scope.type);
        if (!$state.params.type) {
            $scope.type = 'HOT';
        }

        if ($scope.type == 'HOT') {
            $scope.title = '聚划算';
        } else if ($scope.type == 'ANCIENT') {
            $scope.title = '古法工艺';
        }

        $scope.getDate = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/jngy/findByType?type=" + $scope.type
            }).then(function (resp) {
                $scope.list = resp.data;
                console.log($scope.list);
            });
        };
        $scope.getDate();

        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();