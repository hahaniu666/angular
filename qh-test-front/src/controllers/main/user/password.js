(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 修改个人密码
         */
        $stateProvider.state("main.user.password", {
            url: "/password",
            views: {
                "@": {
                    templateUrl: 'views/main/user/password/index.root.html',
                    controller:passwordController
                }
            }
        });
    }]);
    passwordController.$inject=[ '$scope', '$http', '$state', '$httpParamSerializer', 'appConfig', 'curUser', 'alertService'];
    function passwordController( $scope, $http, $state, $httpParamSerializer, appConfig, curUser, alertService) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.user = curUser.data;
        // 修改手机号码
        $scope.password = {oldPassword: null, password1: null, password2: null};
        $scope.myForm = {password1Css: false, oldPassword: false, password2Css: false}; // 初始化错误参数提示
        // 简单校验原密码
        $scope.patternPassword = function () {
            if (!$scope.password.oldPassword) {
                $scope.myForm.oldPassword = true;
                alertService.msgAlert("exclamation-circle", "请正确输入原密码");
                return false;
            }
            if ($scope.password.oldPassword.length < 6) {
                alertService.msgAlert("exclamation-circle", "请正确输入原密码");
                $scope.myForm.oldPassword = true;
                return false;
            }
            if ($scope.password.oldPassword.length > 18) {
                alertService.msgAlert("exclamation-circle", "请正确输入原密码");
                $scope.myForm.oldPassword = true;
                return false;
            }
            $scope.myForm.oldPassword = false;
        };
        // 验证第一次输入的验证码
        $scope.patternPasswordOne = function () {
            if (!$scope.password.password1) {
                // 出现红色方框,和清除打钩按钮
                $scope.myForm.password1 = false;
                $scope.myForm.password1Css = true;
                return false;
            }
            if ($scope.password.password1.length < 6) {
                // 出现红色方框,和清除打钩按钮
                $scope.myForm.password1 = false;
                $scope.myForm.password1Css = true;
                return false;
            }
            if ($scope.password.password1.length > 18) {
                // 出现红色方框,和清除打钩按钮
                $scope.myForm.password1 = false;
                $scope.myForm.password1Css = true;
                return false;
            }
            // 出现红色方框,和清除打钩按钮
            $scope.myForm.password1 = true;
            $scope.myForm.password1Css = false;
            if ($scope.myForm.password2 === true) {
                // 修改第一次密码的时候,查看是否输入了第二次密码.用来判断
                if ($scope.password.password2 === $scope.password.password1) {
                    // 出现红色方框,和清除打钩按钮
                    $scope.myForm.password2 = true;
                    $scope.myForm.password2Css = false;
                } else {
                    // 不相等
                    $scope.myForm.password2 = false;
                    $scope.myForm.password2Css = true;
                }

            }
        };
        // 验证第二次密码
        $scope.patternPasswordTwo = function () {
            if (!$scope.password.password2) {
                // 出现红色方框,和清除打钩按钮
                $scope.myForm.password2 = false;
                $scope.myForm.password2Css = true;
                return false;
            }
            if ($scope.password.password2.length < 6) {
                // 出现红色方框,和清除打钩按钮
                $scope.myForm.password2 = false;
                $scope.myForm.password2Css = true;
                return false;
            }
            if ($scope.password.password2.length > 18) {
                // 出现红色方框,和清除打钩按钮
                $scope.myForm.password2 = false;
                $scope.myForm.password2Css = true;
                return false;
            }
            if ($scope.password.password2 === $scope.password.password1 && $scope.myForm.password1) {
                // 出现红色方框,和清除打钩按钮
                $scope.myForm.password2 = true;
                $scope.myForm.password2Css = false;
            } else {
                // 不相等
                $scope.myForm.password2 = false;
                $scope.myForm.password2Css = true;
            }

        };
        // 修改密码
        $scope.changePassword = function () {
            if ($scope.password.password2 !== $scope.password.password1) {
                $scope.myForm.password2 = false;
                $scope.myForm.password2Css = true;
                alertService.msgAlert("cancle", "新密码2次输入不匹配");
                return;
            }
            if ($scope.myForm.oldPassword || !$scope.myForm.password1 || !$scope.myForm.password2) {
                // 原密码的验证是 false == 现在密码验证 true
                alertService.msgAlert("exclamation-circle", "请正确输入密码");
                return;
            }
            if ($scope.password.oldPassword === $scope.password.password1) {
                alertService.msgAlert("exclamation-circle", "原密码和新密码一致");
                return;
            }
            $http({
                method: "POST",
                url: appConfig.apiPath + '/user/modifyPwd',
                data: $httpParamSerializer($scope.password),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function () {
                $http({
                    method:'GET',
                    url:appConfig.apiPath + '/j_spring_security_logout'
                }).then(function () {
                    $state.go("main.newLogin", {s: 'index'});
                },function () {

                });
            }).error(function (data) {
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                } else {
                    $scope.myForm.oldPassword = true;
                }
            });
        };

        // 回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();