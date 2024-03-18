import { createRoot } from 'react-dom/client';
import Page from './components/Page.jsx';
global.browser = require('webextension-polyfill'); // Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';
// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<Page />);
