var express=require("express");
var bodyParser=require("body-parser");
var rongcloudSDK=require("rongcloud-sdk");

var mysql=require("mysql");
var conn=mysql.createConnection({

	host:"localhost",
	user:"root",
	password:"saisai@@",
	port:"3306",
	database:"RongyunDemo"
});


rongcloudSDK.init("pvxdm17jpcwsr","wQxcIT7jHr2Qt");

var app=express();

var urlencodedParser=bodyParser.urlencoded({extended:false});

app.post("/getToken",urlencodedParser,function(req,res){

	
	



	
});

app.post("/login",urlencodedParser,function(req,res){

	var queryUser="select * from user where name=? and password=?";
	var queryParams=[req.body.name,req.body.password];
	conn.query(queryUser,queryParams,function(err,rows,field){

		if(err){
			
			res.statusCode=500;
			res.statusMessage=err;
			res.send();
			console.log(err);			
		}else{

			if(rows.length==0){
				
				res.statusCode=503;
				res.statusMessage="username not exist";

				res.send();
				
			}else{
				
				rongcloudSDK.user.getToken(rows[0].id,rows[0].name,"",function(err,resultText){

					if(err){
	
						res.statusCode=500;
						res.statusMessage=err;
						res.send();
					}else{

						var result = JSON.parse( resultText );

						//console.log(result);
    						if( result.code === 200 ) {
      						//Handle the result.token

							var response={
								code:200,
								userId:result.userId,
								name:req.body.name,
								password:req.body.password,
								token:result.token
							};

							res.send(JSON.stringify(response));
   						}else{

							res.statusCode=result.code;
							res.statusMessage="error";
							res.send();
						}

						
					}
			
				});
			}
		}
	});	
});



app.post("/register",urlencodedParser,function(req,res){

	var insertSql="insert into user(name,password) values(?,?)";
	var params=[req.body.name,req.body.password];
	conn.query(insertSql,params,function(err,result){

		if(err){
			
			res.statusCode=500;
			res.statusMessage=err;
			console.log(err);
			res.send();	
		}else{
			
		
			var querySql="select id from user where name=? and password=?";
			
			conn.query(querySql,params,function(err,rows,field){

				if(err){
					res.statusCode=500;
					res.statusMessage=err;
					console.log(err);
					res.send();
				}else{

					//var json=JSON.parse(result);
					var response={
						code:200,
						userId:rows[0].id,
						name:req.body.name,
						password:req.body.password
					};
					
					//console.log(rows);
					res.send(response);
				}
			});
			
			
		}
	});
});

app.get("/getFriends",function(req,res){

	var queryUserAll="Select * from user";

	conn.query(queryUserAll,function(err,rows,field){

		if(err){
			
			res.statusCode=500;
			res.statusMessage=err;
			console.log(err);
			res.send();
		}else{

			//var data;
			//for(var i=0;i<rows.length;i++){

				//data[i].userId=rows[i].id;
				//data[i].name=rows[i].name;
				
			//}

			//res.send(JSON.stringify(data));
			//console.log(rows);
			res.send(rows);
			
		}
	});
});

app.get("/user",function(req,res){

	var querySql="select * from user where id=?";
	var params=req.query.userId;
	console.log(params);

	conn.query(querySql,params,function(err,rows,field){

		if(err){
			res.statusCode=500;
			res.statusMessage=err;
			console.log(err);
			res.send();
		}else{
			if(rows.length==0){
				res.send({});
			}else{
				res.send(rows[0]);
			}
			
		}
	});
});
var server=app.listen(9999,function(){

	var host=server.address().address;
	var port=server.address().port;

	console.log("call url: http://%s:%s",host,port);
});
