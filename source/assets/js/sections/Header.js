import toArray from '../utils/toArray';
import bindAll from '../utils/bindAll';

export default class Header {
    constructor() {
        bindAll(this, ['showVideo', 'hideVideo', 'onVideoAnimRevComplete']);
        this.init();
    }

    init() {
        this.getElements();
        this.setVideoSrc();
        this.setListeners();
        this.setHintAnimation();
    }

    getElements() {
        this.$el = document.querySelector('.header');
        this.$logo = this.$el.querySelector('.header__logo');
        this.$productName = this.$el.querySelector('.header__product');
        this.$tagline = this.$el.querySelectorAll('.header__tagline');
        this.$hint = this.$el.querySelector('.header__scroll-hint');
        this.$hintPaths = toArray(this.$hint.querySelectorAll('.header__scroll-hint-path')).reverse();
        this.$video = this.$el.querySelector('.header__video');
        this.$videoTrigger = this.$el.querySelector('.header__video-trigger');
        this.$videoCloseBtn = this.$el.querySelector('.header__video-close-btn');
    }

    setVideoSrc() {
        this.$video.src = this.$video.dataset.src;
    }

    setListeners() {
        this.$videoTrigger.addEventListener('click', this.showVideo);
        this.$videoCloseBtn.addEventListener('click', this.hideVideo);
        this.$video.addEventListener('ended', this.hideVideo);
        this.$video.addEventListener('webkitendfullscreen', this.hideVideo);
        this.$video.addEventListener('webkitfullscreenchange', this.onFullScreenChange);
    }

    onFullScreenChange() {
        !document.webkitIsFullScreen && this.hideVideo();
    }

    setHintAnimation() {
        const hintTl = new TimelineMax({ repeat: -1 });
        hintTl.set(this.$hintPaths, { y: -25, opacity: 0 });
        hintTl.to(this.$hintPaths[0], 0.5, { y: 0, opacity: 1 });
        hintTl.to(this.$hintPaths[1], 0.5, { y: 0, opacity: 0.75, }, '-=0.3');
        hintTl.to(this.$hintPaths[2], 0.5, {y: 0, opacity: 0.5 }, '-=0.4');
        hintTl.staggerTo(this.$hintPaths, 0.4, { opacity: 0 }, 0.12, '-=0.2');
    }

    showVideo() {
        if (window.innerWidth <= 640 && document.webkitFullscreenEnabled) this.$video.webkitRequestFullscreen();
        this.animateVideoIn();
    }

    animateVideoIn() {
        this.$video.play();
        this.videoTl = new TimelineLite({ onReverseComplete: this.onVideoAnimRevComplete });
        this.videoTl.fromTo(this.$video, 0.5, { volume: 0 }, { volume: 1 });
        this.videoTl.fromTo(this.$videoCloseBtn, 0.5, { autoAlpha: 0 }, { autoAlpha: 1, ease: Power2.easeInOut });
        this.videoTl.fromTo([ this.$logo, this.$videoTrigger, this.$productName, this.$tagline, this.$hint ],
            0.5, { autoAlpha: 1}, { autoAlpha: 0, ease: Power2.easeInOut },'-=1');
        this.videoTl.fromTo(this.$video, 0.5, { autoAlpha: 0 }, { autoAlpha: 1, ease: Power2.easeInOut }, '-=1');
    }

    hideVideo() {
        this.videoTl && this.videoTl.reverse();
    }

    onVideoAnimRevComplete() {
        this.$video.pause();
        this.$video.currentTime = 0;
    }
}
