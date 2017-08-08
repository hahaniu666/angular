/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.mufengdialog", {
                url: "/dialogMufeng",
                views: {
                    "@": {
                        templateUrl: 'biz/dialogMufeng/mufengdialog.html',
                        controller: selsectProductController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            selsectProductController.$inject = ['$scope','$mdBottomSheet','$mdDialog'];
            function selsectProductController($scope,$mdBottomSheet,$mdDialog) {


                $scope.comments = new Array(5);


                $scope.show = function (ev) {
                    console.log("--------show");
                    $mdBottomSheet.show({
                        templateUrl: 'biz/selsectProduct/select.html',
                        parent: '.ks-main',
                        controller: BsController
                    }).then(function (clickedItem) {
                        /*console.log("clicked : " + clickedItem)*/
                    });
                }

                //商品详情
                $scope.showParameter = function (ev) {
                    console.log("--------show");
                    $mdBottomSheet.show({
                        templateUrl: 'biz/selsectProduct/parameter.html',
                        parent: '.ks-main',
                        controller: parameterController
                    }).then(function (clickedItem) {
                        /*console.log("clicked : " + clickedItem)*/
                    });

                }


            }

            // ---------------------------------------------------------------------------- // 模拟空购物车中商品
            BsController.$inject = ['$scope', '$mdBottomSheet'];
            function BsController($scope, $mdBottomSheet) {
                console.log("---------------BsController");
                $scope.cc = function () {
                    return $mdBottomSheet.hide("xxx");
                }
            }

            // ----------------------------------------------------------------------------//商品详情
            parameterController.$inject = ['$scope', '$mdBottomSheet'];
            function parameterController($scope, $mdBottomSheet) {
                console.log("---------------BsController");
                $scope.cc = function () {
                    return $mdBottomSheet.hide("xxx");
                }
                $scope.arrays = new Array(12);

            }
            // ----------------------------------------------------------------------------//加入成功
            selectCartController.$inject = ['$scope', '$mdDialog','$timeout'];
            function selectCartController($scope, $mdDialog,$timeout) {
                $scope.cc = function () {
                    return $mdDialog.hide("xxx");
                }

                //将resolve/reject处理函数绑定到timer promise上以确保我们的cancel方法能正常运行
                $timeout(
                    function() {

                    },
                    2000
                ).then(
                    function() {
                        $scope.cc();
                    },
                    function() {

                    }
                );

            }
        }]);

})();