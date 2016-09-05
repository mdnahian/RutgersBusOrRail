import React, { Component } from 'react';
var Tabbar = require('./components/tabbar');

var Settings = require('./pages/settings');
var Home = require('./pages/home');

module.exports = React.createClass({
	getInitialState: function () {
		return	{
			initialRoute: 'home',
			views: {
				settings: Settings,
				home: Home
			},
			images: [
				[require('../img/home.png'), 'home'],
				[require('../img/settings.png'), 'settings']
			],
			underlayColor: '#dedede'
		}
	},
	render: function () {
		return <Tabbar config={this.state} />
	}
});