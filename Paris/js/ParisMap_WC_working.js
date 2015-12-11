(function() {

		// Creating a map
	var xhr1 = null;
	var xhr2 = null;
	var map = null;
	var starbucksArray = [];
	var toilettesArray = [];
	var foodArray = [];
	var masterMapPinArray = [];
	var singleMapArray = [];

	var masterStationArray = [];
	var stationArray = [];
	var entranceArray = [];

	var showStarbucks = false;
	var showToilettes = false;
	var showMetro = false;
	var showMuseums = false;
	var showFood = false;
	//var showArrondissement = false;
	
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
	var toilettesIcon = 'img/Toilettes.png';	
	
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
	var toilettes = document.getElementById('toilettes');

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
	var toilettesTag = document.getElementById('toilettes');
	var restaurantsTag = document.getElementById('other');

	//first30Tag.onclick    = function() {toggle("first30")};
	//second30Tag.onclick  = function()  {toggle("second30")};
	//third30Tag.onclick = function()  {toggle("third30")};
	subwayTag.onclick    = function() {toggle("subway")};
	starbucksTag.onclick = function()  {toggle("starbucks")};
	toilettesTag.onclick = function()  {toggle("toilettes")};
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
		new google.maps.LatLng(48.863037,2.320769), new google.maps.LatLng(48.868938,2.325229), new google.maps.LatLng(48.869419,2.325149),
		new google.maps.LatLng(48.869949,2.328018), new google.maps.LatLng(48.868286,2.330302), new google.maps.LatLng(48.863407,2.350944),
		new google.maps.LatLng(48.857124,2.347351), new google.maps.LatLng(48.856972,2.346910), new google.maps.LatLng(48.855373,2.345966),
		new google.maps.LatLng(48.854012,2.344529), new google.maps.LatLng(48.855247,2.342400), new google.maps.LatLng(48.856800,2.340469),
		new google.maps.LatLng(48.858467,2.337250), new google.maps.LatLng(48.859680,2.331459), new google.maps.LatLng(48.863037,2.320769)
			];
    var arr2 = [
		new google.maps.LatLng(48.871960,2.339999), new google.maps.LatLng(48.870689,2.347890), new google.maps.LatLng(48.869308,2.354330),
		new google.maps.LatLng(48.863411,2.350979), new google.maps.LatLng(48.868294,2.330292), new google.maps.LatLng(48.869720,2.328211),
		new google.maps.LatLng(48.869923,2.328072), new google.maps.LatLng(48.871960,2.339999)
			];
    var arr3 = [
		new google.maps.LatLng(48.867905,2.362360), new google.maps.LatLng(48.866436,2.364764), new google.maps.LatLng(48.863190,2.366694),
		new google.maps.LatLng(48.855820,2.368454), new google.maps.LatLng(48.856441,2.364335), new google.maps.LatLng(48.857262,2.361631),
		new google.maps.LatLng(48.858757,2.358626), new google.maps.LatLng(48.860111,2.356825), new google.maps.LatLng(48.861214,2.353391),
		new google.maps.LatLng(48.862034,2.350172), new google.maps.LatLng(48.869286,2.354249), new google.maps.LatLng(48.867905,2.362360)
			];
    var arr4 = [
		new google.maps.LatLng(48.845989,2.364650), new google.maps.LatLng(48.846958,2.366299), new google.maps.LatLng(48.852810,2.369200),
		new google.maps.LatLng(48.855869,2.368360), new google.maps.LatLng(48.856407,2.364329), new google.maps.LatLng(48.857258,2.361670),
		new google.maps.LatLng(48.858749,2.358579), new google.maps.LatLng(48.860161,2.356780), new google.maps.LatLng(48.861240,2.353299),
		new google.maps.LatLng(48.862030,2.350169), new google.maps.LatLng(48.857147,2.347329), new google.maps.LatLng(48.856964,2.346986),
		new google.maps.LatLng(48.855396,2.345966), new google.maps.LatLng(48.854027,2.344551), new google.maps.LatLng(48.853298,2.346950),
		new google.maps.LatLng(48.851978,2.350130), new google.maps.LatLng(48.850849,2.354670), new google.maps.LatLng(48.848640,2.360899),
		new google.maps.LatLng(48.845989,2.364650)
			];
    var arr5 = [
		new google.maps.LatLng(48.836750,2.351799), new google.maps.LatLng(48.840000,2.361839), new google.maps.LatLng(48.844379,2.364930),
		new google.maps.LatLng(48.844997,2.366000), new google.maps.LatLng(48.848610,2.360980), new google.maps.LatLng(48.850788,2.354800),
		new google.maps.LatLng(48.851997,2.350169), new google.maps.LatLng(48.853298,2.346859), new google.maps.LatLng(48.854038,2.344500),
		new google.maps.LatLng(48.853760,2.344199), new google.maps.LatLng(48.850258,2.342576), new google.maps.LatLng(48.839622,2.336462),
		new google.maps.LatLng(48.837601,2.345489), new google.maps.LatLng(48.836750,2.351799)
			];
    var arr6 = [
		new google.maps.LatLng(48.846851,2.316469), new google.maps.LatLng(48.847851,2.319040), new google.maps.LatLng(48.850311,2.324120),
		new google.maps.LatLng(48.851608,2.327040), new google.maps.LatLng(48.851952,2.328660), new google.maps.LatLng(48.856339,2.331599),
		new google.maps.LatLng(48.859180,2.333860), new google.maps.LatLng(48.858490,2.337499), new google.maps.LatLng(48.856750,2.340592),
		new google.maps.LatLng(48.855247,2.342512), new google.maps.LatLng(48.853992,2.344465), new google.maps.LatLng(48.853767,2.344250),
		new google.maps.LatLng(48.850349,2.342639), new google.maps.LatLng(48.839630,2.336520), new google.maps.LatLng(48.845100,2.319990),
		new google.maps.LatLng(48.846851,2.316469)
			];
    var arr7 = [
		new google.maps.LatLng(48.845810,2.309531), new google.maps.LatLng(48.847153,2.307342), new google.maps.LatLng(48.858192,2.289877),
		new google.maps.LatLng(48.861862,2.294769), new google.maps.LatLng(48.863499,2.300219), new google.maps.LatLng(48.863838,2.318330),
		new google.maps.LatLng(48.859676,2.331462), new google.maps.LatLng(48.859180,2.333844), new google.maps.LatLng(48.856258,2.331590),
		new google.maps.LatLng(48.854424,2.330410), new google.maps.LatLng(48.852673,2.329295), new google.maps.LatLng(48.851826,2.328479),
		new google.maps.LatLng(48.851601,2.327106), new google.maps.LatLng(48.847801,2.319274), new google.maps.LatLng(48.845909,2.313651),
		new google.maps.LatLng(48.845215,2.311355), new google.maps.LatLng(48.845810,2.309531)
			];
    var arr8 = [
		new google.maps.LatLng(48.864601,2.301550), new google.maps.LatLng(48.865131,2.299869), new google.maps.LatLng(48.868690,2.298799),
		new google.maps.LatLng(48.871151,2.297299), new google.maps.LatLng(48.873260,2.295539), new google.maps.LatLng(48.873192,2.294570),
		new google.maps.LatLng(48.873669,2.294029), new google.maps.LatLng(48.874290,2.294399), new google.maps.LatLng(48.874317,2.295409),
		new google.maps.LatLng(48.877750,2.297769), new google.maps.LatLng(48.878029,2.297639), new google.maps.LatLng(48.878460,2.298049),
		new google.maps.LatLng(48.878250,2.298799), new google.maps.LatLng(48.880459,2.309009), new google.maps.LatLng(48.881340,2.316609),
		new google.maps.LatLng(48.883450,2.327210), new google.maps.LatLng(48.875908,2.326849), new google.maps.LatLng(48.875404,2.326611),
		new google.maps.LatLng(48.873825,2.326976), new google.maps.LatLng(48.873329,2.326869), new google.maps.LatLng(48.872597,2.326290),
		new google.maps.LatLng(48.872471,2.326505), new google.maps.LatLng(48.869534,2.325819), new google.maps.LatLng(48.869392,2.325152),
		new google.maps.LatLng(48.869019,2.325260), new google.maps.LatLng(48.863098,2.320769), new google.maps.LatLng(48.863811,2.318280),
		new google.maps.LatLng(48.863522,2.301670), new google.maps.LatLng(48.864601,2.301550)
			];
    var arr9 = [
		new google.maps.LatLng(48.882011,2.339599), new google.maps.LatLng(48.883781,2.349520), new google.maps.LatLng(48.880692,2.349870),
		new google.maps.LatLng(48.878880,2.349209), new google.maps.LatLng(48.877220,2.349000), new google.maps.LatLng(48.875660,2.348139),
		new google.maps.LatLng(48.873871,2.347850), new google.maps.LatLng(48.870689,2.347890), new google.maps.LatLng(48.871960,2.340040),
		new google.maps.LatLng(48.869572,2.325790), new google.maps.LatLng(48.872471,2.326519), new google.maps.LatLng(48.872589,2.326309),
		new google.maps.LatLng(48.873341,2.326880), new google.maps.LatLng(48.873779,2.326979), new google.maps.LatLng(48.875439,2.326630),
		new google.maps.LatLng(48.875950,2.326820), new google.maps.LatLng(48.883419,2.327170), new google.maps.LatLng(48.883621,2.327929),
		new google.maps.LatLng(48.884651,2.329480), new google.maps.LatLng(48.882271,2.337406), new google.maps.LatLng(48.882011,2.339599)
			];
    var arr10 = [
		new google.maps.LatLng(48.884079,2.368755), new google.maps.LatLng(48.883289,2.369142), new google.maps.LatLng(48.882637,2.370213),
		new google.maps.LatLng(48.878632,2.370257), new google.maps.LatLng(48.878124,2.370814), new google.maps.LatLng(48.877560,2.370601),
		new google.maps.LatLng(48.872108,2.376952), new google.maps.LatLng(48.870644,2.372917), new google.maps.LatLng(48.867790,2.364205),
		new google.maps.LatLng(48.867226,2.363477), new google.maps.LatLng(48.867905,2.362404), new google.maps.LatLng(48.869286,2.354293),
		new google.maps.LatLng(48.870728,2.347941), new google.maps.LatLng(48.873943,2.347812), new google.maps.LatLng(48.875751,2.348155),
		new google.maps.LatLng(48.877277,2.348971), new google.maps.LatLng(48.879223,2.349272), new google.maps.LatLng(48.880692,2.349873),
		new google.maps.LatLng(48.883797,2.349486), new google.maps.LatLng(48.884472,2.359227), new google.maps.LatLng(48.884361,2.364806),
		new google.maps.LatLng(48.884079,2.368755)
			];
    var arr11 = [
		new google.maps.LatLng(48.867115,2.383175), new google.maps.LatLng(48.866070,2.383776), new google.maps.LatLng(48.862823,2.387465),
		new google.maps.LatLng(48.858444,2.389654), new google.maps.LatLng(48.857571,2.392230), new google.maps.LatLng(48.856548,2.394321),
		new google.maps.LatLng(48.851330,2.398398), new google.maps.LatLng(48.848709,2.399214), new google.maps.LatLng(48.848103,2.399064),
		new google.maps.LatLng(48.848351,2.395899), new google.maps.LatLng(48.850170,2.384291), new google.maps.LatLng(48.850483,2.379999),
		new google.maps.LatLng(48.852459,2.371544), new google.maps.LatLng(48.853222,2.370257), new google.maps.LatLng(48.853081,2.369184),
		new google.maps.LatLng(48.863190,2.366737), new google.maps.LatLng(48.866409,2.364720), new google.maps.LatLng(48.867256,2.363477),
		new google.maps.LatLng(48.867790,2.364205), new google.maps.LatLng(48.872108,2.376866), new google.maps.LatLng(48.867115,2.383175)
			];
    var arr12 = [
		new google.maps.LatLng(48.846809,2.414499), new google.maps.LatLng(48.836529,2.412520), new google.maps.LatLng(48.834270,2.409609),
		new google.maps.LatLng(48.833698,2.414070), new google.maps.LatLng(48.835850,2.422140), new google.maps.LatLng(48.840588,2.420249),
		new google.maps.LatLng(48.842060,2.419299), new google.maps.LatLng(48.843590,2.419989), new google.maps.LatLng(48.844547,2.421790),
		new google.maps.LatLng(48.841778,2.424450), new google.maps.LatLng(48.840588,2.438359), new google.maps.LatLng(48.844547,2.439220),
		new google.maps.LatLng(48.844440,2.440850), new google.maps.LatLng(48.845959,2.440760), new google.maps.LatLng(48.845901,2.446600),
		new google.maps.LatLng(48.844940,2.446340), new google.maps.LatLng(48.844097,2.455519), new google.maps.LatLng(48.842232,2.463340),
		new google.maps.LatLng(48.836529,2.469770), new google.maps.LatLng(48.834148,2.469090), new google.maps.LatLng(48.831497,2.465219),
		new google.maps.LatLng(48.827599,2.464280), new google.maps.LatLng(48.827259,2.466000), new google.maps.LatLng(48.822968,2.464789),
		new google.maps.LatLng(48.819458,2.462559), new google.maps.LatLng(48.817150,2.458870), new google.maps.LatLng(48.816978,2.453889),
		new google.maps.LatLng(48.818157,2.448570), new google.maps.LatLng(48.818439,2.437500), new google.maps.LatLng(48.819630,2.437330),
		new google.maps.LatLng(48.822628,2.431919), new google.maps.LatLng(48.824150,2.427630), new google.maps.LatLng(48.824211,2.421959),
		new google.maps.LatLng(48.824100,2.419729), new google.maps.LatLng(48.824600,2.417330), new google.maps.LatLng(48.825001,2.411070),
		new google.maps.LatLng(48.826981,2.406690), new google.maps.LatLng(48.829300,2.403509), new google.maps.LatLng(48.829689,2.401110),
		new google.maps.LatLng(48.828049,2.395620), new google.maps.LatLng(48.827198,2.390719), new google.maps.LatLng(48.826469,2.388580),
		new google.maps.LatLng(48.846130,2.364539), new google.maps.LatLng(48.847031,2.366429), new google.maps.LatLng(48.853130,2.369180),
		new google.maps.LatLng(48.853130,2.370379), new google.maps.LatLng(48.852417,2.371544), new google.maps.LatLng(48.850368,2.380170),
		new google.maps.LatLng(48.850079,2.384459), new google.maps.LatLng(48.848328,2.395960), new google.maps.LatLng(48.846809,2.414499)
			];
    var arr13 = [
		new google.maps.LatLng(48.838322,2.342039), new google.maps.LatLng(48.831947,2.341110), new google.maps.LatLng(48.831429,2.341310),
		new google.maps.LatLng(48.826408,2.341650), new google.maps.LatLng(48.823658,2.341460), new google.maps.LatLng(48.821461,2.342420),
		new google.maps.LatLng(48.820278,2.343939), new google.maps.LatLng(48.819382,2.344590), new google.maps.LatLng(48.817631,2.344100),
		new google.maps.LatLng(48.816441,2.344050), new google.maps.LatLng(48.816410,2.346839), new google.maps.LatLng(48.817989,2.351669),
		new google.maps.LatLng(48.817501,2.354400), new google.maps.LatLng(48.816441,2.356799), new google.maps.LatLng(48.816132,2.363339),
		new google.maps.LatLng(48.821480,2.378810), new google.maps.LatLng(48.825298,2.385269), new google.maps.LatLng(48.826481,2.388560),
		new google.maps.LatLng(48.844997,2.365959), new google.maps.LatLng(48.844379,2.364930), new google.maps.LatLng(48.840031,2.361930),
		new google.maps.LatLng(48.836731,2.351890), new google.maps.LatLng(48.837067,2.348927), new google.maps.LatLng(48.837605,2.345431),
		new google.maps.LatLng(48.838322,2.342039)
			];
    var arr14 = [
		new google.maps.LatLng(48.825428,2.301464), new google.maps.LatLng(48.841503,2.321032), new google.maps.LatLng(48.840996,2.321547),
		new google.maps.LatLng(48.843651,2.324594), new google.maps.LatLng(48.839695,2.336396), new google.maps.LatLng(48.838284,2.342105),
		new google.maps.LatLng(48.831982,2.341117), new google.maps.LatLng(48.828793,2.341504), new google.maps.LatLng(48.825600,2.341632),
		new google.maps.LatLng(48.823254,2.341504), new google.maps.LatLng(48.821304,2.342490), new google.maps.LatLng(48.820118,2.344036),
		new google.maps.LatLng(48.819355,2.344551), new google.maps.LatLng(48.817574,2.344164), new google.maps.LatLng(48.816502,2.344078),
		new google.maps.LatLng(48.816811,2.335710), new google.maps.LatLng(48.818478,2.332878), new google.maps.LatLng(48.825428,2.301464)
			];
    var arr15 = [
		new google.maps.LatLng(48.827492,2.292365), new google.maps.LatLng(48.833763,2.277001), new google.maps.LatLng(48.830429,2.274255),
		new google.maps.LatLng(48.829807,2.275027), new google.maps.LatLng(48.828960,2.272797), new google.maps.LatLng(48.828114,2.270564),
		new google.maps.LatLng(48.828171,2.267818), new google.maps.LatLng(48.831108,2.267303), new google.maps.LatLng(48.833591,2.270650),
		new google.maps.LatLng(48.835342,2.269191), new google.maps.LatLng(48.834724,2.266188), new google.maps.LatLng(48.835175,2.264127),
		new google.maps.LatLng(48.849014,2.278204), new google.maps.LatLng(48.855679,2.287644), new google.maps.LatLng(48.858276,2.289963),
		new google.maps.LatLng(48.845852,2.309274), new google.maps.LatLng(48.845287,2.311335), new google.maps.LatLng(48.846813,2.316483),
		new google.maps.LatLng(48.845173,2.320003), new google.maps.LatLng(48.843594,2.324552), new google.maps.LatLng(48.841049,2.321633),
		new google.maps.LatLng(48.841618,2.320948), new google.maps.LatLng(48.825512,2.301464), new google.maps.LatLng(48.827492,2.292365)
			];
    var arr16 = [
		new google.maps.LatLng(48.878292,2.280070), new google.maps.LatLng(48.873859,2.294939), new google.maps.LatLng(48.871193,2.297387),
		new google.maps.LatLng(48.868427,2.299039), new google.maps.LatLng(48.865269,2.299910), new google.maps.LatLng(48.864574,2.301571),
		new google.maps.LatLng(48.863361,2.301800), new google.maps.LatLng(48.861660,2.294080), new google.maps.LatLng(48.857590,2.288930),
		new google.maps.LatLng(48.854321,2.286010), new google.maps.LatLng(48.847988,2.277429), new google.maps.LatLng(48.835121,2.264040),
		new google.maps.LatLng(48.835678,2.257859), new google.maps.LatLng(48.839298,2.253909), new google.maps.LatLng(48.845398,2.254770),
		new google.maps.LatLng(48.845509,2.250300), new google.maps.LatLng(48.848328,2.241719), new google.maps.LatLng(48.848560,2.227300),
		new google.maps.LatLng(48.855450,2.225929), new google.maps.LatLng(48.866520,2.231590), new google.maps.LatLng(48.870468,2.239320),
		new google.maps.LatLng(48.876339,2.246700), new google.maps.LatLng(48.874199,2.255110), new google.maps.LatLng(48.880520,2.258199),
		new google.maps.LatLng(48.878292,2.280070)
			];
    var arr17 = [
		new google.maps.LatLng(48.878368,2.279999), new google.maps.LatLng(48.882771,2.283259), new google.maps.LatLng(48.888420,2.291850),
		new google.maps.LatLng(48.889660,2.297680), new google.maps.LatLng(48.895081,2.305750), new google.maps.LatLng(48.900612,2.321889),
		new google.maps.LatLng(48.900810,2.330131), new google.maps.LatLng(48.887592,2.325625), new google.maps.LatLng(48.883450,2.327210),
		new google.maps.LatLng(48.881310,2.316910), new google.maps.LatLng(48.880402,2.308670), new google.maps.LatLng(48.878151,2.298074),
		new google.maps.LatLng(48.873917,2.295027), new google.maps.LatLng(48.878368,2.279999)
			];
    var arr18 = [
		new google.maps.LatLng(48.900719,2.370379), new google.maps.LatLng(48.896709,2.370379), new google.maps.LatLng(48.895359,2.371840),
		new google.maps.LatLng(48.894459,2.370289), new google.maps.LatLng(48.887592,2.367081), new google.maps.LatLng(48.886604,2.366630),
		new google.maps.LatLng(48.884411,2.364720), new google.maps.LatLng(48.884411,2.358789), new google.maps.LatLng(48.883678,2.349520),
		new google.maps.LatLng(48.881870,2.339739), new google.maps.LatLng(48.882286,2.337254), new google.maps.LatLng(48.884430,2.329530),
		new google.maps.LatLng(48.883526,2.327920), new google.maps.LatLng(48.883415,2.327192), new google.maps.LatLng(48.887619,2.325603),
		new google.maps.LatLng(48.900829,2.330210), new google.maps.LatLng(48.901279,2.353209), new google.maps.LatLng(48.900719,2.370379)
			];
    var arr19 = [
		new google.maps.LatLng(48.877857,2.408749), new google.maps.LatLng(48.875999,2.402309), new google.maps.LatLng(48.875259,2.395255),
		new google.maps.LatLng(48.875549,2.390210), new google.maps.LatLng(48.874531,2.387719), new google.maps.LatLng(48.874649,2.386519),
		new google.maps.LatLng(48.873859,2.384720), new google.maps.LatLng(48.872219,2.376819), new google.maps.LatLng(48.878090,2.370379),
		new google.maps.LatLng(48.882771,2.370210), new google.maps.LatLng(48.883339,2.368920), new google.maps.LatLng(48.884132,2.368669),
		new google.maps.LatLng(48.884403,2.364742), new google.maps.LatLng(48.886688,2.366781), new google.maps.LatLng(48.890202,2.368348),
		new google.maps.LatLng(48.894508,2.370289), new google.maps.LatLng(48.895470,2.371750), new google.maps.LatLng(48.896648,2.370279),
		new google.maps.LatLng(48.900780,2.370379), new google.maps.LatLng(48.900269,2.376900), new google.maps.LatLng(48.900661,2.388490),
		new google.maps.LatLng(48.899818,2.392009), new google.maps.LatLng(48.898239,2.393810), new google.maps.LatLng(48.885880,2.397250),
		new google.maps.LatLng(48.881760,2.401879), new google.maps.LatLng(48.880119,2.406600), new google.maps.LatLng(48.877857,2.408749)
			];
    var arr20 = [
		new google.maps.LatLng(48.865269,2.413300), new google.maps.LatLng(48.859058,2.414149), new google.maps.LatLng(48.853809,2.413980),
		new google.maps.LatLng(48.851040,2.415270), new google.maps.LatLng(48.846809,2.414410), new google.maps.LatLng(48.848110,2.399049),
		new google.maps.LatLng(48.848789,2.399309), new google.maps.LatLng(48.851269,2.398359), new google.maps.LatLng(48.856522,2.394410),
		new google.maps.LatLng(48.858475,2.389654), new google.maps.LatLng(48.862961,2.387379), new google.maps.LatLng(48.866180,2.383509),
		new google.maps.LatLng(48.867142,2.383195), new google.maps.LatLng(48.872238,2.376822), new google.maps.LatLng(48.873970,2.384970),
		new google.maps.LatLng(48.874699,2.386519), new google.maps.LatLng(48.874531,2.387890), new google.maps.LatLng(48.875549,2.390379),
		new google.maps.LatLng(48.875217,2.395297), new google.maps.LatLng(48.875950,2.402219), new google.maps.LatLng(48.877857,2.408580),
		new google.maps.LatLng(48.874310,2.410979), new google.maps.LatLng(48.871090,2.413380), new google.maps.LatLng(48.865269,2.413300)
			];
			
	var arrondissementBoundry = [
	// Creating the polyline object
		new google.maps.Polyline({path: arr1,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr2,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr3,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr4,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr5,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr6,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr7,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr8,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr9,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr10,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr11,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr12,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr13,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr14,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr15,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr16,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr17,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr18,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr19,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2}),
		new google.maps.Polyline({path: arr10,strokeColor: "#0000ff",strokeOpacity: 0.6,strokeWeight: 2})
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
					showMetro = !showMetro;
				}
				break;
			
			case 'starbucks':
				showStarbucks = !showStarbucks;
				starbucks.src = (showStarbucks ? "img/StarbucksMcDonaldsComboDown.jpg" : "img/StarbucksMcDonaldsCombo.jpg");
				var mapName = document.getElementById('mapname');
				mapName.innerHTML = "Paris 2014 ShowStarbucks: " + (showStarbucks ? "true" : "false");
				toggleMarketStreets();
				break;
			
			case 'toilettes':
				showToilettes = !showToilettes;
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

			//case 'arrondissement':
			//	showArrondissement != showArrondissement;
			//	break;
				
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
		
		while(0 != toilettesArray.length)
		{
			toilettesArray.pop();
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
				if(tempPin.type.toUpperCase() == "STARBUCKS")
				{
					starbucksArray.push(new google.maps.Marker({position:pinLatLng, icon:starbucksIcon}));
				}
				else if(tempPin.type.toUpperCase() === "WC")
				{
					toilettesArray.push(new google.maps.Marker({position:pinLatLng, icon:toilettesIcon}));
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
						
						if(showMetro && tempPin.subway != null && tempPin.subway != "???")
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
						if(showMetro && tempPin.subway != null && tempPin.subway != "???")
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

		if(showMetro)
		{
			mgr.addMarkers(stationArray,10);
			mgr.addMarkers(entranceArray, 17);
		}
		if(showStarbucks)
		{
			mgr.addMarkers(starbucksArray,10);
		}
		if(showToilettes)
		{
			mgr.addMarkers(toilettesArray,10);
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
		
		//if(showArrondissement)
		//{
		//	polyline1.setMap(map);
		//	polyline2.setMap(map);
		//	polyline3.setMap(map);
		//	polyline4.setMap(map);
		//	polyline5.setMap(map);
		//	polyline6.setMap(map);
		//	polyline7.setMap(map);
		//	polyline8.setMap(map);
		//	polyline9.setMap(map);
		//	polyline10.setMap(map);
		//	polyline11.setMap(map);
		//	polyline12.setMap(map);
		//	polyline13.setMap(map);
		//	polyline14.setMap(map);
		//	polyline15.setMap(map);
		//	polyline16.setMap(map);
		//	polyline17.setMap(map);
		//	polyline18.setMap(map);
		//	polyline19.setMap(map);
		//	polyline20.setMap(map);
		//}
		
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

