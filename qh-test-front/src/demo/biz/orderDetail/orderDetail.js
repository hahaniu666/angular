/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.orderDetail", {
                url: "/orderDetail",
                views: {
                    "@": {
                        templateUrl: 'biz/orderDetail/orderDetail.html',
                        controller: orderDetailController
                    }
                }
            });
        }]);

    // ----------------------------------------------------------------------------
    orderDetailController.$inject = ['$scope','$mdBottomSheet','$mdToast','$mdDialog'];
    function orderDetailController($scope,$mdBottomSheet,$mdToast,$mdDialog) {


        //退出登录
        $scope.showCon = function (ev) {
            $scope.alert = '';
            $mdDialog.show({
                templateUrl: 'biz/orderDetail/Cancal.html',
                controller: showCancelController,
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
    showCancelController.$inject = ['$scope','$mdDialog'];
    function showCancelController($scope,$mdDialog) {
        $scope.hide = function () {
            return $mdDialog.hide();
        };
        $scope.cancel = function () {
            return $mdDialog.cancel();
        };
    }


})();