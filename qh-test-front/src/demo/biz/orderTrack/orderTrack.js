/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.orderTrack", {
                url: "/orderTrack",
                views: {
                    "@": {
                        templateUrl: 'biz/orderTrack/orderTrack.html',
                        controller: orderTrackController
                    }
                }
            });
        }]);

    // ----------------------------------------------------------------------------
    orderTrackController.$inject = ['$scope','$mdBottomSheet','$mdToast','$mdDialog'];
    function orderTrackController($scope,$mdBottomSheet,$mdToast,$mdDialog) {


        //退出登录
        $scope.showTelephone = function (ev) {
            $scope.alert = '';
            $mdDialog.show({
                templateUrl: 'biz/orderTrack/telephone.html',
                controller: showTelephoneController,
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
    showTelephoneController.$inject = ['$scope','$mdDialog'];
    function showTelephoneController($scope,$mdDialog) {
        $scope.hide = function () {
            return $mdDialog.hide();
        };
        $scope.cancel = function () {
            return $mdDialog.cancel();
        };
    }


})();