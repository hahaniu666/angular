/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.center", {
                url: "/center",
                views: {
                    "@": {
                        templateUrl: 'biz/center/center.html',
                        controller: centerController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    centerController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
    function centerController($scope, $http, $state, $element, $rootScope) {
    }


})();