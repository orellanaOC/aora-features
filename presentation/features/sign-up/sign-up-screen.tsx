import { useState } from 'react';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Dimensions, Alert, Image } from 'react-native';

import { images } from '@/constants';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { createUser } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

const SignUpScreen = () => {
	const { setUser, setIsLogged } = useGlobalContext();
	const [isSubmitting, setSubmitting] = useState(false);
	const [form, setForm] = useState({
		userName: '',
		email: '',
		password: '',
	});

	const submit = async () => {
		if (form.userName === '' || form.password === '' || form.email === '') {
			Alert.alert('Error', 'Please fill in all fields');
		}

		setSubmitting(true);

		try {
			const result = await createUser(form.email, form.password, form.userName);

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
						Sign Up to Aora
					</Text>

					<FormField
						title="Username"
						value={form.userName}
						handleChangeText={(e: string) => setForm({ ...form, userName: e })}
						otherStyles="mt-10"
					/>

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
						title="Sign Up"
						handlePress={submit}
						containerStyles="mt-7"
						isLoading={isSubmitting}
					/>

					<View className="flex justify-center pt-5 flex-row gap-2">
						<Text className="text-lg text-gray-100 font-regular">
							Have an account already?
						</Text>

						<Link
							href="/sign-in"
							className="text-lg font-semibold text-secondary"
						>
							Sign In
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default SignUpScreen;
