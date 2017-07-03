/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.recharge", {
                url: "/recharge",
                views: {
                    "@": {
                        templateUrl: 'biz/recharge/recharge.html',
                        controller: rechargeController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    rechargeController.$inject = ['$scope'];
    function rechargeController($scope) {
        $scope.types=false;
        $scope.getMoreTypes = function () {
            $scope.types = true;
        };
    }
})();