(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.wallet.balanceDetail", {
                url: "/balanceDetail",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(false, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/wallet/balanceDetail/index.root.html',
                        controller: balanceDetailController
                    }
                }
            });
        }]);
    // ----------------------------------------------------------------------------
    balanceDetailController.$inject = ['$scope', '$http', '$state', 'appConfig'];
    function balanceDetailController($scope, $http, $state, appConfig) {
        //回退
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        var mychart = window.echarts.init(document.getElementById('mychart'));
        var option = {
            color: ['#ffffff','#edcb8c','#ba9f6e'],
            series: [
                {
                    type: 'pie',
                    radius: ['30%', '80%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '12',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    data: [
                        {value: 0, name: '佣金'},
                        {value: 0, name: '充值'},
                        {value: 0, name: '礼券'}
                    ]
                }
            ]
        };
        //获取钱包余额信息
        $http({
            method: "GET",
            url: appConfig.apiPath + "/wallet/account"
        }).then(function (resp) {
            var data = resp.data;
            $scope.amounts = data;
            var newopt = [
                {value: $scope.amounts.canAmount, name: '佣金'},
                {value: $scope.amounts.notAmount, name: '充值'},
                {value: $scope.amounts.giftAmount, name: '礼券'}
            ];
            option.series[0].data = newopt;
            mychart.setOption(option);
        }, function () {
            mychart.setOption(option);
        });
    }
})();