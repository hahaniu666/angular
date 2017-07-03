(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 租赁申请
         */
        $stateProvider.state("main.leaseApplication.leaseSuccess", {
            url: "/leaseSuccess",
            views: {
                "@": {
                    templateUrl: 'views/main/leaseApplication/leaseSuccess/index.root.html',
                    controller: leaseSuccessController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    leaseSuccessController.$inject = [];
    function leaseSuccessController() {

    }
})();


