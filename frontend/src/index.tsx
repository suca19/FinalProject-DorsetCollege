import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AnimatePresence, LayoutGroup } from 'framer-motion';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <LayoutGroup>
    <AnimatePresence mode="wait">
      <App />
    </AnimatePresence>
  </LayoutGroup>
);

// Add this to the top of your main file (index.tsx or App.tsx)
const resizeObserverErrorHandler = () => {
  const resizeObserverError = "ResizeObserver loop completed with undelivered notifications";
  
  window.addEventListener("error", (event) => {
    if (event.message === resizeObserverError) {
      event.stopImmediatePropagation();
    }
  });
};

resizeObserverErrorHandler();