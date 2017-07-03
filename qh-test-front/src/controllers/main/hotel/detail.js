(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.hotel.detail", {
                url: "/detail?id",
                views: {
                    "@": {
                        templateUrl: 'views/main/hotel/detail/index.root.html',
                        controller: hotelDetailController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    hotelDetailController.$inject = ['$scope', '$http', '$state', 'appConfig', '$compile',  "imgService", "$timeout"];
    function hotelDetailController($scope, $http, $state, appConfig, $compile,  imgService, $timeout) {
        var vm = this;

        $scope.id = $state.params.id;
        $scope.imgUrl = appConfig.imgUrl;
        $scope.hotImg = imgService.hotImg;

        $scope.detailSwiper = {};

        $scope.iconList = [
            {
                name: '电视',
                icon: 'ks-tv'
            },
            {
                name: '空调',
                icon: 'ks-aircondition'
            },
            {
                name: '热水',
                icon: 'ks-hot-water'
            },
            {
                name: '宽带',
                icon: 'ks-net'
            },
            {
                name: 'WI-FI',
                icon: 'ks-wifi'
            },
            {
                name: '电吹风',
                icon: 'ks-dryer'
            }
        ];


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

        vm.baiduPoint = function () {
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            var addr = vm.data.result.province + vm.data.result.city + vm.data.result.area + vm.data.result.street;
            var title = vm.data.result.title;
            myGeo.getPoint(addr, function (point) {
                if (point) {
                    vm.data.result.point = point;
                    addMarker(point, addr, title);
                    vm.clickCenter(vm.data.result);
                }
            }, "addr");
            // }
        };
        // 设置为中心
        vm.clickCenter = function (org) {
            map.centerAndZoom(org.point, 16);
        };

        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };

        $http({
            method: "GET",
            url: appConfig.apiPath + "/org/detail",
            params: {
                id: $scope.id
            }
        }).then(function (resp) {
                vm.data = resp.data;
                vm.baiduPoint(1);
                var ele = $compile(vm.data.result.detail)($scope);
                angular.element('#need-detail').append(ele);
                $timeout(function () {
                    $scope.detailSwiper.update();
                });
            }, function () {
            }
        );

    }
})();
