import * as React from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useGlobalContext } from '@/context/GlobalProvider';
import EmptyState from '@/components/EmptyState';
import useAppwrite from '@/lib/useAppwrite';
import VideoCard from '@/components/VideoCard';
import { getUserPosts, signOut, VideoData } from '@/lib/appwrite';
import { icons } from '@/constants';
import InfoBox from '@/components/InfoBox';

export default function Profile() {
	const { user, setUser, setIsLogged } = useGlobalContext();
	const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));
	const logout = async () => {
		await signOut();
		setUser(null);
		setIsLogged(false);
		router.replace('/sign-in');
	};
	return (
		<SafeAreaView className="bg-primary h-full">
			<FlatList
				className="bg-primary"
				data={posts}
				keyExtractor={(item: VideoData) => item.$id}
				renderItem={({ item }) => (
					<VideoCard
						title={item.title}
						thumbnail={item.thumbnail}
						video={item.video}
						creator={item.users.username}
						avatar={item.users.avatar}
					/>
				)}
				ListHeaderComponent={() => (
					<View className="w-full justify-center items-center mt-6 mb-12 px-4">
						<TouchableOpacity
							className="w-full items-end mb-10"
							onPress={logout}
						>
							<Image
								source={icons.logout}
								resizeMode="contain"
								className="w-6 h-6"
							/>
						</TouchableOpacity>

						<View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
							<Image
								className="w-[90%] h-[90%] rounded-lg"
								resizeMode="cover"
								source={{ uri: user?.avatar }}
							/>
						</View>

						<InfoBox
							title={user?.username}
							containerStyles="mt-5"
							titleStyles="text-lg"
						/>

						<View className="mt-5 flex-row">
							<InfoBox
								title={`${posts.length || 0}`}
								subtitle="Posts"
								containerStyles="mr-10"
								titleStyles="text-lg"
							/>

							<InfoBox
								title="1.2k"
								subtitle="Followers"
								titleStyles="text-xl"
							/>
						</View>
					</View>
				)}
				ListEmptyComponent={() => (
					<EmptyState
						title="No Videos Found"
						subtitle="No videos found for this search query"
					/>
				)}
			/>
		</SafeAreaView>
	);
}
