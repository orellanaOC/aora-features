import { useRouter } from 'expo-router';
import {
	GoogleSignin,
	isErrorWithCode,
	isSuccessResponse,
	statusCodes,
} from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useState } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';

export const useGoogleSignIn = () => {
	const router = useRouter();
	const [error, setError] = useState<any>();
	const { setUser, setIsLogged } = useGlobalContext();

	const appleSignIn = async () => {
		try {
			const credential = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
				],
			});
			setUser(credential);
			router.replace('/home');
			setIsLogged(true);
			console.log({ credential });
			setError(undefined);
			router.replace('/home');
			// signed in
		} catch (e: any) {
			setError(error);
			setIsLogged(false);
			if (e.code === 'ERR_REQUEST_CANCELED') {
				// handle that the user canceled the sign-in flow
				console.log('Cancelado');
			} else {
				// handle other errors
				console.error(e);
			}
		}
	};

	const googleSignIn = async () => {
		console.log('signIn');
		try {
			await GoogleSignin.hasPlayServices();
			const user = await GoogleSignin.signIn();
			setUser(user);
			router.replace('/home');
			setIsLogged(true);
			console.log({ user });
			setError(undefined);
		} catch (error: any) {
			setError(error);
			setIsLogged(false);
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				console.log('El usuario canceló el inicio de sesión');
			} else if (error.code === statusCodes.IN_PROGRESS) {
				console.log('El inicio de sesión ya está en progreso');
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				console.log('Google Play Services no está disponible');
			} else {
				console.error('Error al iniciar sesión:', error);
			}
		}
	};

	return { googleSignIn, appleSignIn };
};
