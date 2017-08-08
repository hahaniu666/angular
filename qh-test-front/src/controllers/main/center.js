(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 个人中心:没有登陆用户
         */
        $stateProvider.state("main.center", {
            url: "/center",
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(true, true);
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/center/index.root.html',
                    controller: centerController
                }
            }
        });
    }]);
    centerController.$inject = ['$scope', '$http', '$state', 'userService', 'appConfig', 'imgService', 'alertService', '$mdDialog'];
    function centerController($scope, $http, $state, userService, appConfig, imgService, alertService, $mdDialog) {

    }
})();



