/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.wallet.recharge", {
                url: "/recharge",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(false, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/wallet/recharge/index.root.html',
                        controller: rechargeController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    rechargeController.$inject = [ '$scope', '$http', '$state', 'appConfig'];
    function rechargeController( $scope, $http, $state, appConfig) {
        $scope.back = $state.params.back;
        //回退
        $scope.fallbackPage = function () {
            if ($scope.back === 'hotelSettle') {
                history.back();
            } else {
                $state.go("main.wallet", null, {reload: true});
            }

        };
        //充值活动信息
        $http({
            method: "GET",
            url: appConfig.apiPath + "/wallet/rechargeActivity"
        }).then(function (resp) {
            var data = resp.data;
            $scope.reclist = data.recList;
        });
        //赠送金额
        $scope.giveNow = 0;
        $scope.giveMoneys = function () {
            var reg = /^(\d+)([.]{0,1})(\d{0,3})$/;
            var money = $scope.cashmodel;
            if (money.match(reg) == null && money !== "") {
                $scope.cashmodel = "";
            } else if (money !== "") {
                if (money.indexOf(".") && money.length > money.indexOf(".") + 3 && money.indexOf(".") > 0) {
                    money = money.substring(0, money.indexOf(".") + 3);
                    $scope.cashmodel = money;
                }
            }
            var gives = 0;
            var _temp = 0;
            $scope.giveNow = 0;
            var list = $scope.reclist;
            //查找合适充值活动
            for (var i = 0; i < $scope.reclist.length; i++) {
                var temps = list[i].requiredMoney / 100;
                var givemoney = list[i].giveMoney / 100;
                if (money >= temps) {
                    _temp = temps;
                    if (_temp > gives) {
                        gives = _temp;
                        $scope.giveNow = givemoney;
                    }
                }
            }
        };
        //获取qhPay()
        $scope.submit = function () {
            var reprice = $scope.cashmodel * 100;
            $http({
                method: "GET",
                url: appConfig.apiPath + "/wallet/recharge?money=" + reprice
            }).then(function (resp) {
                var data = resp.data;
                var qhPay = data.qhPay;
                $state.go("main.pay", {payId: qhPay, s: "main.wallet", ba: true});
            });
        };
    }
})();