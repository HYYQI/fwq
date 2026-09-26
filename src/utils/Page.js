export class Page {
    constructor(container, data = {}, config = {}) {
        this.container = container;
        this.data = data;
        this.config = config;
        this.isActive = this.config.active;
    }
    mount() {
        this.container.innerHTML = this.render();
        if (this.isActive) {
            !this.container.classList.contains("show") ? this.activate() : this.setupEvent?.();
        } else if (!this.isActive) {
            this.container.classList.contains("show") ? this.deactivate() : this.delEvent?.();
        }
        this.hook?.();
    }
    umount() {
        this.container.innerHTML = "";
        this.isActive = false;
    }
    activate() {
        if (!this.isActive) {
            this.container.classList.add("show");
            this.isActive = true;
            this.setupEvent?.();
        }
    }
    deactivate() {
        if (this.isActive) {
            this.container.classList.remove("show");
            this.isActive = false;
            this.delEvent?.();
        }
    }
    render() {
        return "";
    }
}