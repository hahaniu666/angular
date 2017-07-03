/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.userName", {
                url: "/userName",
                views: {
                    "@": {
                        templateUrl: 'biz/userName/userName.html',
                        controller: UserNameController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    UserNameController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function UserNameController($scope,$mdBottomSheet,$mdToast) {

    };


})();