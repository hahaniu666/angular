(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 租赁申请
         */
        $stateProvider.state("main.leaseApplication.leaseFirst", {
            url: "/leaseFirst",
            // 通过 resolve 获取的数据，只要state不重新加载，就不会重新发送http请求，
            // 因此可以在子状态之间临时保存一些数据，然后一起提交到服务器上
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(true, true);
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/leaseApplication/leaseFirst/index.root.html',
                    controller: leaseFirstController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    leaseFirstController.$inject = ['$scope'];
    function leaseFirstController($scope) {

        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();


