(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单提交成功
         */
        $stateProvider.state("main.paymentMethod.orderSuccess", {
            url: '/orderSuccess',
            views: {
                "@": {
                    templateUrl: 'views/main/paymentMethod/orderSuccess/index.root.html',
                    controller: orderSuccessController
                }
            }
        });
    }]);
    orderSuccessController.$inject = ['$scope', '$http', '$state', 'appConfig', '$mdBottomSheet'];
    function orderSuccessController($scope, $http, $state, appConfig, $mdBottomSheet) {
        $scope.details = function () {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'views/main/paymentMethod/details/index.root.html',
                controllerAs: "vm",
                controller: ["$httpParamSerializer", "FileUploader", function ($httpParamSerializer, FileUploader) {
                    var vm = this;
                    vm.cancel = function () {
                        $mdBottomSheet.hide(false);
                    };
                    vm.updateAvatar = function () {
                        angular.element("#uploaderFile").click();
                    };
                    var uploader = vm.uploader = new FileUploader({
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
                        $http({
                            method: "POST",
                            url: appConfig.apiPath + '/user/updateUserInfo',
                            data: $httpParamSerializer({yunFileId: response.id}),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            }
                        }).then(function () {
                            $mdBottomSheet.hide(response);
                        }, function (resp) {
                            var data = resp.data;
                            if (data.code === "NOT_LOGINED") {
                                $state.go("main.newLogin", {backUrl: window.location.href});
                            }
                        });
                    };
                }],
                parent: '.ks-main'
            }).then(function (response) {
                if (response) {
                    $scope.user.userInfo.avatar = response.avatar;
                }
            });
        };

        $scope.chooseMethod = function () {
        };
        // 回退页面
        $scope.fallbackPage = function () {
            if ($state.params.s === 'fx') {
                $state.go("main.index", null, {reload: true});
            } else {
                if (history.length === 1) {
                    $state.go("main.index", null, {reload: true});
                } else {
                    history.back();
                }
            }

        };
    }

})();
