/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.welfareSmall", {
                url: "/welfareSmall",
                views: {
                    "@": {
                        templateUrl: 'biz/welfareSmall/welfareSmall.html',
                        controller: welfareSmallController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    welfareSmallController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
    function welfareSmallController($scope, $http, $state, $element, $rootScope) {

    }
})();