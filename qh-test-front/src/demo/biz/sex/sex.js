/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.sex", {
                url: "/sex",
                views: {
                    "@": {
                        templateUrl: 'biz/sex/sex.html',
                        controller: sexController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    sexController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function sexController($scope,$mdBottomSheet,$mdToast) {

    };


})();