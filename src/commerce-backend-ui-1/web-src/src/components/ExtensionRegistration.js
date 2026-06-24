import { register } from '@adobe/uix-guest';
import { useEffect } from 'react';

import { extensionId } from './Constants';
import { MainPage } from './MainPage';

export default function ExtensionRegistration(props) {
  useEffect(() => {
    (async () => {
      await register({ id: extensionId, methods: {} });
    })();
  }, []);

  return <MainPage ims={props.ims} runtime={props.runtime} />;
}