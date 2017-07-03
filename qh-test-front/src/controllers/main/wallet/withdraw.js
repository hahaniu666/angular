(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.wallet.withdraw", {
                url: "/withdraw",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(false, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/wallet/withdraw/index.root.html',
                        controller: withdrawController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    withdrawController.$inject = ['$scope', '$http', '$state', 'appConfig', 'alertService'];
    function withdrawController($scope, $http, $state, appConfig, alertService) {
        //回退
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        //获取可体现金额
        $scope.getaccount = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/wallet/account"
            }).then(function (resp) {
                var data = resp.data;
                $scope.canamount = data.canAmount / 100;
            }, function () {
                alertService.msgAlert('ks-exclamation-circle', '获取余额失败！');
            });
        };
        $scope.getaccount();
        //提现金额不能大于余额
        $scope.allow = false;
        $scope.getMaxNum = function () {
            var reg = /^(\d+)([.]{0,1})(\d{0,3})$/;
            var money = $scope.cashmodel;
            if (money.match(reg) == null && money !== "") {
                $scope.cashmodel = "";
            } else if (money !== "" && money.indexOf(".") && money.length > money.indexOf(".") + 3 &&money.indexOf(".")>0) {
                    money = money.substring(0, money.indexOf(".") + 3);
                    $scope.cashmodel = money;
            }
            if ($scope.cashmodel <= $scope.canamount) {
                $scope.allow = true;
            }
        };
        //提现
        $scope.subWithdraw = function () {
            if ($scope.cashmodel > $scope.canamount) {
                alertService.msgAlert('ks-exclamation-circle', '可提现金额不足！');
            } else if ($scope.cashmodel < 1||!$scope.cashmodel) {
                alertService.msgAlert('ks-exclamation-circle', '提现金额必须大于1元');
            }else{
                alertService.confirm(null, "", "提现金额将在两个工作日内到帐！", "取消", "确定").then(function (data) {
                    if (data) {
                        $http({
                            method: "GET",
                            url: appConfig.apiPath + "/wallet/withdraw?withdraw=" + $scope.cashmodel * 100
                        }).then(
                            function () {
                                alertService.msgAlert('ks-successe', '提现申请成功！');
                                //重新获取余额
                                $scope.getaccount();
                                $scope.cashmodel = "";
                            }
                        );
                    }
                });

            }

        };
    }

})();