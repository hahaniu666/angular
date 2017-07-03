(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单初次申请退货
         */
        $stateProvider.state("main.order.deliver", {
            url: '/deliver?orderId',
            views: {
                "@": {
                    templateUrl: 'views/main/order/deliver/index.root.html',
                    controller: deliverController
                }
            }
        });
    }]);
    deliverController.$inject = ['$scope', '$http', '$state', '$httpParamSerializer', 'alertService', 'appConfig', "imgService", "wxService", "FileUploader"];
    function deliverController($scope, $http, $state, $httpParamSerializer, alertService, appConfig, imgService, wxService, FileUploader) {

        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();

        $scope.simpleImg = imgService.simpleImg;
        $scope.itemImg = imgService.itemImg;
        $scope.imgUrl = appConfig.imgUrl;
        var ua = window.navigator.userAgent.toLowerCase();

        $scope.isWxClient = false;
        if (ua.match(/MicroMessenger/i)) {
            $scope.isWxClient = true;
            wxService.init();
        }
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

        // 当前订单的购买数量
        if (!$state.params.orderId) {
            // 参数未传完整,直接跳回我的订单处，调试页面可把方法体注释
            $scope.fallbackPage();
            return;
        }

        $scope.deliver = {};    //
        $scope.resp = {};       //获取的数据

        // 获取物流公司列表
        $http({
            method: 'get',
            url: appConfig.apiPath + '/common/enumCodes?enumType=LogisticsComEnum'
        }).then(function (resp) {
            $scope.resp.companys = resp.data.data.LogisticsComEnum;
        });

        /**$http({
            method:'GET',
            url:appConfig.apiPath + "/order/orderItemDetail?orderId=" + $state.params.orderId + "&no=" + $state.params.no,
        }).then(function (data) {
            var data= data.data;
            $scope.refund = data;
            $scope.refund.price = $scope.refund.price / 100.0;
            $scope.maxNum = $scope.refund.applyedNum;
            $scope.maxPrice = $scope.refund.price;
        },function (data) {
            var data= data.data;
            if (data.code === "NOT_LOGINED") {
                $state.go("main.login", {backUrl: window.location.href});
            }
        });*/

        //说明 里面 剩余字数实时变化
        /**$scope.numWords = 200;
         $scope.checkText = function () {
            if ($scope.memo.length > 200) {
                $scope.memo = $scope.memo.substr(0, 200);
            }
            //剩余字数
            $scope.numWords = 200 - $scope.memo.length;
        };*/

        $scope.submit = function () {
            if (!$scope.deliver.company || $scope.deliver.company === "") {
                alertService.msgAlert("exclamation-circle", "物流公司必选");
                return;
            }
            if (!$scope.deliver.no || $scope.deliver.no === "") {
                alertService.msgAlert("exclamation-circle", "请填写快递单号");
                return;
            }
            var imgsTemp = [];
            for (var i = 0; i < $scope.imgs.length; i++) {
                imgsTemp.push($scope.imgs[i].id);
            }

            $http({
                method: "POST",
                url: appConfig.apiPath + '/order/deliver',
                data: $httpParamSerializer({
                    orderId: $state.params.orderId,
                    memo: $scope.deliver.memo,
                    company: $scope.deliver.company,
                    no: $scope.deliver.no,
                    imgs: imgsTemp
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function () {
                $scope.fallbackPage();
            }, function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };

        /**** 以下是上传图片相关代码，暂时无用，对应的html未显示****/
        ////测试
        // 初始化图片
        $scope.imgs = [];
        $scope.uploadWx = function () {
            wxService.wxUploadImg().then(function (data) {
                var s = {};
                s.id = data.id;
                s.avatar = data.avatar;
                $scope.imgs.push(s);
            });
        };
        // 代替图片上传的点击,隐藏自己的控件
        $scope.uploaderFiles = function () {
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
        var uploader = $scope.uploader = new FileUploader({
            url: appConfig.apiPath + '/common/uploadImgS',
            autoUpload: true
        });
        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 30;
            }
        });
        uploader.onSuccessItem = function (fileItem, response) {
            var s = {};
            s.id = response.id;
            s.avatar = response.avatar;
            $scope.imgs.push(s);
        };

        // 删除图片
        $scope.removeOneImg = function (id) {
            for (var i = 0; i < $scope.imgs.length; i++) {
                if ($scope.imgs[i].id === id) {
                    $scope.imgs.splice(i, 1);
                    //从当前的这个i起 删除一个(也就是删除本身)
                    return;
                }
            }
        };
    }
})();