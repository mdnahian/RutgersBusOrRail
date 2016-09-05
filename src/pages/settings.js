import React, { Component } from 'react';
import { 
	StyleSheet,
	Text,
	View,
	TextInput
} from 'react-native';

module.exports = React.createClass({
	render: function () {
		return <View style={styles.container}>
			<Text>Goodbye</Text>
		</View>
	}
});

var styles = StyleSheet.create({
	container: {
		padding: 5
	}
});