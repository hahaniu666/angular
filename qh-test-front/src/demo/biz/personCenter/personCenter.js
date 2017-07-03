/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.personCenter", {
                url: "/personCenter",
                views: {
                    "@": {
                        templateUrl: 'biz/personCenter/personCenter.html',
                        controller: personCenterController
                    }
                }
            });
        }]);

    // ----------------------------------------------------------------------------
    personCenterController.$inject = ['$scope','$mdBottomSheet','$mdToast','$mdDialog'];
    function personCenterController($scope,$mdBottomSheet,$mdToast,$mdDialog) {

        $scope.showBottomSheet = function () {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'biz/personCenter/detail.html',
                controller: bottomSheetController,
                parent:'.ks-main'

            }).then(function (clickedItem) {
               /* $mdToast.show(
                    $mdToast.simple()
                        .textContent(clickedItem['name'] + ' clicked!')
                        .position('top right')
                        .hideDelay(1500)
                );*/
                console.log('test demo');
            });
        };

       //退出登录
        $scope.showConfirm = function (ev) {
            $scope.alert = '';
            $mdDialog.show({
                templateUrl: 'biz/personCenter/logout.html',
                   controller: showConfirmController,
                parent:'.ks-main '
            }).then(function (clickedItem) {
                /* $mdToast.show(
                 $mdToast.simple()
                 .textContent(clickedItem['name'] + ' clicked!')
                 .position('top right')
                 .hideDelay(1500)
                 );*/
            });
        };
    };

    // ----------------------------------------------------------------------------
    bottomSheetController.$inject = ['$scope'];
    function bottomSheetController($scope) {
    }

    // ----------------------------------------------------------------------------
    showConfirmController.$inject = ['$scope','$mdDialog'];
    function showConfirmController($scope,$mdDialog) {
        $scope.hide = function () {
            return $mdDialog.hide();
        };
        $scope.cancel = function () {
            return $mdDialog.cancel();
        };
    }


})();