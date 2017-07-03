/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.more", {
                url: "/more",
                views: {
                    "@": {
                        templateUrl: 'biz/more/more.html',
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