import TweenMax from 'gsap';

export default class Main {
    constructor() {
        this.init();
    }

    init() {
        this.getElements();
        this.setElements();
        this.playAnimations();
    }

    getElements() {
        this.$main = document.querySelector('.main');
        this.$headTitle = document.querySelector('.hero__title');
        this.$headIntro = document.querySelector('.hero__intro');
        this.$explTitle = document.querySelector('.explained__title');
        this.$explNote = document.querySelector('.explained__note');
        this.$explFoot = document.querySelector('.explained__footer');
    }

    setElements() {
        const el = [this.$headTitle, this.$explTitle];
        const elNoX = [this.$explNote, this.$headIntro, this.$explFoot];

        TweenMax.set(el, {
            opacity: 0,
            x: -20
        });

        TweenMax.set(elNoX, {
            opacity: 0,
        })
    }

    playAnimations() {
        
        const timelineHeadTitle = new TimelineLite()
            .to(this.$headTitle, .33, {
                opacity: 1,
                ease: Power2.easeIn,
                delay: .25
            })
            .to(this.$headTitle, .33, {
                x: 0,
                ease: Power4.easeInOut
            }, '-=.33')

        const timelineHeadIntro = new TimelineLite()
            .to(this.$headIntro, .33, {
                opacity: 1,
                ease: Power2.easeIn,
                delay: .5
            })
            .to(this.$headIntro, .33, {
                x: 0,
                ease: Power4.easeInOut
            }, '-=.33')

        const timelineExplTitle = new TimelineLite()
            .to(this.$explTitle, .33, {
                opacity: 1,
                ease: Power2.easeIn,
                delay: .75
            })
            .to(this.$explTitle, .33, {
                x: 0,
                ease: Power4.easeInOut
            }, '-=.33')

        TweenMax.to(this.$explNote, .33, {
            opacity: 1,
            ease: Power2.easeIn,
            delay: 1
        });

        TweenMax.to(this.$explFoot, .33, {
            opacity: 1,
            ease: Power2.easeIn,
            delay: 1.25
        });
    }
}
