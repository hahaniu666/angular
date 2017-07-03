(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.setPaySuccess", {
            url: '/setPaySuccess',
            views: {
                "@": {
                    templateUrl: 'views/main/user/setPaySuccess/index.root.html',
                    controller:setPaySuccessController
                }
            }
        });
    }]);
    setPaySuccessController.$inject = ['$scope'];
    function setPaySuccessController($scope ) {

    }

})();
