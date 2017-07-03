/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.screen", {
                url: "/screen",
                views: {
                    "@": {
                        templateUrl: 'biz/screen/screen.html',
                        controller: ScreenController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            ScreenController.$inject = ['$scope', '$http', '$state', '$mdBottomSheet'];
            function ScreenController($scope, $http, $state, $mdBottomSheet) {
                $scope.alertking = function () {
                    $scope.alert = '';
                    $mdBottomSheet.show({
                        templateUrl: 'biz/screen/screenDetail.html',
                        controller: showScreenController,
                        parent: '.ks-main '

                    }).then(function (clickedItem) {
                        /* $mdToast.show(
                         $mdToast.simple()
                         .textContent(clickedItem['name'] + ' clicked!')
                         .position('top right')
                         .hideDelay(1500)
                         );*/
                        console.log('test demo');
                    });
                }

            }

            showScreenController.$inject = ['$scope', '$mdDialog'];
            function showScreenController($scope, $mdDialog) {
                $scope.hide = function () {
                    return $mdDialog.hide();
                };
                $scope.cancel = function () {
                    return $mdDialog.cancel();
                };
            }
        }]);
})();