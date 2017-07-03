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
                        templateUrl: 'views/main/signUp/index.root.html',
                        controller: signUpController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    signUpController.$inject = [];
    function signUpController() {
    }
})();