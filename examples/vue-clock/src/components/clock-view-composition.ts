import { injectKey } from 'mini-ioc-vue';
import { defineComponent, inject, computed } from 'vue';
import ClockStore from '../store/clock';

export default defineComponent({
	setup() {
		const clock = inject(injectKey)?.get(ClockStore);
		return {
			timeString: computed(() => clock && [
				clock.hours,
				clock.minutes,
				clock.seconds,
			].map(v => v.toString().padStart(2, '0')).join(':') || ''),
		};
	},
	template: '<div>Vue composition API component shows: {{ timeString }}</div>',
});
