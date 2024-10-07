import { Http3Server } from '@fails-components/webtransport';
import fs from 'fs';



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

    //invio e ricezione di un singolo datagramma

    // const writer=session.value.datagrams.writable.getWriter();
    // const reader=session.value.datagrams.readable.getReader();
    // const encoder=new TextEncoder();
    // const decoder= new TextDecoder();
    // console.log("in attesa di un messaggio");
    // let messaggio=await reader.read();
    // console.log(decoder.decode(messaggio.value));
    // const textArray=encoder.encode('bella');
    // writer.write(textArray);


    //Stream

    //Creazione di uno stream

    // const dupStream=await session.value.createBidirectionalStream();
    // const writer=dupStream.writable.getWriter();
    // const reader=dupStream.readable.getReader();
    // const encoder=new TextEncoder();
    // const decoder= new TextDecoder();
    // console.log("in attesa di un messaggio dallo Stream");
    // let messaggio=await reader.read();
    // console.log(decoder.decode(messaggio.value));
    // writer.write(encoder.encode("ciaoo"));
    // console.log("invio "+encoder.encode("ciaoo"))


    //Ricezione di uno stream bidirezionale

    // const receiveStream= session.value.incomingBidirectionalStreams;
    // const receiveReader= receiveStream.getReader();
    // const incomingStream= await receiveReader.read();
    // const decoder= new TextDecoder();
    // const reader=incomingStream.value.readable.getReader();
    // let messaggio= await reader.read();
    // console.log(decoder.decode(messaggio.value));

    //Ricezione di uno stream unidirezionale

    const receiveStream=session.value.incomingUnidirectionalStreams;
    const streamReader=receiveStream.getReader();
    const unidirectionalStream= await streamReader.read();
    const reader=unidirectionalStream.value.getReader();
    const decoder= new TextDecoder();
    let messaggio=await reader.read();
    console.log(decoder.decode(messaggio.value));

    //Creazione di uno stream unidirezionale

    // const receiveStream=await session.value.createUnidirectionalStream();
    // const writer=receiveStream.getWriter();
    // const encoder=new TextEncoder();
    // await writer.ready;
    // writer.write(encoder.encode('8 ottobre'));















}

main();
