import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import { TooltipProvider } from './src/components/ui/Tooltip';
import { LocaleProvider } from './src/i18n/LocaleContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <TooltipProvider delayDuration={200}>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </TooltipProvider>
  </React.StrictMode>
);
