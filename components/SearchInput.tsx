import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

import { icons } from '../constants';

type FormFieldProps = {
	title?: string;
	value?: string;
	placeholder?: string;
	handleChangeText?: (text: string) => void;
	otherStyles?: string;
	keyboardType?: string;
};

const SearchInput = ({
	title = '',
	value = '',
	placeholder = 'Search for a video topic',
	handleChangeText = () => {},
	otherStyles = '',
	keyboardType = 'default',
	...props
}: FormFieldProps) => {
	return (
		<View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center space-x-4">
			<TextInput
				className="flex-1 text-white font-regular mt-0.5 text-base"
				value={value}
				placeholder={placeholder}
				placeholderTextColor="#7B7B8B"
				onChangeText={handleChangeText}
				{...props}
			/>

			<TouchableOpacity>
				<Image
					source={icons.search}
					className="w-5 h-5"
					resizeMode="contain"
				/>
			</TouchableOpacity>
		</View>
	);
};

export default SearchInput;
