import * as React from 'react';
import { useState, useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import { useVideoPlayer, VideoView } from 'expo-video';

import {
	FlatList,
	Image,
	ImageBackground,
	StyleSheet,
	TouchableOpacity,
	View,
	ViewToken,
} from 'react-native';

import { icons } from '../constants';
import { VideoData } from '@/lib/appwrite';
import { useEvent } from 'expo';

const zoomIn = {
	0: {
		scale: 0.9,
	},
	1: {
		scale: 1,
	},
};

const zoomOut = {
	0: {
		scale: 1,
	},
	1: {
		scale: 0.9,
	},
};

const TrendingItem = ({
	activeItem,
	item,
}: {
	activeItem: VideoData;
	item: VideoData;
}) => {
	const [play, setPlay] = useState(false);
	const [error, setError] = useState<string | null>(null);
	console.log({ activeItemvideo: item.video });

	const player = useVideoPlayer(item.video, (player) => {
		player.loop = true;
	});
	useEffect(() => {
		console.log({ status: player.status });
		if (player.status === 'readyToPlay' && play) {
			console.log('Reproduce el video cuando esté listo');
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
	console.log({ isPlaying });

	console.log({ activeItem: activeItem.$id, item: item.$id });
	return (
		<Animatable.View
			className="mr-5"
			animation={activeItem.$id === item.$id ? zoomIn : zoomOut}
			duration={500}
		>
			{play ? (
				<View className="w-52 h-72 rounded-[33px] mt-3 bg-white/10">
					<VideoView
						style={styles.container}
						player={player}
						allowsFullscreen
						allowsPictureInPicture
					/>
				</View>
			) : (
				<TouchableOpacity
					className="relative flex justify-center items-center"
					activeOpacity={0.7}
					onPress={() => setPlay(true)}
				>
					<ImageBackground
						source={{
							uri: item.thumbnail,
						}}
						className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
						resizeMode="cover"
					/>

					<Image
						source={icons.play}
						className="w-12 h-12 absolute"
						resizeMode="contain"
					/>
				</TouchableOpacity>
			)}
		</Animatable.View>
	);
};

const Trending = ({ posts }: { posts: VideoData[] }) => {
	const [activeItem, setActiveItem] = useState(posts[0]);

	const viewableItemsChanged = ({
		viewableItems,
	}: {
		viewableItems: ViewToken[];
	}) => {
		if (viewableItems.length > 0) {
			console.log({ videoselected: viewableItems[0].item });
			setActiveItem(viewableItems[0].item);
		}
	};

	return (
		<FlatList
			data={posts}
			horizontal
			keyExtractor={(item) => item.$id}
			renderItem={({ item }) => (
				<TrendingItem
					activeItem={activeItem}
					item={item}
				/>
			)}
			onViewableItemsChanged={viewableItemsChanged}
			viewabilityConfig={{
				itemVisiblePercentThreshold: 70,
			}}
			contentOffset={{ x: 170, y: 0 }}
		/>
	);
};

export default Trending;

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 50,
	},
	container: {
		width: 182, // w-52 -> 52 * 4 (ya que Tailwind utiliza una escala de 4px por unidad)
		height: 252, // h-72 -> 72 * 4
		borderRadius: 33, // rounded-[33px]
		backgroundColor: 'rgba(255, 255, 255, 0.1)', // bg-white/10
	},
});
