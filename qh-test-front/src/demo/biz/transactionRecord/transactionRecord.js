(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.transactionRecord", {
                url: "/transactionRecord",
                views: {
                    "@": {
                        templateUrl: 'biz/transactionRecord/transactionRecord.html',
                        controller: transRecordController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    transRecordController.$inject = ['$scope','$http', '$state', '$element'];
    function transRecordController($scope,$http, $state, $element) {

    };


})();