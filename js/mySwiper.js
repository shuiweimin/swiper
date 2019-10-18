(function () {
    function Swiper(wrapper, imgs) {
        this.wrapper = wrapper;
        this.imgs = imgs;
        this.swiper = document.querySelector(wrapper);
        this.buildBox();
        this.lis = this.swiper.children;
        this.liW = this.lis[0].offsetWidth;
        this.arrL = this.swiper.nextElementSibling; //左箭头
        this.arrR = this.arrL.nextElementSibling; //右箭头
        this.dotS = this.arrR.nextElementSibling; //小点
        this.timer = null;
        this.count = 0; // 全局计数器
        // 开启入口函数
        this.init();
    }

    Swiper.prototype = {
        init: function () {
            // 1. 开启自动轮播
            this.autoPlay();
            //2. 绑定hover事件
            this.bindHoverEvent();
            //3.绑定点击事件
            this.bindArrEvent();
            //4.初始pagenation
            this.initDotts();
        },
        buildBox: function () {
            //轮播图
            var ulSwiper = `<ul class="swiper">{{str}}</ul>`
            //小点Ul
            var dotUl = `<ul class="dots">{{dotUl}}</ul>`
            //轮播Li
            var swiperLi = '';
            //小点LI
            var dotLi = '';
            this.imgs.forEach((ele, index) => {
                swiperLi += `
            <li class="li-item"><img src="imgs/m${index + 1}.jpg" alt=""></li>
            `
                dotLi += `
            <li class="dots-item ${index == 0 ? 'active' : ''}" value="${index + 1}"></li>
            `
            })
            ulSwiper = ulSwiper.replace('{{str}}', swiperLi)
            dotUl = dotUl.replace('{{dotUl}}', dotLi)
            // this.swiper.innerHTML = str
            //左右箭头
            var arrS = `<div class="arr arr-l"><a href="javascript:;"><</a></div>
                    <div class="arr arr-r"><a href="javascript:;">></a></div>`
            //小点
            this.swiper.parentNode.innerHTML = ulSwiper + arrS + dotUl;
            this.swiper = document.querySelector(this.wrapper)
        },
        autoPlay: function () {
            var that = this;
            this.timer = setInterval(function () {
                that.commonWay(1)
            }, 2000)
        },
        bindArrEvent: function () {
            var that = this
            that.arrL.onclick = function () {
                clearInterval(that.timer);
                that.commonWay(2);
                that.autoPlay()
            }
            that.arrR.onclick = function () {
                clearInterval(that.timer);
                that.commonWay(3);
                that.autoPlay()
            }
        },
        initDotts: function () {
            this.dotS = this.arrR.nextElementSibling//小点
            var that = this;
            this.dotS.onclick = function (e) {
                if (e.target.value) {
                    clearInterval(that.timer)
                    var num = e.target.value;
                    that.commonWay(4, num)
                    that.autoPlay();
                }
            }
        },
        bindHoverEvent: function () {
            var that = this;
            this.swiper.onmouseenter = function () {
                clearInterval(that.timer)
            }
            that.swiper.onmouseleave = function () {
                //重新开启
                that.autoPlay()
            }
        },
        commonWay: function (isRight, num) {
            var that = this;
            that.dotS.children[that.count].classList.remove('active');
            switch (isRight) {
                case 1:
                    that.count++;
                    if (that.count > 3) {
                        that.count = 0
                    }
                    if (that.count < 0) {
                        that.count = 3
                    }
                    break
                case 2:
                    that.count--;
                    if (that.count < 0) {
                        that.count = 3
                    }
                    break
                case 3:
                    that.count++
                    if (that.count > 3) {
                        that.count = 0
                    }
                    break
                case 4:
                    that.count = num - 1
            }
            that.dotS.children[that.count].classList.add('active')
            var target = -1 * that.liW * that.count;
            that.animate(that.swiper, target)
        },
        animate: function (el, target, fn) {
            clearInterval(el.timer);
            el.timer = setInterval(function () {
                var current = el.offsetLeft
                var step = (target - current) / 10;
                //修正
                if (Math.abs(step) < 1) {
                    step = step > 0 ? 1 : Math.floor(step)
                }
                //设值
                current += step
                el.style.left = current + 'px';
                if (current == target) {
                    clearInterval(el.timer)
                    if (fn) {
                        fn()
                    }
                }
            }, 17)
        }
    }
    // console.log(Swiper)
    window.Swiper = Swiper
})()