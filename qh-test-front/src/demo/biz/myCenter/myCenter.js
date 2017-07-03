/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.myCenter", {
                url: "/myCenter",
                views: {
                    "@": {
                        templateUrl: 'biz/myCenter/myCenter.html',
                        controller: MyCenterController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    MyCenterController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
    function MyCenterController($scope, $http, $state, $element, $rootScope) {
    }


})();