(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.balanceDetail", {
                url: "/balanceDetail",
                views: {
                    "@": {
                        templateUrl: 'biz/balanceDetail/balanceDetail.html',
                        controller: balanceDetailController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    balanceDetailController.$inject = ['$scope'];
    function balanceDetailController($scope) {
    }
})();