import {Http3Server} from '@fails-components/webtransport';
import fs from 'fs'

async function main() {
    const cert=fs.readFileSync('./cert.pem');
    const privkey=fs.readFileSync('./key.pem');
    
    
    const server= new Http3Server({
        port: 4000,
        host: '127.0.0.1',
        secret: 'mysecret',
        cert: cert.toString(),
        privKey: privkey.toString()
      })
    
      server.startServer();
  
      const sessionStream= await server.sessionStream('/');
      const sessionReader=sessionStream.getReader();
      const session= await sessionReader.read();
      await session.value.ready;
      console.log("sessione pronta");

    const receiveStream= session.value.incomingBidirectionalStreams;
    const receiveReader= receiveStream.getReader();
    const incomingStream= await receiveReader.read();
    const decoder= new TextDecoder();
    const reader=incomingStream.value.readable.getReader();
    let frame= await reader.read();
    console.log(`stream ricevuto ${frame}`);

    



}

main();