/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.returnInform", {
                url: "/returnInform",
                views: {
                    "@": {
                        templateUrl: 'biz/returnInform/returnInform.html',
                        controller: returnInformController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            returnInformController.$inject = ['$scope', '$http', '$state'];
            function returnInformController($scope, $http, $state, $element) {
            }

        }]);

 })();