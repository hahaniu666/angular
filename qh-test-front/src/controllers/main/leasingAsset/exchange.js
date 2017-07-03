(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.leasingAsset.exchange", {
            url: '/exchange',
            views: {
                "@": {
                    templateUrl: 'views/main/leasingAsset/exchange/index.root.html',
                    controller:exchangeController
                }
            }
        });
    }]);
    exchangeController.$inject = [];
    function exchangeController() {

    }

})();
