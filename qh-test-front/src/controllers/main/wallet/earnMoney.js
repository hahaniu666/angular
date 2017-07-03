(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.wallet.earnMoney", {
                url: "/earnMoney",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(false, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/wallet/earnMoney/index.root.html',
                        controller: earnMoneyController
                    }
                }
            });
        }]);
    // ----------------------------------------------------------------------------
    earnMoneyController.$inject = ['$scope', '$http', '$state', 'appConfig'];
    function earnMoneyController($scope, $http, $state, appConfig) {
        //回退
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };

        $scope.data= {};


        // 进行签到
        $scope.signs = function () {
            $http({
                method: "POST",
                url: appConfig.apiPath + '/integral/sign',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                $scope.data.toDaySign = true;

                //showSign来判断是否弹出钱币加10
                // $scope.showSign = true;
                // $scope.data.sign = $scope.data.sign + 1;
                // $scope.data.count = $scope.data.count + 1;
                // $scope.data.integral = resp.data.integral;
                // $scope.lodingThis();
            }, function () {
            });
        };
        // 进行签到
        $scope.data = {"toDaySign": false, "integral": 0, "sign": 0, "count": 0, "advertise": null};
        $scope.lodingThis = function () {
            $http({
                method: 'GET',
                url: appConfig.apiPath + '/integral/index'
            }).then(function (resp) {
                $scope.data = resp.data.result;

                // if ($scope.data.toDaySign === true) {
                //     var $aDiv1 = angular.element('#creat');
                //     $aDiv1.empty();
                //     var $mdIcon1 = '<div>今日已签</div>';
                //     $aDiv1.append($mdIcon1);
                //     $aDiv1.addClass('finshBtn');
                // }
                // else if ($scope.data.toDaySign === false) {
                //     var $aDiv2 = angular.element('#creat');
                //     $aDiv2.empty();
                //     var $mdIcon2 = '<div>签到</div>';
                //     $aDiv2.append($mdIcon2);
                //     $aDiv2.addClass('beginBtn');
                //     $aDiv2.click(function () {
                //         $scope.signs();
                //     });
                // }
            });
        };
        $scope.lodingThis();
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    }
})();