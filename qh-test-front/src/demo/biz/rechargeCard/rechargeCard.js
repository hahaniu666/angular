/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.rechargeCard", {
                url: "/rechargeCard",
                views: {
                    "@": {
                        templateUrl: 'biz/rechargeCard/rechargeCard.html',
                        controller: rechargeCardController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    rechargeCardController.$inject = ['$scope'];
    function rechargeCardController($scope) {
        $scope.types=false;
        $scope.getMoreTypes = function () {
            $scope.types = true;
        };
    }
})();