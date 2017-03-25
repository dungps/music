var React = require('react');
var config = require('../../config');
var url = require('url');
var _ = require('lodash');
var request = require('request');

class Results extends React.Component {
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
		var self = this;
		var i = 0;
		var createItem = function(item) {
			return (
				<a className="list-group-item" href={item.link} data-id={item.id} data-name={item.name} onClick={self.handleSelectMusic.bind(this, item)} key={i++}>
					{item.name}
				</a>
			)
		}
		var className = _.isEmpty(this.props.items) ? 'list-group hidden' : 'list-group';
		return (
			<div className={className}>{_.map(this.props.items, createItem)}</div>
		);
	}
}

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.state = {
			text: ''
		}
	}

	onChange(e) {
		var self = this;
		this.setState({text: e.target.value});

		if ( _.isEmpty(e.target.value) ) {
			self.setState({
				items: {}
			})
		}
		request(url.resolve(config.site.home, 'api/search/?q=' + encodeURIComponent( e.target.value ) ), function(err, resp, body) {
			body = JSON.parse(body);
			if (!_.isEmpty(body) && !body.error) {
				self.setState({
					items: body
				});
			}
		})
	}

	render() {
		return(
			<div className="search-bar">
				<div className="search-section show-guide">
					<input type="text" className="form-control" placeholder="Search Music" onChange={this.onChange} value={this.state.text}/>
					<Results items={this.state.items} onSelectMusic={this.props.onSelectMusic}/>
				</div>
			</div>
		);
	}
}

module.exports = Search;