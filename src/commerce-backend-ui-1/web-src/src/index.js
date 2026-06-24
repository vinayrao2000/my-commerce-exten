import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { createRoot } from 'react-dom/client';

import Runtime, { init } from '@adobe/exc-app';

import App from './components/App';

import './index.css';

window.React = require('react');

try {
  require('./exc-runtime');
  init(bootstrapInExcShell);
} catch (error) {
  console.log('application not running in Adobe Experience Cloud Shell');
  bootstrapRaw();
}

function renderApp(runtime, ims) {
  const root = createRoot(document.getElementById('root'));

  root.render(window.React.createElement(App, { runtime, ims }));
}

function bootstrapRaw() {
  const mockRuntime = {
    on: () => {},
    done: () => {},
  };

  renderApp(mockRuntime, {});
}

function bootstrapInExcShell() {
  const runtime = Runtime();

  runtime.on('ready', ({ imsOrg, imsToken, imsProfile }) => {
    runtime.done();

    const ims = {
      profile: imsProfile,
      org: imsOrg,
      token: imsToken,
    };

    renderApp(runtime, ims);
  });

  runtime.solution = {
    icon: 'AdobeExperienceCloud',
    title: 'Order Enrichment',
    shortTitle: 'Orders',
  };
  runtime.title = 'Enriched Orders Dashboard';
}