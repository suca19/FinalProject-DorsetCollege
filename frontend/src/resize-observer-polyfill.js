// src/resize-observer-polyfill.js
(function() {
    // Save the original ResizeObserver
    const OriginalResizeObserver = window.ResizeObserver;
  
    // Create a wrapper for ResizeObserver that catches and suppresses the error
    window.ResizeObserver = function(callback) {
      const observer = new OriginalResizeObserver((...args) => {
        // Try-catch to prevent the error from bubbling up
        try {
          callback(...args);
        } catch (e) {
          if (!e.message.includes('ResizeObserver loop')) {
            console.error(e);
          }
        }
      });
  
      return observer;
    };
  
    // Copy prototype methods
    window.ResizeObserver.prototype = OriginalResizeObserver.prototype;
  })();