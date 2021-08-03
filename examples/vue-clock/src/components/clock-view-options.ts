import { computedInjection, APP_IOC_CONTAINER_PROVIDE_KEY } from 'mini-ioc/dist/vue';
import { defineComponent } from 'vue';
import ClockStore from '../store/clock';

export default defineComponent({
	inject: [APP_IOC_CONTAINER_PROVIDE_KEY],
	computed: {
		clock: computedInjection(ClockStore).get,
		timeString() {
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
	template: '<div>{{ timeString }}</div>',
});
