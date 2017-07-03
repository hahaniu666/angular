/**
 * Created by susf on 17-5-6.
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.lottery.lotteryMain", {
                url: "/lotteryMain",
                // resolve: {
                //     curUser: ['userService', function (userService) {
                //         return userService.getCurUser(true, true);
                //     }]
                // },
                views: {
                    "@": {
                        templateUrl: 'views/main/lottery/lotteryMain/index.root.html',
                        controller: lotteryMainController,
                        controllerAs: "vm"
                    }
                },
            });
        }]);

    // ----------------------------------------------------------------------------
    lotteryMainController.$inject = ['$scope', '$http', '$state', 'appConfig', '$cookies', '$rootScope', "imgService", '$interval', '$filter', 'wxService', 'userService', '$mdDialog'];
    function lotteryMainController($scope, $http, $state, appConfig, $cookies, $rootScope, imgService, $interval, $filter, wxService, userService, $mdDialog) {















        //控制转盘第一层背景更换
        $scope.flog = true;
        //转盘类
        function turntableDraw(obj, jsn) {
            "use strict";
            this.draw = {};
            this.draw.currNumber = 1;
            // this.draw.obj = $(obj);
            this.draw.obj = document.getElementById(obj);
            // this.draw.objClass = $(obj).attr("class");
            this.draw.objClass = document.getElementById(obj).className;
            // console.log(this.draw.objClass)
            this.draw.newClass = "rotary" + "new" + parseInt(Math.random() * 1000);
            var _jiaodu = parseInt(360 / jsn.share);
            var _yuan = 360 * (jsn.weeks || 4) + parseInt(_jiaodu / 2);
            var _str = "";
            var _speed = jsn.speed || "2s";
            var _velocityCurve = jsn.velocityCurve || "ease";
            var _this = this;
            for (var i = 1; i <= jsn.share; i++) {
                _str += "." + this.draw.newClass + i + "{";
                _str += "transform:rotate(" + ((i - 1) * _jiaodu + _yuan) + "deg);";
                _str += "-ms-transform:rotate(" + ((i - 1) * _jiaodu + _yuan) + "deg);";
                _str += "-moz-transform:rotate(" + ((i - 1) * _jiaodu + _yuan) + "deg);";
                _str += "-webkit-transform:rotate(" + ((i - 1) * _jiaodu + _yuan) + "deg);";
                _str += "-o-transform:rotate(" + ((i - 1) * _jiaodu + _yuan) + "deg);";
                _str += "transition: transform " + _speed + " " + _velocityCurve + ";";
                _str += "-moz-transition: -moz-transform " + _speed + " " + _velocityCurve + ";";
                _str += "-webkit-transition: -webkit-transform " + _speed + " " + _velocityCurve + ";";
                _str += "-o-transition: -o-transform " + _speed + " " + _velocityCurve + ";";
                _str += "}";
                _str += "." + this.draw.newClass + i + "stop{";
                _str += "transform:rotate(" + ((i - 1) * _jiaodu + parseInt(_jiaodu / 2)) + "deg);";
                _str += "-ms-transform:rotate(" + ((i - 1) * _jiaodu + parseInt(_jiaodu / 2)) + "deg);";
                _str += "-moz-transform:rotate(" + ((i - 1) * _jiaodu + parseInt(_jiaodu / 2)) + "deg);";
                _str += "-webkit-transform:rotate(" + ((i - 1) * _jiaodu + parseInt(_jiaodu / 2)) + "deg);";
                _str += "-o-transform:rotate(" + ((i - 1) * _jiaodu + parseInt(_jiaodu / 2)) + "deg);";
                _str += "}";
            }
            $(document.head).append("<style>" + _str + "</style>");
            _speed = _speed.replace(/s/, "") * 1000;
            this.draw.startTurningOk = false;
            this.draw.number = jsn.number;
            this.draw.goto = function (ind) {
                if (_this.draw.startTurningOk) {
                    return false
                }
                if (_this.draw.currNumber > _this.draw.number) {
                    callbackA();
                    return false
                } else {
                    _this.draw.currNumber++
                }
                _this.draw.obj.setAttribute('class', _this.draw.objClass + " " + _this.draw.newClass + ind);
                // _this.draw.obj.attr("class",_this.draw.objClass+" "+_this.draw.newClass+ind);
                _this.draw.startTurningOk = true;
                $scope.lottery.number--;
                var timer = setInterval(function () {
                    $scope.flog = !$scope.flog;
                    // console.log($scope.flog);
                    $scope.$digest();
                }, 200);

                setTimeout(function () {
                    clearInterval(timer)
                    _this.draw.obj.setAttribute('class', _this.draw.objClass + " " + _this.draw.newClass + ind + "stop");
                    // _this.draw.obj.attr("class",_this.draw.objClass+" "+_this.draw.newClass+ind+"stop");
                    if (jsn.callback) {
                        _this.draw.startTurningOk = false;
                        jsn.callback(ind);
                    }
                    ;
                }, _speed + 10);
                return _this.draw;
            };
            return this.draw;
        };

        //转盘实例 //.img1为需要旋转元素的id;
        $scope.lottery = {};
        //默认每次进页面可以转5次
        $scope.lottery.number = 5;
        var newdraw = new turntableDraw('.img01', {
            //几个奖项
            share: 8,
            // 旋转几秒
            speed: "3s",
            //变速
            velocityCurve: "ease",
            //先转6圈
            weeks: 6,
            //可以旋转次数
            number: $scope.lottery.number,
            //旋转完成后的回调函数
            callback: function (num) {
                callbackB(num);
            },
        });
        //点击旋转
        $scope.turn = function () {
            newdraw.goto(parseInt(Math.random() * 8) + 1);
        };
        //抽奖回调
        function callbackA() {
            // alert('次数用完了');
        }

        function callbackB(ind) {
            $scope.dialogShow(ind);
        }


        $scope.dialogShow = function (ind) {
            $mdDialog.show({
                templateUrl: 'views/main/lottery/lotteryDialog/index.root.html',
                parent: angular.element(document.body).find('#qh-test-front'),
                // targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false,
                controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {
                    var vm = this;
                    vm.ind = ind;
                    console.log(vm);
                    console.log(vm.ind);
                    vm.checkSubmit = function () {
                        $mdDialog.hide(true);
                    };
                    vm.cancel = function () {
                        $mdDialog.cancel();
                    };
                }],
                controllerAs: "vm"
            }).then(function (answer) {
                // alert(answer)
                if (answer){
                    $state.go("main.lottery.WXfollow", null, {reload: true});
                }
            }, function () {
                // alert(answer)
            });

        };

        $scope.showGameRules = function (ev) {
            $mdDialog.show({
                templateUrl: 'views/main/lottery/lotteryRules/index.root.html',
                parent: angular.element(document.body).find('#qh-test-front'),
                // targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false,
                controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {
                    var vm = this;
                    vm.ind = ev;
                    console.log(vm);
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
        }



    }
})();