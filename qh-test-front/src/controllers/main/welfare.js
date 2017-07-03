/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.welfare", {
                url: "/welfare",
                views: {
                    "@": {
                        templateUrl: 'views/main/welfare/index.root.html',
                        controller: welfareController,
                        controllerAs: 'vm'
                    }
                }
            });
        }]);
    // ----------------------------------------------------------------------------
    welfareController.$inject = ['$scope', '$http', '$state', '$rootScope', 'appConfig', 'imgService', '$interval', '$filter', "$compile", 'urlbackService'];
    function welfareController($scope, $http, $state, $rootScope, appConfig, imgService, $interval, $filter, $compile, urlbackService) {
        var vm = this;
        vm.appConfig = appConfig;
        vm.fallbackPage = function () {
            $state.go("main.index");
        };
        vm.imgService = imgService;
        ////////////// 进行获取轮拨图
        $http
            .get(appConfig.apiPath + '/common/imgCarousel?type=WELFARE')
            .success(function (data) {
                vm.imgCarousel = data.recList;
                var detail = "<ks-swiper-container swiper='welfareSwiper'" +
                    "override-parameters=\"{'effect':'between'}\"" +
                    "slides-per-view=\"1\"" +
                    "slides-per-column=\"1\"" +
                    "space-between=\"0\"" +
                    "pagination-is-active=\"true\"" +
                    "pagination-clickable=\"false\"" +
                    "show-nav-buttons=\"false\"" +
                    "loop=\"false\"" +
                    "autoplay=\"5000\"" +
                    "initial-slide=\"0\"" +
                    "direction=\"horizontal\">" +
                    "<ks-swiper-slide class=\"swiper-slide\" ng-repeat=\"s in vm.imgCarousel\">" +
                    "<a ng-click='vm.clickUrl(s.url)'><img ng-src=\"{{vm.appConfig.imgUrl}}{{s.img}}?imageView2/2/w/{{vm.imgService.slideImg.w}}/h/{{vm.imgService.slideImg.h}}\"></a>" +
                    "<p class='slide-title'>{{s.title}}</p>" +
                    "</ks-swiper-slide>" +
                    "</ks-swiper-container>";
                var ele = $compile(detail)($scope);
                angular.element('#banner').html(ele);
            })
            .error(function () {
            });
        vm.clickUrl = function (url) {
            urlbackService.urlBack(url);
        };
        // 计算里结束还有多久
        vm.endTime = function (activity) {
            $rootScope.intervalStop = $interval(function () {
                var date = new Date().getTime();
                var oldDate;
                if (activity.type === 'USED') {
                    oldDate = new Date($filter("date")(activity.endDate, "yyyy/MM/dd HH:mm:ss")).getTime();
                } else {
                    oldDate = new Date($filter("date")(activity.beginDate, "yyyy/MM/dd HH:mm:ss")).getTime();
                }
                // 倒计时到零时，停止倒计时
                var rest = oldDate - date;
                if (rest <= 0) {
                    vm.activityCheck = null;
                    $interval.cancel($rootScope.intervalStop);
                    $rootScope.intervalStop = null;
                    return;
                }
                //计算出小时数
                var leave1 = rest % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
                var hours = Math.floor(leave1 / (3600 * 1000));
                //计算相差分钟数
                var leave2 = rest % (3600 * 1000);        //计算小时数后剩余的毫秒数
                var minutes = Math.floor(leave2 / (60 * 1000));

                //计算相差秒数
                var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
                var seconds = Math.round(leave3 / 1000);
                vm.activityCheck.house = hours;
                vm.activityCheck.minu = minutes;
                vm.activityCheck.second = seconds;
            }, 1000);
        };
        vm.activityCheck = null;
        //////////// 获取该活动下的商品
        vm.querySku = function (activity) {
            if ($rootScope.intervalStop) {
                // 切换计算数的时候进行停止上一个计算
                $interval.cancel($rootScope.intervalStop);
                $rootScope.intervalStop = null;
            }
            // 所有的活动都是未点中
            for (var i = 0; i < vm.activityList.length; i++) {
                vm.activityList[i].click = false;
            }
            if (activity.type === 'USED') {
                vm.activityCheck = {type: 'USED', img: activity.img};
                vm.endTime(activity);
            } else if (activity.type === 'BEGIN') {
                vm.activityCheck = {type: 'BEGIN', img: activity.img};
                vm.endTime(activity);
            } else {
                vm.activityCheck = {type: 'END', img: activity.img};
            }
            // 该活动被选中 获取该活动下的sku
            activity.click = true;
            $http
                .get(appConfig.apiPath + '/item/querySku?id=' + activity.id)
                .success(function (data) {
                    vm.activitySku = data.recList;
                })
                .error(function () {
                });
        };

        vm.gotoDetail = function (sku) {
            if (vm.activityCheck.type == 'USED') {
                $state.go("main.item", {itemId: sku.itemId, skuId: sku.id});
            }
        };

        //////////// 获取商品的活动时间
        $http({
            method: "GET",
            url: appConfig.apiPath + '/item/queryBoon'
        }).then(
            function (resp) {
                var data = resp.data;
                vm.activityList = data.recList;
                // 判断是否有正在进行中的活动，没有则获取最后一个
                var boo = false;
                for (var i = 0; i < vm.activityList.length; i++) {
                    if (vm.activityList[i].type === 'USED') {
                        vm.querySku(vm.activityList[i]);
                        boo = true;
                        break;
                    }
                }
                if (vm.activityList.length > 0 && !boo) {
                    vm.querySku(vm.activityList[vm.activityList.length - 1]);
                }
            }, function () {
            });
    }
})();