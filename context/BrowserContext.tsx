import React, { createContext, useState, useRef, ReactNode, useCallback } from 'react';
import { WebView as RNWebView } from 'react-native-webview';

// Define the shape of the context data
interface BrowserContextProps {
  // Provide a stable ref object (still useful for other potential interactions)
  webViewRef: React.RefObject<RNWebView | null>;
  // Provide a function to update the ref's current value
  setWebViewRefInstance: (instance: RNWebView | null) => void;
  // Add a key that can be changed to force WebView remount/reset
  resetKey: number;
  // Add a function to trigger the reset
  requestWebViewReset: () => void;
}

// Create context with a default value
export const BrowserContext = createContext<BrowserContextProps>({
  webViewRef: React.createRef<RNWebView | null>(),
  setWebViewRefInstance: () => {
    console.warn('BrowserContext: setWebViewRefInstance called without a Provider.');
  },
  resetKey: 0,
  requestWebViewReset: () => {
    console.warn('BrowserContext: requestWebViewReset called without a Provider.');
  },
});

interface BrowserProviderProps {
  children: ReactNode;
}

// Provider component
export const BrowserProvider: React.FC<BrowserProviderProps> = ({ children }) => {
  const internalWebViewRef = useRef<RNWebView | null>(null);
  const [resetKey, setResetKey] = useState(0); // State for the reset key

  const setWebViewRefInstance = useCallback((instance: RNWebView | null) => {
    internalWebViewRef.current = instance;
  }, []);

  // Function to increment the key, triggering a remount
  const requestWebViewReset = useCallback(() => {
    console.log('Requesting WebView reset...');
    setResetKey(prevKey => prevKey + 1);
  }, []);

  const value = {
    webViewRef: internalWebViewRef,
    setWebViewRefInstance,
    resetKey,
    requestWebViewReset,
  };

  return (
    <BrowserContext.Provider value={value}>
      {children}
    </BrowserContext.Provider>
  );
};
