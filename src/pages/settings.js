import React, { Component } from 'react';
import { 
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableHighlight
} from 'react-native';
import Store from 'react-native-store';
import DropDown, {
  Select,
  Option,
  OptionList,
} from 'react-native-selectme';


const DB = {
    'settings': Store.model('settings')
}

module.exports = React.createClass({
	componentWillMount: function () {
		DB.settings.find().then(resp => {
			if(resp != null && resp[resp.length - 1].route != ""){
				this.setState({
					route: resp[resp.length - 1].route,
					starting: resp[resp.length - 1].starting
				});
			}
		});
	},
	getInitialState: function () {
		return {
			route: '',
			starting: '',
			error: '',
			success: ''
		}
	},
	render: function () {
		return <View>

			<View style={styles.title}>
				<Text style={styles.titleText}>Settings</Text>
			</View>

			<View style={styles.container}>
				<Text style={{marginBottom:10, fontSize:18}}>{this.state.starting} {this.state.route}</Text>
				<View style={styles.item}>
					<Text>Select a starting point ...</Text>

					<Select
			            width={250}
			            ref="Starting"
			            optionListRef={this.getOptionList}
			            defaultValue='...'
			            onSelect={(selection) => this.setState({starting: selection})}>
			            <Option>From Washington Street</Option>
			            <Option>From NJIT</Option>
			            <Option>From Penn Station</Option>
			        </Select>
			    </View>

			    <View style={styles.item}>
			        <Text>Select a route ...</Text>

					<Select
			            width={250}
			            ref="Route"
			            optionListRef={this.getOptionList}
			            defaultValue='...'
			            onSelect={(selection) => this.setState({route: selection})}>
			            <Option>to Penn Station</Option>
						<Option>to Washington Street</Option>
						<Option>to NJIT</Option>
			        </Select>
			    </View>

	          <TouchableHighlight style={styles.button}
	          underlayColor={'#eeeeee'}
	          onPress={this.saveBtnPressed}>
	          	<Text style={{ textAlign: 'center' }}>SAVE</Text>
	          </TouchableHighlight>

	          <Text style={{marginTop:15, color:'red'}}>{this.state.error}</Text>
	          <Text style={{marginTop:15, color:'green'}}>{this.state.success}</Text>
			  <Text style={{marginTop:15, width:250}}>Bus and light rail times may vary due to traffic, weather, and other factors.</Text>
			 
			  <OptionList ref="OPTIONLIST"/>
			</View>
		</View>
	},
	getOptionList: function () {
    	return this.refs['OPTIONLIST'];
  	},
  	saveBtnPressed: function () {
  		if(this.state.starting != "" && this.state.route != ""){
	  		if((this.state.starting).replace('From', '') != (this.state.route).replace('to', '')){
	  			var isValid;
	  			if((this.state.starting == "From Washington Street" ||
	  				this.state.starting == "From NJIT") &&
	  				this.state.route == "to Penn Station"){
	  				isValid = true;
	  			} else {
	  				if(this.state.starting == "From Penn Station" &&
	  				 (this.state.route == "to Washington Street" ||
	  				 	this.state.route == "to NJIT")){
	  					isValid = true;
	  				}
	  			}

	  			if(isValid){
	  				DB.settings.add({
				        route: this.state.route,
				        starting: this.state.starting
				    });

				    this.setState({success: 'Saved!', error: ''});
	  			} else {
	  				this.setState({error: 'Invalid Entries. Please revise and try again.', success: ''});
	  			}


	  		} else {
	  			this.setState({error: 'Invalid Entries. Cannot start and stop at the same place.', success: ''});
	  		}
	  	}
  	}
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
		alignSelf: 'stretch',
		backgroundColor: '#eeeeee',
		padding: 10,
		marginBottom: 25
	},
	titleText: {
		color: '#999999',
		fontSize: 36
	},
	item: {
		margin: 10
	},
	button: {
		margin: 10,
		padding: 10,
		borderColor: '#999999',
		borderWidth: 1,
		borderRadius: 5,
		width: 250
	}
});