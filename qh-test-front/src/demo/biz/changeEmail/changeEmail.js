/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.changeEmail", {
                url: "/changeEmail",
                views: {
                    "@": {
                        templateUrl: 'biz/changeEmail/changeEmail.html',
                        controller: ChangeEmailController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    ChangeEmailController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function ChangeEmailController($scope,$mdBottomSheet,$mdToast) {

    };


})();