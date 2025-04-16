import { Tabs } from 'expo-router';
import { User as Browser, Settings, Shield } from 'lucide-react-native';
import { BrowserProvider } from '../../context/BrowserContext'; // Import the provider

export default function TabLayout() {
  return (
    <BrowserProvider> {/* Wrap Tabs with the provider */}
      <Tabs screenOptions={{
        headerShown: false,
        tabBarStyle: {
        backgroundColor: '#1a1a1a',
      },
      tabBarActiveTintColor: '#6366f1',
      tabBarInactiveTintColor: '#666',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Browser',
          tabBarIcon: ({ size, color }) => (
            <Browser size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="security"
        options={{
          title: 'Security',
          tabBarIcon: ({ size, color }) => (
            <Shield size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
      </Tabs>
    </BrowserProvider>
  );
}
