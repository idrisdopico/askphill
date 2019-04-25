import toArray from '../utils/toArray';
import selectorAll from '../utils/selectorAll';

export default class Slider {
    constructor() {
        this.currentSlide = 1;
        this.init();
    }

    init() {
        this.getElements();
        this.getSlidesAmount();
        this.setListeners();
    }

    getElements() {
        this.$slider = document.getElementById('slider');
        this.$sliderList = this.$slider.querySelector('.slider__list');
        this.$sliderButtons = toArray(this.$slider.querySelectorAll('.slider-navigation'));
        this.$slides = selectorAll('.slider__slide', this.$slider);
        this.$sliderButtons = selectorAll('.slider-navigation', this.$slider);
        this.$slideNo = this.$slider.querySelector('.slider__pagi__current');
        this.$mobPagiDots = toArray(this.$slider.querySelector('.slider__mob__pagi').querySelectorAll('span'));
    }

    getSlidesAmount() {
        this.minSlides = 1;
        this.maxSlides = this.$slides.length;
    }

    setListeners() {
        this.$sliderButtons.forEach($button => {
            $button.addEventListener('click', e => {
                e.stopPropagation();
                this.slide(e.currentTarget.dataset.direction);
            });
        });

        this.$mobPagiDots.forEach($dot => $dot.addEventListener('click', e => this.slideTo(e.currentTarget.dataset.number * 1)));
        this.$slider.addEventListener('touchstart', e => this.touchStart(e));
        this.$slider.addEventListener('touchmove', e => this.touchMove(e));
        this.$slider.addEventListener('touchend', e => this.touchEnd(e));
        this.$slider.addEventListener('mouseout', () => false);
        window.App.emitter.on('resize', this.handleResize, this);
    }

    slide(direction, duration = .6) {
        const nextSlide = this.calculateNext(direction * 1);
        if (!nextSlide) return;
        this.animateSlider(nextSlide, duration);
    }

    touchStart(e) {
        if (this.isSliding) return;
        this.lastTouchX = e.changedTouches[0].pageX;
        this.lastTouchY = e.changedTouches[0].pageY;
        this.initialTouchX = e.changedTouches[0].pageX;
        this.initialTouchY = e.changedTouches[0].pageY;
    }

    touchMove(e) {
        if (this.isSliding) return;

        const deltaX = e.changedTouches[0].pageX - this.lastTouchX;
        const deltaY = e.changedTouches[0].pageY - this.lastTouchY;

        if (this.currentSlide === this.minSlides && deltaX > 0) return;
        if (this.currentSlide === this.maxSlides && deltaX < 0) return;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault();
            TweenMax.set(this.$sliderList, {
                x: `+=${ deltaX }`
            });
        }

        this.lastTouchX = e.changedTouches[0].pageX;
        this.lastTouchY = e.changedTouches[0].pageY;
    }

    touchEnd(e) {
        if (this.isSliding) return;

        const finalX = e.changedTouches[0].pageX;
        const x = finalX - this.initialTouchX;
        const finalY = e.changedTouches[0].pageY;
        const y = finalY - this.initialTouchY;
        const isHorizontal = Math.abs(x) > Math.abs(y);
        const overThreshold = Math.abs(x) / this.$slider.offsetWidth >= .3;

        (isHorizontal && overThreshold) ? this.slide(x, .25) : this.animateSlider(this.currentSlide);
    }

    slideTo(slide) {
        if (this.isSliding) return;
        this.animateSlider(slide, .6);
    }

    calculateNext(x) {
        let nextSlide = x < 0 ? this.currentSlide + 1 : this.currentSlide - 1;

        if (nextSlide === 0) nextSlide = 1;
        if (nextSlide === (this.maxSlides + 1)) return;

        return nextSlide;
    }

    animateSlider(nextSlide, timing = .25) {
        const x = `${ (-this.$slider.offsetWidth * nextSlide) + this.$slider.offsetWidth }px`;

        TweenMax.to(this.$sliderList, timing, {
            x,
            ease: Power2.easeInOut,
            onStart: () => this.isSliding = true,
            onComplete: () => {
                this.isSliding = false;
                this.currentSlide = nextSlide;
                this.updatePagi();
            }
        });
    }

    updatePagi() {
        this.$slideNo.textContent = this.currentSlide;
        this.$sliderButtons.forEach($button => $button.querySelector('svg').style.opacity = 1);

        if (this.currentSlide === this.minSlides) this.$sliderButtons[0].querySelector('svg').style.opacity = .5;
        if (this.currentSlide === this.maxSlides) this.$sliderButtons[1].querySelector('svg').style.opacity = .5;

        this.$mobPagiDots.forEach($dot => $dot.classList.remove('active'));
        this.$mobPagiDots[this.currentSlide - 1].classList.add('active');
    }

    handleResize() {
        TweenMax.set(this.$sliderList, {
            x: `-${ this.$slider.offsetWidth * (this.currentSlide - 1)}px`
        });
    }
}
