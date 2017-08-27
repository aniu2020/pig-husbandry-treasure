/**
 * author    aniu
 * email     106535323@qq.com
 */

//=== 节流处理===
var PHT = window.PHT || {};//全站全局接口
!function (PHT) {
    /**
     * 节流处理
     * @param method 方法(传的是方法名，不加())  -->a.call(b)  把a的方法传给b用 下面的b是window
     */
    PHT.throttle = function (method) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function () {
            method.call();

        }, 300);
    };
}(window.PHT);

//检测是否为 IE6
PHT.isIe6 = !-[1, undefined] && !window.XMLHttpRequest;//加了个undefined 修改gulp 压缩的时候会把','自动去掉的bug
//ie6-8响应式处理
!function ($, W, PHT) {

    if ($.support.leadingWhitespace) {//判断非ie 678 直接return （ie678都不支持leadingWhitespace属性，所以可以用来判断）
        return;
    }
    var responsive = {
        init: function () {
            this.switchClass();
        },
        /**
         * 响应式尺寸切换
         */
        switchClass: function () {
            var $WVisible = $(W).width(),//浏览器可见宽度
                $html = $('html');
            if ($WVisible > 1008 && $WVisible < 1255) {
                $html.addClass('w990');
                $html.removeClass('w750');

            } else if ($WVisible < 1009) {
                $html.addClass('w750');
                $html.removeClass('w990');
            }
            else {
                $html.removeClass('w990');
                $html.removeClass('w750');
            }
        }

    };

    //页面初始化
    responsive.init();
    //事件绑定
    $(W).on('resize', function () {

        PHT.throttle(responsive.switchClass);
    });

}(jQuery, window, window.PHT);

//===返回顶部===
!function ($, W, PHT) {
    //移动端 去掉返回顶部
    if ($(W).width() < 1008) {
        return;
    }

    var $window = $(window),
        $body = $("body"),
        $fixedObj = '';

    var goTop = {
        init: function () {
            var backTop = $('<div id="fixedObj" style="position:fixed;right:20px;bottom:220px;_position:absolute;z-index:99999;display: none"><a href="javascript:;" title="回到顶部" target="_self" id="backToTop" class="iconfont" style="display:block;font-size: 30px;padding: 1px 14px 12px;color:#fff;background-color: #e2e2e2;_width: 1px;">︿</a>' + '</div>');

            $body.append(backTop);
            $fixedObj = $('#fixedObj');
            this.goTopSwitch();
        },
        goTopSwitch: function () {
            var e = $(W).scrollTop();
            if (e > 50) {
                $fixedObj.stop(true, true).fadeIn();
            } else {
                $fixedObj.stop(true, true).fadeOut();
            }

            if ($(W).scrollTop() > $(document.body).height() - $('.footer').height() - $(window).height()) {
                $fixedObj.css('bottom', '410px');
            } else {
                $fixedObj.css('bottom', '205px');

            }
        }
    };

    //初始化
    goTop.init();

    //窗口滚动
    $window.scroll(function () {

        //PHT.throttle(goTopSwitch);
        goTop.goTopSwitch();
    });

    //鼠标经过
    $body.on('mouseover', '#backToTop', function () {
        $(this).css('background-color', '#47B182');
    }).on('mouseleave', '#backToTop', function () {
        $(this).css('background-color', '#e2e2e2');
    });

    //ie6单独处理
    var IE6Hanle = function () {
        var e = $(this).scrollTop();
        $fixedObj.stop().animate({
            top: 400 + e
        }, 100)
    };
    if (PHT.isIe6) {
        $window.scroll(function () {
            PHT.throttle(IE6Hanle);
        })
    }

    //点击返回顶部
    $fixedObj.on('click', function () {
        //ie 只认html
        $('html,body').animate({
            'scrollTop': '0'
        }, 800);

        //e.preventDefault()

    });
}(jQuery, window, window.PHT);

//===显示隐藏动画处理==
!function ($) {
    var $mHeaderCate = $('#J_m-header-cate'),//菜单
        $mHeaderNav = $mHeaderCate.next('.m-header-nav-bd');//导航分类

    var switchCom = function (disable1, disable2, time, ele) {
        ele.stop(true, true).animate({opacity: disable1, height: disable2}, time);
    };


    $mHeaderCate.on('click', function () {

        if ($mHeaderNav.is(':visible')) {

            switchCom('hide', 'hide', 500, $mHeaderNav);
        } else {

            switchCom('show', 'show', 500, $mHeaderNav);

        }
    });

    $mHeaderNav.on('mouseover', function () {

        switchCom('show', 'show', 0, $mHeaderNav);
    }).on('mouseleave', function () {

        switchCom('hide', 'hide', 500, $mHeaderNav);
    });

}(jQuery);

//=== 图片懒加载 ===
$(function () {
    var $fLaze = $(".f-lazy");
    $fLaze.length > 0 && $fLaze.lazyload({
        threshold: 0,
        failure_limit: 20,
        effect: "fadeIn",
        load: function () {
            // 加载后去除加载图
            $(this).removeClass("f-lazy");
        }
    });
});

setTimeout(function () {
    $(window).trigger('scroll');
}, 300);


//index
$('.J_home-bd-list').on('mouseover', function () {
    var $lookMore = $(this).find('.look-more');
    $lookMore.addClass('animated flipInX');
    setTimeout(function () {
        $lookMore.removeClass('flipInX');
    }, 500);
});

$('#J_bottom-tips-close').on('click', function () {
    var self = $(this);
    self.parents('.bottom-tips').fadeOut();
    $('.footer').css({'padding-bottom': '0'})
})

// common_problem

//弹框
var $issuePopUp = $('#J_issue-pop-up'),
    $popUpTit = $issuePopUp.find('.pop-up-tit'),
    $popUpContP = $issuePopUp.find('.pop-up-cont').find('p');
$('.J_issue-pop-up').on('click', function () {
    $issuePopUp.fadeIn();
    var self = $(this);
    $popUpTit.html(self.text());
    $popUpContP.html(self.data('answer'));

});

$('.J_close').on('click', function () {
    $issuePopUp.hide();
    var self = $(this);
    $popUpTit.empty();
    $popUpContP.empty();
});