(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 输入密码
         */
        $stateProvider.state("main.paymentMethod.details", {
            url: '/details',
            views: {
                "@": {
                    templateUrl: 'views/main/paymentMethod/details/index.root.html',
                    controller: detailsController
                }
            }
        });
    }]);
    detailsController.$inject = ['$scope','$mdBottomSheet', 'alertService'];
    function detailsController($scope,$mdBottomSheet, alertService) {

        $scope.logout = function () {
            $mdBottomSheet.show({
                templateUrl: 'views/main/paymentMethod/dialog/index.root.html',
                parent: '.ks-main',
                controllerAs: "vm",
                controller: [ function () {
                    var vm = this;
                    vm.props = $scope.itemDetail.props;
                    vm.specs = $scope.itemDetail.specs;
                    vm.cancel = function () {
                        $mdBottomSheet.hide(false);
                    };
                }]
            }).then(function () {

            });
        };

        $scope.pwds = [];
        $scope.dots = [false,false,false,false,false,false];
        $scope.num = function (num) {

            if($scope.pwds.length<6){
                $scope.pwds.push(num);
            }
            for(var i=0;i<$scope.pwds.length;i++){
                $scope.dots[i] = true;

            }
        };
    }

})();
