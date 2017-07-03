(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.newVip", {
                url: "/newVip?page",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }],
                    vipMsg: ['userService', function (userService) {
                        return userService.getVipMsg();
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/newVip/index.root.html',
                        controller: newVipController,
                        controllerAs: "vm"
                    }
                },
                // onEnter: function () {
                //     alert(1)
                // },
                // onExit: function () {
                //     alert(2)
                // }
            });
        }]);


    // ----------------------------------------------------------------------------
    newVipController.$inject = ['$scope', '$http', '$state', 'appConfig', 'alertService', '$rootScope', "vipMsg", "$timeout", "$mdDialog"];
    function newVipController($scope, $http, $state, appConfig, alertService, $rootScope, vipMsg, $timeout, $mdDialog) {
        $scope.comments = new Array(3);

        $scope.imgUrl = appConfig.imgUrl;
        // var swiper = new Swiper('.swiper-container', {
        //     pagination: '.swiper-pagination',
        //     slidesPerView: 1,
        //     centeredSlides: true,
        //     paginationClickable: true,
        //     spaceBetween: 0,
        //     autoHeight: true,
        // });
        //获取等级信息

        $scope.data1 = vipMsg.data;
        for (var i = 0; i < $scope.data1.agents.length; i++) {
            if ($scope.data1.agent === $scope.data1.agents[i].id) {
                $scope.order = $scope.data1.agents[i].order;
                $scope.name = $scope.data1.agents[i].name;
                /*
                 * 参考main/vip/authority.js
                 * */
                $scope.needIntegral = $scope.data1.agents[i].integral;
                if ($scope.order === $scope.data1.agents.length) {
                    $scope.nextIntegral = $scope.data1.agents[i].integral;
                } else {
                    $scope.nextIntegral = $scope.data1.agents[i + 1].integral;
                }
            }
        }
        // $http({
        //     method: "GET",
        //     url: appConfig.apiPath + "/integral/user"
        // }).then(function (resp) {
        //     $scope.data1 = resp.data;
        //     for (var i = 0; i < $scope.data1.agents.length; i++) {
        //         if ($scope.data1.agent === $scope.data1.agents[i].id) {
        //             $scope.order = $scope.data1.agents[i].order;
        //             $scope.name = $scope.data1.agents[i].name;
        //             /*
        //             * 参考main/vip/authority.js
        //             * */
        //             $scope.needIntegral = $scope.data1.agents[i].integral;
        //         }
        //     }
        // }, function () {
        // });

        /*
         * 渲染轮播图结构
         * */
        $timeout(function () {
            var swiper3 = new Swiper('.swiper-container2', {
                pagination: '.swiper-pagination',
                wrapperClass: 'my-wrapper2',
                slideClass: 'my-slide2',
                slidesPerView: 1.3,
                centeredSlides: true,
                paginationClickable: true,
                spaceBetween: 0,
                iOSEdgeSwipeDetection: true,
                setWrapperSize: true,
            });
            var Swiper2 = new Swiper('.swiper-container1', {
                wrapperClass: 'my-wrapper',
                slideClass: 'my-slide',
                slidesPerView: 1,
                centeredSlides: true,
                paginationClickable: true,
                spaceBetween: 30,
                iOSEdgeSwipeDetection: true,
                autoHeight: true, //高度随内容变化
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,//修改swiper的父元素时，自动初始化swiper
                onSlideChangeEnd: function (swiper) {
                    swiper.update();
                }
            });

            swiper3.params.control = Swiper2;//需要在Swiper2初始化后，Swiper1控制Swiper2
            Swiper2.params.control = swiper3;//需要在Swiper1初始化后，Swiper2控制Swiper1
            var Swiper5 = new Swiper('.swiper-container3', {
                control: [swiper3, Swiper2],//控制前面两个Swiper
            });
            if ($scope.order >= 1) {
                swiper3.slideTo($scope.order - 1, 500, false);
            }

            /*
             * 控制线下门店服务显示
             * */
            $scope.iconShow1 = false;
            $scope.showIcon1 = function () {
                $scope.iconShow1 = !$scope.iconShow1;
                $scope.iconShow2 = !$scope.iconShow2;
                $scope.iconShow3 = !$scope.iconShow3;
                Swiper2.update();
                $timeout(function () {
                    Swiper2.update();
                }, 500)
            };

            $scope.iconShow2 = false;
            $scope.showIcon2 = function () {
                $scope.iconShow2 = !$scope.iconShow2;
                $scope.iconShow1 = !$scope.iconShow1;
                $scope.iconShow3 = !$scope.iconShow3;
                Swiper2.update();
                $timeout(function () {
                    Swiper2.update();
                }, 500)
            };

            $scope.iconShow3 = false;
            $scope.showIcon3 = function () {
                $scope.iconShow3 = !$scope.iconShow3;
                $scope.iconShow1 = !$scope.iconShow1;
                $scope.iconShow2 = !$scope.iconShow2;
                Swiper2.update();
                $timeout(function () {
                    Swiper2.update();
                }, 500)
            };
        }, 100);


        /*
         * 签到相关js
         * */
        $scope.data = {};
        // 进行签到
        $scope.signs = function () {
            $http({
                method: "POST",
                url: appConfig.apiPath + '/integral/sign',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                $scope.data.toDaySign = true;
            }, function () {
            });
        };
        // 进行签到
        $scope.data = {"toDaySign": false, "integral": 0, "sign": 0, "count": 0, "advertise": null};
        $scope.lodingThis = function () {
            $http({
                method: 'GET',
                url: appConfig.apiPath + '/integral/index'
            }).then(function (resp) {
                $scope.data = resp.data.result;
                $scope.totalIntegral = resp.data.result.totalIntegral;
                $rootScope.isUpdateUserInfo = resp.data.result.isUpdateUserInfo;
                console.log('$rootScope.isUpdateUserInfo', $rootScope.isUpdateUserInfo);
                $scope.currentLevel = resp.data.result.currentLevel;
                $scope.calculation();
            });
        };
        $scope.lodingThis();

        /*
         * 计算进度条位置
         * */
        $scope.calculation = function () {
            if ($scope.data.totalIntegral < $scope.data1.agents[1].integral) {
                angular.element('.line-img1').css("-webkit-transform", "translateX(-" + ((1 - $scope.data.totalIntegral / $scope.nextIntegral) * 100 ) + "%)");
                angular.element('.line-img2').css("-webkit-transform", "translateX(-" + ((1 - ($scope.data.totalIntegral) / ($scope.data1.agents[2].integral)) * 100 ) + "%)");
            } else {
                angular.element('.line-img2').css("-webkit-transform", "translateX(-" + ((1 - ($scope.data.totalIntegral - $scope.data1.agents[1].integral) / ($scope.nextIntegral - $scope.data1.agents[1].integral)) * 100 ) + "%)");
            }
        };


        $scope.maxSize = 1;
        //页面展示页数   5
        $scope.pageSize = 4;
        //页面展示条数   10
        $scope.curPage = 1;
        $scope.page = function () {
            //获取账户信息
            $http({
                method: "GET",
                url: appConfig.apiPath + "/integral/itemList?brandId=56f8e97c0cf2a98fe2d4d6e0&curPage=" + $scope.curPage + "&pageSize=" + $scope.pageSize,
                params: {
                    type: 'SERVICE'
                }
            }).then(function (resp) {
                    $scope.serviceData = resp.data;
                    // console.log('$scope.serviceData', $scope.serviceData);
                }, function () {
                }
            );

            $http({
                method: "GET",
                url: appConfig.apiPath + "/integral/itemList?brandId=56f8e97c0cf2a98fe2d4d6e0&curPage=" + $scope.curPage + "&pageSize=" + $scope.pageSize,
                params: {
                    type: 'ITEM'
                }
            }).then(function (resp) {
                    $scope.itemData = resp.data;
                    // console.log('$scope.itemData', $scope.itemData);
                }, function () {
                }
            );
        };

        // 面板
        $scope.tabs = function (num) {
            $scope.tab = num;
            $scope.curPage = 1;
            $scope.page();
        };
        $scope.tabs("SERVICE");


        $scope.addInfo = function () {
            if ($rootScope.isUpdateUserInfo) {
                return;
            }
            $state.go("main.user", {s: 'center'}, {reload: true});
        };

        /*
         * 弹窗js
         * */
        $scope.dialogShow = function (ev) {
            $mdDialog.show({
                templateUrl: 'views/main/newVip/dialog.html',
                parent: angular.element(document.body).find('.ks-newVip'),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false,
                controller: ['$scope', '$mdDialog', '$timeout', function ($scope, $mdDialog, $timeout) {
                    var vm = this;

                    $timeout(function () {
                        var swiper4 = new Swiper('.swiper-container4', {
                            wrapperClass: 'my-wrapper4',
                            slideClass: 'my-slide4',
                            slidesPerView: 1.3,
                            centeredSlides: true,
                            paginationClickable: true,
                            spaceBetween: 30,
                            iOSEdgeSwipeDetection: true,
                        });
                    }, 305);


                    vm.checkSubmit = function () {
                        $mdDialog.hide(true);
                    };
                    vm.cancel = function () {
                        $mdDialog.cancel();
                    };
                }],
                controllerAs: "vm"
            }).then(function () {
                // alert(answer)
            }, function () {
                // alert(answer)
            });
        };

    }
})();