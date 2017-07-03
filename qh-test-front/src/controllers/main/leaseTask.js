(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.leaseTask", {
            url: '/leaseTask',
            views: {
                "@": {
                    templateUrl: 'views/main/leaseTask/index.root.html',
                    controller: leaseTaskController
                }
            }
        });
    }]);
    leaseTaskController.$inject = [];
    function leaseTaskController() {
        //不再使用
    }

})();
