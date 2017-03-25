var React = require('react');
var ReactDOMServer = require('react-dom/server');
var Content = require('./Content');

class Html extends React.Component {
	

	render() {
		var data = this.props.data;
		var contentHtml = ReactDOMServer.renderToString(<Content {...data}/>);
		var initScript = 'main()';
		return (
			<html lang="en">
				<head>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1"/>
					<link rel="stylesheet" href="/css/bootstrap.min.css"/>
					<link rel="stylesheet" href="/css/font-awesome.min.css"/>
					<link rel="stylesheet" href="/css/style.css"/>
					<title>{data.title}</title>
				</head>
				<body>
					<div id="content" dangerouslySetInnerHTML={{__html: contentHtml}}/>

					<script src="/js/main.js?v=1.0.0"></script>
					<script dangerouslySetInnerHTML={{__html: initScript}} />
				</body>
			</html>
		);
	}

}

module.exports = Html;
