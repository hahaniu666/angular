(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 查看评价
         */
        $stateProvider.state("main.order.commentDetail", {
            url: '/commentDetail?orderId&rentOrder&orgOrder',
            views: {
                "@": {
                    templateUrl: 'views/main/order/commentDetail/index.root.html',
                    controller: commentDetailController
                }
            }
        });
    }]);
    commentDetailController.$inject=['$scope' , '$http', '$state', "imgService" , 'appConfig'];
    function commentDetailController($scope, $http, $state, imgService, appConfig) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();

        $scope.simpleImg = imgService.simpleImg;
        $scope.itemImg = imgService.simpleImg;
        $scope.imgUrl = appConfig.imgUrl;
        $scope.url = {param: ""};
        if ($state.params.orderId) {
            $scope.url.param = "orderId=" + $state.params.orderId;
        } else if ($state.params.rentOrder) {
            $scope.url.param = "rentOrder=" + $state.params.rentOrder;
        } else if ($state.params.orgOrder) {
            $scope.url.param = "orgOrder=" + $state.params.orgOrder;
        }

        $http({
            method:'GET',
            url:appConfig.apiPath + "/unionOrder/commentDetail?" + $scope.url.param
        }).then(function (resp) {
            var data=resp.data;
            $scope.comment = data;
        },function () {

        });
        // 评论的预览图片
        $scope.imgPreviewReply = function (reply, img) {
            var imgs = [];
            for (var n = 0; n < reply.length; n++) {
                imgs.push($scope.imgUrl + reply[n].avatar +
                    "?imageView2/1/w/" + $scope.itemImg.w + "/h/" + $scope.itemImg.h);
            }
            var imgUrl = $scope.imgUrl + img +
                "?imageView2/1/w/" + $scope.itemImg.w + "/h/" + $scope.itemImg.h;
            wx.previewImage({
                current: imgUrl, // 当前显示图片的http链接
                urls: imgs // 需要预览的图片http链接列表
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