const AudioRecorder = {

    EnabledMic: false,
    RequestedMic: false,
    Stream: null,
    Recorder: null,
    Recording: false,

    RequestMic: function(){
        this.RequestedMic = true;

        navigator.mediaDevices.getUserMedia({audio: true})
        .then((stream) => {
            this.Stream = stream;
            this.EnabledMic = true;
        });
    },

    Record: function(callback)
    {
        if (!this.EnabledMic)
        {
            if (this.RequestedMic)
                swal({title: 'Erro', text: 'Microfone desativado!', icon: 'error'});
            return;
        }

        if (!this.Stream)
        {
            swal({title: 'Erro', text: 'Um erro ocorreu.\n(Stream = null)', icon: 'error'});
            return;
        }

        this.Recorder = new MediaRecorder(this.Stream, {
            type: 'audio/ogg; codecs=opus'
        });

        this.Recording = true;
        this.Recorder.start(); // Starting the record
    
        this.Recorder.ondataavailable = (e) => {
            // Converting audio blob to base64
            let reader = new FileReader()
            reader.onloadend = () => {
                // You can upload the base64 to server here.
                callback(reader.result);
            }
    
            reader.readAsDataURL(e.data);
        }

    },

    StopRecording: function()
    {
        //if (!this.Recording) return;
        this.Recording = false;
        this.Recorder.stop();
    }

};