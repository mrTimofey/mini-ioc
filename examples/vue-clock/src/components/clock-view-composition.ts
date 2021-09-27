import { injectKey } from 'mini-ioc-vue';
import { computed, defineComponent, inject } from 'vue';
import ClockStore from '../store/clock';

export default defineComponent({
	setup() {
		const clock = inject(injectKey)?.get(ClockStore);
		const timeString = computed(() => clock && [
			clock.hours,
			clock.minutes,
			clock.seconds,
		].map(v => v.toString().padStart(2, '0')).join(':') || '');
		return { timeString };
	},
	template: '<div>Vue composition API component shows: {{ timeString }}</div>',
});
