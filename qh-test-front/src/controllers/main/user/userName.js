(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         *个人信息/真实姓名**/
        $stateProvider.state("main.user.userName", {
            url: "/trueName",
            views: {
                "@": {
                    templateUrl: 'views/main/user/userName/index.root.html',
                    controller:userNameController
                }
            }
        });
    }]);
    userNameController.$inject=['alertService', '$scope', '$http', 'curUser', '$state', '$httpParamSerializer', 'appConfig'];
    function userNameController(alertService, $scope, $http, curUser, $state, $httpParamSerializer, appConfig) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        // 回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        $scope.user = curUser.data;
        $scope.userName = $scope.user.userInfo.name;
        // 判断是否有用户名
        if ($scope.userName) {
            alertService.msgAlert("exclamation-circle", "用户名只能设置一次");
            return;
        }
        $scope.usernameBlur = function () {
            if (!$scope.userName) {
                alertService.msgAlert("exclamation-circle", "请填写账户名");
            } else if ($scope.userName.length < 6 || $scope.userName.length > 20) {
                alertService.msgAlert("exclamation-circle", "请输入6-20位以英文开头、数字组成的用户名");
            }
        };

        $scope.userNamefinish = function () {
            if (!$scope.userName) {
                alertService.msgAlert("exclamation-circle", "请填写账户名");
                return;
            } else if ($scope.userName.length < 6 || $scope.userName.length > 20) {
                alertService.msgAlert("exclamation-circle", "请输入6-20位以英文开头、数字组成的用户名");
            }
            $http({
                method: "POST",
                url: appConfig.apiPath + '/user/updateUserName',
                data: $httpParamSerializer({userName: $scope.userName}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function () {
                $scope.user.userInfo.name = $scope.userName;
                $scope.fallbackPage();
            }).error(function (data) {
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };

    }
})();