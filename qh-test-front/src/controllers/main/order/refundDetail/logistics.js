(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 物流详情.和商品订单的共用
         */
        $stateProvider.state("main.order.refundDetail.logistics", {
            url: '/logistics',
            views: {
                "@": {
                    templateUrl: 'views/main/order/refundDetail/logistics/index.root.html',
                    controllerAs: "vm",
                    controller: RefundDetailLogisticsController
                }
            }
        });
    }]);
    // ----------------------------------------------------------------------------

    RefundDetailLogisticsController.$inject = ['$scope', '$http', '$state', 'appConfig', "$httpParamSerializer", "wxService", "imgService", "FileUploader", "alertService"];
    function RefundDetailLogisticsController($scope, $http, $state, appConfig, $httpParamSerializer, wxService, imgService, FileUploader, alertService) {
        var vm = this;
        vm.imgs = [];
        vm.simpleImg = imgService.simpleImg;
        vm.imgUrl = appConfig.imgUrl;
        var ua = window.navigator.userAgent.toLowerCase();
        vm.isWxClient = false;
        if (ua.match(/MicroMessenger/i)) {
            vm.isWxClient = true;
        }
        vm.id = $state.params.id;

        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        // 参数检测
        if (!vm.id) {
            vm.fallbackPage();
            return;
        }
        $scope.uploadWx = function () {
            wxService.wxUploadImg().then(function (data) {
                var s = {};
                s.id = data.id;
                s.avatar = data.avatar;
                vm.imgs.push(s);
            });
        };
        // 删除图片
        vm.removeImg = function (id) {
            for (var i = 0; i < vm.imgs.length; i++) {
                if (vm.imgs[i].id === id) {
                    vm.imgs.splice(i, 1);
                    //从当前的这个i起 删除一个(也就是删除本身)
                    return;
                }
            }
        };
        vm.updateAvatar = function () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                wxService.wxUploadImg(1).then(function (data) {
                    $scope.imgs.push(data);
                });
            } else {
                if ($scope.imgs.length < 3) {
                    angular.element("#uploaderFile").click();
                } else {
                    alertService.msgAlert("exclamation-circle", "最多上传3张");
                }
            }
        };
        var uploader = vm.uploader = new FileUploader({
            url: appConfig.apiPath + '/common/uploadImgS',
            autoUpload: true
        });
        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 100;
            }
        });
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            var s = {};
            s.id = response.id;
            s.avatar = response.avatar;
            vm.imgs.push(s);
        };
        // 获取所有物流商的名称和缩写
        $http
            .get(appConfig.apiPath + '/serviceOrder/getLogistics')
            .success(function (data, status, headers, config) {
                vm.logistics = data;
            });
        //发货
        vm.submitLogistics = function () {
            /*alertService.confirm(null, "确认填写完成")*/
            alertService.confirm(null, "", "确认填写完成", "取消", "确定").then(function (data) {
                if (data) {
                    var imgId = [];
                    for (var i = 0; i < vm.imgs.length; i++) {
                        imgId.push(vm.imgs[i].id);
                    }
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/order/refundExpressNo',
                        data: $httpParamSerializer({
                            status: vm.logisticsCheck,
                            expressNo: vm.textLogistics,
                            imgs: imgId,
                            id: vm.id
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).success(function () {
                        vm.fallbackPage();
                    });
                }
            });
        };
        // 上传的预览图片
        vm.imgPreviewUploadReply = function (reply, img) {
            var imgs = [];
            for (var n = 0; n < reply.length; n++) {
                imgs.push(vm.imgUrl + reply[n].avatar +
                    "?imageView2/1/w/" + vm.itemImg.w + "/h/" + vm.itemImg.h);
            }
            var imgUrl = vm.imgUrl + img +
                "?imageView2/1/w/" + vm.itemImg.w + "/h/" + vm.itemImg.h;
            wx.previewImage({
                current: imgUrl, // 当前显示图片的http链接
                urls: imgs // 需要预览的图片http链接列表
            });
        };
    }
})();