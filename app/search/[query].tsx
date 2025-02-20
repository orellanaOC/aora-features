import * as React from 'react';
import { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import useAppwrite from '@/lib/useAppwrite';
import VideoCard from '@/components/VideoCard';
import { searchPosts, VideoData } from '@/lib/appwrite';

export default function Search() {
	const { query } = useLocalSearchParams();
	const { data: posts, refetch } = useAppwrite(() =>
		searchPosts(query.toString())
	);

	useEffect(() => {
		refetch();
	}, [query]);

	return (
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
				<View className="flex  px-4">
					<Text className="text-2xl font-semibold text-white">{query}</Text>

					<View className="mt-6 mb-8">
						<SearchInput initialQuery={query.toString()} />
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
	);
}
