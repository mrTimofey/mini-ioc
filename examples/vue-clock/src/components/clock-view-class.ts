import { Options, Vue } from 'vue-class-component';
import { Inject } from 'mini-ioc-vue-class';
import ClockStore from '../store/clock';

@Options({
	name: 'ClockViewClass',
	template: '<div>Vue class component shows: {{ timeString }}</div>',
})
export default class ClockView extends Vue {
	@Inject clock?: ClockStore;

	get timeString() {
		if (!this.clock) return '';
		return [
			this.clock.hours,
			this.clock.minutes,
			this.clock.seconds,
		].map(v => v.toString().padStart(2, '0')).join(':');
	}
}
