(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 输入密码
         */
        $stateProvider.state("main.previewTemplate.directSeeding", {
            url: '/directSeeding',
            views: {
                "@": {
                    templateUrl: 'views/main/previewTemplate/directSeeding/index.root.html',
                    controller: previewTemplateDirectSeedingController
                }
            }
        });
    }]);
    previewTemplateDirectSeedingController.$inject = ['$scope', '$mdBottomSheet', '$state'];
    function previewTemplateDirectSeedingController($scope, $mdBottomSheet, $state) {
        $scope.moreSwiper = {};

        loadjs('//g.alicdn.com/de/prismplayer/1.4.10/prism-h5-min.js', {
            success: function () { /* foo.js loaded */
                //$scope.openAudio();
            }
        });


        var video = document.getElementsByClassName("video");
        $scope.show = false;
        $scope.show1 = false;
        $scope.playBtn = function (num) {
            $scope.show = true;
            video[num - 1].play();
        };
        $scope.play = function (num) {
            if (num == 1) {
                $scope.show = true;
                video[num - 1].play();
            } else if (num == 2) {
                $scope.show1 = true;
                video[num - 1].play();
            }
        };
        $scope.pause = function (num) {
            if (video[num - 1].paused) {
                if (num == 1) {
                    $scope.show = true;
                    video[num - 1].play();
                } else if (num == 2) {
                    $scope.show1 = true;
                    video[num - 1].play();
                }
            } else {
                if (num == 1) {
                    $scope.show = false;
                    video[num - 1].pause();
                } else if (num == 2) {
                    $scope.show1 = false;
                    video[num - 1].pause();
                }
            }
        };
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();
