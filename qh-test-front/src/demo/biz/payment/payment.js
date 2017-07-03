/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.payment", {
                url: "/payment",
                views: {
                    "@": {
                        templateUrl: 'biz/payment/payment.html',
                        controller: paymentController
                    }
                }
            });
        }]);

    // ----------------------------------------------------------------------------
    paymentController.$inject = ['$scope','$mdBottomSheet','$mdToast','$mdDialog'];
    function paymentController($scope,$mdBottomSheet,$mdToast,$mdDialog) {


        //退出登录
        $scope.showpayment = function (ev) {
            $scope.alert = '';
            $mdDialog.show({
                templateUrl: 'biz/payment/sure.html',
                controller: showpaymentController,
                parent:'.ks-main '

            }).then(function (clickedItem) {
               /*  $mdToast.show(
                 $mdToast.simple()
                 .textContent(clickedItem['name'] + ' clicked!')
                 .position('top right')
                 .hideDelay(1500)
                 );*/
            });
        };
    };


    // ----------------------------------------------------------------------------
    showpaymentController.$inject = ['$scope','$mdDialog'];
    function showpaymentController($scope,$mdDialog) {
        $scope.hide = function () {
            return $mdDialog.hide();
        };
        $scope.cancel = function () {
            return $mdDialog.cancel();
        };
    }


})();