import { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import '../global.css';
import GlobalProvider from '@/context/GlobalProvider';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

SplashScreen.preventAutoHideAsync();

const configureFirebase = () => {
	GoogleSignin.configure({
		webClientId:
			'615201126390-kdft6vdp0sresikbenndbs961d7tlqq4.apps.googleusercontent.com',
	});
};

const RootLAyout = () => {
	configureFirebase();

	const [fontsLoaded, error] = useFonts({
		'Poppins-Black': require('@/presentation/assets/fonts/Poppins-Black.ttf'),
		'Poppins-Bold': require('@/presentation/assets/fonts/Poppins-Bold.ttf'),
		'Poppins-ExtraBold': require('@/presentation/assets/fonts/Poppins-ExtraBold.ttf'),
		'Poppins-ExtraLight': require('@/presentation/assets/fonts/Poppins-ExtraLight.ttf'),
		'Poppins-Light': require('@/presentation/assets/fonts/Poppins-Light.ttf'),
		'Poppins-Medium': require('@/presentation/assets/fonts/Poppins-Medium.ttf'),
		'Poppins-Regular': require('@/presentation/assets/fonts/Poppins-Regular.ttf'),
		'Poppins-SemiBold': require('@/presentation/assets/fonts/Poppins-SemiBold.ttf'),
		'Poppins-Thin': require('@/presentation/assets/fonts/Poppins-Thin.ttf'),
	});

	useEffect(() => {
		if (error) throw error;
		if (fontsLoaded) SplashScreen.hideAsync();
	}, [fontsLoaded, error]);

	if (!fontsLoaded) {
		return null;
	}

	if (!fontsLoaded && !error) return null;

	return (
		<GlobalProvider>
			<Stack>
				<Stack.Screen
					name="(tabs)"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="(auth)"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="index"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="search/[query]"
					options={{
						headerShown: true,
						headerTitle: 'Search Results',
						headerTintColor: '#FFFFFF',
						headerStyle: {
							backgroundColor: '#161622',
						},
						headerBackButtonDisplayMode: 'minimal',
					}}
				/>
			</Stack>
		</GlobalProvider>
	);
};

export default RootLAyout;
