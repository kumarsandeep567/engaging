import { MicrophoneIcon, StopCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const AudioRecorder = ({ fileReady }) => {

    // Audio recording state
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    // Audio recording logic
    const recordAudio = async () => {
        
        // Audio is being recorded and user clicks on the stop button
        if (recording) {
            setRecording(false);

            if (mediaRecorder) {
                mediaRecorder.stop();
                setMediaRecorder(null);
            }

            return;
        }

        // Start recording when the microphone icon is clicked
        setRecording(true);

        try {
            
            // Ask user's permission to access the microphone to record audio
            const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });

            const tempMediaRecorder = new MediaRecorder(audioStream);

            // Audio data will be available from the mediaRecorder in chunks
            const chunks = [];

            // Create an event listener to push audio data into chunks[]
            tempMediaRecorder.addEventListener("dataavailable", (event) => {
                chunks.push(event.data);
            });

            // Create an event listener to convert the chunks[] to an audio file
            tempMediaRecorder.addEventListener("stop", () => {
                let audioBlob = new Blob(chunks, {
                    type: "audio/webm; codecs=opus"
                });

                let audioFile = new File([audioBlob], "recorded_audio.ogg", {
                    type: "audio/webm; codecs=opus"
                });

                // Create a hyperlink to the audio file
                const url = URL.createObjectURL(audioFile);

                // Create an Audio element to load the audio file and get the duration
                const audioElement = new Audio(url);
                audioElement.addEventListener("loadedmetadata", () => {
                    const duration = audioElement.duration;

                    // Pass the file, url, and duration to the fileReady callback
                    fileReady(audioFile, url, duration);
                });
            });

            tempMediaRecorder.start();
            setMediaRecorder(tempMediaRecorder);
        } catch (error) {
            setRecording(false);
            console.log("MICROPHONE ACCESS DENIED: ", error);
        }
    };

    return (
        <button 
            className="tooltip tooltip-top xs:tooltip-right p-1 text-gray-400 hover:text-green-600 relative"
            data-tip = "Record audio"
            onClick={recordAudio}
        >

            {/* Show appropriate icons based on recording state */}
            { 
                recording 
                ? <StopCircleIcon className="w-6 text-red-600" /> 
                : <MicrophoneIcon className="w-6" /> 
            }
            
            
        </button>
    );
};

export default AudioRecorder;