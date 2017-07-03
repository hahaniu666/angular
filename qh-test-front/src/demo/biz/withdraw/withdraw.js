(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.withdraw", {
                url: "/withdraw",
                views: {
                    "@": {
                        templateUrl: 'biz/withdraw/withdraw.html',
                        controller: withdrawController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    withdrawController.$inject = ['$scope'];
    function withdrawController($scope) {
    }
})();