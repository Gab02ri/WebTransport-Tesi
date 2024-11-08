async function func() {

    await navigator.mediaDevices.getUserMedia({video:true, audio: true});

    let devices=await navigator.mediaDevices.enumerateDevices();
           
    devices.forEach(element => {

        console.log(element.deviceId+" "+ element.kind);
        
    });
    


}