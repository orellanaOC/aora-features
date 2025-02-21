import { StyleSheet, Text, View, Image } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { icons } from '@/presentation/constants';

export default function TabsLayout() {
	const TabIcon = ({
		icon,
		color,
		name,
		focused,
	}: {
		icon: any;
		color: string;
		name: string;
		focused: boolean;
	}) => {
		return (
			<View className="flex flex-col items-center justify-center w-full">
				<Image
					source={icon}
					resizeMode="contain"
					tintColor={color}
					className="w-6 h-6"
				/>

				<Text
					className={`text-xs ${
						focused ? 'font-semibold' : 'font-normal'
					} whitespace-nowrap`}
					numberOfLines={1}
					ellipsizeMode="tail"
					style={{ color: color }}
				>
					{name}
				</Text>
			</View>
		);
	};

	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				tabBarActiveTintColor: '#FFA001',
				tabBarInactiveTintColor: '#CDCDE0',
				tabBarStyle: {
					backgroundColor: '#161622',
					borderTopWidth: 1,
					paddingTop: 8,
					borderTopColor: '#232533',
					height: 84,
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: 'Home',
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={icons.home}
							color={color}
							name="Home"
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="bookmark"
				options={{
					title: 'Bookmark',
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={icons.bookmark}
							color={color}
							name="Bookmark"
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="create"
				options={{
					title: 'Create',
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={icons.plus}
							color={color}
							name="Create"
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={icons.profile}
							color={color}
							name="Profile"
							focused={focused}
						/>
					),
				}}
			/>
		</Tabs>
	);
}

const styles = StyleSheet.create({});
