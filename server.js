const express = require('express');
const bodyParser = require('body-parser');
const googleSheets = require('gsa-sheets');

// TODO(you): Update the contents of privateSettings accordingly, as you did
// in HW5, then uncomment this line.
const key = require('./privateSettings.json');
// TODO(you): Change the value of this string to the spreadsheet id for your
// GSA spreadsheet, as you did in HW5, then uncomment these lines.
const SPREADSHEET_ID = '1dROZ3ISAAfHUHTKS679jM1IO75SjjSB_-ts3R4RtaXg';
const sheet = googleSheets(key.client_email, key.private_key, SPREADSHEET_ID);
//const SPREADSHEET_ID = '1leVRKnPfOIAD_hmM7jbS8stm6Y2qUrFaMxcHnjbdyAo';

const app = express();
const jsonParser = bodyParser.json();
//const sheet = googleSheets(key.client_email, key.private_key, SPREADSHEET_ID);

app.use(express.static('public'));

async function onGet(req, res) {
  const result = await sheet.getRows();
  const rows = result.rows;
  const id=req.params.id;	
  for(var i=1;i<rows.length;i++){
  	if(id === rows[i][0]){
  		res.json({text:rows[i][1]});
  		return;
  	}
  }
  none={text:null};
  res.json(none);
}
app.get('/api/:id', onGet);


async function onPost(req, res) {
  var check = req.body.delete;
  const messageBody = req.body.text;
  const id=req.params.id;	
  const result = await sheet.getRows();
  const rows = result.rows;
  var apperance=false;
  if(check === "false"){
  		for(var i=1;i<rows.length;i++){
  			if(id === rows[i][0]){
  				await sheet.setRow(i,[id,messageBody]);
  				apperance=true;
  				break;
  			}
  		}
  		if(apperance===false)
  				await sheet.appendRow([id,messageBody]);
  }
  else{
		for(var i=1;i<rows.length;i++){
			if(id === rows[i][0]){
				await sheet.setRow(i,[id,messageBody]);
			}
		}  		
  }
  	res.json("success");
}
app.post('/api/:id', jsonParser, onPost);

// Please don't change this; this is needed to deploy on Heroku.
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`CS193X: Server listening on port ${port}!`);
});
