import { useState, useEffect } from 'react';
// import { ResizeMode, Video } from 'expo-av';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useEvent } from 'expo';

import { icons } from '../constants';
import { useVideoPlayer, VideoView } from 'expo-video';

const VideoCard = ({
	title,
	creator,
	avatar,
	thumbnail,
	video,
}: {
	title: string;
	creator: string;
	avatar: string;
	thumbnail: string;
	video: string;
}) => {
	const [play, setPlay] = useState(false);
	const [error, setError] = useState<string | null>(null);
	// console.log({ activeItemvideo: video });

	const player = useVideoPlayer(video, (player) => {
		player.loop = true;
	});
	useEffect(() => {
		// console.log({ status: player.status });
		if (player.status === 'readyToPlay' && play) {
			// console.log('Reproduce el video cuando esté listo');
			player.play(); // Reproduce el video cuando esté listo
		} else if (player.status === 'error') {
			setError('Error al reproducir el video.');
		}
	}, [player.status, play]);

	// Maneja el botón de play/pause
	const togglePlay = () => {
		setPlay((prev) => !prev);
	};
	const { isPlaying } = useEvent(player, 'playingChange', {
		isPlaying: player.playing,
	});
	// console.log({ isPlaying });

	return (
		<View className="flex flex-col items-center px-4 mb-14">
			<View className="flex flex-row gap-3 items-start">
				<View className="flex justify-center items-center flex-row flex-1">
					<View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
						<Image
							source={{ uri: avatar }}
							className="w-full h-full rounded-lg"
							resizeMode="cover"
						/>
					</View>

					<View className="flex justify-center flex-1 ml-3 gap-y-1">
						<Text
							className="font-semibold text-sm text-white"
							numberOfLines={1}
						>
							{title}
						</Text>
						<Text
							className="text-xs text-gray-100 font-regular"
							numberOfLines={1}
						>
							{creator}
						</Text>
					</View>
				</View>

				<View className="pt-2">
					<Image
						source={icons.menu}
						className="w-5 h-5"
						resizeMode="contain"
					/>
				</View>
			</View>

			{play ? (
				<View className="w-full h-60 rounded-s mt-3 relative flex justify-center items-center">
					<VideoView
						style={styles.container}
						player={player}
						allowsFullscreen
						allowsPictureInPicture
					/>
				</View>
			) : (
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => setPlay(true)}
					className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
				>
					<Image
						source={{ uri: thumbnail }}
						className="w-full h-full rounded-xl mt-3"
						resizeMode="cover"
					/>

					<Image
						source={icons.play}
						className="w-12 h-12 absolute"
						resizeMode="contain"
					/>
				</TouchableOpacity>
			)}
		</View>
	);
};

export default VideoCard;

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
