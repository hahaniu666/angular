(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 租赁申请
         */
        $stateProvider.state("main.leaseApplication", {
            url: "/leaseApplication",
            views: {
                "@": {
                    templateUrl: 'views/main/leaseApplication/index.root.html',
                    controller: leaseApplicationController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    leaseApplicationController.$inject = ['$scope', '$http', '$state', 'appConfig', 'imgService', "alertService", "FileUploader", "$httpParamSerializer","wxService"];
    function leaseApplicationController($scope, $http, $state, appConfig, imgService, alertService, FileUploader, $httpParamSerializer,wxService) {

        var vm = this;

        /**
         * 提交申请.
         */
        $scope.orgs = {};
        $scope.queryOry = function () {
            $http.get(appConfig.apiPath + '/staff/queryOrg')
                .success(function (data) {
                    $scope.orgs = data.recList;
                });
        };
        $scope.queryOry();

        /**
         * 提交申请
         */
        $scope.submit = function () {
            if (!vm.orgId || !vm.idJust || !vm.idBack || !vm.student || !vm.people) {
                alertService.msgAlert("exclamation-circle", "请填写完整信息");
                return;
            }
            if (vm.idJust.id == vm.idBack.id || vm.idJust.id == vm.student.id || vm.idJust.id == vm.people.id) {
                alertService.msgAlert("exclamation-circle", "请上传不同的照片");
                return;
            }
            if (vm.idBack.id == vm.student.id || vm.idBack.id == vm.people.id || vm.student.id == vm.people.id) {
                alertService.msgAlert("exclamation-circle", "请上传不同的照片");
                return;
            }
            $http({
                method: "POST",
                url: appConfig.apiPath + '/staff/applyStaff',
                data: $httpParamSerializer({
                    orgId: vm.orgId,
                    idJust: vm.idJust.id,
                    idBack: vm.idBack.id,
                    student: vm.student.id,
                    people: vm.people.id
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function () {
                //success

                $state.go("main.leaseApplication.leaseSuccess", {reload: true});
            }, function () {
                //error
            });
        };

        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };

        ///////////////////////////////////////////////////////以下是传图片相关

        vm.idJust = null;           //身份证正面
        vm.idBack = null;           //身份证背面
        vm.student = null;          //学生证
        vm.people = null;           //手持身份证照片

        $scope.block1 = false;       //阻塞多图同时上传
        $scope.block2 = false;
        $scope.block3 = false;
        $scope.block4 = false;


        $scope.simpleImg = imgService.simpleImg;
        $scope.imgUrl = appConfig.imgUrl;

        // 代替图片上传的点击,隐藏自己的控件，改为图片独立上传
        $scope.uploaderFiles1 = function () {
            if ($scope.block1) {
                alertService.msgAlert("exclamation-circle", "请等待图片上传完成");
                return;
            }
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                wxService.wxUploadImg(1).then(function (data) {
                    $scope.imgs.push(data);
                });
            } else {
                angular.element("#uploaderFile1").click();
            }
        };
        $scope.uploaderFiles2 = function () {
            if ($scope.block2) {
                alertService.msgAlert("exclamation-circle", "请等待图片上传完成");
                return;
            }
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                wxService.wxUploadImg(1).then(function (data) {
                    $scope.imgs.push(data);
                });
            } else {
                angular.element("#uploaderFile2").click();
            }
        };
        $scope.uploaderFiles3 = function () {
            if ($scope.block3) {
                alertService.msgAlert("exclamation-circle", "请等待图片上传完成");
                return;
            }
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                wxService.wxUploadImg(1).then(function (data) {
                    $scope.imgs.push(data);
                });
            } else {
                angular.element("#uploaderFile3").click();
            }
        };
        $scope.uploaderFiles4 = function () {
            if ($scope.block4) {
                alertService.msgAlert("exclamation-circle", "请等待图片上传完成");
                return;
            }
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                wxService.wxUploadImg(1).then(function (data) {
                    $scope.imgs.push(data);
                });
            } else {
                angular.element("#uploaderFile4").click();
            }
        };

        var uploader1 = $scope.uploader1 = new FileUploader({
            url: appConfig.apiPath + '/common/uploadImgS',
            autoUpload: true
        });
        var uploader2 = $scope.uploader2 = new FileUploader({
            url: appConfig.apiPath + '/common/uploadImgS',
            autoUpload: true
        });
        var uploader3 = $scope.uploader3 = new FileUploader({
            url: appConfig.apiPath + '/common/uploadImgS',
            autoUpload: true
        });
        var uploader4 = $scope.uploader4 = new FileUploader({
            url: appConfig.apiPath + '/common/uploadImgS',
            autoUpload: true
        });

        // FILTERS
        uploader1.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 40;
            }
        });
        uploader2.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 40;
            }
        });
        uploader3.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 40;
            }
        });
        uploader4.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 40;
            }
        });

        //上传成功的回调函数
        uploader1.onSuccessItem = function (fileItem, response) {
            vm.idJust = {
                id: response.id,
                avatar: response.avatar
            };
        };
        uploader2.onSuccessItem = function (fileItem, response) {
            vm.idBack = {
                id: response.id,
                avatar: response.avatar
            };
        };
        uploader3.onSuccessItem = function (fileItem, response) {
            vm.student = {
                id: response.id,
                avatar: response.avatar
            };
        };
        uploader4.onSuccessItem = function (fileItem, response) {
            vm.people = {
                id: response.id,
                avatar: response.avatar
            };
        };

        //上传前，阻塞按钮
        uploader1.onBeforeUploadItem = function () {

            $scope.block1 = true;
        };
        uploader2.onBeforeUploadItem = function () {

            $scope.block2 = true;
        };
        uploader3.onBeforeUploadItem = function () {

            $scope.block3 = true;
        };
        uploader4.onBeforeUploadItem = function () {

            $scope.block4 = true;
        };

        // 删除图片
        $scope.removeOneImg = function (index) {
            switch (index) {
                case 1:
                    vm.idJust = null;
                    $scope.block1 = false;
                    break;
                case 2:
                    vm.idBack = null;
                    $scope.block2 = false;
                    break;
                case 3:
                    vm.student = null;
                    $scope.block3 = false;
                    break;
                case 4:
                    vm.people = null;
                    $scope.block4 = false;
                    break;
                default:
                    break;
            }
        };

    }
})();


