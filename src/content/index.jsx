import { createRoot } from 'react-dom/client';
import Content from './components/Content.jsx';

const browserExtensionRootElement = document.createElement('div');
browserExtensionRootElement.id = 'url-tracer-root';

document.body.insertAdjacentElement('beforeend', browserExtensionRootElement);

global.browser = require('webextension-polyfill');

const root = createRoot(browserExtensionRootElement);
root.render(<Content />);
