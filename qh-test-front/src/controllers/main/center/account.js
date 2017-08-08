(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state("main.center.account", {
            url: "/account",
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(true, true);
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/center/account/index.root.html',
                    controller: accountController
                }
            }
        });
    }]);
    accountController.$inject = ['$scope', '$http', '$state', '$httpParamSerializer', 'appConfig', 'alertService'];
    function accountController($scope, $http, $state, $httpParamSerializer, appConfig, alertService) {

        alert(222)
    }

})();