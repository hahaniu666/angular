/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.wallet.rechargeCard", {
                url: "/rechargeCard?require&give",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(false, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/wallet/rechargeCard/index.root.html',
                        controller: rechargeCardController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    rechargeCardController.$inject = [ '$scope', '$http', '$state', 'appConfig', '$stateParams'];
    function rechargeCardController( $scope, $http, $state,  appConfig, $stateParams) {
        $scope.requireM = $stateParams.require;
        $scope.giveM = $stateParams.give;
        //回退
        $scope.fallbackPage = function () {
            $state.go("main.wallet", null, {reload: true});
        };

        //获取qhPay()
        $scope.submit = function () {
            var reprice = $scope.requireM;
            $http({
                method: "GET",
                url: appConfig.apiPath + "/wallet/recharge?money=" + reprice
            }).then(function (resp) {
                var data = resp.data;
                var qhPay = data.qhPay;
                //查看qhPay的值
                // $log.info(qhPay);
                // $scope.payment(qhPay);
                $state.go("main.pay", {payId: qhPay, s: "main.wallet", ba: true});
            });
        };
        
    }
})();