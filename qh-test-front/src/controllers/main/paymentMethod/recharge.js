(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state("main.paymentMethod.recharge", {
            url: '/recharge',
            views: {
                "@": {
                    templateUrl: 'views/main/paymentMethod/recharge/index.root.html',
                    controller:rechargeController
                }
            }
        });
    }]);
    rechargeController.$inject = [];
    function rechargeController() {

    }

})();
