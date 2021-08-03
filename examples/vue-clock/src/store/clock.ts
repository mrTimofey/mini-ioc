import { reactive } from 'vue';

interface IState {
	hours: number;
	minutes: number;
	seconds: number;
}

export default class {
	private currentDate!: Date;
	private state!: IState;
	private ticking = false;
	private tickTimeout!: number;

	constructor() {
		this.setCurrentTime();
	}

	setCurrentTime() {
		this.currentDate = new Date();
		const obj: IState = {
			hours: this.currentDate.getHours(),
			minutes: this.currentDate.getMinutes(),
			seconds: this.currentDate.getSeconds(),
		};
		if (!this.state) this.state = reactive(obj);
		else Object.assign(this.state, obj);
	}

	start() {
		this.ticking = true;
		clearTimeout(this.tickTimeout);
		this.tickTimeout = window.setTimeout(() => {
			if (!this.ticking) return;
			this.setCurrentTime();
			this.start();
		}, 1000);
	}

	stop() {
		this.ticking = false;
		clearTimeout(this.tickTimeout);
	}

	get hours() {
		return this.state.hours;
	}

	get minutes() {
		return this.state.minutes;
	}

	get seconds() {
		return this.state.seconds;
	}
}
