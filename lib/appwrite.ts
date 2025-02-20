import {
	Client,
	Account,
	ID,
	Avatars,
	Databases,
	Query,
	Storage,
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
	storageId,
} = config;

// Init React Native SDK
const client = new Client();

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

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
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.orderDesc('$createdAt'),
		]);
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

// get user posts
export async function getUserPosts(userId: string): Promise<VideoData[]> {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.equal('users', userId),
			Query.orderDesc('$createdAt'),
		]);
		return posts.documents as unknown as VideoData[];
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function signOut() {
	try {
		await account.deleteSession('current');
	} catch (error: any) {
		throw new Error(error);
	}
}

// import { uploadFile } from './uploadFile'; // Import the appropriate module

// Create Video Post
export async function createVideoPost(form: {
	thumbnail: VideoFile;
	video: VideoFile;
	title: string;
	prompt: string;
	userId: string;
}) {
	try {
		const [thumbnailUrl, videoUrl] = await Promise.all([
			uploadFile(form.thumbnail, 'image'),
			uploadFile(form.video, 'video'),
		]);

		const newPost = await databases.createDocument(
			databaseId,
			videoCollectionId,
			ID.unique(),
			{
				title: form.title,
				thumbnail: thumbnailUrl,
				video: videoUrl,
				prompt: form.prompt,
				users: form.userId,
			}
		);

		return newPost;
	} catch (error: any) {
		throw new Error(error);
	}
}

export interface VideoFile {
	mimeType: string;
	fileName: string;
	fileSize: number;
	uri: string;
}

// Upload File
export async function uploadFile(file: VideoFile, type: string) {
	if (!file) return;

	const { mimeType, fileName, fileSize, uri } = file;
	const asset = { type: mimeType, name: fileName, size: fileSize, uri };
	console.log({ file });
	try {
		const uploadedFile = await storage.createFile(
			storageId,
			ID.unique(),
			asset
		);
		console.log({ uploadedFile });

		const fileUrl = await getFilePreview(uploadedFile.$id, type);
		return fileUrl;
	} catch (error: any) {
		throw new Error(error);
	}
}

// Get File Preview
export async function getFilePreview(fileId: string, type: string) {
	let fileUrl;

	try {
		if (type === 'video') {
			fileUrl = storage.getFileView(storageId, fileId);
		} else if (type === 'image') {
			fileUrl = storage.getFilePreview(
				storageId,
				fileId,
				2000,
				2000,
				'top',
				100
			);
		} else {
			throw new Error('Invalid file type');
		}

		if (!fileUrl) throw Error;

		return fileUrl;
	} catch (error: any) {
		throw new Error(error);
	}
}
