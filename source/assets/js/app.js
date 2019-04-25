// Style
import '../stylus/main.styl';

// Libs
// import 'intersection-observer';
import TweenMax from 'gsap';
import TinyEmitter from 'tiny-emitter';

// Local
import Main from './sections/Main';

class App {
    constructor() {
        this.handleResize = this.handleResize.bind(this);
        // this.onIntersect = this.onIntersect.bind(this);
        this.emitter = new TinyEmitter();
        this.main = new Main();
    }

    init(options) {
        this.w = window.innerWidth;
        this.language = options.lang;

        window.addEventListener('resize', this.handleResize);

        // this.initObserver();
    }

    // initObserver() {
    //     this.observer = new IntersectionObserver(this.onIntersect, { threshold: 0.3 });
    //
    //     const sections = document.querySelectorAll('.section');
    //
    //     for (let i = 0; i < sections.length; i++) this.observer.observe(sections[i]);
    // }
    //
    // onIntersect(entries) {
    //     for (let i = 0; i < entries.length; i++) {
    //         if (entries[i].isIntersecting) {
    //             entries[i].target.classList.add('has-entered');
    //             this.observer.unobserve(entries[i].target);
    //         }
    //     }
    // }

    handleResize() {
        if (this.w !== window.innerWidth) {
            this.emitter.emit('resize', window.innerWidth);
            this.w = window.innerWidth;
        }
    }
}

window.App = new App();
