export default class Hotspot {
    constructor(options) {
        this.positionHotspot = this.positionHotspot.bind(this);
        this.$hotspot = document.querySelector(`.${ options.el }`);
        this.$image = document.querySelector(`.${ options.image }`);
        this.positions = options.positions;
        this.breakpoints = options.breakpoints;
        this.width = window.App.w;
        this.positionHotspot();
        this.listen();
    }

    listen() {
        window.App.emitter.on('resize', this.handleResize, this);
    }

    positionHotspot() {
        let posIndex = 0;
        if (this.breakpoints && this.width <= this.breakpoints[0]) {
            for (let i = 0; i < this.breakpoints.length; i ++) if (this.width <= this.breakpoints[i]) posIndex = i + 1;
        }
        this.$hotspot.style.left = `${ this.$image.offsetWidth * this.positions[posIndex].x }px`;
        this.$hotspot.style.top = `${ this.$image.offsetHeight * this.positions[posIndex].y }px`;
        TweenMax.to(this.$hotspot, 0.5, { autoAlpha: 1 });
    }

    handleResize(width) {
        this.width = width;
        TweenMax.set(this.$hotspot, { autoAlpha: 0 });
        TweenMax.killDelayedCallsTo(this.positionHotspot);
        TweenMax.delayedCall(.5, this.positionHotspot);
    }
}
