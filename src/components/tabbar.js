import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Navigator,
	Text,
	Image,
	TouchableHighlight
} from 'react-native';

var navigate;

module.exports = React.createClass({
	getInitialState: function () {
		return {
			configureScene: Navigator.SceneConfigs.FloatFromRight
		}
	},
	renderScene: function (route, navigator) {
		navigate = navigator;
		var Component = this.props.config.views[route.name];
		return <Component route={route} navigator={navigator}/>;
	},
	render: function () {
		return <View style={styles.wrapper}>
			<Navigator
			initialRoute={{name: this.props.config.initialRoute}}
			renderScene={this.renderScene}
			configureScene={() => { return this.state.configureScene; }} />
			{this.buildTabbar()}
		</View>
	},
	buildTabbar: function () {
		var images = this.props.config.images;
		return <View style={styles.tabbar}>
		{images.map((image) => {
		  return (
		    <TouchableHighlight key={image} style={styles.tabs}
			underlayColor={this.props.config.underlayColor}
			onPress={() => this.changeView(image[1])}>
				<Image style={styles.tabs} source={image[0]}/>
			</TouchableHighlight>
		  );
		})}
		</View>
	},
	changeView: function (view) {
		var views = this.props.config.images;

		var currentView = navigate.getCurrentRoutes();
		currentView = currentView[currentView.length-1].name;

		var currentViewNumber;
		var nextViewNumber;

		for(i=0; i<views.length; i++){
			
			if(currentView == views[i][1]){
				currentViewNumber = i;
			}

			if(view == views[i][1]){
				nextViewNumber = i;
			}

		}

		if(currentViewNumber > nextViewNumber){
			this.setState({configureScene: Navigator.SceneConfigs.FloatFromRight});
		} else if(nextViewNumber > currentViewNumber){
			this.setState({configureScene: Navigator.SceneConfigs.FloatFromLeft});
		}

		navigate.push({name: view});
	}
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1
	},
	tabbar: {
		backgroundColor: '#eeeeee',
		borderTopColor: '#dedede',
		borderTopWidth: 1,
		flexDirection: 'row'
	},
	tabs: {
		flex: 1,
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center'
	}
});