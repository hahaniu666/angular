/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.feedBack", {
                url: "/feedBack",
                views: {
                    "@": {
                        templateUrl: 'biz/feedBack/feedBack.html',
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