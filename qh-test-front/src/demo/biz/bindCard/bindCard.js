/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.bindCard", {
                url: "/bindCard",
                views: {
                    "@": {
                        templateUrl: 'biz/bindCard/bindCard.html',
                        controller: bindCardController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    bindCardController.$inject = ['$scope'];
    function bindCardController($scope) {
    }
})();