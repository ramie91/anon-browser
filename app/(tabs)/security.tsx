import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';

export default function SecurityScreen() {
  const [settings, setSettings] = useState({
    blockTrackers: true,
    blockAds: true,
    clearOnExit: true,
    blockScripts: false,
    blockPopups: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacy Settings</Text>
        <Text style={styles.subtitle}>Configure your browsing security</Text>
      </View>

      <View style={styles.section}>
        {Object.entries(settings).map(([key, value]) => (
          <View key={key} style={styles.setting}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Text>
              <Text style={styles.settingDescription}>
                {getSettingDescription(key)}
              </Text>
            </View>
            <Switch
              value={value}
              onValueChange={() => toggleSetting(key as keyof typeof settings)}
              trackColor={{ false: '#3a3a3a', true: '#4f46e5' }}
              thumbColor={value ? '#6366f1' : '#f4f3f4'}
            />
          </View>
        ))}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Your Privacy Matters</Text>
        <Text style={styles.infoText}>
          This browser is designed to protect your privacy by default. We never store your browsing history, cookies, or personal data.
        </Text>
      </View>
    </ScrollView>
  );
}

function getSettingDescription(key: string): string {
  const descriptions: Record<string, string> = {
    blockTrackers: 'Prevent websites from tracking your activity',
    blockAds: 'Block advertisements and tracking pixels',
    clearOnExit: 'Clear all browsing data when closing the app',
    blockScripts: 'Block potentially harmful JavaScript (may break some sites)',
    blockPopups: 'Prevent popup windows from opening',
  };
  return descriptions[key] || '';
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
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#999',
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#2a2a2a',
    margin: 20,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
});