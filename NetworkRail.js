<!DOCTYPE html>
<html>
  <head>

    <meta charset="utf-8">
	<link rel="preconnect" href="https://fonts.gstatic.com">
	<link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
	https://kit.fontawesome.com/##yourfontawsomekeyhere##
 	<title>NR Departure Board 1.1.4 (C) R.Farnworth 2021</title>

   </head>
<style>
	t1 {font-family: 'Open Sans';
	   width: 354px;
	   display: inline-block;
	   color: rgb(255,255,255);
	   background-color: rgb(0,0,0);
	   font-size: 14px; 
	   sans-serif ;}
	p1 {font-family: 'DotGothic16';
	   width: 50px;
	   display: inline-block;
	   color: rgb(255,153,0);
	   background-color: rgb(0,0,0);
	   font-size: 16px; 
	   sans-serif ;}
	p2 {font-family: 'DotGothic16';
	   width: 189px;
	   display: inline-block;
	   color: rgb(255,153,0);
	   background-color: rgb(0,0,0);
	   font-size: 16px;
	   sans-serif ;}
	p3 {font-family: 'DotGothic16';
	   width: 80px;
	   display: inline-block;
	   color: rgb(255,153,0);
	   background-color: rgb(0,0,0);
	   font-size: 16px; 
	   sans-serif ;}
	p4 {font-family: 'DotGothic16';
	   width: 35px;
	   display: inline-block;
	   color: rgb(255,153,0);
	   background-color: rgb(0,0,0);
	   font-size: 16px; 
	   sans-serif ;}
   .marquee {
	    font-family: 'DotGothic16';
 	    font-size: 16px;
	    display: inline-block;
	    width: 354px;
            height: 25px;
	    padding: 0px;
	    margin: 0px;
            position: relative;
	    overflow: hidden;
            background: rgb(0,0,0);
            color: rgb(255,255,255);
            border: 0px solid gray;
        }
        
        .marquee p {
            position: absolute;
	    display: inline-block;
            width: 354px;
            height: 25px;
            margin: 0px;
	    white-space: nowrap;
            line-height: 25px;
            text-align: left;
            -moz-transform: translateX(100%);
            -webkit-transform: translateX(100%);
            transform: translateX(100%);
            -moz-animation: scroll-left 4s linear infinite;
            -webkit-animation: scroll-left 4s linear infinite;
            animation: scroll-left 30s linear infinite;
        }
        
        @-moz-keyframes scroll-left {
            0% {
                -moz-transform: translateX(100%);
            }
            100% {
                -moz-transform: translateX(-100%);
            }
        }
        
        @-webkit-keyframes scroll-left {
            0% {
                -webkit-transform: translateX(100%);
            }
            100% {
                -webkit-transform: translateX(-100%);
            }
        }
        
        @keyframes scroll-left {
            0% {
                -moz-transform: translateX(100%);
                -webkit-transform: translateX(100%);
                transform: translateX(100%);
            }
            100% {
                -moz-transform: translateX(-200%);
                -webkit-transform: translateX(-200%);
                transform: translateX(-200%);
            }
        }
	body {
	   overflow: hidden;
	     }
</style>

<body>
	<!-- Display -->
	<t1 id="t_title"></t1><br>
	<p1 id="d_displayline0a"></p1><p2 id="d_displayline0b"></p2><p3 id="d_displayline0c"></p3><p4 id="d_displayline0d"></p4><br>
	<p1 id="d_displayline1a"></p1><p2 id="d_displayline1b"></p2><p3 id="d_displayline1c"></p3><p4 id="d_displayline1d"></p4><br>
	<p1 id="d_displayline2a"></p1><p2 id="d_displayline2b"></p2><p3 id="d_displayline2c"></p3><p4 id="d_displayline2d"></p4><br>
	<p1 id="d_displayline3a"></p1><p2 id="d_displayline3b"></p2><p3 id="d_displayline3c"></p3><p4 id="d_displayline3d"></p4><br>
	<p1 id="d_displayline4a"></p1><p2 id="d_displayline4b"></p2><p3 id="d_displayline4c"></p3><p4 id="d_displayline4d"></p4><br>
	<div class="marquee">
        	<p id="d_displaynrccmsgtext"> </p>
	</div>

<script>
	//  Version 1.1.4 (prod) of NR Departure Board widget 
	// (C) R.Farnworth 2021
	// 1.1.4 Remove erroneous characters in NRCC messages causing multiple messages to overlap
	// 1.1.3 Have a marquee scroll of incident/warning messages appropriate to the line 
	// 1.1.2 Resize to 354pixel wide to make a 1/3 of screen widget and stop scroll bars to allow resizing to show fewer trains
	// 1.1.1 Check for "No trains" to prevent widget crashing 
	// 1.1.0 Allow widget to reverse journey at 1300hrs
	//	 Add API Datasaver code (between 0000 and 0600) to save API cost
	// 1.0.2 Fix null in due time; fix no platform for cancelled
	// 1.0.1 Fix some issues with widths. Fix revised time display
	// 1.0   Initial Release
	// Max number of trains to show is five
	// Timer is: 120,000 = 1000 x 60 x 2 (1000ms x 60 seconds x 2 mins = 2mins)

	myMain();
	var myTimer = setInterval(myMain, 120000);

	function myMain() {

		const v_stationA = "RDG";			// Start Station
		const v_stationA_desc = "Reading";		// Start Station description
		const v_stationB = "PAD";			// End Station
		const v_stationB_desc = "Paddington";		// End Station description
		const v_tocfilter = "";				// Train operator filter 
		const v_reverseday = "Y";			// Reverse the journey in the middle of the day
		const v_apisaver = "ON";			// if ON - Don't make API calls at night

		var v_hournow = new Date();
		var v_to = "";
		var v_from = "";
		var v_heading = "";
		v_hournow = v_hournow.getHours();  // Use for reverse journey switch and also API saver code
		
		if (v_reverseday == "Y") {
			if (v_hournow < 13) {
				v_from = v_stationA;
				v_to = v_stationB;
				v_heading = "Departures from " + v_stationA_desc + " to " + v_stationB_desc + " (Out)";
			} else {
				v_from = v_stationB;
				v_to = v_stationA;
				v_heading = "Departures from " + v_stationB_desc + " to " + v_stationA_desc + " (Ret)";
			}
		} else {
			v_from = v_stationA;
			v_to = v_stationB;
			v_heading = "Departures from " + v_stationA_desc + " to " +v_stationB_desc;
		}
		//Trap title overflow
		if (v_heading.length > 50) {
			v_heading = v_heading.substring(0,50);
		}

		// Clear out the five rows of departures so that late at night you aren't left with departed trains
		// And fill with spaces so that all five rows are always displayed
		var v_clear = 0;
		while (v_clear < 5) {
			document.getElementById("d_displayline" + v_clear + "a").innerHTML = "&nbsp";
			document.getElementById("d_displayline" + v_clear + "b").innerHTML = "&nbsp";
			document.getElementById("d_displayline" + v_clear + "c").innerHTML = "&nbsp";
			document.getElementById("d_displayline" + v_clear + "d").innerHTML = "&nbsp";
			v_clear = v_clear + 1;
		}

		const url_apitoken = "##youraccesstokenhere##";
		const url_core = "https://huxley.apphb.com/fast/"+v_from+"/to/"+v_to+"/10?accessToken="+url_apitoken;

		// Main code to make API call, wait for a response and then process
		if (v_apisaver == "ON" && (v_hournow >= 0 && v_hournow <= 6 )) {
			document.getElementById("t_title").innerHTML = v_heading;
			document.getElementById("d_displayline0a").innerHTML = "&nbsp";
			document.getElementById("d_displayline0b").innerHTML = "API saver is currently on";
			document.getElementById("d_displayline0c").innerHTML = "&nbsp";
			document.getElementById("d_displayline0d").innerHTML = "&nbsp";
		} else {
			let arr_traindata = [];
			let arr_trainmsg = [];
			let requestURL = url_core;
	    		let request = new XMLHttpRequest();
		    	request.open('GET', requestURL);
		    	request.responseType = 'json';
	    		request.send();

			request.onload = function() {
			      	const v_lineid = request.response;

				// Trap if: a) there are no trains running b) the station codes dont give a direct route (widget will crash otherwise)
				if (v_lineid.trainServices == null) {
					document.getElementById("t_title").innerHTML = v_heading;
					document.getElementById("d_displayline0b").innerHTML = "There are either:";
					document.getElementById("d_displayline1b").innerHTML = "No trains in the next";
					document.getElementById("d_displayline1c").innerHTML = "2 hrs";
					document.getElementById("d_displayline2b").innerHTML = "No trains currently";
					document.getElementById("d_displayline2c").innerHTML = "running";
					document.getElementById("d_displayline3b").innerHTML = "No direct routes";
					document.getElementById("d_displayline3c").innerHTML = "available";
				} else {

					const v_lineidelements = v_lineid.trainServices.length;
					var v_scanjson = 0;
					var v_validelements = 0;
		
					while (v_scanjson < v_lineidelements) {
						v_split_std = v_lineid.trainServices[v_scanjson].std;
						v_split_etd = v_lineid.trainServices[v_scanjson].etd;
						v_split_dest = v_lineid.trainServices[v_scanjson].destination[0].locationName;
						v_split_dest = v_split_dest.substring(0,23);
						v_split_origin = v_lineid.trainServices[v_scanjson].origin[0].locationName;
						v_split_plat = v_lineid.trainServices[v_scanjson].platform;
						v_split_toc = v_lineid.trainServices[v_scanjson].operatorCode;

						//Modify data based on content - Delays, cancellation and platform 
						if (v_split_plat == null && v_split_etd != "Cancelled") {
							v_split_plat = "Wait";
						}
						if (v_split_plat == null) {
							v_split_plat = "&nbsp"; //force a space for blank
						}
						if (v_split_etd !="Cancelled" && v_split_etd !="Delayed" && v_split_etd !="On time" && v_split_etd != null) {
							v_split_etd = "Now " + v_split_etd;
						}
						if (v_split_etd == null) {
							v_split_etd = "No Info";
						}
	
						//filter out to one ToC if the filter is on - e.g. Used to get rid of ElizabethLine errors on GWestern//
						if ((v_tocfilter == v_split_toc) || (v_tocfilter == "")) {
							arr_traindata.push([v_split_std, v_split_etd, v_split_dest, v_split_origin, v_split_plat, v_split_toc]);
							v_validelements = v_validelements + 1;
						}
						v_scanjson = v_scanjson + 1;
					}

					var v_scanjson = 0;
					while ((v_scanjson < v_validelements) && (v_scanjson < 5)) {
						document.getElementById("d_displayline" + v_scanjson + "a").innerHTML = arr_traindata[v_scanjson][0];
						document.getElementById("d_displayline" + v_scanjson + "b").innerHTML = arr_traindata[v_scanjson][2];
						document.getElementById("d_displayline" + v_scanjson + "c").innerHTML = arr_traindata[v_scanjson][1];
						document.getElementById("d_displayline" + v_scanjson + "d").innerHTML = arr_traindata[v_scanjson][4];
						v_scanjson = v_scanjson + 1;
					}
					document.getElementById("t_title").innerHTML = v_heading;

					// Get the National Control Centre messages appropriate to the train timetable/direction
					//
					if (v_lineid.nrccMessages == null) {
						v_nrccmessages = "There are no service status messages";
					} else {
						const v_lineidmsgs = v_lineid.nrccMessages.length;
						var v_scanjson = 0;
						var v_validelements = 0;
						var v_nrccmessages = "";
						while (v_scanjson < v_lineidmsgs) {
							v_message = v_lineid.nrccMessages[v_scanjson].value;
							v_message = v_message.replace("<p>","");
							v_message = v_message.replace("</p>","");
							arr_trainmsg.push([v_scanjson,v_message]);
							v_nrccmessages = v_nrccmessages + " " + v_message;
							v_validelements = v_validelements + 1;
							v_scanjson = v_scanjson + 1;
						}
					}
					document.getElementById("d_displaynrccmsgtext").innerHTML = v_nrccmessages;
				}
			}
		}
	}

    </script>
  </body>
</html>
