(function () {
    "use strict";
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            /**
             * 我的订单
             */
            $stateProvider.state("main.groupOrder", {
                abstract: true,
                url: '/groupOrder',

            });

        }]);
})();