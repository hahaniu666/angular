/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.imgHolder", {
                url: "/imgHolder",
                views: {
                    "@": {
                        templateUrl: 'biz/img-holder/img-holder.html',
                        controller: ImgHolderController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    ImgHolderController.$inject = ['$scope'];
    function ImgHolderController($scope) {
        $scope.imgUrl = "https://dn-portal-files.qbox.me/sample1.jpg";
        $scope.imgUrl2 = "https://dn-portal-files.qbox.me/sample1.jpg222";
    }
})();