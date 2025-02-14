import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { View, Text } from 'react-native';

import { images } from '../constants';

export default function Index() {
	return (
		<View className="flex-1 items-center justify-center bg-white">
			<Text className="text-3xl font-pblack">Aora!</Text>
			<StatusBar style="auto" />
			<Link
				href="/(tabs)/home"
				style={{ color: 'blue' }}
			>
				Go to Home
			</Link>
		</View>
	);
}
