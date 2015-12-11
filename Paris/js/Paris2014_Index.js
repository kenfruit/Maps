(function() {

		// Creating a map
	var thisMap = null;
	var xhr1 = null;
	var masterMapPinArray = [];

	var lonStart = 2.230570;
	var latStart = 48.81054;
	
    // How many maps to build
    var rowsToBuild = 11;
    var colsToBuild = 21;
    var dStep = 0.009;
    var dStepPin = 0.00525;

	var indexTxt = "";

	//-20
		window.onload = function() {
			var options = { zoom: 16, center: new google.maps.LatLng(latStart, lonStart), disableDefaultUI: true, mapTypeId: google.maps.MapTypeId.ROADMAP};
			thisMap = new google.maps.Map(document.getElementById('map'), options);
			loadXMLDoc1("http://kenandfranfruit.com/Maps/Paris/php/MapPins2012.php", handler1);
		};
		
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


	function MapPin(name, address, slat, slng, pinColor, pinText, type)
	{
		this.name = name;
		this.address = address;
		this.slat = slat; 
		this.slng = slng; 
		this.pinColor = pinColor;
		this.pinText = pinText;
		this.type = type;
	}

	function handler1()
	{
		if (xhr1.readyState===4 && xhr1.status===200)
		{
			handlerCommon();
		}
	}

	function handlerCommon()
	{
		if(0 != masterMapPinArray.length)
		{
			return;
		}

		var xmlDoc1 = xhr1.responseXML;

		mappinNodes = xmlDoc1.getElementsByTagName("mappin");
		var iLoopSize = mappinNodes.length;
		
		// Build the array with all the Point of Interest pins
		for (i=0; i < iLoopSize; i++) 
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
			type = mappinNodes[i].getAttribute("type");

			pinText  = ""; //i.toString();
			masterMapPinArray.push(new MapPin(name, address, slat, slng, pinColor, pinText, type));
		}
		BuildIndex();
	}

function BuildIndex()
{
	lat = latStart;
	for(row = 0; row < rowsToBuild; row++)
	{
		lon = lonStart;
		for(col = 0; col < colsToBuild; col++)
		{
			thisMap.setCenter(new google.maps.LatLng(lat, lon));
			BuildPageIndex(row +1, col+1);
			lon += dStep;
		}
		lat += dStep;
	}

	index = document.getElementById('mapindex');
	index.innerHTML = indexTxt;
}

	// Handle redrawing the markers.
	// Check to see if markers are turn off or on
	function BuildPageIndex(row, col){
		// Build the map pins.
		rowCol = "R" + row + "C" + col;
		counter = 1;

		mapBounds = thisMap.getBounds();

		// Walk the master list and build the pins for the current segment
		for(pin = 0; pin < masterMapPinArray.length; pin++)
		{
			tempPin = masterMapPinArray[pin];
			pinLatLng = new google.maps.LatLng(tempPin.slat, tempPin.slng);
			if(tempPin.type.toUpperCase() == "STARBUCKS" ||
				tempPin.type.toUpperCase() === "WC" ||
				tempPin.type.toUpperCase() == "RESTAURANT" ||
    			tempPin.type.toUpperCase() == "BISTRO" ||
    			tempPin.type.toUpperCase() == "CAFE" ||
    			tempPin.type.toUpperCase() == "PARK" ||
    			tempPin.type.toUpperCase() == "GARDEN" ||
    			tempPin.type.toUpperCase() == "SQUARE" ||
    			tempPin.type.toUpperCase() == "BOULANGER" ||
    			tempPin.type.toUpperCase() == "BRASSERIE" ||
    			tempPin.type.toUpperCase() == "MCD" ||
    			tempPin.type.toUpperCase() == "WIFI" ||
    			tempPin.type.toUpperCase() == "WALLACE")
			{
				continue;
			}
			
			
			if(mapBounds.contains(pinLatLng))
			{
				tempPin.pinText = counter.toString();
				if(tempPin.type == "thistime")
				{
					indexTxt += "<b>";
				}
				indexTxt += tempPin.name + "  -- " + tempPin.address + "     " +rowCol + "-" + tempPin.pinText + "<br />";
				if(tempPin.type == "thistime")
				{
					indexTxt += "</b>";
				}
				counter++;
			}
		}
		
		

	}

})();

