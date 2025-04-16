import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useContext } from 'react'; // Import useContext
import { BrowserContext } from '../../context/BrowserContext'; // Import context
import { WebView as RNWebView } from 'react-native-webview'; // Import RNWebView for type assertion
import { Trash2, Shield, Moon, Globe, Search } from 'lucide-react-native';

export default function SettingsScreen() {
  // Get the reset function from context instead of the ref
  const { requestWebViewReset } = useContext(BrowserContext);

  const clearData = () => {
    console.log('Clear Data button pressed');
    if (Platform.OS !== 'web') {
      // Trigger the reset via context
      requestWebViewReset();
      Alert.alert(
        "Browser Reset",
        "Browser state will be reset to initial launch state.",
        [{ text: "OK" }]
      );
    } else {
      // Use window.alert for web compatibility
      window.alert(
        "On the web platform, browsing data (cache, cookies) is managed by your main browser settings, not by this app. Reloading the page might offer a partial reset."
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your browsing experience</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        
        <TouchableOpacity style={styles.option}>
          <Search size={24} color="#6366f1" />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Search Engine</Text>
            <Text style={styles.optionDescription}>DuckDuckGo</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Globe size={24} color="#6366f1" />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Default Language</Text>
            <Text style={styles.optionDescription}>English</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Moon size={24} color="#6366f1" />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Theme</Text>
            <Text style={styles.optionDescription}>Dark</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        
        <TouchableOpacity style={styles.option}>
          <Shield size={24} color="#6366f1" />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Privacy Settings</Text>
            <Text style={styles.optionDescription}>Configure tracking protection</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.option, styles.dangerOption]} onPress={clearData}>
          <Trash2 size={24} color="#ef4444" />
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, styles.dangerText]}>Clear Browsing Data</Text>
            <Text style={styles.optionDescription}>Remove all temporary files</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>About Anonymous Browser</Text>
        <Text style={styles.infoText}>
          Version 1.0.0{'\n'}
          A secure and private browsing experience
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#2a2a2a',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  optionText: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#999',
  },
  dangerOption: {
    marginTop: 20,
  },
  dangerText: {
    color: '#ef4444',
  },
  infoBox: {
    margin: 20,
    padding: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
});
