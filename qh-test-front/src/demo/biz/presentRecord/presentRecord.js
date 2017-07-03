/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.presentRecord", {
                url: "/presentRecord",
                views: {
                    "@": {
                        templateUrl: 'biz/presentRecord/presentRecord.html',
                        controller: presentRecordController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    presentRecordController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
    function presentRecordController($scope, $http, $state, $element, $rootScope) {
        $scope.comments = new Array(2)
    }


})();