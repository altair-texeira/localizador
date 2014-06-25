  var $img        = 'icon.png';
  var latitude    =   null;
  var longitude   =   null;
	
	function dbInit(ob)
	{
	  ob.executeSql('CREATE TABLE IF NOT EXISTS objects (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, date TEXT DEFAULT "null", name TEXT DEFAULT "null", src TEXT DEFAULT "null", latitude TEXT  DEFAULT "null", longitude TEXT  DEFAULT "null")');
	};
	function getDB()
	{
	  return window.openDatabase("LocalizadorDB3", "1.0", "Localizador Database", 900000);
	};
	
	function populateDB(tx)
	{
	  dbInit(tx);
	};   
	
	function queryDB(tx) {
	
	};
	
	function querySuccess(tx, results) {
	};
	function errorCB(err) {
	  console.log("Error processing SQL: "+err.code);
	  alert('code: '    + err.code    + '\n' +
	  'message: ' + err.message + '\n');
	};
	function successCB() {
	  getDB().transaction(queryDB, errorCB);
	};
	function onDeviceReady() {
	  getDB().transaction(populateDB, errorCB, successCB);
	  getObjects();
	};
	function savePosition(pos)
	{
	  latitude    =   pos.coords.latitude;
	  longitude   =   pos.coords.longitude;
	  
	  $('#save-object').removeClass("ui-disabled");
	  $('#save-object  .ui-btn-text').text('Feito! Você pode salvar agora!');
	};
	function takeImage() {         
	  var opt = {
		quality: 50,
	 destinationType: navigator.camera.DestinationType.FILE_URI,
	 sourceType : Camera.PictureSourceType.CAMERA, 
	 allowEdit : true,
	 encodingType: Camera.EncodingType.JPEG,
	 targetWidth: 100,
	 targetHeight: 100
	  };
	  return navigator.camera.getPicture(newImage, errorCB, opt);
	};
	function newImage(src)
	{
	  $img   =  src;
	};
	function showImage(id)
	{
	  
	  
	  var _Query  =   "select src from objects where id = "+id;
	  
	  getDB().transaction(function(tx){
		dbInit(tx);
		tx.executeSql(_Query, [],
					  function(qr,rs){
						
						var len = rs.rows.length;
						
						for (var i=0; i<len; i++){
						  $('#_photo').attr('src',rs.rows.item(i).src);
						  $("#sql_console").append("<br/> IMAGE SRC: "+rs.rows.item(i).src);
						}
					  }, errorCB);
	  }, errorCB, successCB);
	};
	function objectSave()
	{
	  var now =   new Date().toLocaleDateString();
	  var name = $("#name").val().toUpperCase();
	  
	  
	  
	  for (var i = 0; i<=(name.length-1);i++)
	  {
		name = name.replace('"',"'");
	  }
	  
	  if(validForm())
	  {
		var statements_     =   'INSERT INTO objects (date,src,name,latitude, longitude) VALUES ("'+ now +'","'+ $img +'","'+name+'","'+latitude+'","'+longitude+'")';
		
		getDB().transaction(function(tx){
		  dbInit(tx);
		  tx.executeSql(statements_);
		}, errorCB, successCB);
		  
		  window.location.reload(true);
		console.log(statements_);
		return;
	  }
	};
	function getObjects()
	{
	  
	  $("#table-of-objects").html('');
	  
	  var _Query  =   "select * from objects";
	  
	  getDB().transaction(function(tx){
		dbInit(tx);
		tx.executeSql(_Query, [],
					  function(qr,rs){
						
						var len = rs.rows.length;
						
						for (var i=0; i<len; i++){
						  $("#table-of-objects").append("<tr><td>"+rs.rows.item(i).date+"</td><td>"+rs.rows.item(i).name+"</td><td><a href='#dialogPage' data-rel='dialog'  data-role='button' data-mini='true' data-icon='search'  data-iconpos='notext' data-id='"+rs.rows.item(i).id+"'>View</a><a href='#dialogPage' data-rel='dialog'  data-role='button' data-icon='delete' data-action='delete' data-iconpos='notext' data-id='"+rs.rows.item(i).id+"'>Delete</a></td></tr>");
						}
					  }, errorCB);
	  }, errorCB, successCB);
	};
	function validForm()
	{
	  var name    =   !$('#name').val()?'':$('#name').val();
	  
	  if(name.length>=4)
	  {
		return true;
	  }
	  else if(name.length<1)
	  {
		alert('Por favor, insira o nome.');
		$('#name').focus();
		return false;
	  }
	  
	  alert('O nome precisa ter 4 caracteres no mínimo.');
	  $('#name').focus();
	  return false;
	};
	  $("#photo").on('click',function(){
		  if(validForm())
		  {
			takeImage();
		  }
	  });
		
		  
		  $("#save-object").on('click',function(){objectSave();});
		getObjects();
		
		$("#table-of-objects").on('click','a',function(){
		  
		  var id  =   $(this).attr('data-id');
		  var action  =   $(this).attr('data-action');
		  
		  if(action==='delete')
		  {
			if(confirm(action))
			{
			  
			  statements_ =   'delete from objects where id='+id;
			  
			  getDB().transaction(function(tx){
				dbInit(tx);
				tx.executeSql(statements_);
			  }, errorCB, successCB);
			  alert('Deletado!');
			}
			document.location   =   'index.html';
		  }
		  
		  
		  var _Query  =   "select * from objects where id="+id;
		  
		  console.log(_Query);
		  getDB().transaction(function(tx){
			dbInit(tx);
			tx.executeSql(_Query, [],
						  function(qr,rs){
							
							var len = rs.rows.length;
							
							for (var i=0; i<len; i++){
							  $("#object-title-dialog").html(rs.rows.item(i).name);
							  $("#object-content-dialog").html('Latitude:'+rs.rows.item(i).latitude + '</br> <br/>Longitude:'+rs.rows.item(i).longitude);
							  $("#object-image-dialog").attr('src',rs.rows.item(i).src);
							}
						  }, errorCB);
		  }, errorCB, successCB);
							  
							  $.mobile.dialog.prototype.options.initSelector = ".mydialog";
							  $('#dialogPage').dialog();
		});
			$('.refresh').on('click',function(){
			  window.location.reload(true);
			});
	  $('#getPosition-btn').on('click',function(){
		$('#save-object').addClass("ui-disabled");
		$('#save-object  .ui-btn-text').text('Espere a localização...');
		navigator.geolocation.getCurrentPosition(savePosition, errorCB);
	  }); 
