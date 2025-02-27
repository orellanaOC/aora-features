import { useState } from 'react';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	View,
	Text,
	ScrollView,
	Dimensions,
	Alert,
	Image,
	StyleSheet,
} from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useGoogleSignIn } from './hooks/use-google-signin';
import { images } from '@/presentation/constants';
import CustomButton from '@/presentation/shared/components/CustomButton';
import FormField from '@/presentation/shared/components/FormField';
import { signIn, getCurrentUser } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

const SignInScreen = () => {
	const { googleSignIn } = useGoogleSignIn();
	const { setUser, setIsLogged } = useGlobalContext();
	const [isSubmitting, setSubmitting] = useState(false);
	const [form, setForm] = useState({
		email: '',
		password: '',
	});

	const submit = async () => {
		if (form.email === '' || form.password === '') {
			Alert.alert('Error', 'Please fill in all fields');
		}

		setSubmitting(true);

		try {
			await signIn(form.email, form.password);
			const result = await getCurrentUser();
			setUser(result);
			setIsLogged(true);

			router.replace('/home');
		} catch (error: any | unknown) {
			Alert.alert('Error', error.message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView>
				<View
					className="w-full flex justify-center h-full px-4 my-6"
					style={{
						minHeight: Dimensions.get('window').height - 100,
					}}
				>
					<Image
						source={images.logo}
						resizeMode="contain"
						className="w-[115px] h-[34px]"
					/>

					<Text className="text-2xl font-semibold text-white mt-10">
						Log in to Aora
					</Text>

					<FormField
						title="Email"
						value={form.email}
						handleChangeText={(e: string) => setForm({ ...form, email: e })}
						otherStyles="mt-7"
						keyboardType="email-address"
					/>

					<FormField
						title="Password"
						value={form.password}
						handleChangeText={(e: string) => setForm({ ...form, password: e })}
						otherStyles="mt-7"
					/>

					<CustomButton
						title="Sign In"
						handlePress={submit}
						containerStyles="mt-7"
						isLoading={isSubmitting}
					/>

					<GoogleSigninButton
						style={styles.googleButton}
						size={GoogleSigninButton.Size.Wide}
						color={GoogleSigninButton.Color.Dark}
						onPress={googleSignIn}
					/>

					<View className="flex justify-center pt-5 flex-row gap-2">
						<Text className="text-lg text-gray-100 font-regular">
							Don't have an account?
						</Text>

						<Link
							href="/sign-up"
							className="text-lg font-semibold text-secondary"
						>
							Sign Up
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default SignInScreen;

const styles = StyleSheet.create({
	googleButton: {
		width: '100%',
		marginTop: 16,
	},
});
