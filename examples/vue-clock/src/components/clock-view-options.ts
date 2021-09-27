import { computedResolver, injectContainer } from 'mini-ioc-vue';
import { defineComponent } from 'vue';
import ClockStore from '../store/clock';

export default defineComponent({
	inject: injectContainer(),
	computed: {
		clock: computedResolver(ClockStore),
		timeString() {
			if (!this.clock) return '';
			return [
				// typing works in VSCode, but this.clock is marked as error "property 'clock' doesn't exist"
				// @ts-ignore
				this.clock.hours,
				// @ts-ignore
				this.clock.minutes,
				// @ts-ignore
				this.clock.seconds,
			].map(v => v.toString().padStart(2, '0')).join(':');
		},
	},
	template: '<div>Vue options API component shows: {{ timeString }}</div>',
});
