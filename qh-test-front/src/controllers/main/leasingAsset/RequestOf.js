(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.leasingAsset.RequestOf", {
            url: '/RequestOf?id&totalPrice&overDate',
            views: {
                "@": {
                    templateUrl: 'views/main/leasingAsset/RequestOf/index.root.html',
                    controller: RequestOfController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    RequestOfController.$inject = ['$scope', '$http', '$state', 'appConfig', "imgService", "wxService", "FileUploader", "$filter", '$httpParamSerializer','alertService'];
    function RequestOfController($scope, $http, $state, appConfig, imgService, wxService, FileUploader, $filter, $httpParamSerializer,alertService) {
        //回退页面

        var vm = this;
        vm.fallbackPage = function () {
            $state.go("main.leasingAsset", null, {reload: true});
        };
        $scope.totalPrice=$state.params.totalPrice/100;
        $scope.itemId = $state.params.id;
        $scope.imgUrl = appConfig.imgUrl;
        $scope.simpleImg = imgService.simpleImg;
        $scope.overDate = $state.params.overDate;
        $scope.endDate = new Date($scope.overDate),
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
            if ($scope.imgs.length <= 3) {
                angular.element("#uploaderFile").click();
            } else {
                alertService.msgAlert("exclamation-circle", "最多上传3张");
            }
        };

        var uploader = $scope.uploader = new FileUploader({
            url: appConfig.apiPath + '/common/uploadImgS',
            autoUpload: true
        });

        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function () {
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
                    //从当前的这个i起 删除一个(也就是删除本身)
                    $scope.imgs.splice(i, 1);
                    return;
                }
            }
        };

        //初始化时间日期
        $scope.tuihuoyuanyin = '请选择退租原因';
        $scope.tuizuzhong = function () {


            //正则表达式验证时间
            var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
            var date = $filter("date")(new Date($scope.endDate), "yyyy-MM-dd").toString();       //.value.trim();
            var isDate = $filter("date")(new Date(new Date()), "yyyy-MM-dd").toString();

            if (date.match(reg) == null) {
                alertService.msgAlert("exclamation-circle", "日期格式错误(格式为:yyyy-MM-dd)");
                return;
            }

            //输入时间
            var arrDate = date.split('-');
            var arrLength = date.split('-').length;
            var hh = '';
            for (var i = 0; i < arrLength; i++) {
                hh = hh + arrDate[i];
            }


            //当前时间
            var arrDateed = isDate.split('-');
            var arrLengthed = isDate.split('-').length;
            var jj = '';
            for (var i = 0; i < arrLengthed; i++) {
                jj = jj + arrDateed[i];
            }
            if (parseInt(hh) < parseInt(jj)) {
                alertService.msgAlert("exclamation-circle", "退租时间不能小于当前时间");
                return false;
            }
            if ($scope.totalPrice>+$state.params.totalPrice/100) {
                alertService.msgAlert("exclamation-circle", "不能大于最高可退金额");
                return false;
            }
            if ($scope.tuihuoyuanyin === '请选择退租原因') {
                alertService.msgAlert("exclamation-circle", "请选择退租原因");
            } else {

                $http({
                    method: 'POST',
                    url: appConfig.apiPath + "/rentOrder/refund",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: $httpParamSerializer({
                        rentItemId: $scope.itemId,
                        endDate: $filter("date")(new Date($scope.endDate), "yyyy-MM-dd"),
                        reason: $scope.tuihuoyuanyin,
                        memo: $scope.memo
                    })
                }).then(function () {
                    $state.go("main.leasingAsset", {
                        recListId: $scope.itemId,
                        selectIndex: 2
                    }, {reload: true});
                }, function () {
                });
            }
        };
    }

})();
