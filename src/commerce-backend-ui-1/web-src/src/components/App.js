import React from 'react';
import { Provider, lightTheme } from '@adobe/react-spectrum';
import { ErrorBoundary } from 'react-error-boundary';
import { HashRouter, Route, Routes } from 'react-router-dom';

import ExtensionRegistration from './ExtensionRegistration';

function App(props) {
  props.runtime.on('configuration', ({ imsOrg, imsToken }) => {
    console.log('configuration change', { imsOrg, imsToken });
  });

  props.runtime.on('history', ({ type, path }) => {
    console.log('history change', { type, path });
  });

  return (
    <ErrorBoundary onError={onError} FallbackComponent={FallbackComponent}>
      <HashRouter>
        <Provider theme={lightTheme} colorScheme="light">
          <Routes>
            <Route
              index
              element={<ExtensionRegistration runtime={props.runtime} ims={props.ims} />}
            />
          </Routes>
        </Provider>
      </HashRouter>
    </ErrorBoundary>
  );
}

function onError(error, componentStack) {
  console.error(error, componentStack);
}

function FallbackComponent({ componentStack, error }) {
  return (
    <React.Fragment>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Something went wrong :(</h1>
      <pre>{componentStack + '\n' + error.message}</pre>
    </React.Fragment>
  );
}

export default App;