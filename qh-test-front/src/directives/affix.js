/**
 * 在 angular 中实现 bootstrap 的 affix 功能。
 * 在其基础上修改了部分内容。
 *
 * 参考：
 * 1. http://v3.bootcss.com/javascript/#affix
 * 2. https://github.com/maxisam/angular-bootstrap-affix/blob/master/src/bootstrap-affix.js
 */

angular.module('qh-test-front').directive('bsAffix', ['$window', function ($window) {

    var checkPosition = function (instance, el, options) {

        var scrollTop = window.pageYOffset;
        var scrollHeight = document.body.scrollHeight;
        var position = el.offset();
        var height = el.height();
        var offsetTop = options.offsetTop * 1;
        var offsetBottom = options.offsetBottom * 1;
        var reset = 'affix affix-top affix-bottom';
        var affix;

        if (instance.unpin !== null && (scrollTop + instance.unpin <= position.top)) {
            affix = false;
        } else if (offsetBottom && (position.top + height >= scrollHeight - offsetBottom)) {
            affix = 'bottom';
        } else if (offsetTop && scrollTop <= offsetTop) {
            affix = 'top';
        } else {
            affix = false;
        }

        if (instance.affixed === affix) return;

        instance.affixed = affix;
        instance.unpin = affix === 'bottom' ? position.top - scrollTop : null;

        el.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''));
    };

    var checkCallbacks = function (scope, instance, iElement, iAttrs) {
        if (instance.affixed) {
            scope.onUnaffix();
        } else {
            scope.onAffix();
        }
    };

    return {
        restrict: 'EAC',
        scope: {
            onUnaffix: "&",
            onAffix: "&"
        },
        link: function postLink(scope, iElement, iAttrs) {
            var instance = {unpin: null};

            angular.element($window).bind('scroll', function () {
                checkPosition(instance, iElement, iAttrs);
                checkCallbacks(scope, instance, iElement, iAttrs);
            });

            angular.element($window).bind('click', function () {
                setTimeout(function () {
                    checkPosition(instance, iElement, iAttrs);
                    checkCallbacks(scope, instance, iElement, iAttrs);
                }, 1);
            });
        }
    };
}]);
