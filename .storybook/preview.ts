import '../src/app.css';
import type { Preview } from '@storybook/sveltekit';
import 'katex/dist/katex.min.css';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		}
	}
};

export default preview;
