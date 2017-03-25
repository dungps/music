var React = require('react');
var Search = require('./Search');

class Header extends React.Component {
	render() {
		return( 
			<header id="masthead" className="navbar navbar-default site-header">
				<div className="container">
					<Search onSelectMusic={this.props.onSelectMusic} />
				</div>
			</header>
		);
	}
}

module.exports = Header;