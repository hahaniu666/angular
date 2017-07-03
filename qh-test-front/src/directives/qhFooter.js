/**
 * 动态根据footer调整前一个元素的padding-bottom。
 */
angular.module('qh-test-front').directive('qhFooter', ['$log', '$window', function ($log, $window) {
    function link(scope, element, attrs, controllers) {

        var preEles = element.prev();

        for (var i = preEles.length - 1; i >= 0; i--) {
            // 找到footer前面的第一个非绝对定位的元素，将其padding设置为合理值。
            // 不足之处：该处理仅仅执行一次。
            var preEle = $window.jQuery(preEles[i]);
            var prePos = preEle.css("position");
            if (prePos !== "absolute" && prePos !== "fixed") {
                console.log(element.height());
                preEle.css("padding-bottom", element.height());
                break;
            }
        }
    }

    return {
        restrict: "AE",
        transclude: false,
        priority: 0,
        link: link,
        replace: false

    };
}]);

