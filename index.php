<?php
	/*
	 * Get this filename with a timestamp on the end, creating the file
	 * if it doesn't exist. This prevents caching problems.
	 */
	function get_time_filename($filename) {
		if (!file_exists($filename)) {
			throw new Exception('File does not exist [' . $filename . ']');
		}

		$timestamp = filemtime($filename);
		$time_filename = pathinfo($filename, PATHINFO_FILENAME) . '_' . $timestamp .
			'.' . pathinfo($filename, PATHINFO_EXTENSION);

		// Create the file if it doesn't exist.
		if (!file_exists($time_filename)) {
			copy($filename, $time_filename);
		}

		return $time_filename;
	}

	$indexjs_filename = get_time_filename('index.js');
	$json = file_get_contents('deadlines.json');
?>
<head>
	<title>ICS Deadlines</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet">
	<style>
		* {
			box-sizing: border-box;
		}
		
		html {
			font-family: 'Open Sans', sans-serif;
			background-color: #222;
			color: #bbb;
		}
		a {
			color: #59c;
			text-decoration: none;
		}
		
		.box {
			padding: 5px;
			overflow: auto;
			border-top: solid 2px #222;
			max-width: 600px;
			font-size: 0.9em;
		}

		.today {
			background-color: #373;
		}
		.weekend {
			background-color: #284828;
		}
		.due {
			background-color: #383838;
		}
		.duenow {
			background-color: #664400;
		}
		.overdue {
			background-color: #522;
		}
		
		.left {
			font-family: 'Share Tech Mono', monospace;	
		}
		.left > div {
			display: inline-block;
			padding: 3px; /* The font has very little padding. */
		}
		
		.deadlineLeft {
			font-family: 'Share Tech Mono', monospace;
			float: left;
			padding: 3px 0; /* The font has very little padding. */
			width: 110px;
			text-align: center;
		}
		
		.deadlineRight {
			margin-left: 110px;
		}
		
		#disclaimer {
			font-size: 0.8em;
			margin-bottom: 20px;
		}
		
		#made {
			font-size: 0.8em;
			margin-top: 50px;
		}
		#made > span {
			display: inline-block;
			position: relative;
			top: -12px;
			width: 0;
			font-size: 0.5em;
		}
		.notice {
			font-size: 0.8em;
			margin-top: 30px;
			font-weight: bold;
		}

		@media (min-width:768px) {
			.left {
				float: left;
				width: 80px;	
			}
			
			.right {
				margin-left: 80px;
			}
		}
	</style>
</head>
<div id="disclaimer">Disclaimer: Do not trust this information under any circumstances.</div>
<div id="main"></div>
<!--
<div id="complier" class="notice">The first four exercises for Complier Design don't have officially assigned deadlines, so their deadlines here are going to be the release date of the following exercise. <br/> Except Exercise 3 and 4. These ones you actually need to submit. </div>
-->
<div id="made">Made with love by JC and <span>mainly</span>Dave &lt;3</div>
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
<script src="<?=$indexjs_filename?>"></script>
<script>
	showDeadlines(<?=$json?>);
</script>
