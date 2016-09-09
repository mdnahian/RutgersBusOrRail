import React, { Component, AsyncStorage } from 'react';
import { 
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableHighlight
} from 'react-native';
import Store from 'react-native-store';
import TimerMixin from 'react-timer-mixin';

var bus = require('json!../../../data/bus.json');
var rail = require('json!../../../data/rail.json');

const DB = {
    'settings': Store.model('settings')
}

module.exports = React.createClass({
	mixins: [TimerMixin],
	componentWillMount: function () {
		this.refresh();
		this.setInterval(
	      () => { this.refresh(); },
	      5000
	    );
	},
	convert12to24: function(raw_time){
		var current_time = new Date();
		var hour = raw_time.split(":")[0];
		var minute = raw_time.split(":")[1].split(" ")[0];
		var ampm = raw_time.split(":")[1].split(" ")[1];

		if(ampm == "PM"){
			if(parseInt(hour) >= 1 && parseInt(hour) <= 11){
				hour = parseInt(hour) + 12;
			}
		} else {
			if(parseInt(hour) == 12){
				hour = parseInt(hour) - 12;
			}
		}

		var datetime = new Date(current_time.getFullYear(), current_time.getMonth(), current_time.getDate(), hour, minute);
		
		console.log(datetime);

		return datetime;
	},
	extract12from24: function(date){
		var hour;
		var minute;
		var ampm;

		if(date.getHours() > 12){
			hour = date.getHours() - 12;
			ampm = "PM";
		} else {
			ampm = "AM";
		}

		return hour+":"+minute+" "+ampm;
	},
	refresh: function(){
		DB.settings.find().then(resp => {
			if(resp == null || resp[resp.length - 1].route == ""){
				this.props.navigator.immediatelyResetRouteStack([{name: 'settings'}]);
			} else {
				var route = resp[resp.length - 1].route;
				var starting = resp[resp.length - 1].starting;

				// get current time
				var current_time = new Date();

				// get next arrival bus
				var bus_time;
				var formated_bus_time;
				for(var i=0; i<bus[starting].length; i++){
					var raw_bus_time = this.convert12to24(bus[starting][i]);
					if(raw_bus_time > current_time){
						bus_time = raw_bus_time;
						formated_bus_time = bus[starting][i];
						break;
					}
				}

				if(bus_time == null){
					bus_time = this.convert12to24(bus[starting][0]);
					formated_bus_time = bus[starting][0];
				}

				// get next arrival rail
				var rail_time;
				var formated_rail_time;
				for(var i=0; i<rail[starting].length; i++){
					var raw_rail_time = this.convert12to24(rail[starting][i]);
					if(raw_rail_time > current_time){
						rail_time = raw_rail_time;
						formated_rail_time = rail[starting][i];
						break;
					}
				}

				if(rail_time == null){
					rail_time = this.convert12to24(rail[starting][0]);
					formated_rail_time = rail[starting][0];
				}

				// compare both to see which is coming sooner
				if(bus_time > rail_time){
					var rail_arriving = Math.floor((rail_time - current_time) / 1000 / 60);

					this.setState({
						recommendation: 'Light Rail '+route,
						recommendationTime: rail_arriving,
						lightRailTime: formated_rail_time,
						shuttleBusTime: formated_bus_time,
						starting: starting
					});
				} else {
					var bus_arriving = Math.floor((bus_time - current_time) / 1000 / 60);

					this.setState({
						recommendation: 'Shuttle Bus '+route,
						recommendationTime: bus_arriving,
						lightRailTime: formated_rail_time,
						shuttleBusTime: formated_bus_time,
						starting: starting
					});
				}
			}
		});
	},
	getInitialState: function () {
		return {
			recommendation: '',
			recommendationTime: '',
			lightRailTime: '',
			shuttleBusTime: '',
			starting: ''
		}
	},
	render: function () {
		return <View style={styles.container}>
			<View style={styles.recommendation}>
				<Text style={[styles.medium, styles.textWhite, styles.indent]}>{this.state.recommendation}</Text>
				<Text style={[styles.xsmall, styles.textWhite, styles.indent]}>{this.state.starting}</Text>
				<Text style={[styles.small, styles.textWhite, styles.indent]}>Will Arrive In</Text>
				<Text style={[styles.large, styles.textWhite, styles.indent]}>{this.state.recommendationTime} Minutes</Text>
				<TouchableHighlight underlayColor={'#CA0A30'} style={{marginTop:10}} onPress={this.refresh}><Image style={{width: 32, height: 32}} source={require('../../img/refresh.png')}/></TouchableHighlight>
			</View>
			<Text style={[styles.small, styles.title]}>Next Arrivals</Text>
			<View style={styles.times}>

				<View style={styles.items}>
					<Image style={styles.itemImage} source={require('../../img/train.png')}/>
					<Text style={styles.small}>Light Rail</Text>
					<Text style={styles.medium}>{this.state.lightRailTime}</Text>
				</View>

				<View style={styles.items}>
					<Image style={styles.itemImage} source={require('../../img/bus.png')}/>
					<Text style={styles.small}>Shuttle Bus</Text>
					<Text style={styles.medium}>{this.state.shuttleBusTime}</Text>
				</View>
			</View>
		</View>
	}
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff'
	},
	recommendation: {
		flex: 8,
		backgroundColor: '#CA0A30',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
	},
	times: {
		flex: 5,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	medium: {
		fontSize: 24
	},
	small: {
		fontSize: 18
	},
	xsmall: {
		fontSize: 15
	},
	large: {
		fontSize: 32
	},
	textWhite: {
		color: '#ffffff',
		textAlign: 'center'
	},
	indent: {
		marginBottom: 5,
		marginTop: 5
	},
	items: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	itemImage: {
		width: 64,
		height: 64,
		marginBottom: 5
	},
	title: {
		flex: 1,
		textAlign: 'center',
		marginTop: 20
	}
});