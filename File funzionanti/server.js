import {Http3Server} from '@fails-components/webtransport';
import fs from 'fs'
import { exit } from 'process';

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
const sessioni=[];

main();

async function main() {

  const sessionStream= await server.sessionStream('/');
  const sessionReader=sessionStream.getReader();

  

    const FrameSession= await sessionReader.read();
    let Framedone=FrameSession.done;
    let Framevalue=FrameSession.value;

    if (Framedone) {

      console.log("Errore nella lettura della sessione");
      exit(1);

    }

    console.log("Nuova sessione di Frame");
    await Framevalue.ready;
    console.log("sessione Frame Pronta");
    sessioni.push(Framevalue);

    const ReceiveSession= await sessionReader.read();
    let Receivedone=ReceiveSession.done;
    let Receivevalue=ReceiveSession.value;

    if (Receivedone) {

      console.log("Errore nella lettura della sessione");
      exit(1);

    }

    console.log("Nuova sessione di Receive");
    await Receivevalue.ready;
    console.log("sessione Receive Pronta");
    sessioni.push(Receivevalue);



    const FramereceiveStream= Framevalue.incomingBidirectionalStreams;
    const FramereceiveReader= FramereceiveStream.getReader();
    const FrameincomingStream= await FramereceiveReader.read();
    const Framereader=FrameincomingStream.value.readable.getReader();

    const ReceivereceiveStream= Receivevalue.incomingBidirectionalStreams;
    const ReceivereceiveReader= ReceivereceiveStream.getReader();
    const ReceiveincomingStream= await ReceivereceiveReader.read();
    const Receivewriter=ReceiveincomingStream.value.writable.getWriter();

  
    let totalBytes=0;
    let buffer;

    while (true) {

       buffer= await Framereader.read();

        totalBytes=totalBytes+buffer.value.length;
        console.log(`arrivati ${buffer.value.length} byte li invio `);
        console.log(`Byte totali arrivati: ${totalBytes}`);

        Receivewriter.write(buffer.value);

     

  }
}


