/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.signUp", {
                url: "/signUp",
                views: {
                    "@": {
                        templateUrl: 'biz/signUp/signUp.html',
                        controller: signUpController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    signUpController.$inject = ['$scope'];
    function signUpController($scope) {
    }
})();