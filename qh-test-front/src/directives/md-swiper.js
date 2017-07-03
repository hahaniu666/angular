(function () {

    /**
     * 阻止ios系统300ms延迟
     *
     * 参考： http://stackoverflow.com/questions/34575510/angular-ng-click-issues-on-safari-with-ios-8-3
     */
    angular.module('qh-test-front')
        .directive("mdSwiperLeft", [function () {
            return function (scope, elem, attrs) {
                elem.bind("touchstart click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    scope.$apply(attrs["mdSwiperLeft"]);
                });
            };
        }])
        .directive("mdSwiperUp", [function () {
            return function (scope, elem, attrs) {
                elem.bind("touchstart click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    scope.$apply(attrs["mdSwiperUp"]);
                });
            };
        }])
        .directive("mdSwiperRight", [function () {
            return function (scope, elem, attrs) {
                elem.bind("touchstart click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    scope.$apply(attrs["mdSwiperRight"]);
                });
            };
        }])
        .directive("mdSwiperDown", [function () {
            return function (scope, elem, attrs) {
                elem.bind("touchstart click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    scope.$apply(attrs["mdSwiperDown"]);
                });
            };
        }]);
})();