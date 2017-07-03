(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 个人信息
         */
        $stateProvider.state("main.sleepingAction", {
            url: "/sleepingAction",
            views: {
                "@": {
                    templateUrl: 'views/main/sleepingAction/index.root.html',
                    controller: sleepingActionController
                }
            }
        });
    }]);
    sleepingActionController.$inject = ['$scope', '$http', '$rootScope', 'appConfig', '$interval', '$state', "alertService", '$timeout'];
    function sleepingActionController($scope, $http, $rootScope, appConfig, $interval, $state, alertService, $timeout) {


        $scope.fsyzm = "获取验证码";
        $scope.sendCode = function () {
            //发送验证码
            $http({
                method: 'get',
                url: appConfig.apiPath + '/activityUser/sendCode',
                params: {
                    phone: $scope.phone
                }
            }).then(function (data) {
                if (data.data.code === 'SUCCESS') {
                    alertService.msgAlert("success", "已发送");
                    if ($rootScope.intervalStop) {
                        $interval.cancel($rootScope.intervalStop);//解除计时器
                    }
                    var i = 60;
                    $rootScope.intervalStop = $interval(function () {
                        i--;
                        $scope.fsyzm = i + 'S';
                        if (i <= 0) {
                            $scope.fsyzm = "重新获取";
                            $interval.cancel($rootScope.intervalStop);//解除计时器
                            $rootScope.intervalStop = null;
                        }
                    }, 1000);
                }
                else {
                    $scope.fsyzm = "重新获取";
                }


            });
        };

        $scope.submit = function () {
            //提交数据
            $http({
                method: 'POST',
                url: appConfig.apiPath + '/activityUser/save',
                data:{
                    phone: $scope.phone,
                    username: $scope.username,
                    code: $scope.code
                }
            }).then(function (data) {
                if (data.data.code === 'SUCCESS') {
                    alertService.msgAlert("success", "加入成功");
                    $timeout(function () {
                        $state.go("main.index", null, {reload: true});
                    }, 2000);
                }
            });
        };


        // 回退页面
        $scope.fallbackPage = function () {
            $state.go("main.index", null, {reload: true});
        };
    }
})();


