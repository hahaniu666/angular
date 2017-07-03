(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单付款
         */
        $stateProvider.state("main.vip.baiduMap", {
            url: '/baiduMap?id&cleanOrder', // orderId代表的是qhPay的支付Id.id只有在详情页面进来的时候才有值,payType支付方式
            views: {
                "@": {
                    templateUrl: 'views/main/vip/baiduMap/index.root.html',
                    controller: baiduMapController,
                    controllerAs: "vm"
                }
            }
        });
    }]);
    baiduMapController.$inject = ['alertService', '$http', '$state',  'appConfig'];
    function baiduMapController(alertService, $http, $state,  appConfig) {
        var vm = this;
        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };

        vm.baiduOrg = function (curPage) {
            var url = "/integral/orgAddress?curPage=" + curPage + "&pageSize=" + appConfig.pageSize;
            if ($state.params.cleanOrder == 'true') {
                url += "&hasDevice=true";       //共用接口，洗护商品下单，查看附近门店，只显示有消毒柜的
            }
            if ($state.params.id) {
                url = url + "&id=" + $state.params.id;
            }
            $http({
                method: "GET",
                url: appConfig.apiPath + url
            }).then(function (resp) {
                vm.data = resp.data.orgs;
                vm.baiduMapNew(0);
            }, function (resp) {
            });
        };
        vm.baiduOrg(1);
        // 百度地图API功能
        var map = new BMap.Map("allmap");
        var point = new BMap.Point(120.204, 30.715);
        map.centerAndZoom(point, 10);
        map.enableScrollWheelZoom();
        map.enableKeyboard();


        // 编写自定义函数,创建标注
        var addMarker = function (point, addr, title) {
            var marker = new BMap.Marker(point);
            map.addOverlay(marker);
            var opts = {
                width: 200,     // 信息窗口宽度
                height: 100,     // 信息窗口高度
                title: title, // 信息窗口标题
                enableMessage: true//设置允许信息窗发送短息
            };
            var infoWindow = new BMap.InfoWindow("地址：" + addr, opts);  // 创建信息窗口对象
            marker.addEventListener("click", function () {
                map.openInfoWindow(infoWindow, point); //开启信息窗口
            });
        };
        vm.baiduMapNew = function (index) {
            if (index >= vm.data.length) {
                //执行完后，定位到当前第一个地址的范围内
                map.centerAndZoom(vm.data[0].point, 10);
                return;
            }
            vm.baiduPoint(vm.data[index], index);

        };
        vm.baiduPoint = function (orgs, index) {
            // for (var i = 0; i < vm.data.length; i++) {
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            // var orgs = vm.data[i];
            // 将地址解析结果显示在地图上,并调整地图视野
            var addr = orgs.province + orgs.city + orgs.area + orgs.street;
            var title = orgs.title;
            myGeo.getPoint(addr, function (point) {
                if (point) {
                    // map.centerAndZoom(point, 16);
                    // map.addOverlay(new BMap.Marker(point));
                    orgs.point = point;
                    addMarker(point, addr, title);
                    index++;
                    vm.baiduMapNew(index);
                }
            }, "杭州市");
            // }
        };
        // 设置为中心
        vm.clickCenter = function (org) {
            map.centerAndZoom(org.point, 16);
        };
        // 导航,进行展示用户的地址
        vm.navigation = function (org) {
            var content = org.name;
            var title = org.street;
            var lt = org.point.lat;
            var gt = org.point.lng;
            // 获取导航的地点
            if (window.cordova) {
                var url = null;
                var scheme = null;
                var host = null;
                if (cordova.platformId === 'ios') {
                    host = "iosamap";
                    scheme = 'iosamap://';
                    // baidumap
                } else {
                    host = "androidamap";
                    scheme = 'com.autonavi.minimap';
                    // com.baidu.BaiduMap
                }
                url = host + "://viewMap?sourceApplication=applicationName&poiname=" + title + "&lat=" + lt + "&lon=" + gt + "&dev=1";
                appAvailability.check(
                    scheme,       // URI Scheme or Package Name
                    function () {  // Success callback
                        var ref = window.cordova.InAppBrowser.open(url, '_system', 'location=yes');
                    },
                    function () {  // Error callback
                        if (cordova.platformId === 'ios') {
                            scheme = 'baidumap://';
                            host = "baidumap";
                            // baidumap
                        } else {
                            scheme = 'com.baidu.BaiduMap';
                            host = "bdapp";
                            // com.baidu.BaiduMap
                        }
                        // url = host + "://map/navi?location=" + lt + "," + gt;
                        url = host + "://map/marker?location=" + lt + "," + gt + "&title=" + title + "&content=" + content + "&src=webapp.marker.yourCompanyName.yourAppName";
                        appAvailability.check(
                            scheme,       // URI Scheme or Package Name
                            function () {  // Success callback
                                boo = true;
                                var ref = window.cordova.InAppBrowser.open(url, '_system', 'location=yes');
                            },
                            function () {  // Error callback
                                alertService.msgAlert(null, "请下载高德或者百度地图!");
                            }
                        );
                    }
                );
            } else {
                //ua.match判断浏览器类型来进行选择登录类型
                var ua = window.navigator.userAgent.toLowerCase();
                // alert(ua);
                var url = null;
                var type = "B";
                if (type === 'B') {
                    var host = "bdapp";
                    if (ua.match(/ios/i) || ua.match(/iphone/i) || ua.match(/ipad/i)) {
                        host = "baidumap"
                    }
                    url = host + "://map/marker?location=" + lt + "," + gt + "&title=" + title + "&content=" + content + "&src=webapp.marker.yourCompanyName.yourAppName";
                } else {
                    var host = "androidamap";
                    if (ua.match(/ios/i) || ua.match(/iphone/i) || ua.match(/ipad/i)) {
                        host = "iosamap"
                    }
                    url = host + "://viewMap?sourceApplication=applicationName&poiname=" + title + "&lat=" + lt + "&lon=" + gt + "&dev=1";
                }
                location.href = url;
            }

        };
    }
})();