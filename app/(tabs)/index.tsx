import { useState, useRef, forwardRef, useContext, useEffect } from 'react'; // Added useContext, useEffect
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { WebView as RNWebView, WebViewNavigation, WebViewProps } from 'react-native-webview';
import { Search, X, RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { BrowserContext } from '../../context/BrowserContext'; // Import context

// Wrap RNWebView with forwardRef and explicit types
const WebView = forwardRef<RNWebView, WebViewProps>((props, ref) => <RNWebView {...props} ref={ref} />);

export default function BrowserScreen() {
  // url controls the TextInput, submittedUrl controls the WebView/iframe
  const [url, setUrl] = useState('https://example.com');
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null); // Start with no URL loaded
  const [isLoading, setIsLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const localWebViewRef = useRef<RNWebView | null>(null); // Local ref for internal use
  // Get setter and resetKey from context
  const { setWebViewRefInstance, resetKey } = useContext(BrowserContext);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleRefresh = () => {
    localWebViewRef.current?.reload(); // Use local ref
  };

  const goBack = () => {
    localWebViewRef.current?.goBack(); // Use local ref
  };

  const goForward = () => {
    localWebViewRef.current?.goForward(); // Use local ref
  };

  const clearUrl = () => {
    setUrl('');
  };

  const handleSubmit = () => {
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = `https://${url}`;
    }
    setUrl(finalUrl);
    setSubmittedUrl(finalUrl); // Set the URL to be loaded only on submit
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          onSubmitEditing={handleSubmit}
          placeholder="Search or enter URL"
          placeholderTextColor="#666"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {url.length > 0 && (
          <TouchableOpacity onPress={clearUrl} style={styles.clearButton}>
            <X size={20} color="#666" />
          </TouchableOpacity>
        )}
        {Platform.OS !== 'web' && (
          <>
            <TouchableOpacity onPress={goBack} disabled={!canGoBack} style={styles.navButton}>
              <ArrowLeft size={20} color={canGoBack ? '#fff' : '#444'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={goForward} disabled={!canGoForward} style={styles.navButton}>
              <ArrowRight size={20} color={canGoForward ? '#fff' : '#444'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
              <RefreshCw size={20} color="#666" />
            </TouchableOpacity>
          </>
        )}
      </View>
      {submittedUrl && ( // Only render WebView/iframe if a URL has been submitted
        Platform.OS === 'web' ? (
          <iframe
            src={submittedUrl}
            style={styles.iframe as any} // Use 'as any' for web-specific style type
            onLoad={handleLoad} // Basic load handling
            onError={() => setIsLoading(false)} // Basic error handling
          />
        ) : (
          <WebView
            key={resetKey} // Add key prop to force remount on change
            ref={(refInstance) => {
              // Assign to local ref for internal use
              localWebViewRef.current = refInstance;
              // Update the ref in the context provider
              setWebViewRefInstance(refInstance);
            }}
            source={{ uri: submittedUrl }}
            style={styles.webview}
            onLoad={handleLoad}
            onLoadStart={handleLoadStart}
            incognito={true}
            thirdPartyCookiesEnabled={false}
            sharedCookiesEnabled={false}
            cacheEnabled={false}
            domStorageEnabled={false}
            javaScriptEnabled={true}
            mediaPlaybackRequiresUserAction={true}
            onNavigationStateChange={(navState: WebViewNavigation) => {
              setUrl(navState.url);
              setCanGoBack(navState.canGoBack);
              setCanGoForward(navState.canGoForward);
            }}
          />
        )
      )}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    margin: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#fff',
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  refreshButton: {
    padding: 5,
    marginLeft: 5,
  },
  navButton: {
    padding: 5,
    marginLeft: 5,
  },
  webview: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  iframe: { // Style for iframe on web
    flex: 1,
    borderWidth: 0, // Remove default iframe border
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
});
