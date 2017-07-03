/**
 * Created by susf on 17-5-9.
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.lottery.WXfollow", {
                url: "/WXfollow",
                // resolve: {
                //     curUser: ['userService', function (userService) {
                //         return userService.getCurUser(true, true);
                //     }]
                // },
                views: {
                    "@": {
                        templateUrl: 'views/main/lottery/WXfollow/index.root.html',
                        controller: WXfollowController,
                        controllerAs: "vm"
                    }
                },
            });
        }]);

    // ----------------------------------------------------------------------------
    WXfollowController.$inject = ['$scope', '$http', '$state', 'appConfig', '$cookies', '$rootScope', "imgService", '$interval', '$filter', 'wxService', 'userService', '$mdDialog'];
    function WXfollowController($scope, $http, $state, appConfig, $cookies, $rootScope, imgService, $interval, $filter, wxService, userService, $mdDialog) {
















    }
})();