/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.email", {
                url: "/email",
                views: {
                    "@": {
                        templateUrl: 'biz/email/email.html',
                        controller: EmailController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    EmailController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function EmailController($scope,$mdBottomSheet,$mdToast) {

    };


})();