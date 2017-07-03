/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.antiCounterfeiting", {
                url: "/antiCounterfeiting",
                views: {
                    "@": {
                        templateUrl: 'biz/antiCounterfeiting/antiCounterfeiting.html',
                        controller: AntiCounterfeitingController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    AntiCounterfeitingController.$inject = ['$scope','$mdBottomSheet','$mdToast','$mdDialog'];
    function AntiCounterfeitingController($scope,$mdBottomSheet,$mdToast,$mdDialog) {
        $scope.verifyLog = function (ev) {
            $scope.alert = '';
            $mdDialog.show({
                templateUrl: 'biz/antiCounterfeiting/Prompt.html',
                controller: showVerifyLogController,
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
    showVerifyLogController.$inject = ['$scope','$mdDialog'];
    function showVerifyLogController($scope,$mdDialog) {
        $scope.hide = function () {
            return $mdDialog.hide();
        };
        $scope.cancel = function () {
            return $mdDialog.cancel();
        };
    }

})();