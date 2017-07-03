/**
 * Created by susf on 17-5-6.
 */
(function () {
    "use strict";
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            /**
             * 我的订单
             */
            $stateProvider.state("main.lottery", {
                abstract: true,
                url: '/lottery',
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                }
            });

        }]);
})();