
// 这个js应该是没用的

(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 个人信息
         */
        $stateProvider.state("main.cleaningDetails", {
            url: "/cleaningDetails",

            views: {
                "@": {
                    templateUrl: 'views/main/cleaningDetails/index.root.html',
                    controller: cleaningDetailsController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    cleaningDetailsController.$inject = ['$scope', '$http', '$state', 'appConfig', 'imgService', "alertService", "$mdBottomSheet"];
    function cleaningDetailsController($scope, $http, $state, appConfig, imgService, alertService, $mdBottomSheet) {

        $scope.userAvatarUpdate = function () {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'views/main/cleaningDetails/dialog/index.root.html',
                controllerAs: "vm",
                controller: ["$httpParamSerializer", "FileUploader", function ($httpParamSerializer, FileUploader) {
                    var vm = this;
                    vm.qingkong = function () {
                        alertService.confirm(null, "", "您确定要删除这些宝贝吗?", "点错了", "确定").then(function (data) {
                            if (data) {
                                alert('删除成功API接口调用');
                            }
                        });
                    };
                }],
                parent: '.ks-main'
            }).then(function (response) {
                if (response) {
                    $scope.user.userInfo.avatar = response.avatar;
                }
            }, function () {

            });
        };
    }
})();


