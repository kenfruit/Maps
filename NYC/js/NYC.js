(function() {

		// Creating a map
	var xhr1 = null;
	var xhr2 = null;
	var map = null;
	var starbucksArray = [];
	var publicSpaceArray = [];
	var foodArray = [];
	var masterMapPinArray = [];
	var singleMapArray = [];

	var masterStationArray = [];
	var stationArray = [];
	var entranceArray = [];

	var showStarbucks = false;
	var showPublicSpace = false;
	var showSubways = false;
	var showMuseums = false;
	var showFood = false;
	
	//TEMP
	var showPlus = false;
	var pinCount = 0;
	
	var mgr = null;
	var row = 1;
	var col = 1;

	var lon = -74.01434;
	var lat = 40.70366;
	
    // How many maps to build
    var rowsToBuild = 20;
    var colsToBuild = 12;
    var dStep = 0.009;
    var dStepPin = 0.00525;
	
	var pinsLoaded = false;
	var subwayLoaded = false;
	
	var firstPinIndex = 0;

	var debuggingString = "";

	var entranceIcon = 'img/SubwayEntrance.png';
	var starbucksIcon = 'img/StarbucksLocation.png';
	var mcdonaldsIcon = 'img/McDonalds.png';
	
    var infoBubble;

	
		window.onload = function() {
	
		// Creating a map
		var options = { zoom: 16, center: new google.maps.LatLng(lat, lon), disableDefaultUI: true, mapTypeId: google.maps.MapTypeId.ROADMAP};
		map = new google.maps.Map(document.getElementById('map'), options);
		
		var arrowup = document.getElementById('arrowup');
		var arrowdown = document.getElementById('arrowdown');
		var arrowright = document.getElementById('arrowright');
		var arrowleft = document.getElementById('arrowleft');
		var plussign = document.getElementById('plussign');
		var starbucks = document.getElementById('starbucks');

		arrowup.onclick    = function() {arrowClick("u");};
		arrowdown.onclick  = function() {arrowClick("d");};
		arrowright.onclick = function() {arrowClick("r");};
		arrowleft.onclick  = function() {arrowClick("l");};
		//starbucks.onclick  = function() { showStarbucks = !showStarbucks; 
		//starbucks.src = (showStarbucks ? "img/StarbucksLogoDown.jpg" : "img/StarbucksLogo.jpg"); 
		//};
		
		//var first30Tag = document.getElementById('first30');
		//var second30Tag = document.getElementById('second30');
		//var third30Tag = document.getElementById('third30');
		var subwayTag = document.getElementById('subwaytoggle');
		var starbucksTag = document.getElementById('starbucks');
		var restaurantsTag = document.getElementById('other');

		//first30Tag.onclick    = function() {toggle("first30")};
		//second30Tag.onclick  = function()  {toggle("second30")};
		//third30Tag.onclick = function()  {toggle("third30")};
		subwayTag.onclick    = function() {toggle("subway")};
		starbucksTag.onclick = function()  {toggle("starbucks")};
		restaurantsTag.onclick  = function()  {toggle("restaurants")};
		plussign.onclick  = function() {toggle("plussign");};
		


		
		// Creating a new MarkerManager object
		mgr = new MarkerManager(map);

		google.maps.event.addListener(mgr, 'loaded', onLoaded);

		google.maps.event.addListener(map, 'bounds_changed', onBoundsChanged);

		google.maps.event.addListener(map, 'center_changed', onCenterChanged);
		
		google.maps.event.addListener(map, 'tilesloaded', onTilesLoaded);

		google.maps.event.addListener(map, 'click', onMouseClick);

		google.maps.event.addListener(map, 'idle', onIdle);
		
		loadXMLDoc1("http://kenandfranfruit.com/Maps/NYC/php/MapPins.php", handler1);
		
		loadXMLDoc2("http://kenandfranfruit.com/Maps/NYC/php/SubwayStationsTest-14.php", handler2);
		
		
		//initInfoBubble();
		infoBubble = new google.maps.InfoWindow();
		// infoBubble = new InfoBubble({
          // maxWidth: 250,
		  // minWidth: 200,
		  // maxHeight: 200,
		  // minHeight: 100
        //});

		
		
		

		};
		
		function onLoaded(){
			refreshMarkers();
			//console.log("loaded\n");
			debuggingString += "loaded<br/>"
		}
		
		function onTilesLoaded(){
			refreshMarkers();
			//console.log("tilesloaded\n");
			debuggingString += "tilesloaded<br/>"
		}
		
		function onMouseClick(){
			refreshMarkers();
			//console.log("click\n");
			debuggingString += "click<br/>"

		}
		
		function onBoundsChanged(){
			refreshMarkers();
			//console.log("boundschanged\n");
			debuggingString += "boundschanged<br/>"
		}

		function onCenterChanged(){
			refreshMarkers();
			//console.log("centerchanged\n");
			debuggingString += "centerchanged<br/>"
		}

		function onIdle(){
			refreshMarkers();
			//console.log("idle\n");
			debuggingString += "idle<br/>"
		}

	function loadXMLDoc1(dname, stateHandler){
		// instantiate XMLHttpRequest object
		try 
		{
			xhr1 = new XMLHttpRequest();
		} catch (e)
		{
			xhr1 = new ActiveXObject("Microsoft.XMLHTTP");
		}

		// handle old browsers
		if (xhr1 === null)
		{
			alert("Ajax not supported by your browser!");
			return;
		}

		// get quote
		xhr1.onreadystatechange = stateHandler;
		xhr1.open("GET", dname, true);
		xhr1.send(null);
	} 
	function toggle(toggleID)
	{
		switch(toggleID)
		{
			case 'first30':
				firstPinIndex = 0;
				rewriteRowCol(row, col)
				break;
			
			case 'second30':
				firstPinIndex = 30;
				rewriteRowCol(row, col)
				break;
			
			case 'third30':
				firstPinIndex = 60;
				rewriteRowCol(row, col)
				break;
			
			case 'subway':
				if(subwayLoaded)
				{
					showSubways = !showSubways;
				}
				break;
			
			case 'starbucks':
				showStarbucks = !showStarbucks;
				starbucks.src = (showStarbucks ? "img/StarbucksMcDonaldsComboDown.jpg" : "img/StarbucksMcDonaldsCombo.jpg");
				break;

			case 'publicspace':
				showPublicSpace = !showPublicSpace;
				//starbucks.src = (showStarbucks ? "img/StarbucksMcDonaldsComboDown.jpg" : "img/StarbucksMcDonaldsCombo.jpg");
				break;
			
			case 'restaurants':
				//alert("Other");
				showFood = !showFood;
				other.src = (showFood ? "img/EatDown.jpg" : "img/Eat.jpg");
				break;

			case 'plussign':
				//alert("Other");
				firstPinIndex += 30;
				if(pinCount < firstPinIndex)
				{
					firstPinIndex = 0;
				}
				break;

				
			default:
				alert("bad toggleID");
				showFood = !showFood;
				break;
		}
		refreshMarkers();
	}
	
	
	
 	function loadXMLDoc2(dname, stateHandler){
		// instantiate XMLHttpRequest object
		try 
		{
			xhr2 = new XMLHttpRequest();
		} catch (e)
		{
			xhr2 = new ActiveXObject("Microsoft.XMLHTTP");
		}

		// handle old browsers
		if (xhr2 === null)
		{
			alert("Ajax not supported by your browser!");
			return;
		}

		// get quote
		xhr2.onreadystatechange = stateHandler;
		xhr2.open("GET", dname, true);
		xhr2.send(null);
	}
	
	function MapPin(name, address, note, webpage, slat, slng, pinColor, pinText, type, subway, station)
	{
		this.name = name;
		this.address = address;
		this.note = note;
		this.webpage = webpage;
		this.slat = slat; 
		this.slng = slng; 
		this.pinColor = pinColor;
		this.pinText = pinText;
		this.type = type;
		this.subway = subway;
		this.station = station;
	}

	
	
	function StationPin(slat, slng, stationPin)
	{
		this.slat = slat;
		this.slng = slng;
		this.stationPin = stationPin;
	}

	
	
	
	
	function handler1()
	{
		if (xhr1.readyState===4 && xhr1.status===200)
		{
			pinsLoaded = true;
			if(0 != masterMapPinArray.length)
			{
				return;
			}

			var xmlDoc1 = xhr1.responseXML;

			mappinNodes = xmlDoc1.getElementsByTagName("mappin");
			var iLoopSize = mappinNodes.length;
			
			// Build the array with all the Point of Interest pins
			for ( var i=0; i < iLoopSize; i++) 
			{
				if(mappinNodes[i].nodeType !==1) 
				{
					continue;
				}
				name = mappinNodes[i].getAttribute("name"); 
				slat = mappinNodes[i].getAttribute("lat"); 
				slng = mappinNodes[i].getAttribute("lon"); 
				pinColor = mappinNodes[i].getAttribute("pincolor");
				address =  mappinNodes[i].getAttribute("address");
				note  =  mappinNodes[i].getAttribute("note");
				webpage = mappinNodes[i].getAttribute("webpage");
				type = mappinNodes[i].getAttribute("type");
				subway = mappinNodes[i].getAttribute("subway");
				station = mappinNodes[i].getAttribute("stop");
				pinText  = mappinNodes[i].getAttribute("pintext");
				masterMapPinArray.push(new MapPin(name, address, note, webpage, slat, slng, pinColor, pinText, type, subway, station));

			}
			refreshMarkers();
		}
	}
	function handler2()
	{
		if (xhr2.readyState===4 && xhr2.status===200)
		{
			var xmlDoc2 = xhr2.responseXML;

			var stationNodes = xmlDoc2.getElementsByTagName("station");
			
			// Build the master array for subway stops
			iLoopSize = stationNodes.length;
			for (var i=0; i < iLoopSize; i++) {
				if(stationNodes[i].nodeType !==1) {
					continue;
				}
				slat = stationNodes[i].getAttribute("lat"); 
				slng = stationNodes[i].getAttribute("lon"); 
				div = stationNodes[i].getAttribute("div"); 
				stationName = stationNodes[i].getAttribute("stationname"); 
				line = stationNodes[i].getAttribute("line"); 
				routes = stationNodes[i].getAttribute("routes");
				flyby = stationName + " " + routes;
				
				//for(k = 0; k < routes.length; k++) {
					//trainName = routes.charAt(k);
					trainName = routes.charAt(0);
					tempIcon = getIcon(trainName);
					pos = new google.maps.LatLng(slat,slng);
					masterStationArray.push(new StationPin(slat, slng, 
					new google.maps.Marker({icon:'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+
					tempIcon.text+'|'+tempIcon.color+'|'+tempIcon.fore, 
										position:pos ,
										title:routes}))); //break;
				//}
			}
			entranceNodes = xmlDoc2.getElementsByTagName("entrance");
			jLoopSize = entranceNodes.length;
			for (j=0; j < jLoopSize; j++) {
				 if(entranceNodes[j].nodeType !==1) {
					 continue;
				 }
				
				
				 elat = entranceNodes[j].getAttribute("lat"); 
				 elng = entranceNodes[j].getAttribute("lon"); 
				 entranceArray.push(new google.maps.Marker({position: new google.maps.LatLng(elat,elng),icon: entranceIcon}));
			 }

			 subwayLoaded = true;
		}
	}
// handle all the clicks of the arrow keys.
// recalculate the center and then call for redrawing the map
function arrowClick(direction)
{
	switch(direction)
	{
	case "u":
		row++;
		lat += dStep;
		break;
	case "d":
		if(1 === row)
		{
			return;
		}
		row--;
		lat -= dStep;
		break;

	case "r":
		col++;
		lon += dStep;
		break;

	case "l":
		if(1 === col)
		{
			return;
		}
		col--;
		lon -= dStep;
		break;
	}

	firstPinIndex = 0;
	map.setCenter(new google.maps.LatLng(lat, lon));
	rewriteRowCol(row, col);
	refreshMarkers();
}

	function getIndexIcon(trains)
	{
		var returnIcons = "";
		trains = trains.toLowerCase();
		if(0 < trains.length && "?" != trains.charAt(0))
		{
			for(var i = 0; i < trains.length; i++){
				returnIcons += "<img src='img/" + trains.charAt(i) + "_shad_s.jpg' />";
			}
		}
		return returnIcons;
	}

	
	function getBubbleStationIcons(combinedStationList)
	{
		var stationList = combinedStationList.split("|");
		returnString = "";
		for(var i = 0; i < stationList.length; i++)
		{
			minusSignPosition = stationList[i].indexOf("-")
			stationSubstring = stationList[i].substr(0,minusSignPosition);
			returnString += getIndexIcon(stationSubstring)

			returnString += " -- " + stationList[i].substr(minusSignPosition+1) + "<br/>";
		}
		
		return returnString;
	}
	
	

	function getIcon( train) {
		var returnIcon = null;
		textColor = "FFFFFF";

		switch(train.toString()) {
		case "H": train="A"; case "A": case "C": case "E": 
			pinColor = "6060FF";
			break;

		case "1": case "2": case "3":
			pinColor = "FF3030";
			break;

		case "4": case "5": case "6":
			pinColor = "009D36";
			break;


		case "N": case "Q": case "R":
			pinColor = "FFFF00";
			textColor = "000000";
			break;

		case "S": case "L":
			pinColor = "9A9A9A";
			break;

		case "J": case "Z":
			pinColor = "9A6600";
			break;
	
		case "B": case "D": case "F": case "M":
			pinColor = "FF9A00";
			break;

		case "G":
			pinColor = "9ACA00";
			break;

		case "7":
			pinColor = "CD00C6";
			break;


		default:
			pinColor = "000000";
			break;
		}

		return new StyledIcon(StyledIconTypes.MARKER,{color:pinColor,fore:textColor,text:train});
	}

	// Handle redrawing the markers.
	// Check to see if markers are turn off or on
	function refreshMarkers(){
		// Build the map pins.

		if(!pinsLoaded)
		{
			return;
		}
			
		var counter = 1;
		var foodCounter = 1;
		var indexTxt = "<b>R" + row + "C" + col + "</b><br /><br />";
		var indexTxtFood = "<b>R" + row + "C" + col + "</b><br /><br />";
		var indexTxtStar = "<b>R" + row + "C" + col + "</b><br /><br />";
		
		
		
		// Clear the last set of map pins
		while(0 != singleMapArray.length)
		{
			singleMapArray.pop();
		}
		while(0 != starbucksArray.length)
		{
			starbucksArray.pop();
		}		
		
		while(0 != publicSpaceArray.length)
		{
			publicSpaceArray.pop();
		}		
		
		while(0 != foodArray.length)
		{
			foodArray.pop();
		}		
		
		while(0 != stationArray.length)
		{
			stationArray.pop();
		}				
		
		mapBounds = map.getBounds();
		
		var textColor = "000000";

		// Walk the master list and build the pins for the current segment
		for( var pin = 0; pin < masterMapPinArray.length; pin++)
		{
			var tempPin = masterMapPinArray[pin];
			var pinLatLng = new google.maps.LatLng(tempPin.slat, tempPin.slng);
		
			if(mapBounds.contains(pinLatLng))
			{
				if(tempPin.type === "star")
				{
					starbucksArray.push(new google.maps.Marker({position:pinLatLng, icon:starbucksIcon}));
				}
				else if(tempPin.type === "publicspace")
				{
					publicSpaceArray.push(new google.maps.Marker({position:pinLatLng, icon:starbucksIcon}));
				}
				else if(tempPin.type === "restaurant")
				{
					tempPin.pinNumber = foodCounter.toString();
					var textColor = "000000";
					if(firstPinIndex < foodCounter && foodCounter < firstPinIndex+31)
					{
						if(tempPin.webpage != null)
						{
							indexTxtFood += tempPin.pinNumber + " ";
							indexTxtFood += "<a href=\"" + tempPin.webpage+ "\" target=\"_blank\">";
							indexTxtFood += tempPin.name;
							
						if(tempPin.note != null)
						{
							if(tempPin.note != "")
							{
								indexTxtFood += " -- " + tempPin.note;
							}
						}							
							indexTxtFood += "</a>";
						}
						else
						{
							indexTxtFood += tempPin.pinNumber + " " + tempPin.name;
						}
						
						if(showSubways && tempPin.subway != null && tempPin.subway != "???")
						{
							indexTxtFood += " -- " +   getIndexIcon(tempPin.subway);
						}
						indexTxtFood += "<br />";
						//foodArray.push(new StyledMarker({styleIcon: new StyledIcon(StyledIconTypes.MARKER,
						//	{color:tempPin.pinColor, fore:textColor, text:tempPin.pinNumber}),
						//	position:pinLatLng, title:tempPin.name}));
							
						//var newMarkerFood = new StyledMarker({styleIcon: new StyledIcon(StyledIconTypes.MARKER,
						//	{color:tempPin.pinColor, fore:textColor, text:tempPin.pinNumber}),
						//	position:pinLatLng, title:tempPin.name})
							
						var newMarkerFood = new google.maps.Marker({ position: pinLatLng, 
																	 title: 'Pin1', 
																	 icon: 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+tempPin.pinNumber+'|'+tempPin.pinColor+'|000000'
																	});
							
						
							
							google.maps.event.addListener(newMarkerFood, 'click', (function(newMarkerFood, pin) {
									return function() {
									  stationIcons = getBubbleStationIcons(masterMapPinArray[pin].station);
									  bubbleText = masterMapPinArray[pin].pinText+ "<br/>" + stationIcons;
									  infoBubble.setContent(bubbleText);
									  infoBubble.open(map, newMarkerFood);
									}
								  })(newMarkerFood, pin));
									
									
						foodArray.push(newMarkerFood);
							
					}
					foodCounter++;

				}
				else if(tempPin.type === "mcd")
				{
					starbucksArray.push(new google.maps.Marker({position:pinLatLng, icon:mcdonaldsIcon}));
				}
				else
				{
					tempPin.pinNumber = counter.toString();
					
					// If we are zoomed out and the number goes to three (or 4) digits, use the rightmost 2
					if(2 <tempPin.pinNumber.length)
					{
						textLength = tempPin.pinNumber.length;
						tempPin.pinNumber = tempPin.pinNumber.slice(textLength-2);
					}
					
					
					if(firstPinIndex < counter && counter < firstPinIndex+31)
					{
						// Build an index item
						// This trip gets BOLD
						if(tempPin.type === "thistrip")
						{
							indexTxt += "<b>";
						}
						// Add the name of the pin
						if(tempPin.webpage != null)
						{
							indexTxt += tempPin.pinNumber + " ";
							indexTxt += "<a href=\"" + tempPin.webpage+ "\" target=\"_blank\">";
							indexTxt += tempPin.name;
							indexTxt += "</a>";
						}
						else
						{
							indexTxt += tempPin.pinNumber + " " + tempPin.name;
						}

						// Add the note for the pin
						if(tempPin.note != null)
						{
							//"Best Thing" gets BOLD
							if(tempPin.type === "bestthing")
							{
								indexTxt += "<b>";
							}
							if(tempPin.note != "")
							{
								indexTxt += " -- " + tempPin.note;
							}
							if(tempPin.type === "bestthing")
							{
								indexTxt += "</b>";
							}
						}
						

						// Add the subway stop icons
						if(showSubways && tempPin.subway != null && tempPin.subway != "???")
						{
							indexTxt += " -- " +   getIndexIcon(tempPin.subway);
						}

						
						indexTxt += "<br />";

						if(tempPin.type === "thistrip")
						{
							indexTxt += "</b>";
						}
						
						// Make a marker and save it
						//var newMarker = new StyledMarker({styleIcon: new StyledIcon(StyledIconTypes.MARKER,
						//	{color:tempPin.pinColor, fore:textColor, text:tempPin.pinNumber}),
						//	position:pinLatLng, title:tempPin.name})
						
						var newMarker = new google.maps.Marker({ position: pinLatLng, 
																 title:tempPin.name, 
																 icon: 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+tempPin.pinNumber+'|'+tempPin.pinColor+'|000000'
																});

							google.maps.event.addListener(newMarker, 'click', (function(newMarker, pin) {
									return function() {
									  stationIcons = getBubbleStationIcons(masterMapPinArray[pin].station);
									  bubbleText = masterMapPinArray[pin].pinText+ "<br/>" + stationIcons;
									  infoBubble.setContent(bubbleText);
									  infoBubble.open(map, newMarker);
									}
								  })(newMarker, pin));
									
									
									
						singleMapArray.push(newMarker);
					}
					counter++;
				}
			}
		}
		pinCount = counter;
		
		for(var pin = 0; pin < masterStationArray.length; pin++)
		{
			var tempPin = masterStationArray[pin];
			var pinLatLng = new google.maps.LatLng(tempPin.slat, tempPin.slng);
			if(mapBounds.contains(pinLatLng))
			{
				stationArray.push(masterStationArray[pin].stationPin);
			}
		}
		
		//latlngNE = document.getElementById('latlngNE');
		//latlngNE.innerHTML = mapBounds.getNorthEast().lat() + "  " + mapBounds.getNorthEast().lng();
		
		//latlngSW = document.getElementById('latlngSW');
		//latlngSW.innerHTML = mapBounds.getSouthWest().lat() + "  " + mapBounds.getSouthWest().lng();
		//cornerPinLatLng = mapBounds.getNorthEast();
		
		//singleMapArray.push(new StyledMarker({styleIcon: new StyledIcon(StyledIconTypes.MARKER,
		//				{color:"FFFFFF"}),
		//				position:cornerPinLatLng}));
		
		
		var index = document.getElementById('mapindex');

		mgr.clearMarkers(); 

		if(showSubways)
		{
			mgr.addMarkers(stationArray,10);
			mgr.addMarkers(entranceArray, 17);
		}
		if(showStarbucks)
		{
			mgr.addMarkers(starbucksArray,10);
		}
		if(showPublicSpace)
		{
			mgr.addMarkers(publicSpaceArray,10);
		}
		if(showFood)
		{
			mgr.addMarkers(foodArray,10);
			index.innerHTML = indexTxtFood;
		}
		else
		{
			mgr.addMarkers(singleMapArray, 10);
			// Debugging
			//indexTxt += debuggingString;
			//var markerCount = mgr.getMarkerCount(10);
			
			//indexTxt += "<br />Debugging: MarkerCount at refresh time =" + markerCount + "<br />";
			//End debugging
			
			index.innerHTML = indexTxt;
		}
		
		mgr.refresh();
	}
	function rewriteRowCol(row, col)
	{
		var rowCol = "R"+row+"C"+col;
		if(0 != firstPinIndex)
		{
			rowCol += "      p. "+(firstPinIndex/30+1);
		}
		var rcHeader = document.getElementById('rowcol');
		rcHeader.innerHTML = rowCol;
	}
	

      function initInfoBubble() {
        infoBubble = new InfoBubble({
          maxWidth: 200,
		  minWidth: 200,
		  maxHeight: 100,
		  minHeight: 100
        });


      }
})();

