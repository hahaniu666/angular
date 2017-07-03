(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 确认上一不购买的订单.
         */
        $stateProvider.state("main.rentOrder.comment", {
            url: "/comment?orderId",
            views: {
                "@": {
                    templateUrl: 'views/main/rentOrder/comment/index.root.html',
                    controller: commentController
                }
            }
        });
    }]);
    commentController.$inject = ['$scope', '$http', '$state', '$log', '$httpParamSerializer', '$timeout', 'alertService', 'appConfig', 'imgService', 'wxService'];
    function commentController($scope, $http, $state, $log, $httpParamSerializer, $timeout, alertService, appConfig, imgService, wxService) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.orderId = $state.params.orderId;
        $scope.simpleImg = imgService.simpleImg;
        $scope.itemImg = imgService.itemImg;
        var ua = window.navigator.userAgent.toLowerCase();
        $scope.isWxClient = false;
        if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
            $scope.isWxClient = true;
            wxService.init();
        }

        // 发货速度
        $scope.initSpeedRate = 5;
        // 服务态度
        $scope.initServiceRate = 5;
        // 选中的标签
        $scope.tags = [];
        // 评论
        $scope.content = null;
        // 上传的图片
        $scope.imgs = [];

        $scope.imgUrl = appConfig.imgUrl;
        $scope.anonymous = true; // 默认进行匿名
        //是否进行匿名
        $scope.anonymousClick = function () {
            $scope.anonymous = !$scope.anonymous;
        };
        $scope.numWords = 200;
        //补充说明里面, 字数限制.
        $scope.checkText = function () {
            if ($scope.content.length > 200) {
                $scope.content = $scope.content.substr(0, 200);
            }
            //剩余字数
            $scope.numWords = 200 - $scope.content.length;
        };
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

        // 删除标签按钮
        $scope.removeTags = function (tag) {
            for (var i = 0; i < $scope.tags.length; i++) {
                if ($scope.tags[i] === tag) {
                    $scope.tags.splice(i, 1);
                    return;
                }
            }
        };
        $scope.addTags = function () {
            // 检查是否误触该按钮
            if (!$scope.addTag || $scope.addTag === '') {
                return;
            }
            if ($scope.addTag.length > 6) {
                alertService.msgAlert("exclamation-circle", "热门标签长度不能超6个字");
                return;
            }
            // 检查是否有添加同样的标签
            for (var i = 0; i < $scope.tags.length; i++) {
                if ($scope.tags[i] === $scope.addTag) {
                    $scope.addTag = null;
                    return;
                }
            }
            $scope.tags.push($scope.addTag);
            $scope.addTag = null;
        };


        $http({
            method: 'GET',
            url: appConfig.apiPath + '/rentOrder/goComment?orderId=' + $scope.orderId
        }).then(function (resp) {
            var data = resp.data;
            $scope.orderItem = data;
        }, function (resp) {
            var data = resp.data;
            if (data.code === "NOT_LOGINED") {
                $state.go("main.newLogin", {backUrl: window.location.href});
            }
        });
        $scope.uploadWx = function () {
            wxService.wxUploadImg().then(function (data) {
                var s = {};
                s.id = data.id;
                s.avatar = data.avatar;
                $scope.imgs.push(s);
            });
        };
        $scope.init_img = function () {
            // 创建上传器，需要先选择要上传的文件
            var uploader = new WebUploader.Uploader({
                // 选完文件后，是否自动上传。
                auto: true,
                pick: '#filePicker',
                sendAsBinary: true, // 以二进制流的格式上传，
                //fileSingleSizeLimit: 1000 * 1024,
                compress: {
                    width: 1024,
                    height: 1024,

                    // 图片质量，只有type为`image/jpeg`的时候才有效。
                    quality: 90,

                    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                    allowMagnify: true,

                    // 是否允许裁剪。
                    crop: false,

                    // 是否保留头部meta信息。
                    preserveHeaders: true,

                    // 如果发现压缩后文件大小比原来还大，则使用原来图片
                    // 此属性可能会影响图片自动纠正功能
                    noCompressIfLarger: false,

                    // 单位字节，如果图片大小小于此值，不会采用压缩。
                    compressSize: 1024 * 1000
                },

                server: appConfig.apiPath + appConfig.imgUpload + "?imgType=ITEM_USER_SHOW",
                //swf: '../../dist/Uploader.swf',
                accept: {
                    mimeTypes: 'image/*'
                },
                fileNumLimit: 50,
                onError: function () {
                    alertService.msgAlert("exclamation-circle", "请勿上传重复图片");
                }
            });


            uploader.on('error', function (type) {
                $log.error("文件上传出错 : " + type);
                alertService.msgAlert("exclamation-circle", "请勿上传重复图片");
            });


            uploader.on('fileQueued', function () {
                $log.log("添加了新文件");
                // 创建缩略图
                // 如果为非图片文件，可以不用调用此方法。
                // thumbnailWidth x thumbnailHeight 为 100 x 100

            });

            uploader.on('uploadSuccess', function (file, response) {
                var s = {};
                s.id = response.id;
                s.avatar = response.avatar;
                $scope.imgs.push(s);
                // 刷新数据有延迟，进行手动刷新数据
                $scope.$apply();
            });
        };
        // 删除图片
        $scope.removeImg = function (id) {
            for (var i = 0; i < $scope.imgs.length; i++) {
                if ($scope.imgs[i].id === id) {
                    //从当前的这个i起 删除一个(也就是删除本身)
                    $scope.imgs.splice(i, 1);
                    return;
                }
            }
        };
        // 提交本次评论
        $scope.submitComment = function () {
            var imgId = [];
            for (var i = 0; i < $scope.imgs.length; i++) {
                imgId.push($scope.imgs[i].id);
            }
            if (!$scope.content) {
                alertService.msgAlert("exclamation-circle", "请提交本次评论内容");
                return;
            }
            if (!$scope.initSpeedRate || !$scope.initServiceRate) {
                alertService.msgAlert("exclamation-circle", "请提交本次评分内容");
                return;
            }
            $http({
                method: "POST",
                url: appConfig.apiPath + '/rentOrder/comment',
                data: $httpParamSerializer({
                    orderId: $scope.orderId,
                    speed: $scope.initSpeedRate * 10,
                    //logistics: $scope.initLogisticsRate * 10,
                    service: $scope.initServiceRate * 10,
                    //quality: $scope.initServiceQuality * 10,
                    tags: $scope.tags,
                    anonymous: $scope.anonymous,
                    imgs: imgId,
                    app: 'WAP',
                    content: $scope.content
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function () {
                alertService.msgAlert("success", "评论成功");
                $timeout(function () {
                    $scope.fallbackPage();
                }, 1000);
            }).error(function (data) {
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
                $log.log("服务器开小差去了");
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