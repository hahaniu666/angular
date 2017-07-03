/**
 * Module : 新增发票抬头
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.invoice.add", {
                url: "/add",
                views: {
                    "@": {
                        templateUrl: 'biz/invoice/invoiceAdd.html',
                        controller: InvoiceAddController
                    }
                }
            });
        }]);

    // ----------------------------------------------------------------------------
    InvoiceAddController.$inject = ['$scope'];
    function InvoiceAddController($scope) {
        $scope.invoices = new Array(3);
        $scope.selected = 'person'; // 'person', 'com'
    }


})();