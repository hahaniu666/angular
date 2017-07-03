/**
 * Module : 选择发票
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.invoice.list", {
                url: "/list",
                views: {
                    "@": {
                        templateUrl: 'biz/invoice/invoiceList.html',
                        controller: InvoiceListController
                    }
                }
            });
        }]);

    // ----------------------------------------------------------------------------
    InvoiceListController.$inject = ['$scope'];
    function InvoiceListController($scope) {
        $scope.invoices = new Array(3);
        $scope.empty = true;
    }


})();