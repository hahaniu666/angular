/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.aboutUs", {
                url: "/aboutUs",
                views: {
                    "@": {
                        templateUrl: 'biz/aboutUs/aboutUs.html',
                        controller: promotionHelpController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    promotionHelpController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
    function promotionHelpController($scope, $http, $state, $element, $rootScope) {
    }

})();