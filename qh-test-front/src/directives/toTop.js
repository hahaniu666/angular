/**
 * 返回顶部的窗口右下角图标。
 */
angular.module('qh-test-front').directive('toTop', ['$log', '$window', function ($log, $window) {
    function link(scope, element, attrs, controllers) {
        element.addClass("toTop");

        element.click(function () {
            $window.scrollTo(0, 0);
        });

        var $win = $window.jQuery($window);
        //var winHeight = $win.height();
        var onScrollFunc = function () {
            if ($win.scrollTop() > 200) {
                element.show();
            } else {
                element.hide();
            }
        };
        $win.scroll(onScrollFunc);
        onScrollFunc();
    }

    return {
        restrict: "AE",
        transclude: false,
        priority: 0,
        template: ' <div class="topcircle"><span class="iconfont icon-fanhuidingbu topto"></span></div>',
        link: link,
        replace: false

    };
}]);

