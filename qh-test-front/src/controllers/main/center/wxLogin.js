(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /***
         * 已经登陆用户进行操作
         **/
        $stateProvider.state("main.center.wxLogin", {
            url: "/wxLogin",
            views: {
                "@": {
                    templateUrl: 'views/main/center/wxLogin/index.root.html',
                    controller: wxloginController
                }
            }
        });
    }]);
    wxloginController.$inject = ['$scope', '$state'];
    function wxloginController($scope, $state) {
        // 微信已经被绑定
        $scope.fallbackPage = function () {

            $state.go("main.index", null, {reload: true});
        };
    }
})();