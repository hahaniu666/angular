/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.back", {
                abstract: true,
                url: "/back"
            });
        }]);

    // ----------------------------------------------------------------------------
    BackController.$inject = ['$scope', '$state'];
    function BackController($scope, $state) {
    }

})();