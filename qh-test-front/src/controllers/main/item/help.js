(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 购物咨询
         */
        $stateProvider.state("main.item.help", {
            url: "/help",
            views: {
                "@": {
                    templateUrl: 'views/main/item/help/index.root.html',
                    controller: helpController
                }
            }
        });
    }]);
    helpController.$inject=['$scope', '$http', '$state', 'appConfig'];
    function helpController($scope, $http, $state, appConfig) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        // 评论的预览图片
        $scope.imgPreviewReply = function (img) {
            var imgs = [];
            imgs.push(appConfig.cdnUrl + "assets/img/zixun/xuzhi1.png");
            imgs.push(appConfig.cdnUrl + "assets/img/zixun/xuzhi2.png");
            img = appConfig.cdnUrl + img;
            wx.previewImage({
                current: img, // 当前显示图片的http链接
                urls: imgs // 需要预览的图片http链接列表
            });
        };

        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.item", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();