
    var pages = [];			//list of data-role pages
	var links = [];			//list of data-role links
	var screenList = [];	//history of screens
	var numLinks =0;
	var numPages = 0;
	//var pageshow = new Event("pageshow");
	var pageshow = document.createEvent("Event");
	pageshow.initEvent("pageshow", true, true);
	var count=0;
	//var shake = {};
    var value=0;
   var db = null;
   var occasionList;
   var giftSelection;

window.addEventListener("DOMContentLoaded", init);
                        
function init(){
   // console.info("DOMContentLoaded");
    document.addEventListener("deviceready", checkDB);   
    //checkDB();
}

function checkDB(){
    //app start once deviceready occurs
    console.info("deviceready");
    db = openDatabase('gift Dad', '', 'giftDad', 1024*1024);
    if(db.version ==''){
        console.info('First time running... create tables'); 
        //means first time creation of DB
        //increment the version and create the tables
        db.changeVersion('','1.0',
                function(trans){
                    //something to do in addition to incrementing the value
                    //otherwise your new version will be an empty DB
                    console.info("DB version incremented");
                    //do the initial setup               
                    trans.executeSql('CREATE TABLE names(name_id INTEGER PRIMARY KEY AUTOINCREMENT, name_text TEXT)', [], 
                                    function(tx, rs){
                                        //do something if it works
                                        console.info("Table names created");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });
					 trans.executeSql('CREATE TABLE gifts(gift_id INTEGER PRIMARY KEY AUTOINCREMENT, name_id INTEGER, occassion_id INTEGER, gift_idea TEXT )', [], 
                                    function(tx, rs){
                                        //do something if it works
                                        console.info("Table gifts created");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });
					  trans.executeSql('CREATE TABLE occassions(occassion_id INTEGER PRIMARY KEY AUTOINCREMENT, occasion_text TEXT)', [], 
                                    function(tx, rs){
                                        //do something if it works
                                        console.info("Table gifts created");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });
                 /*   trans.executeSql('INSERT INTO names(name_text) VALUES(?)', ["meghna"], 
                                    function(tx, rs){
                                        //do something if it works, as desired   
                                        console.info("Added row in names");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });
					  trans.executeSql('INSERT INTO gifts(gift_idea) VALUES(?)', ["Christmas Gift"], 
                                    function(tx, rs){
                                        //do something if it works, as desired   
                                        console.info("Added row in gifts");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });
					trans.executeSql('INSERT INTO occassions(ocassion_name) VALUES(?)', ["New Year"], 
                                    function(tx, rs){
                                        //do something if it works, as desired   
                                        console.info("Added row in occassion");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });*/
                },
                function(err){
                    //error in changing version
                    //if the increment fails
                    console.info( err.message);
                },
                function(){
                    //successfully completed the transaction of incrementing the version number   
                });
        addNavHandlers();
    }else{
        //version should be 1.0
        //this won't be the first time running the app
        console.info('Version: ', db.version)   
        addNavHandlers();
    }
	viewGiftIdeas();
}

function addNavHandlers(ev){

                  
				  pages = document.querySelectorAll('[data-role="page"]');
				  numPages = pages.length;
			  
				  links = document.querySelectorAll('[data-role="link"]');
				  numLinks = links.length;		
				  
				  for(var lnk=0; lnk<numLinks;lnk++ ){
					if( detectTouchSupport() ){
						links[lnk].addEventListener("touchend", handleTouchEnd); 
					}else{
						links[lnk].addEventListener("click", handleLinkClick); 
					}
				  }
					document.querySelector("#home").addEventListener("pageshow",viewGiftIdeas);
					document.querySelector("#two").addEventListener("pageshow", preparePeoplename);
					document.querySelector("#three").addEventListener("pageshow", makeOccasionList);	
					document.querySelector("#four").addEventListener("pageshow", saveGifts);	
					
					document.querySelector('#saved').addEventListener('click', addpeople);
					//checkDB();
	}


function handleTouchEnd(ev){
	//pass the touchend event directly to a click event
	ev.preventDefault();
	var target = ev.currentTarget;
	var newEvt = document.createEvent('Event');
	newEvt.initEvent('tap', true, true);
	target.addEventListener('tap', handleLinkClick);
	target.dispatchEvent(newEvt);
	//this will send a click event from the touched tab to 
}
	
function handleLinkClick(ev){
	ev.preventDefault( );  //we want to handle clicks on the link
	var href = ev.currentTarget.href;
	var parts = href.split("#");	//could be #home or index.html#home
	loadPage( parts[1] );
	var pageID="#"+parts[1];
	console.log(pageID);
	var pagelodeid=document.querySelector(pageID)
	    pagelodeid.dispatchEvent(pageshow);		//send the "home" part
}

function loadPage( pageid ){
  	//code to use AJAX to load a url and display it OR just to switch between divs
  	//keep track of the new URL in a global array
  	//add animations to move between divs if you want
	//use display:block / display: none; if no animations
	if( pageid == null || pageid == "undefined"){
		//show the home page
		pageid = pages[0].id;
	}
	if( screenList[ screenList.length - 1] != pageid){
		screenList.push( pageid );  //save the history
		//don't bother saving if it is the same page
	}
	//remove active class from all pages except the one called pageid
	for(var pg=0;pg<numPages;pg++){
		if(pages[pg].id == pageid){
		//	pages[pg].className = "active";
			pages[pg].className = "show";
			//animation off the page is set to take 0.4 seconds
			setTimeout(showPage, 10, pages[pg]);
			
		}else{
			pages[pg].className = "";
			//now add the class active to animate.
			setTimeout(hidePage, 300, pages[pg]);	
		}
		//if you ever use other classes on the pages then you need to handle that 
		//scenario and not delete those other classnames
		//there is a property called classList that you can use in all browsers except IE before version 10
	}
	
	
	//update the style of the tabs too
	for(var lnk=0; lnk<numLinks; lnk++){
		links[lnk].className = "";
	}
	var currTab = document.querySelector('[href="#' + pageid + '"]').className = "activetab";
	
}

function hidePage(pg){
	pg.className = "hide";

	//this class replaces show
}

function showPage(pg){
	pg.classList.add("active");
	//window.addEventListener("shake", onshake);
	
	
}
		
function detectTouchSupport( ){
	  msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
	  touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
	  return touchSupport;
	}
		

function viewGiftIdeas() {
	document.getElementById('Ideas').addEventListener('change', getData, false);
    //just a function to show it in use.
	//select query and display
    //db.transaction(function(trans){
		//console.log(giftSelection);
		//trans.executeSql('SELECT occasion_text AS count FROM occassions', [], goodQuery, badQuery);
		//trans.executeSql('SELECT occassion_id AS count FROM occassions where occasion_text=?', [giftSelection], goodQuery, badQuery);
		
       //trans.executeSql('SELECT g.gift_idea, o.occasion_text FROM gifts AS g INNER JOIN occassions AS o ON g.occassion_id = o.occassion_id WHERE g.name_id=?', [],goodQuery,badQuery);    
    //}, transErr, transSuccess);	
	db.transaction(function(trans){
		//console.log(giftSelection);
		//trans.executeSql('SELECT occasion_text AS count FROM occassions', [], goodQuery, badQuery);
		trans.executeSql('SELECT occasion_text AS count FROM occassions ', [],function(tx, rs){
			console.info("success getting number of rows");         
      console.info("number of items in names display");
	  var numRecords = rs.rows.length; 
	  console.log(numRecords);
	  var selectIdea = document.querySelector("#Ideas");
	  selectIdea.length = 0;  //this clears out the existing options. 
	  
	  var defaultOpt = document.createElement("option");
	  defaultOpt.innerHTML = "List of Ideas";
	  selectIdea.appendChild(defaultOpt);
	  
	  for(var i=0; i<numRecords; i++){ 
		var opt = document.createElement("option"); 
		opt.innerHTML=rs.rows.item(i).count;
		selectIdea.appendChild(opt); 
	  }
	  },badData);
		
       //trans.executeSql('SELECT g.gift_idea, o.occasion_text FROM gifts AS g INNER JOIN occassions AS o ON g.occassion_id = o.occassion_id WHERE g.name_id=?', [],goodQuery,badQuery);    
    }, transErr, transSuccess);	
		
} 
 

  //document.getElementById('Ideas').addEventListener('change', getData, false);
  


function badQuery(tx, err){
}
//Add person and click save to save the person name into database

function getData(){
	giftSelection = document.getElementById('Ideas').value;
	console.log(giftSelection);
	db.transaction(function(trans){
		//console.log(giftSelection);
		//trans.executeSql('SELECT occasion_text AS count FROM occassions', [], goodQuery, badQuery);
		trans.executeSql('SELECT occassion_id AS count FROM occassions where occasion_text=?', [giftSelection],function(tx,rs){
			var temp = rs.rows.item(0).count;
			console.log(temp);
			db.transaction(function(trans){
		//SELECT * FROM gifts AS g INNER JOIN names AS n ON g.name_id = n.name_id INNER JOIN occassions AS o ON g.occassion_id = o.occassion_id
		//trans.executeSql('SELECT * FROM gifts AS g INNER JOIN names AS n ON g.name_id = n.name_id INNER JOIN occassions AS o ON g.occassion_id = o.occassion_id WHERE gift_idea = "' + giftSelection + '";', [],goodData,badData);    
        trans.executeSql('SELECT a.gift_idea AS idea, b.name_text AS name FROM gifts AS a INNER JOIN names AS b ON a.name_id = b.name_id WHERE occassion_id=?', [temp],goodData,badData);
    }, transErr, transSuccess);
	
			},badData);
		
       //trans.executeSql('SELECT g.gift_idea, o.occasion_text FROM gifts AS g INNER JOIN occassions AS o ON g.occassion_id = o.occassion_id WHERE g.name_id=?', [],goodQuery,badQuery);    
    }, transErr, transSuccess);	
	
}

function goodData(tx, rs){
	console.log(rs.rows);
	console.log(rs.rows.length);
		//console.log(rs.rows.item(0).name_text);
		//console.log(rs.rows.item(0).gift_idea);
	document.querySelector("#di").innerHTML = "";
	 for(var i=0;i<rs.rows.length;i++){
		 
                var displayName= document.createElement("li");
				//console.log(rs.rows.item(i).cnt);
				console.log(rs.rows.item(i).idea);
				  displayName.innerHTML="Name: "+rs.rows.item(i).name;
				  document.querySelector("#di").appendChild(displayName);
                //console.log (rs.rows.item(i).name_text);
				}
	 for(var j=0;j<rs.rows.length;j++){
		 
                var displayIdeas= document.createElement("li");
				//console.log(rs.rows.item(i).cnt);
				console.log(rs.rows.item(j).idea);
				  displayIdeas.innerHTML="Idea: "+rs.rows.item(j).idea;
				  document.querySelector("#di").appendChild(displayIdeas);
                //console.log (rs.rows.item(i).name_text);
				}
				
}
function badData(tx, err){
}

function preparePeoplename(){
	  document.querySelector('#saved').addEventListener('click', addpeople);
	  
} 

function addpeople(){
	var namevalue=document.querySelector("#person").value;
	console.log(document.querySelector("#person").value);
	if(namevalue == ""){
		//must fill in name
		alert("Enter your name");
	}else{
	 db.transaction(function(trans){
	 trans.executeSql('SELECT COUNT(*) AS cnt FROM names WHERE name_text=?', [namevalue],
	 //trans.executeSql('SELECT name_text FROM names', [], 
            function(tx, rs){
                //success running the query
               var nameSum=rs.rows.item(0).cnt;
                console.log (rs.rows.item(0).cnt);
				//console.log (rs.rows.item(1).name_text);
                console.info("number of items in names");
				if(nameSum==0){
					addpersonname(tx);
				document.getElementById("perMessage").innerHTML = namevalue + " has been added";
					//alert("Your name has been added");
				} else{
					alert("Oops this name already exist");
				}
            }, 
            function(tx, err){
                //failed to run the query
                console.info( err.message);
            });    
	
  }, transErr, transSuccess);	
	}
}

function addpersonname(trans){
	var namevalue=document.querySelector("#person").value;
	//db.transaction(function(trans){
		trans.executeSql('INSERT INTO names(name_text) VALUES(?)', [namevalue], 
                                    function(tx, rs){
                                        //do something if it works, as desired  
										 
                                        console.info("Added "+namevalue+" in names");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });
		trans.executeSql('SELECT name_text FROM names', [], 
            function(tx, rs){
                //success running the query
               
                //console.log (rs.rows.item(0).name_text);
             
            }, 
            function(tx, err){
                //failed to run the query
                console.info( err.message);
            });    							
		
	 
}

function makeOccasionList(){
    document.querySelector("#save").addEventListener('click', addOccassion);
}

function addOccassion(){
	
	 occasionList = document.querySelector("#occasion").value;
	console.log(document.querySelector("#occasion").value);
	 if (occasionList==""){
					alert("Enter your occasion !!");
				} else{
	db.transaction(function(trans){
	 trans.executeSql('SELECT COUNT(*) AS cnt FROM occassions WHERE occasion_text=?', [occasionList],
	 //trans.executeSql('SELECT name_text FROM names', [], 
            function(tx, rs){
                //success running the query
               var occasionCount = rs.rows.item(0).cnt;
                console.log (rs.rows.item(0).cnt);
				//console.log (rs.rows.item(1).name_text);
                console.info("number of items in occassions table");
				if (occasionCount== 0){
					 addOccasionName(tx);
				 //document.getElementById("nwOccasion").innerHTML +=occasionList + " has been added";
					 alert(occasionList +"has been added");	
				}
				else{
					alert("This occassion name is already in Database .Try with new one");
				}
		
            }, 
            function(tx, err){
                //failed to run the query
                console.info( err.message);
            });    
	
  }, transErr, transSuccess);	
}
}

function addOccasionName(trans){
	var occasionList=document.querySelector("#occasion").value;
	//db.transaction(function(trans){
		trans.executeSql('INSERT INTO occassions(occasion_text) VALUES(?)', [occasionList], 
                                    function(tx, rs){
                                        //do something if it works, as desired   
                                        console.log("Added "+occasionList+" in occassions");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });
		trans.executeSql('SELECT occasion_text FROM occassions', [], 
            function(tx, rs){
                //success running the query
               
                console.log (rs.rows.item(0).occasion_text);
             
            }, 
            function(tx, err){
                //failed to run the query
                console.info( err.message);
            });    							
		
	// }, transErr, transSuccess);	
}

function saveGifts()
{
	//1
	 db.transaction(function(trans){
	 trans.executeSql('SELECT occasion_text AS cnt FROM occassions', [],
	 function(tx, rs){
                //success running the query
				for(var i=0;i<rs.rows.length;i++){
                var option= document.createElement("option");
				  option.innerHTML = "List of Occassion";
				console.log(rs.rows.item(i).cnt);
				  option.innerHTML=rs.rows.item(i).cnt;
				  document.querySelector("#ocasnList").appendChild(option);
                console.log (rs.rows.item(i).occasion_text);
				}
            }, 
            function(tx, err){
                //failed to run the query
                console.info( err.message);
            }); 
			trans.executeSql('SELECT name_text AS count FROM names', [],
	 function(tx, rs){
                //success running the query
				for(var j=0;j<rs.rows.length;j++){
                var option1= document.createElement("option");
				 option1.innerHTML = "List of Names";
				  console.log(rs.rows.item(j).count);
				  option1.innerHTML=rs.rows.item(j).count;
				  document.querySelector("#pplList").appendChild(option1);
                console.log (rs.rows.item(j).name_text);
				}
            }, 
            function(tx, err){
                //failed to run the query
                console.info( err.message);
            }); 
	 });
	 
	 document.querySelector("#btnsubmit").addEventListener("click", addGift);
}
function addGift(){
   	var selectedGift = document.querySelector("#giftIdea").value;
	 console.log(document.querySelector("#giftIdea").value);
	 if (selectedGift==""){
					alert("Enter your gift name !!");
				} else{
	db.transaction(function(trans){
	 trans.executeSql('SELECT COUNT(*) AS cnt FROM gifts WHERE gift_idea=?', [selectedGift],
	 //trans.executeSql('SELECT name_text FROM names', [], 
            function(tx, rs){
                //success running the query
               var giftCount = rs.rows.item(0).cnt;
                console.log(rs.rows.item(0).cnt);
				//console.log (rs.rows.item(1).name_text);
                console.log("number of items in gifts table");
				if (giftCount== 0){
					 addGiftName(tx);	
					 //document.getElementById("nwGift").innerHTML +=selectedGift+ " has been added"; 	
					 alert(selectedGift+ " has been added"); 
				}
				else{
					alert("This gift idea is already in Database .Try with new one");
				}
				 
            }, 
            function(tx, err){
                //failed to run the query
                console.info( err.message);
            });    
	
  }, transErr, transSuccess);	
}
}

function addGiftName(trans){
	var selectedGift = document.querySelector("#giftIdea").value;
	
	var selectedName = document.querySelector("#pplList").value;
	var selectedOccassion = document.querySelector("#ocasnList").value;
	var nameID;
	var occassionID;	
	trans.executeSql("SELECT name_id FROM names WHERE name_text ='"+ selectedName +"'", [], 
			function(tx, rs){
				nameID = rs.rows.item(0).name_id;
				//alert(nameID)	
														
				trans.executeSql("SELECT occassion_id FROM occassions WHERE occasion_text ='"+ selectedOccassion +"'", [], 
						function(tx, rs){
							occassionID = rs.rows.item(0).occassion_id;
							//alert(occassionID)	
							
							trans.executeSql('INSERT INTO gifts(gift_idea, occassion_id, name_id) VALUES(?,?,?)', [selectedGift, occassionID, nameID], 
								function(tx, rs){
									//do something if it works, as desired   
									console.log("Added "+selectedGift+" in gifts with name");
								},
								function(tx, err){
									//failed to run query
									console.info( err.message);
								});
									
						}, 
						function(tx, err){
									
						});
									
									
					}, 
					function(tx, err){
									
					});
								
	/*trans.executeSql("SELECT occassion_id FROM occassions WHERE occasion_text ='"+ selectedOccassion +"'", [], 
								function(tx, rs){
									occassionID = rs.rows.item(0).occassion_id;
									alert(occassionID)	
								}, 
								function(tx, err){
									
								});*/
									
	//db.transaction(function(trans){
		/*trans.executeSql('INSERT INTO gifts(gift_idea, occassion_id, name_id) VALUES(?,?,?)', [selectedGift, occassionID, nameID], 
                                    function(tx, rs){
                                        //do something if it works, as desired   
                                        console.log("Added "+selectedGift+" in gifts with name");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });*/
		trans.executeSql('SELECT gift_idea FROM gifts', [], 
            function(tx, rs){
                //success running the query
               
                //console.log(rs.rows.item(0).gift_idea);
             
            }, 
            function(tx, err){
                //failed to run the query
                console.info( err.message);
            });    							
		
	 //}, transErr, transSuccess);	
}


function transErr(tx, err){
    //a generic function to run when any transaction fails
    //navigator.notification.alert(message, alertCallback, [title], [buttonName])
    console.info("Error processing transaction: " + err);
}

function transSuccess(){
    //a generic function to run when any transaction is completed
    //not something often done generically
}
