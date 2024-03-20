const WebSocket = require('ws');
const fs = require("fs")

let wss = 'wss://doevent-face-real-esrgan.hf.space/queue/join'

async function remini(resolusi, image) { // buffer atau base64 
return new Promise(async(resolve, reject) => {
let result = {}
let send_has_payload = {
	"fn_index":0,
	"session_hash":
	"s3xzm2ie8hj"
	}
	
/*
THANK FOR
• Danz (@dannalwaysalone)
• YanzBotz 
• All Team
• All Friends
• Parents

UNTUK CARA PENGGUNAAN:
• BUFFER / BASE62 JUGA BISA

CONTOH:
INI BISA DI UBAH UBAH SESUAI COMMAND
remini("8x", fs.readFileSync('image.jpg')).then(result => console.log(result))

ATAU KALAU MAU PAKE 8X AJA TINGGAL
remini(fs.readFileSync('image.jpg')).then(result => console.log(result))
*/
	
let resolution = { // UP TO HD
 "low": "2x",
 "medium": "4x",
 "high": "8x",
  }
let upTo = resolution[resolusi]
	
	
let send_data_payload = {
	"data":
	[
	"data:image/jpeg;base64," + image.toString('base64'),
	upTo // Kalau mau di ubah juga bisa jadi "8x", "4x", atau "2x"
	],
	"event_data":null,
	"fn_index":0,
	"session_hash":"s3xzm2ie8hj"
	}
	
    const ws = new WebSocket(wss);
    ws.onopen = function() {
     console.log("Connected to websocket")
    };

    ws.onmessage = async function(event) {
      let message = JSON.parse(event.data);

      switch (message.msg) {
        case 'send_hash':
          ws.send(JSON.stringify(send_has_payload));
          break;
           
        case 'send_data':
          console.log('Processing your image....');        
          ws.send(JSON.stringify(send_data_payload));
          break;
          
        case 'process_completed':        
         result.base64 = message.output.data[0].replace('data:image/png;base64,', '') 
 
          break;
      }
    };

    ws.onclose = function(event) {
      if (event.code === 1000) {
        console.log('Process Completed!');
      } else {
        msg.reply('[ ERROR ] >> WebSocket Connection:\n');
      }
      resolve(result)
    };
  })
}

module.exports = remini