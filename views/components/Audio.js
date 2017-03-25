var React = require('react');

class Audio extends React.Component {
	constructor(props) {
		super(props);
		this.setProgress = this.setProgress.bind(this);
		this.toggle = this.toggle.bind(this);
		this.updateProgress = this.updateProgress.bind(this);
		this.play = this.play.bind(this);
		this.pause = this.pause.bind(this);

		this.state = {
			link: this.props.data.link,
			thumb: this.props.data.thumb,
			name: this.props.data.name,
			progress: 0,
			play: false,
			repeat: true,
			time: '0:00',
			hidden: this.props.data.hidden || false
		}
	}

	componentDidMount() {
		let playerElement = this.refs.player;
		playerElement.addEventListener('timeupdate', this.updateProgress);
		playerElement.addEventListener('ended', this.end);
		playerElement.addEventListener('error', this.end);
	}

	componentWillUnmount() {
		let playerElement = this.refs.player;
		playerElement.removeEventListener('timeupdate', this.updateProgress);
		playerElement.removeEventListener('ended', this.end);
		playerElement.removeEventListener('error', this.end);
	}

	componentWillReceiveProps(newProps) {
		this.setState(newProps.data);
	}

	play() {
		this.setState({play: true});
		this.refs.player.play();
	}

	pause() {
		this.setState({play: false});
		this.refs.player.pause();
	}

	toggle(e) {
		this.state.play ? this.pause() : this.play();
	}

	updateProgress() {
		let duration = this.refs.player.duration;
		let currentTime = this.refs.player.currentTime;
		let progress = ( currentTime * 100 ) / duration;

		this.setState({progress: progress});
	}

	setProgress(e) {
		console.log(this.refs);
		let target = e.target.nodeName === 'SPAN' ? e.target.parentNode : e.target;
		let width = target.clientWidth;
		let rect = target.getBoundingClientRect();
		let offsetX = e.clientX - rect.left;
		let duration = this.refs.player.duration;
		let currentTime = (duration * offsetX) / width;
		let progress = (currentTime * 100) / duration;

		this.refs.player.currentTime = currentTime;
		this.setState({ progress: progress });
		this.play();
	}

	render() {
		var className = this.state.hidden ? 'audio-player hidden' : 'audio-player';
		var classIcon = this.state.play ? 'fa fa-pause' : 'fa fa-play';
		return(
			<div className={className}>
				<div className="container">
					<audio src={this.state.link} autoPlay={this.state.play} preload="auto" ref="player"></audio>
					<div className="row">
						<div className="col-xs-1">
							<button className="player-button-play" ><i className={classIcon}></i></button>
						</div>
						<div className="col-xs-8">
							<div className="progress-wrap">
								<div className="progress">
									<div className="progress-bar" style={{width: this.state.progress + 'px'}}></div>
								</div>
							</div>
						</div>
						<div className="col-xs-3">
							<div className="audio-wrap">
								<img src={this.state.thumb} style={{width: '30px', height: '30px'}} onClick={this.setProgress} />
								<strong>{this.state.name}</strong>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

module.exports = Audio;