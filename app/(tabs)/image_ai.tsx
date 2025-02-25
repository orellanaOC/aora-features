import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '@/presentation/constants';
import { useGlobalContext } from '@/context/GlobalProvider';
import { DocumentPickerAsset } from 'expo-document-picker';
import CustomButton from '@/presentation/shared/components/CustomButton';
import { router } from 'expo-router';

type FormState = {
	thumbnail: DocumentPickerAsset | '';
	userId?: string;
};

export default function ImageAI() {
	const { user } = useGlobalContext();
	const [uploading, setUploading] = useState(false);
	const [form, setForm] = useState<FormState>({
		thumbnail: '',
		userId: user.$id,
	});

	const openPicker = async (selectType: string) => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			if (selectType === 'image') {
				console.log({ selectType, result: result.assets[0] });
				setForm({
					...form,
					thumbnail: result.assets[0],
				});
			}
		} else {
			setTimeout(() => {
				Alert.alert('Document picked', JSON.stringify(result, null, 2));
			}, 100);
		}
	};

	const submit = async () => {
		if (!form.thumbnail) {
			return Alert.alert('Please provide all fields');
		}

		setUploading(true);

		try {
			Alert.alert('Success', 'Post uploaded successfully');
			// router.push('/home');
		} catch (error: any) {
			Alert.alert('Error', error.message);
		} finally {
			setForm({
				thumbnail: '',
			});

			setUploading(false);
		}
	};

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView className="px-4 my-6">
				<Text className="text-2xl text-white font-semibold">
					Image to analysis
				</Text>

				<View className="mt-7 space-y-2">
					<Text className="text-base text-gray-100 font-medium">Image:</Text>

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

				<CustomButton
					title="Submit & Publish"
					handlePress={submit}
					containerStyles="mt-7"
					isLoading={uploading}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({});
