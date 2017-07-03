/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.extension", {
                url: "/extension",
                views: {
                    "@": {
                        templateUrl: 'biz/extension/extension.html',
                        controller: extensionController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    extensionController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
    function extensionController($scope, $http, $state, $element, $rootScope) {
    }


})();