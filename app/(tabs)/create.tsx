import { useEffect, useState, useCallback } from 'react';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { DocumentPickerAsset } from 'expo-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	View,
	Text,
	Alert,
	Image,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
} from 'react-native';
import { useVideoPlayer, VideoView, VideoSource } from 'expo-video';
import { icons } from '@/constants';
import { createVideoPost, VideoFile } from '@/lib/appwrite';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useEventListener } from 'expo';

type FormState = {
	title: string;
	video: DocumentPickerAsset | '';
	thumbnail: DocumentPickerAsset | '';
	prompt: string;
	userId?: string;
};

const Create = () => {
	const [play, setPlay] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { user } = useGlobalContext();
	const [uploading, setUploading] = useState(false);
	const [form, setForm] = useState<FormState>({
		title: '',
		prompt: '',
		video: '',
		thumbnail: '',
		userId: user.$id,
	});

	const player = useVideoPlayer(
		form.video !== '' ? form.video.uri : '',
		(player) => {
			player.loop = false;
		}
	);

	useEffect(() => {
		if (form.video !== '') {
			player.replace(form.video.uri); // Actualiza el reproductor con la nueva URL
		}
	}, [form.video]);

	useEventListener(player, 'statusChange', ({ status, error }) => {
		console.log({ status, errorchargingvideo: error });
		if (status === 'readyToPlay' && play) {
			console.log('Reproduce el video cuando esté listo');
			player.play(); // Play the video when it's ready
		} else if (status === 'error') {
			console.log({ errorchargingvideo: error });
			setError('Error al reproducir el video.');
		}
	});

	const openPicker = async (selectType: string) => {
		const result = await DocumentPicker.getDocumentAsync({
			type:
				selectType === 'image'
					? ['image/png', 'image/jpg', 'image/jpeg']
					: ['video/mp4', 'video/gif', 'video/mov'],
		});

		if (!result.canceled) {
			if (selectType === 'image') {
				console.log({ selectType, result: result.assets[0] });
				setForm({
					...form,
					thumbnail: result.assets[0],
				});
			}

			if (selectType === 'video') {
				console.log({ selectType, result: result.assets[0].uri });
				setForm({
					...form,
					video: result.assets[0],
				});
				console.log({
					formvideo: form.video,
					selectType,
					result: result.assets[0],
				});
			}
		} else {
			setTimeout(() => {
				Alert.alert('Document picked', JSON.stringify(result, null, 2));
			}, 100);
		}
	};

	const submit = async () => {
		if (
			form.prompt === '' ||
			form.title === '' ||
			!form.thumbnail ||
			!form.video
		) {
			return Alert.alert('Please provide all fields');
		}

		setUploading(true);

		try {
			await createVideoPost({
				title: form.title,
				video: form.video as VideoFile,
				thumbnail: form.thumbnail as VideoFile,
				prompt: form.prompt,
				userId: user.$id,
			});

			Alert.alert('Success', 'Post uploaded successfully');
			router.push('/home');
		} catch (error: any) {
			Alert.alert('Error', error.message);
		} finally {
			setForm({
				title: '',
				video: '',
				thumbnail: '',
				prompt: '',
			});

			setUploading(false);
		}
	};

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView className="px-4 my-6">
				<Text className="text-2xl text-white font-semibold">Upload Video</Text>

				<FormField
					title="Video Title"
					value={form.title}
					placeholder="Give your video a catchy title..."
					handleChangeText={(e) => setForm({ ...form, title: e })}
					otherStyles="mt-10"
				/>

				<View className="mt-7 space-y-2">
					<Text className="text-base text-gray-100 font-medium">
						Upload Video
					</Text>

					<TouchableOpacity onPress={() => openPicker('video')}>
						{form.video ? (
							<View className="w-full h-60 rounded-s mt-3 relative flex justify-center items-center">
								<VideoView
									style={styles.container}
									player={player}
								/>
							</View>
						) : (
							<View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
								<View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
									<Image
										source={icons.upload}
										resizeMode="contain"
										alt="upload"
										className="w-1/2 h-1/2"
									/>
								</View>
							</View>
						)}
					</TouchableOpacity>
				</View>

				<View className="mt-7 space-y-2">
					<Text className="text-base text-gray-100 font-medium">
						Thumbnail Image
					</Text>

					<TouchableOpacity onPress={() => openPicker('image')}>
						{form.thumbnail ? (
							<Image
								source={{ uri: form.thumbnail.uri }}
								resizeMode="cover"
								className="w-full h-64 rounded-2xl"
							/>
						) : (
							<View className="w-full h-16 px-8 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
								<Image
									source={icons.upload}
									resizeMode="contain"
									alt="upload"
									className="w-5 h-5 mr-2"
								/>

								<Text className="text-sm text-gray-100 font-medium">
									Choose a file
								</Text>
							</View>
						)}
					</TouchableOpacity>
				</View>

				<FormField
					title="AI Prompt"
					value={form.prompt}
					placeholder="The AI prompt of your video...."
					handleChangeText={(e) => setForm({ ...form, prompt: e })}
					otherStyles="mt-7"
				/>

				<CustomButton
					title="Submit & Publish"
					handlePress={submit}
					containerStyles="mt-7"
					isLoading={uploading}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Create;

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 50,
	},
	container: {
		width: '100%', // w-full
		height: '100%', // h-full
		borderRadius: 15, // rounded-xl
		marginTop: 12, // mt-3 (3 * 4)
		backgroundColor: 'rgba(255, 255, 255, 0.1)', // bg-white/10
	},
});
