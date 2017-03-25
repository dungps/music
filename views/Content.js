var React = require('react');
var Header = require('./components/Header');
var Charts = require('./components/Charts');
var Audio = require('./components/Audio');
var config = require('../config');
var url = require('url');

class Content extends React.Component {
	constructor(props) {
		super(props);
		this.onSelectMusic = this.onSelectMusic.bind(this);
		this.state = {
			player: {
				link: '',
				thumb: '',
				name: '',
				hidden: true,
				play: false
			}
		}
	}

	// function run when click search item or chart item
	onSelectMusic(data) {
		this.setState({player: data});
	}

	render() {
		return(
			<div>
				<Header onSelectMusic={this.onSelectMusic} />
				<div className="charts">
					<Charts onSelectMusic={this.onSelectMusic}/>
				</div>
				<Audio data={this.state.player} />
			</div>
		);
	}
}

module.exports = Content;