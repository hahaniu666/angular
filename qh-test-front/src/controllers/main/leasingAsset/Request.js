(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.leasingAsset.Request", {
            url: '/Request',
            views: {
                "@": {
                    templateUrl: 'views/main/leasingAsset/Request/index.root.html',
                    controller:RequestOfController
                }
            }
        });
    }]);
    RequestOfController.$inject = [];
    function RequestOfController() {

    }

})();
