(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        /**
         * 二级产品分类下查询商品信息
         */
        $stateProvider.state("main.jnCategory", {
            url: "/jnCategory?status",
            resolve: {
                // 当前的用户信息
                curUser: ['userService', function (userService) {
                    var curUser = userService.getCurUser(true, false);
                    return curUser;
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/jnCategory/index.root.html',
                    controllerAs: 'vm',
                    controller: jnCategoryController
                }
            }
        });
    }]);
    jnCategoryController.$inject = ['$http', '$state', '$rootScope', '$interval', '$timeout',
        '$scope', 'appConfig', 'imgService', '$mdDialog', '$stateParams', 'alertService', "curUser"];
    function jnCategoryController($http, $state, $rootScope, $interval, $timeout,
                                  $scope, appConfig, imgService, $mdDialog, $stateParams, alertService, curUser) {
        $scope.imgUrl = appConfig.imgUrl;
        $scope.status = $stateParams.status;

        if ($scope.status == 'smjnList') {
            $scope.listTitle = '水墨江南'
        } else if ($scope.status == 'shjnList') {
            $scope.listTitle = '诗画江南'
        } else {
            $scope.listTitle = '锦绣江南'
        }

        /*
         * 获取可变数据
         * */
        $scope.getData = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/jngy/list",
            }).then(function (resp) {
                    $scope.allData = resp.data;
                    $scope.jngyItemList = resp.data.jngyItemList;
                    $scope.jngyItems = resp.data.jngyItems;
                    // console.log($scope.allData);
                    $scope.allData = [];
                    // $scope.jxjnData = [];
                    // $scope.shjnData = [];
                    // $scope.smjnData = [];
                    $scope.carouselDate = [];

                    for (name in $scope.jngyItemList) {
                        // if ($scope.jngyItemList[name].name == 'JXJN') {
                        //     $scope.jxjnData.push($scope.jngyItemList[name].data);
                        // }
                        // if ($scope.jngyItemList[name].name == 'SHJN') {
                        //     $scope.shjnData.push($scope.jngyItemList[name].data);
                        // }
                        // if ($scope.jngyItemList[name].name == 'SMJN') {
                        //     $scope.smjnData.push($scope.jngyItemList[name].data);
                        // }
                        if ($scope.jngyItemList[name].name == 'ALL') {
                            $scope.allData.push($scope.jngyItemList[name].data);
                        }
                    }

                }, function () {
                }
            );
        };
        $scope.getData();

        $scope.fallbackPage = function () {
            $state.go("main.index", null, {reload: true});
        }
    }
})();