/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.commission", {
                url: "/commission",
                views: {
                    "@": {
                        templateUrl: 'biz/commission/commission.html',
                        controller: commissionController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    commissionController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
    function commissionController($scope, $http, $state, $element, $rootScope) {
    }


})();