(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.leasingAsset.rentItemLog", {
            url: '/rentItemLog?id',
            views: {
                "@": {
                    templateUrl: 'views/main/leasingAsset/rentItemLog/index.root.html',
                    controller: rentItemLogController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    rentItemLogController.$inject = [ '$http', '$state', 'appConfig'];
    function rentItemLogController( $http, $state, appConfig) {

        //回退页面
        var vm = this;
        vm.logList = {};
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }

        };
        vm.getRentItemLog = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/rentItem/rentItemLog",
                params:{
                    id:$state.params.id
                }
            }).then(function (resp) {
                if(resp.data.code === 'SUCCESS'){
                    vm.logList = resp.data.recList;
                }

            });
        };
        vm.getRentItemLog();
    }
})();
