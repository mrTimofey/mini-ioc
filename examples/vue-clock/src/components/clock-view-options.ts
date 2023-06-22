import { computedResolver, injectMixin } from 'mini-ioc-vue';
import { defineComponent } from 'vue';
import ClockStore from '../store/clock';

export default defineComponent({
	mixins: [injectMixin],
	computed: {
		clock: computedResolver(ClockStore),
		timeString() {
			if (!this.clock) return '';
			return [
				this.clock.hours,
				this.clock.minutes,
				this.clock.seconds,
			].map(v => v.toString().padStart(2, '0')).join(':');
		},
	},
	template: '<div>Vue options API component shows: {{ timeString }}</div>',
});
