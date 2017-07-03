/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.counsel", {
                url: "/counsel",
                views: {
                    "@": {
                        templateUrl: 'biz/counsel/counsel.html',
                        controller: CounselController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    CounselController.$inject = ['$scope','$mdBottomSheet','$mdToast'];
    function CounselController($scope,$mdBottomSheet,$mdToast) {

    };


})();