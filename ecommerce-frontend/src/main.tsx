import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { LoginComponent } from './components/LoginComponent.tsx';
import './index.css';
import { store } from './store/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <LoginComponent />

      {/* <App /> */}
    </Provider>
  </StrictMode>,
);
