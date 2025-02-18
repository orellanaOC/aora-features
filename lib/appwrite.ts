import { Client, Account, ID } from 'react-native-appwrite';

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

// Register User
export const createUSer = () => {
	account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe').then(
		function (response) {
			console.log(response);
		},
		function (error) {
			console.log(error);
		}
	);
};
