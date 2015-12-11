(function() {

		// Creating a map
	var xhr1 = null;
	var xhr2 = null;
	var map = null;
	var starbucksArray = [];
	var foodArray = [];
	var masterMapPinArray = [];
	var singleMapArray = [];

	var masterStationArray = [];
	var stationArray = [];
	var entranceArray = [];

	var showStarbucks = false;
	var showSubways = false;
	var showMuseums = false;
	var showFood = false;
	var showArrondissement = false;
	
	//TEMP
	var showPlus = false;
	var pinCount = 0;
	
	var mgr = null;
	var row = 6;
	var col = 14;
	//48.85554, 2.34757 - Cite Metro Stop
	var lon = 2.34757;
	var lat = 48.85554;
	
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
	
	var metro1Icon = 'img/pa_metro_ligne_1.jpg';
	var metro2Icon = 'img/pa_metro_ligne_2.jpg';
	var metro3Icon = 'img/pa_metro_ligne_3.jpg';
	var metro4Icon = 'img/pa_metro_ligne_4.jpg';
	var metro5Icon = 'img/pa_metro_ligne_5.jpg';
	var metro6Icon = 'img/pa_metro_ligne_6.jpg';
	var metro7Icon = 'img/pa_metro_ligne_7.jpg';
	var metro8Icon = 'img/pa_metro_ligne_8.jpg';
	var metro9Icon = 'img/pa_metro_ligne_9.jpg';
	var metro1oIcon = 'img/pa_metro_ligne_10.jpg';
	var metro11Icon = 'img/pa_metro_ligne_11.jpg';
	var metro12Icon = 'img/pa_metro_ligne_12.jpg';
	var metro13Icon = 'img/pa_metro_ligne_13.jpg';
	var metro14Icon = 'img/pa_metro_ligne_14.jpg';

	var marketStreet;

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
	starbucksTag.onclick = function()  {toggle("starbucks"); toggle("arrondissement");};
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
	
	loadXMLDoc1("./php/MapPins2012.php", handler1);
	
	loadXMLDoc2("./php/MetroStations.php", handler2);
	
	
	//initInfoBubble();
	infoBubble = new google.maps.InfoWindow();
	// infoBubble = new InfoBubble({
      // maxWidth: 250,
	  // minWidth: 200,
	  // maxHeight: 200,
	  // minHeight: 100
    //});

	// Draw the arrondissement
	// Creating an array that will contain the points for the polyline
	var arr1 = [
		new google.maps.LatLng(48.863022,2.319703),new google.maps.LatLng(48.869122,2.323980),new google.maps.LatLng(48.869801,2.327970),new google.maps.LatLng(48.868221,2.330080),
		new google.maps.LatLng(48.863312,2.350590),new google.maps.LatLng(48.856831,2.346820),new google.maps.LatLng(48.854099,2.344208),new google.maps.LatLng(48.856274,2.340946),
		new google.maps.LatLng(48.857941,2.338071),new google.maps.LatLng(48.858574,2.335560),new google.maps.LatLng(48.858971,2.333050),new google.maps.LatLng(48.859776,2.330067),
		new google.maps.LatLng(48.863007,2.319725)
		];

	var arr2 = [
		new google.maps.LatLng(48.869839,2.328436),new google.maps.LatLng(48.871807,2.339737),new google.maps.LatLng(48.870712,2.346847),new google.maps.LatLng(48.870529,2.348049),
		new google.maps.LatLng(48.869247,2.354035),new google.maps.LatLng(48.863487,2.350752),new google.maps.LatLng(48.868366,2.330339),new google.maps.LatLng(48.869839,2.328351)
		];

	var arr3 = [
		new google.maps.LatLng(48.869179,2.354354),new google.maps.LatLng(48.868645,2.356864),new google.maps.LatLng(48.868347,2.358903),new google.maps.LatLng(48.867840,2.362357),
		new google.maps.LatLng(48.867374,2.363001),new google.maps.LatLng(48.866299,2.364117),new google.maps.LatLng(48.865253,2.365211),new google.maps.LatLng(48.863125,2.366370),
		new google.maps.LatLng(48.855911,2.368237),new google.maps.LatLng(48.856560,2.364525),new google.maps.LatLng(48.856968,2.363065),new google.maps.LatLng(48.857323,2.361950),
		new google.maps.LatLng(48.858368,2.359546),new google.maps.LatLng(48.858677,2.358989),new google.maps.LatLng(48.860104,2.357100),new google.maps.LatLng(48.861259,2.353667),
		new google.maps.LatLng(48.862022,2.350384),new google.maps.LatLng(48.869179,2.354354)
		];
		
	var arr4 = [
		new google.maps.LatLng(48.861820,2.350290),new google.maps.LatLng(48.861172,2.353210),new google.maps.LatLng(48.860039,2.356620),new google.maps.LatLng(48.858711,2.358510),
		new google.maps.LatLng(48.858189,2.359390),new google.maps.LatLng(48.857231,2.361540),new google.maps.LatLng(48.856441,2.364090),new google.maps.LatLng(48.855930,2.366690),
		new google.maps.LatLng(48.855709,2.368360),new google.maps.LatLng(48.852791,2.368770),new google.maps.LatLng(48.852051,2.368100),new google.maps.LatLng(48.847408,2.365890),
		new google.maps.LatLng(48.847191,2.366130),new google.maps.LatLng(48.844963,2.365065),new google.maps.LatLng(48.846573,2.362833),new google.maps.LatLng(48.847321,2.361975),
		new google.maps.LatLng(48.848015,2.360837),new google.maps.LatLng(48.848679,2.359807),new google.maps.LatLng(48.849297,2.358971),new google.maps.LatLng(48.849285,2.359014),
		new google.maps.LatLng(48.849819,2.357233),new google.maps.LatLng(48.850624,2.354851),new google.maps.LatLng(48.851486,2.351654),new google.maps.LatLng(48.852036,2.350130),
		new google.maps.LatLng(48.853252,2.347169),new google.maps.LatLng(48.853985,2.344766),new google.maps.LatLng(48.857231,2.347720),new google.maps.LatLng(48.859909,2.349130),
		new google.maps.LatLng(48.861820,2.350290)
		];

	var arr5 = [
		new google.maps.LatLng(48.853821,2.344655),new google.maps.LatLng(48.853271,2.346736),new google.maps.LatLng(48.851406,2.351221),new google.maps.LatLng(48.851139,2.352744),
		new google.maps.LatLng(48.850361,2.354997),new google.maps.LatLng(48.849670,2.357143),new google.maps.LatLng(48.849049,2.359010),new google.maps.LatLng(48.848312,2.360083),
		new google.maps.LatLng(48.847256,2.361799),new google.maps.LatLng(48.845009,2.364568),new google.maps.LatLng(48.844685,2.365190),new google.maps.LatLng(48.843979,2.364396),
		new google.maps.LatLng(48.841297,2.362443),new google.maps.LatLng(48.840080,2.361606),new google.maps.LatLng(48.837078,2.351968),new google.maps.LatLng(48.837246,2.349265),
		new google.maps.LatLng(48.837475,2.347462),new google.maps.LatLng(48.839809,2.336869),new google.maps.LatLng(48.842434,2.338457),new google.maps.LatLng(48.846165,2.340474),
		new google.maps.LatLng(48.853821,2.344655)
		];

	var arr6 = [
		new google.maps.LatLng(48.853931,2.344183),new google.maps.LatLng(48.841099,2.337123),new google.maps.LatLng(48.839897,2.336329),new google.maps.LatLng(48.841721,2.330836),
		new google.maps.LatLng(48.844215,2.323287),new google.maps.LatLng(48.845261,2.320197),new google.maps.LatLng(48.846851,2.317164),new google.maps.LatLng(48.850971,2.326562),
		new google.maps.LatLng(48.851425,2.327206),new google.maps.LatLng(48.851849,2.328665),new google.maps.LatLng(48.852638,2.329395),new google.maps.LatLng(48.854248,2.330425),
		new google.maps.LatLng(48.856167,2.331669),new google.maps.LatLng(48.858032,2.333257),new google.maps.LatLng(48.858711,2.333515),new google.maps.LatLng(48.858398,2.335746),
		new google.maps.LatLng(48.858006,2.337162),new google.maps.LatLng(48.857609,2.338493),new google.maps.LatLng(48.856480,2.340338),new google.maps.LatLng(48.855320,2.342012),
		new google.maps.LatLng(48.854279,2.343729),new google.maps.LatLng(48.853931,2.344183)
		];

	var arr7 = [
		new google.maps.LatLng(48.858738,2.333043),new google.maps.LatLng(48.857864,2.332399),new google.maps.LatLng(48.854786,2.330210),new google.maps.LatLng(48.852016,2.328451),
		new google.maps.LatLng(48.851765,2.326992),new google.maps.LatLng(48.851200,2.325876),new google.maps.LatLng(48.847095,2.316978),new google.maps.LatLng(48.846172,2.313902),
		new google.maps.LatLng(48.848179,2.310812),new google.maps.LatLng(48.847279,2.307386),new google.maps.LatLng(48.847832,2.306550),new google.maps.LatLng(48.858059,2.290385),
		new google.maps.LatLng(48.860489,2.293603),new google.maps.LatLng(48.861645,2.295535),new google.maps.LatLng(48.862183,2.296908),new google.maps.LatLng(48.862862,2.299011),
		new google.maps.LatLng(48.863087,2.301328),new google.maps.LatLng(48.863255,2.310169),new google.maps.LatLng(48.863426,2.313259),new google.maps.LatLng(48.863480,2.317765),
		new google.maps.LatLng(48.858738,2.333043)
		];

	var arr8 = [
		new google.maps.LatLng(48.863991,2.302272),new google.maps.LatLng(48.865261,2.300384),new google.maps.LatLng(48.868618,2.299182),new google.maps.LatLng(48.870934,2.297895),
		new google.maps.LatLng(48.873249,2.295921),new google.maps.LatLng(48.874348,2.295835),new google.maps.LatLng(48.878136,2.298567),new google.maps.LatLng(48.879570,2.305620),
		new google.maps.LatLng(48.880615,2.312529),new google.maps.LatLng(48.883125,2.326863),new google.maps.LatLng(48.875732,2.326391),new google.maps.LatLng(48.874039,2.326477),
		new google.maps.LatLng(48.873333,2.326477),new google.maps.LatLng(48.866840,2.321713),new google.maps.LatLng(48.863991,2.319610),new google.maps.LatLng(48.864300,2.318451),
		new google.maps.LatLng(48.864216,2.315447),new google.maps.LatLng(48.864075,2.311714),new google.maps.LatLng(48.864101,2.308838),new google.maps.LatLng(48.863991,2.302272)
		];

	var arr9 = [
		new google.maps.LatLng(48.869576,2.324485),new google.maps.LatLng(48.873611,2.327167),new google.maps.LatLng(48.875374,2.326802),new google.maps.LatLng(48.875813,2.327038),
		new google.maps.LatLng(48.883236,2.327338),new google.maps.LatLng(48.883377,2.327832),new google.maps.LatLng(48.884411,2.329509),new google.maps.LatLng(48.883732,2.332191),
		new google.maps.LatLng(48.882603,2.335871),new google.maps.LatLng(48.882210,2.337427),new google.maps.LatLng(48.881905,2.339669),new google.maps.LatLng(48.883095,2.346393),
		new google.maps.LatLng(48.883488,2.349375),new google.maps.LatLng(48.882568,2.349401),new google.maps.LatLng(48.880394,2.349465),new google.maps.LatLng(48.877686,2.348800),
		new google.maps.LatLng(48.876781,2.348499),new google.maps.LatLng(48.875950,2.348027),new google.maps.LatLng(48.874256,2.347662),new google.maps.LatLng(48.870895,2.347620),
		new google.maps.LatLng(48.872082,2.340302),new google.maps.LatLng(48.871925,2.338800),new google.maps.LatLng(48.869576,2.324485)
		];

	var arr10 = [
		new google.maps.LatLng(48.883499,2.349787),new google.maps.LatLng(48.884247,2.359035),new google.maps.LatLng(48.884148,2.364292),new google.maps.LatLng(48.883919,2.368147),
		new google.maps.LatLng(48.882328,2.369936),new google.maps.LatLng(48.878025,2.369785),new google.maps.LatLng(48.872055,2.376523),new google.maps.LatLng(48.870502,2.372038),
		new google.maps.LatLng(48.869034,2.367704),new google.maps.LatLng(48.867523,2.363327),new google.maps.LatLng(48.868195,2.362182),new google.maps.LatLng(48.868893,2.357190),
		new google.maps.LatLng(48.870842,2.348070),new google.maps.LatLng(48.873775,2.348006),new google.maps.LatLng(48.875793,2.348392),new google.maps.LatLng(48.877502,2.349336),
		new google.maps.LatLng(48.879040,2.349401),new google.maps.LatLng(48.880577,2.349980),new google.maps.LatLng(48.883499,2.349765)
		];

	var arr11 = [
		new google.maps.LatLng(48.867207,2.364027),new google.maps.LatLng(48.867912,2.365186),new google.maps.LatLng(48.871723,2.376559),new google.maps.LatLng(48.867065,2.382438),
		new google.maps.LatLng(48.863228,2.386558),new google.maps.LatLng(48.862492,2.387116),new google.maps.LatLng(48.858208,2.389548),new google.maps.LatLng(48.857952,2.390578),
		new google.maps.LatLng(48.857502,2.391994),new google.maps.LatLng(48.856499,2.393990),new google.maps.LatLng(48.851219,2.398067),new google.maps.LatLng(48.848309,2.398989),
		new google.maps.LatLng(48.848770,2.394755),new google.maps.LatLng(48.850689,2.383382),new google.maps.LatLng(48.850830,2.379391),new google.maps.LatLng(48.852554,2.372181),
		new google.maps.LatLng(48.853657,2.370207),new google.maps.LatLng(48.853573,2.369263),new google.maps.LatLng(48.863792,2.366774),new google.maps.LatLng(48.865543,2.365530),
		new google.maps.LatLng(48.866417,2.364972),new google.maps.LatLng(48.867207,2.364027)
		];

	var arr12 = [
		new google.maps.LatLng(48.846622,2.414024),new google.maps.LatLng(48.843884,2.413380),new google.maps.LatLng(48.841400,2.413208),new google.maps.LatLng(48.838181,2.412393),
		new google.maps.LatLng(48.836201,2.411749),new google.maps.LatLng(48.835438,2.411106),new google.maps.LatLng(48.834591,2.409818),new google.maps.LatLng(48.833572,2.407157),
		new google.maps.LatLng(48.829960,2.401063),new google.maps.LatLng(48.829082,2.398789),new google.maps.LatLng(48.827896,2.393425),new google.maps.LatLng(48.826965,2.389305),
		new google.maps.LatLng(48.840439,2.373297),new google.maps.LatLng(48.845947,2.365830),new google.maps.LatLng(48.849079,2.367418),new google.maps.LatLng(48.852669,2.369006),
		new google.maps.LatLng(48.853092,2.370079),new google.maps.LatLng(48.852215,2.371795),new google.maps.LatLng(48.850437,2.378662),new google.maps.LatLng(48.850208,2.381408),
		new google.maps.LatLng(48.850040,2.384326),new google.maps.LatLng(48.847839,2.398746),new google.maps.LatLng(48.846622,2.414024)
		];

	var arr13 = [
		new google.maps.LatLng(48.826515,2.387960),new google.maps.LatLng(48.825428,2.384698),new google.maps.LatLng(48.821968,2.379055),new google.maps.LatLng(48.821430,2.377896),
		new google.maps.LatLng(48.816444,2.363048),new google.maps.LatLng(48.816319,2.361631),new google.maps.LatLng(48.816471,2.359979),new google.maps.LatLng(48.816772,2.356811),
		new google.maps.LatLng(48.818241,2.353635),new google.maps.LatLng(48.818298,2.351575),new google.maps.LatLng(48.816715,2.346082),new google.maps.LatLng(48.816662,2.344333),
		new google.maps.LatLng(48.819599,2.344698),new google.maps.LatLng(48.821224,2.342938),new google.maps.LatLng(48.821575,2.342488),new google.maps.LatLng(48.822086,2.342209),
		new google.maps.LatLng(48.823284,2.341651),new google.maps.LatLng(48.825138,2.341651),new google.maps.LatLng(48.826054,2.341758),new google.maps.LatLng(48.828201,2.341758),
		new google.maps.LatLng(48.828682,2.341715),new google.maps.LatLng(48.831425,2.341393),new google.maps.LatLng(48.833019,2.341415),new google.maps.LatLng(48.838219,2.342187),
		new google.maps.LatLng(48.837524,2.345363),new google.maps.LatLng(48.837242,2.346908),new google.maps.LatLng(48.837002,2.348818),new google.maps.LatLng(48.836788,2.350770),
		new google.maps.LatLng(48.836563,2.351800),new google.maps.LatLng(48.839928,2.361907),new google.maps.LatLng(48.843555,2.364653),new google.maps.LatLng(48.844318,2.365233),
		new google.maps.LatLng(48.844486,2.365469),new google.maps.LatLng(48.842396,2.368387),new google.maps.LatLng(48.838726,2.373129),new google.maps.LatLng(48.837864,2.373987),
		new google.maps.LatLng(48.832638,2.380124),new google.maps.LatLng(48.827694,2.386090),new google.maps.LatLng(48.826488,2.387960)
		];

	var arr14 = [
		new google.maps.LatLng(48.837952,2.341712),new google.maps.LatLng(48.835014,2.341111),new google.maps.LatLng(48.832302,2.340724),new google.maps.LatLng(48.830353,2.340767),
		new google.maps.LatLng(48.826256,2.341197),new google.maps.LatLng(48.824337,2.341197),new google.maps.LatLng(48.823292,2.341068),new google.maps.LatLng(48.821285,2.342227),
		new google.maps.LatLng(48.819298,2.344036),new google.maps.LatLng(48.816811,2.343435),new google.maps.LatLng(48.820286,2.326183),new google.maps.LatLng(48.825684,2.302451),
		new google.maps.LatLng(48.828087,2.304683),new google.maps.LatLng(48.829708,2.306507),new google.maps.LatLng(48.831558,2.309167),new google.maps.LatLng(48.832844,2.310991),
		new google.maps.LatLng(48.836094,2.315004),new google.maps.LatLng(48.837395,2.317064),new google.maps.LatLng(48.838329,2.319120),new google.maps.LatLng(48.841042,2.321781),
		new google.maps.LatLng(48.843578,2.324080),new google.maps.LatLng(48.841961,2.329205),new google.maps.LatLng(48.839478,2.336304),new google.maps.LatLng(48.837952,2.341712)
		];

	var arr15 = [
		new google.maps.LatLng(48.857895,2.290156),new google.maps.LatLng(48.847012,2.307258),new google.maps.LatLng(48.847816,2.310305),new google.maps.LatLng(48.845684,2.313545),
		new google.maps.LatLng(48.846714,2.316635),new google.maps.LatLng(48.845131,2.319531),new google.maps.LatLng(48.843838,2.323251),new google.maps.LatLng(48.838299,2.317071),
		new google.maps.LatLng(48.825909,2.301250),new google.maps.LatLng(48.827633,2.293139),new google.maps.LatLng(48.830742,2.285585),new google.maps.LatLng(48.834045,2.277689),
		new google.maps.LatLng(48.835064,2.274857),new google.maps.LatLng(48.835629,2.271166),new google.maps.LatLng(48.835289,2.265286),new google.maps.LatLng(48.839130,2.269256),
		new google.maps.LatLng(48.845982,2.275565),new google.maps.LatLng(48.855186,2.288418),new google.maps.LatLng(48.857895,2.290177)
		];

	var arr16 = [
		new google.maps.LatLng(48.835327,2.263305),new google.maps.LatLng(48.835777,2.259014),new google.maps.LatLng(48.837105,2.256052),new google.maps.LatLng(48.838123,2.255023),
		new google.maps.LatLng(48.839931,2.254336),new google.maps.LatLng(48.842445,2.254550),new google.maps.LatLng(48.845551,2.255366),new google.maps.LatLng(48.847527,2.254679),
		new google.maps.LatLng(48.849873,2.252619),new google.maps.LatLng(48.851822,2.252576),new google.maps.LatLng(48.853317,2.253520),new google.maps.LatLng(48.854755,2.255623),
		new google.maps.LatLng(48.856789,2.258370),new google.maps.LatLng(48.858089,2.260988),new google.maps.LatLng(48.859303,2.263305),new google.maps.LatLng(48.861645,2.264764),
		new google.maps.LatLng(48.862915,2.265708),new google.maps.LatLng(48.864582,2.267597),new google.maps.LatLng(48.866642,2.269228),new google.maps.LatLng(48.868900,2.270772),
		new google.maps.LatLng(48.874950,2.277160),new google.maps.LatLng(48.875965,2.278533),new google.maps.LatLng(48.877998,2.280850),new google.maps.LatLng(48.873676,2.295070),
		new google.maps.LatLng(48.868584,2.298567),new google.maps.LatLng(48.863785,2.300112),new google.maps.LatLng(48.863091,2.296743),new google.maps.LatLng(48.862022,2.293725),
		new google.maps.LatLng(48.856544,2.287374),new google.maps.LatLng(48.850952,2.279820),new google.maps.LatLng(48.847225,2.275443),new google.maps.LatLng(48.839767,2.268233),
		new google.maps.LatLng(48.835327,2.263305)
		];

	var arr17 = [
		new google.maps.LatLng(48.900471,2.329627),new google.maps.LatLng(48.897480,2.328769),new google.maps.LatLng(48.887554,2.325464),new google.maps.LatLng(48.883625,2.327278),
		new google.maps.LatLng(48.881504,2.316345),new google.maps.LatLng(48.880493,2.308974),new google.maps.LatLng(48.878227,2.298374),new google.maps.LatLng(48.874237,2.295063),
		new google.maps.LatLng(48.878242,2.281373),new google.maps.LatLng(48.879967,2.282188),new google.maps.LatLng(48.881859,2.283089),new google.maps.LatLng(48.883041,2.284162),
		new google.maps.LatLng(48.887897,2.292144),new google.maps.LatLng(48.889618,2.297981),new google.maps.LatLng(48.894920,2.306564),new google.maps.LatLng(48.896305,2.310297),
		new google.maps.LatLng(48.897942,2.314460),new google.maps.LatLng(48.899380,2.319396),new google.maps.LatLng(48.900200,2.322400),new google.maps.LatLng(48.900471,2.329627)
		];

	var arr18 = [
		new google.maps.LatLng(48.884544,2.364700),new google.maps.LatLng(48.886665,2.366563),new google.maps.LatLng(48.889584,2.367808),new google.maps.LatLng(48.894211,2.369910),
		new google.maps.LatLng(48.894917,2.370597),new google.maps.LatLng(48.895370,2.371584),new google.maps.LatLng(48.896542,2.370254),new google.maps.LatLng(48.900517,2.370104),
		new google.maps.LatLng(48.900547,2.364396),new google.maps.LatLng(48.900928,2.352766),new google.maps.LatLng(48.900337,2.330124),new google.maps.LatLng(48.887558,2.325790),
		new google.maps.LatLng(48.883739,2.327482),new google.maps.LatLng(48.883846,2.327975),new google.maps.LatLng(48.884743,2.329488),new google.maps.LatLng(48.883759,2.333361),
		new google.maps.LatLng(48.882595,2.337352),new google.maps.LatLng(48.882168,2.339669),new google.maps.LatLng(48.883625,2.346847),new google.maps.LatLng(48.883938,2.349465),
		new google.maps.LatLng(48.884602,2.359486),new google.maps.LatLng(48.884544,2.364721)
		];

	var arr19 = [
		new google.maps.LatLng(48.900421,2.370422),new google.maps.LatLng(48.900394,2.372396),new google.maps.LatLng(48.899971,2.377117),new google.maps.LatLng(48.900253,2.386816),
		new google.maps.LatLng(48.900246,2.388604),new google.maps.LatLng(48.900002,2.390335),new google.maps.LatLng(48.899696,2.391608),new google.maps.LatLng(48.899101,2.392509),
		new google.maps.LatLng(48.898087,2.393432),new google.maps.LatLng(48.896076,2.394025),new google.maps.LatLng(48.888481,2.396286),new google.maps.LatLng(48.885643,2.397101),
		new google.maps.LatLng(48.881413,2.402079),new google.maps.LatLng(48.880592,2.404525),new google.maps.LatLng(48.879902,2.406220),new google.maps.LatLng(48.879208,2.407143),
		new google.maps.LatLng(48.877842,2.408066),new google.maps.LatLng(48.876247,2.402723),new google.maps.LatLng(48.875511,2.396736),new google.maps.LatLng(48.875626,2.390642),
		new google.maps.LatLng(48.874863,2.388239),new google.maps.LatLng(48.874596,2.386179),new google.maps.LatLng(48.873734,2.384098),new google.maps.LatLng(48.872337,2.376974),
		new google.maps.LatLng(48.878109,2.370408),new google.maps.LatLng(48.882767,2.370257),new google.maps.LatLng(48.884262,2.368970),new google.maps.LatLng(48.884628,2.365043),
		new google.maps.LatLng(48.886662,2.366931),new google.maps.LatLng(48.894562,2.370665),new google.maps.LatLng(48.895367,2.371802),new google.maps.LatLng(48.896690,2.370601),
		new google.maps.LatLng(48.900421,2.370422)
		];

	var arr20 = [
		new google.maps.LatLng(48.877460,2.408366),new google.maps.LatLng(48.871742,2.412443),new google.maps.LatLng(48.863869,2.412915),new google.maps.LatLng(48.858700,2.413731),
		new google.maps.LatLng(48.854580,2.413216),new google.maps.LatLng(48.853394,2.413602),new google.maps.LatLng(48.851021,2.414846),new google.maps.LatLng(48.846954,2.413988),
		new google.maps.LatLng(48.848392,2.399654),new google.maps.LatLng(48.851246,2.399011),new google.maps.LatLng(48.856697,2.394505),new google.maps.LatLng(48.858757,2.389870),
		new google.maps.LatLng(48.863132,2.387767),new google.maps.LatLng(48.872097,2.377124),new google.maps.LatLng(48.872986,2.381287),new google.maps.LatLng(48.873650,2.385128),
		new google.maps.LatLng(48.874439,2.386587),new google.maps.LatLng(48.874611,2.388518),new google.maps.LatLng(48.875229,2.389741),new google.maps.LatLng(48.875328,2.391908),
		new google.maps.LatLng(48.875160,2.393754),new google.maps.LatLng(48.875145,2.395535),new google.maps.LatLng(48.875370,2.397723),new google.maps.LatLng(48.875370,2.399075),
		new google.maps.LatLng(48.875824,2.402444),new google.maps.LatLng(48.876740,2.405298),new google.maps.LatLng(48.877476,2.408388)
		];
			
	var arrondissementBoundry = [
	// Creating the polyline object
		new google.maps.Polyline({path: arr1,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr2,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr3,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr4,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr5,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr6,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr7,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr8,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr9,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr10,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr11,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr12,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr13,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr14,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr15,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr16,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr17,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr18,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr19,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1}),
		new google.maps.Polyline({path: arr10,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 1})
		];
			
	// Adding the polyline to the map
	var arrIx;
	for(arrIx = 0; arrIx < 20; arrIx++)
	{
		arrondissementBoundry[arrIx].setMap(map);
	}
	
	var marketStreetRueMontorgueil = [
		new google.maps.LatLng(48.863369,2.346298),new google.maps.LatLng(48.864758,2.346756),
		new google.maps.LatLng(48.865868,2.347046),new google.maps.LatLng(48.866329,2.347144)];
			
	var marketStreetAvenueMontaigne = [new google.maps.LatLng(48.868515,2.309198),new google.maps.LatLng(48.864853,2.302106)];
	
	var marketStreetRueFaubourgSaintHonoree = [
		new google.maps.LatLng(48.871033,2.316461),new google.maps.LatLng(48.870335,2.317588),
		new google.maps.LatLng(48.869835,2.318521),new google.maps.LatLng(48.869621,2.319015),
		new google.maps.LatLng(48.869148,2.320356),new google.maps.LatLng(48.868881,2.321268),
		new google.maps.LatLng(48.868717,2.321826)];
		
	var marketStreetRueDeRennes = [
		new google.maps.LatLng(48.853691,2.333068),new google.maps.LatLng(48.848202,2.327939),
		new google.maps.LatLng(48.844204,2.324206)];
		
	var marketStreetPlaceDesVictoriesPlaceDesPetitsPeres = [
		new google.maps.LatLng(48.865925,2.341180),new google.maps.LatLng(48.865910,2.341331),
		new google.maps.LatLng(48.865833,2.341449),new google.maps.LatLng(48.865692,2.341438),
		new google.maps.LatLng(48.865562,2.341256),new google.maps.LatLng(48.865593,2.341030),
		new google.maps.LatLng(48.865692,2.340923),new google.maps.LatLng(48.865810,2.340891),
		new google.maps.LatLng(48.865875,2.340687),new google.maps.LatLng(48.865925,2.340462),
		new google.maps.LatLng(48.866009,2.340150),new google.maps.LatLng(48.866074,2.339839)
	  ];
	var marketStreetAvenueVictorHugo = [
		new google.maps.LatLng(48.867950,2.281280),new google.maps.LatLng(48.873383,2.294126)
	  ];
	var marketStreetChampsElysees = [
		new google.maps.LatLng(48.877399,2.283776),new google.maps.LatLng(48.869156,2.309525)
	  ];
	var marketStreetLeBouquinistes1 = [
		new google.maps.LatLng(48.859558,2.329609),new google.maps.LatLng(48.858315,2.333257),
		new google.maps.LatLng(48.857750,2.335360),new google.maps.LatLng(48.857918,2.336347),
		new google.maps.LatLng(48.857410,2.338278),new google.maps.LatLng(48.854362,2.343042),
		new google.maps.LatLng(48.853710,2.344372),new google.maps.LatLng(48.853092,2.346818),
		new google.maps.LatLng(48.852299,2.348235),new google.maps.LatLng(48.851284,2.350724),
		new google.maps.LatLng(48.850067,2.354629)
	  ];
	var marketStreetLeBouquinistes2 = [
		new google.maps.LatLng(48.858040,2.344163),new google.maps.LatLng(48.857292,2.346931),
		new google.maps.LatLng(48.856728,2.348916),new google.maps.LatLng(48.856022,2.350793),
		new google.maps.LatLng(48.853382,2.357714),new google.maps.LatLng(48.852669,2.359623)
	  ];
	var marketStreetRueMouffetard = [
		new google.maps.LatLng(48.844994,2.349118),new google.maps.LatLng(48.844276,2.349268),
		new google.maps.LatLng(48.843159,2.349547),new google.maps.LatLng(48.842270,2.349762),
		new google.maps.LatLng(48.841450,2.349633),new google.maps.LatLng(48.840435,2.349697),
		new google.maps.LatLng(48.839729,2.349783),new google.maps.LatLng(48.839401,2.350084)
	  ];
	var marketStreetRueCler = [
		new google.maps.LatLng(48.857689,2.305967),new google.maps.LatLng(48.855473,2.307082)
	  ];
	var marketStreetMarcheAuxTimbresEtAuxCartesTelephoniques = [
		new google.maps.LatLng(48.868851,2.314563),new google.maps.LatLng(48.868324,2.314225)
	  ];
	var marketStreetRueDeLAnnonciation = [
		new google.maps.LatLng(48.856792,2.279099),new google.maps.LatLng(48.855610,2.280950)
	  ];
	var marketStreetRueCadet = [
		new google.maps.LatLng(48.875797,2.343637),new google.maps.LatLng(48.874146,2.342328)
	  ];
	var marketStreetRueDeLevis = [
		new google.maps.LatLng(48.883774,2.313713),new google.maps.LatLng(48.881584,2.316180)
	  ];
	var marketStreetRuePoncelet = [
		new google.maps.LatLng(48.878410,2.295645),new google.maps.LatLng(48.878635,2.295924)
	  ];
	var marketStreetRueDejean = [
		new google.maps.LatLng(48.887508,2.350021),new google.maps.LatLng(48.887135,2.350901)
	  ];
	var marketStreetRueuPoteau_Duhesme = [
		new google.maps.LatLng(48.892574,2.344067),new google.maps.LatLng(48.893341,2.342693),
		new google.maps.LatLng(48.892826,2.341953)
	  ];
	var marketStreetMarcheAuxVieuxPapiers = [
		new google.maps.LatLng(48.846951,2.415939),new google.maps.LatLng(48.846794,2.417527)
	  ];
	var marketStreetViaducDesArtisans = [
		new google.maps.LatLng(48.848572,2.372659),new google.maps.LatLng(48.843639,2.382948)
	  ];
	var marketStreetRueDAligre = [
		new google.maps.LatLng(48.850517,2.379352),new google.maps.LatLng(48.847748,2.377034)
	  ];
	var marketStreetMarcheParisienDeLaCreation = [
		new google.maps.LatLng(48.841888,2.322609),new google.maps.LatLng(48.840157,2.327630)
	  ];
	var marketStreetRueDAlesia = [
		new google.maps.LatLng(48.830502,2.319304),new google.maps.LatLng(48.827869,2.326546)
	  ];
	
	marketStreet = [
		new google.maps.Polyline({path: marketStreetRueMontorgueil, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:4}),
		new google.maps.Polyline({path: marketStreetAvenueMontaigne, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetRueFaubourgSaintHonoree, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetRueDeRennes, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetPlaceDesVictoriesPlaceDesPetitsPeres, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetAvenueVictorHugo, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetChampsElysees, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetLeBouquinistes1, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetLeBouquinistes2, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetRueMouffetard, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetRueCler, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetMarcheAuxTimbresEtAuxCartesTelephoniques, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetRueDeLAnnonciation, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetRueCadet, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetRueDeLevis, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetRuePoncelet, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetRueDejean, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetRueuPoteau_Duhesme, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetMarcheAuxVieuxPapiers, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetViaducDesArtisans, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetRueDAligre, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetMarcheParisienDeLaCreation, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3}),
		new google.maps.Polyline({path: marketStreetRueDAlesia, strokeColor:"#C000C0", strokeOpacity: 0.6, strokeWeight:3})
	];
	

	var marketStreetIx = 0;
	for(marketStreetIx = 0; marketStreetIx < 23; marketStreetIx++)
	{
		marketStreet[marketStreetIx].setMap(map);
	}
	
		/////////// END TEST LINE
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
				var mapName = document.getElementById('mapname');
				mapName.innerHTML = "Paris 2014 ShowStarbucks: " + (showStarbucks ? "true" : "false");
				toggleMarketStreets();
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

			case 'arrondissement':
				showArrondissement != showArrondissement;
				break;
				
			default:
				alert("bad toggleID");
				showFood = !showFood;
				break;
		}
		refreshMarkers();
	}
	
	function toggleMarketStreets()
	{
		var marketStreetIx;
		for(marketStreetIx = 0; marketStreetIx < 23; marketStreetIx++)
		{
			if(marketStreet[marketStreetIx].getMap(map))
			{
				marketStreet[marketStreetIx].setMap(null);
			}
			else
			{
				marketStreet[marketStreetIx].setMap(map);
			}
		}	
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
					//trainName = routes.charAt(0);
					//tempIcon = getIcon(trainName);
					//pos = new google.maps.LatLng(slat,slng);
					//masterStationArray.push(new StationPin(slat, slng, new StyledMarker({styleIcon:tempIcon,position:pos ,title:routes}))); //break;
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
		case "1": 
			returnIcon = metro1Icon
			break;
		case "2": 
			returnIcon = metro2Icon
			break;
		case "3":
			returnIcon = metro3Icon
			break;
		case "4": 
			returnIcon = metro4Icon
			break;
		case "5": 
			returnIcon = metro5Icon
			break;
		case "6":
			returnIcon = metro6Icon
			break;
		case "7":
			returnIcon = metro7Icon
			break;
		case "8":
			returnIcon = metro8Icon
			break;
		case "9":
			returnIcon = metro9Icon
			break;
		default:
			returnIcon = metro10Icon
			break;
		}

		return returnIcon;
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
				if(tempPin.type.toUpperCase() == "STAR")
				{
					starbucksArray.push(new google.maps.Marker({position:pinLatLng, icon:starbucksIcon}));
				}
				else if(tempPin.type.toUpperCase() == "RESTAURANT" ||
				        tempPin.type.toUpperCase() == "BISTRO" ||
				        tempPin.type.toUpperCase() == "CAFE" ||
				        tempPin.type.toUpperCase() == "BOULANGER" ||
				        tempPin.type.toUpperCase() == "BRASSERIE"
						)
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
				else if(tempPin.type.toUpperCase() == "MCD")
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
						if(tempPin.type.toUpperCase() == "THISTRIP")
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
							if(tempPin.type.toUpperCase() == "BESTTHING")
							{
								indexTxt += "<b>";
							}
							if(tempPin.note != "")
							{
								indexTxt += " -- " + tempPin.note;
							}
							if(tempPin.type.toUpperCase() == "BESTTHING")
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

						if(tempPin.type.toUpperCase() == "THISTRIP")
						{
							indexTxt += "</b>";
						}
						
						// Make a marker and save it
						// var newMarker = new StyledMarker({styleIcon: new StyledIcon(StyledIconTypes.MARKER,
							// {color:tempPin.pinColor, 
							// fore:textColor, 
							// text:tempPin.pinNumber}),
							// position:pinLatLng, title:tempPin.name})
							
							var newMarker = new google.maps.Marker({ position: pinLatLng, 
																	 title: 'Pin1', 
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
		
		if(showArrondissement)
		{
			polyline1.setMap(map);
			polyline2.setMap(map);
			polyline3.setMap(map);
			polyline4.setMap(map);
			polyline5.setMap(map);
			polyline6.setMap(map);
			polyline7.setMap(map);
			polyline8.setMap(map);
			polyline9.setMap(map);
			polyline10.setMap(map);
			polyline11.setMap(map);
			polyline12.setMap(map);
			polyline13.setMap(map);
			polyline14.setMap(map);
			polyline15.setMap(map);
			polyline16.setMap(map);
			polyline17.setMap(map);
			polyline18.setMap(map);
			polyline19.setMap(map);
			polyline20.setMap(map);
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

