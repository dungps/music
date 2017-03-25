const React = require('react');
const request = require('request');
const url = require('url');
const _ = require('lodash');
const config = require('../../config');

class Items extends React.Component {
	constructor(props) {
		super(props);
		this.handleSelectMusic = this.handleSelectMusic.bind(this);
	}

	handleSelectMusic(item, e) {
		e.preventDefault();
		this.props.onSelectMusic({
			link: item.link,
			thumb: item.thumb,
			name: item.name,
			hidden: false,
			play: true
		})
	}

	render() {
		var i = 0;
		var self = this;
		var createItem = function(item) {
			return (
				<a className="list-group-item" href={item.link} data-name={item.name} data-id={item.id} onClick={self.handleSelectMusic.bind(this, item)} key={i++}>
					<img src={item.thumb} width="48" height="48" />
					<span>
						<strong>{item.name}</strong>
						<p>{item.singer}</p>
					</span>
				</a>
			)
		}

		return(
			<div className="list-group chart-items">{_.map(this.props.items, createItem)}</div>
		);
	}
}

class Charts extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: {}
		};
	}

	componentDidMount() {
		var self = this;
		request(url.resolve(config.site.home, 'api/charts'), function(err,resp,body) {
			body = JSON.parse(body);
			self.setState({items: body});
		})
	}

	render() {
		return(
			<div className="container">
				<Items items={this.state.items} onSelectMusic={this.props.onSelectMusic} />
			</div>
		);
	}
}

module.exports = Charts;