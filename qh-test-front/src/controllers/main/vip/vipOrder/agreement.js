(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.vip.vipOrder.agreement", {
                url: "/agreement",
                views: {
                    "@": {
                        templateUrl: 'views/main/vip/vipOrder/agreement/index.root.html',
                        controller: agreementController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    agreementController.$inject = [];
    function agreementController() {
        // 回退页面
        var vm = this;
        vm.fallbackPage = function () {
            history.back();
        };
    }
})();