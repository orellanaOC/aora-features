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

// Init React Native SDK
const client = new Client();

client
	.setEndpoint(config.endpoint)
	.setProject(config.projectId)
	.setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

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
			config.databaseId,
			config.userCollectionId,
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
			config.databaseId,
			config.userCollectionId,
			[Query.equal('accountId', currentAccount.$id)]
		);

		if (!currentUser) throw Error;

		return currentUser.documents[0];
	} catch (error: any) {
		throw new Error(error);
	}
};
