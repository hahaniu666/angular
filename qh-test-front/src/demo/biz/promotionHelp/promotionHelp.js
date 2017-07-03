/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.promotionHelp", {
                url: "/promotionHelp",
                views: {
                    "@": {
                        templateUrl: 'biz/promotionHelp/promotionHelp.html',
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