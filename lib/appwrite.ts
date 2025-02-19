import {
	Client,
	Account,
	ID,
	Avatars,
	Databases,
	Query,
} from 'react-native-appwrite';

export const config = {
	endpoint: 'https://cloud.appwrite.io/v1',
	platform: 'com.test.react.native.app',
	projectId: '67b3d7730007dbb0fdf3',
	databaseId: '67b3d946001faec2750d',
	userCollectionId: '67b3d9660037930eea88',
	videoCollectionId: '67b3d9840026ce3eeb26',
	storageId: '67b3db0900368eb4d754',
};

const {
	endpoint,
	platform,
	projectId,
	databaseId,
	userCollectionId,
	videoCollectionId,
} = config;

// Init React Native SDK
const client = new Client();

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export interface VideoData {
	id: string;
	title: string;
	thumbnail: string;
	prompt: string;
	video: string;
	users: User;
}
export interface User {
	username: string;
	email: string;
	avatar: string;
	accountId: string;
}

// Register User
export const createUser = async (
	email: string,
	password: string,
	username: string
) => {
	try {
		const newAccount = await account.create(
			ID.unique(),
			email,
			password,
			username
		);

		if (!newAccount) throw Error;

		const avatarUrl = avatars.getInitials(username);

		await signIn(email, password);

		const newUser = await databases.createDocument(
			databaseId,
			userCollectionId,
			ID.unique(),
			{
				accountId: newAccount.$id,
				email: email,
				username: username,
				avatar: avatarUrl,
			}
		);

		return newUser;
	} catch (error: any) {
		throw new Error(error);
	}
};

export const signIn = async (email: string, password: string) => {
	try {
		await account.createEmailPasswordSession(email, password);
	} catch (error: any) {
		throw new Error(error);
	}
};

export const getCurrentUser = async () => {
	try {
		const currentAccount = await account.get();

		if (!currentAccount) throw Error;

		const currentUser = await databases.listDocuments(
			databaseId,
			userCollectionId,
			[Query.equal('accountId', currentAccount.$id)]
		);

		if (!currentUser) throw Error;

		return currentUser.documents[0];
	} catch (error: any) {
		throw new Error(error);
	}
};

// Get all video Posts
export async function getAllPosts(): Promise<VideoData[]> {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId);
		// console.log({ docs: posts.documents });
		return posts.documents as unknown as VideoData[];
	} catch (error: any) {
		throw new Error(error);
	}
}

// Get latest video Posts
export async function getLatestPosts(): Promise<VideoData[]> {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.orderDesc('$createdAt'),
			Query.limit(4),
		]);
		// console.log({ docs: posts.documents });
		return posts.documents as unknown as VideoData[];
	} catch (error: any) {
		throw new Error(error);
	}
}

// Search video Posts
export async function searchPosts(query: string): Promise<VideoData[]> {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.search('title', query),
		]);
		return posts.documents as unknown as VideoData[];
	} catch (error: any) {
		throw new Error(error);
	}
}
