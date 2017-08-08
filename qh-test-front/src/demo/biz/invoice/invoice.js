/**
 * Module : 选择发票
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.invoice", {
                url: "/invoice",
                abstract: true,
                views: {}
            });
        }]);

    // ----------------------------------------------------------------------------
    InvoiceController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope', 'imgService'];
    function InvoiceController($scope, $http, $state, $element, $rootScope, imgService) {
    }


})();