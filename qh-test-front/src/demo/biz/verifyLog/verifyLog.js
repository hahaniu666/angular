/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider',function ($stateProvider) {

            $stateProvider.state("main.verifyLog", {
                url: "/verifyLog",
                views: {
                    "@": {
                        templateUrl: 'biz/verifyLog/verifyLog.html',
                        controller: VerifyLogController
                    }
                }
            });



        }]);

    // ----------------------------------------------------------------------------
    VerifyLogController.$inject = ['$scope','$mdBottomSheet','$mdToast','$mdDialog'];
    function VerifyLogController($scope,$mdBottomSheet,$mdToast,$mdDialog) {
        $scope.verifyLog = function (ev) {
            $scope.alert = '';
            $mdDialog.show({
                templateUrl: 'biz/verifyLog/Prompt.html',
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