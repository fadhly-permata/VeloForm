import { ComponentProps } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../theme';
import StudioScreen from '../screens/StudioScreen';
import WorkflowScreen from '../screens/WorkflowScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type RootTabParamList = {
  Studio: undefined;
  Workflow: undefined;
  Reports: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TABS: { name: keyof RootTabParamList; label: string; icon: IconName; iconActive: IconName }[] = [
  { name: 'Studio', label: 'Studio', icon: 'flash-outline', iconActive: 'flash' },
  { name: 'Workflow', label: 'Workflow', icon: 'git-network-outline', iconActive: 'git-network' },
  {
    name: 'Reports',
    label: 'Reports',
    icon: 'document-text-outline',
    iconActive: 'document-text',
  },
  { name: 'Settings', label: 'Settings', icon: 'settings-outline', iconActive: 'settings' },
];

export default function RootTabs() {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={screenFor(tab.name)}
          options={{
            title: tab.label,
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons name={focused ? tab.iconActive : tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

function screenFor(name: keyof RootTabParamList) {
  switch (name) {
    case 'Studio':
      return StudioScreen;
    case 'Workflow':
      return WorkflowScreen;
    case 'Reports':
      return ReportsScreen;
    default:
      return SettingsScreen;
  }
}
