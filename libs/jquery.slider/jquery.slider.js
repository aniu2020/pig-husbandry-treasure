/**
 * author    aniu
 * email     106535323@qq.com
 */
;
!function ($) {
    $.fn.slider = function (config) {
        this.each(function () {
            config = $.extend(
                {
                    //effect: 'scrolly',//效果  有scrollx|scrolly|fade|none
                    auto: true,//自动播放
                    contentBox: ".slider",//内容容器id或class
                    contentTag: "li",//内容标签 默认为<li>
                    switcherBox: ".nav",//切换触发器id或class
                    switcherTag: "i",//切换触发器的子项
                    activeClass: "cur", //当前切换器样式名称 不含"."
                    autoPlaySpeed: 2500,//自动播放或者切换速度
                    prv:'.prv',
                    next:'.next',
                    picSwitchSpeed:600//图片切换速度

                }, config
            );

            var self = $(this),
                $slider = self.find(config.contentBox),//图片盒子
                $sliderLen = self.find(config.contentBox).find(config.contentTag).length,//图片盒子
                $nav = self.find(config.switcherBox),//切换按钮
                $sliderLi = $slider.find(config.contentTag),//焦点图图片
                timer = null,
                arrI =['<'+config.switcherTag+' class="'+config.activeClass+'"></'+config.switcherTag+'>'];

            if($sliderLen>1){
                for(var a=0;a<$sliderLen-1;a++){
                    var nvaI ='<'+config.switcherTag+'></'+config.switcherTag+'>';
                    arrI.push(nvaI);
                }
            }
            $nav.html(arrI.join(''));
            var indexSlider = {
                current: 0,//跟idx配合使用的
                animating: false,//动画锁
                init: function () {
                    self.find(config.contentBox).find(config.contentTag).eq(0).addClass(config.activeClass);
                    if($sliderLen==1){
                        config.auto=false;
                    }
                    indexSlider.sliderAutoSwitch(config.autoPlaySpeed, config.auto);//默认自动播放

                },
                slideTo: function (idx) {
                    var countLen = $sliderLi.length;//焦点图图片数量  6
                    if (indexSlider.animating || idx == indexSlider.current) {//当焦点正处于动画(还没有切换完)或者点击同一个切换的时候 不切换
                        return;
                    }
                    if (idx < 0) {//倒着滚第一张的的时候调到最后一张去 0-1=-1<0
                        idx = countLen - 1;
                    } else if (idx >= countLen) {//滚到最后一张的时候跳到第一张去
                        idx = 0;
                    }
                    var up = (idx > indexSlider.current) || (idx == indexSlider.current - countLen + 1),
                    //idx == indexSlider.current - countLen + 1 最后一张切到第一张的时候用到
                        $current = $sliderLi.eq(idx),//图片盒子元素第几项 当前项
                        $prev = $slider.find('.'+config.activeClass),//上一项
                        $navI = $nav.find('i'),
                        offset = $current.width();
                    indexSlider.animating = true;//先锁起来，给动画结束结束了再解开，（动画结束indexSlider.animating = false）


                //    $current.hide().css({left: up ? offset : -offset}).animate({
                //        left: 0,
                //        opacity: 'show'
                //    }, config.picSwitchSpeed, function () {
                //        $(this).addClass(config.activeClass);
                //        $navI.removeClass(config.activeClass).eq(idx).addClass(config.activeClass);
                //        indexSlider.animating = false;
                //
                //    });
                //    $prev.animate({left: up ? -offset : offset, opacity: 'hide'}, config.picSwitchSpeed, function () {
                //        $(this).removeClass(config.activeClass).hide();
                //    });
                //    indexSlider.current = idx;
                //},

                    $current.show().css({left: up ? offset : -offset}).animate({
                        left: 0
                    }, config.picSwitchSpeed, function () {
                        $(this).addClass(config.activeClass);
                        $navI.removeClass(config.activeClass).eq(idx).addClass(config.activeClass);
                        indexSlider.animating = false;

                    });
                    $prev.animate({left: up ? -offset : offset}, config.picSwitchSpeed, function () {
                        $(this).removeClass(config.activeClass).hide();
                    });

                    indexSlider.current = idx;
                },


                slidePrev: function () {
                    //if (current == 0) return;//放开可防止逆向滚动
                    indexSlider.slideTo(indexSlider.current - 1);
                },
                slideNext: function () {
                    indexSlider.slideTo(indexSlider.current + 1);
                },
                /**
                 * 设置自动播放
                 * @param time 自动播放的速度
                 * @param autoPlay 是否设置为自动播放
                 */
                sliderAutoSwitch: function (time, autoPlay) {
                    timer = autoPlay ? setInterval(function () {
                        indexSlider.slideNext()
                    }, time) : null;
                }
            };

            //初始化
            indexSlider.init();

            //===事件绑定===
            if (!navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {//如果是非移动端执行hover操作 如果不做处理会和下面的一系列手机事件冲突
                var $prv = self.find(config.prv),
                    $next = self.find(config.next);
                var arr =[$prv,$next,$sliderLi],
                    arrLen =arr.length;
                for(var i=0;i<arrLen;i++){//经过焦点图、上下切换按钮的时候关掉自动切换
                    arr[i].hover(function () {
                        if (timer) {
                            clearInterval(timer);
                        }
                    }, function () {
                        indexSlider.sliderAutoSwitch(config.autoPlaySpeed, config.auto);
                    });
                }

                //移入最外面的盒子上下按钮显示出来
                self.hover(
                    function () {
                        self.addClass('toggle-button-animation');
                    }, function () {
                        self.removeClass('toggle-button-animation');
                    }
                );

                $prv.on('click', function () {
                    indexSlider.slidePrev();
                });
                $next.on('click', function () {
                    indexSlider.slideNext();
                });

            }

            //滚轮事件只有firefox比较特殊，使用DOMMouseScroll; 其他浏览器使用mousewheel;
            //$(document).on('mousewheel DOMMouseScroll', function (e) {
            //    //原生的滚轮事件
            //    if (e.originalEvent.wheelDelta > 0) {//鼠标向上滚
            //        indexSlider.slidePrev();
            //    } else {
            //        indexSlider.slideNext();
            //
            //    }
            //});

            //切换导航
            $nav.find('i').hover(function () {
                if (timer) {
                    clearInterval(timer);
                }
                indexSlider.slideTo($(this).index())
            }, function () {
                indexSlider.sliderAutoSwitch(config.autoPlaySpeed, config.auto);
            });

            //===手机手势滑动===
            //var begin_x = 0, end_x = 0;
            //$("document,body").on("touchstart", function (event) {//touchstart 手指放在一个DOM元素上。
            //    var touch = event.originalEvent.targetTouches[0];
            //    begin_x = Number(touch.pageX);//页面触点X坐标
            //    //if (timer) {
            //    //    clearInterval(timer);
            //    //}
            //}).on("touchmove", function (event) { //touchmove手指拖曳一个DOM元素
            //    //if (timer) {
            //    //    clearInterval(timer);
            //    //}
            //
            //}).on("touchend", function (event) {//touchend 手指从一个DOM元素上移开 当手指在屏幕上滑动的时候连续地触发
            //
            //    var touch = event.originalEvent.changedTouches[0];//originalEvent.targetTouches[0]连起来就是取屏幕上第一个手指的坐标的意思
            //    end_x = Number(touch.pageX);
            //    if (begin_x - end_x < -100) {
            //        indexSlider.slidePrev();
            //    } else if (begin_x - end_x > 100) {
            //        indexSlider.slideNext();
            //    }
            //    //indexSlider.sliderAutoSwitch(config.autoPlaySpeed, config.auto);
            //
            //});

            var begin_x=0,end_x=0;
            self.on("touchstart",function(event){//touchstart 手指放在一个DOM元素上。
                var touch = event.originalEvent.targetTouches[0];
                begin_x = Number(touch.pageX);
                    if (timer) {
                        clearInterval(timer);
                    }
                return false;//阻止浏览器默认行为
            }).on("touchmove",function(event){ //touchmove手指拖曳一个DOM元素

                if (timer) {
                    clearInterval(timer);
                }
            }).on("touchend",function(event){//touchend 手指从一个DOM元素上移开
                var touch =  event.originalEvent.changedTouches[0];
                end_x = Number(touch.pageX);
                if(begin_x - end_x<-20){
                    indexSlider.slidePrev();
                }else if(begin_x - end_x>20){
                    indexSlider.slideNext();
                }
                indexSlider.sliderAutoSwitch(config.autoPlaySpeed, config.auto);
                return false;
            });


        });
    };
}(jQuery);
