import React, { useState, useRef } from "react";
import {
    PauseCircleIcon,
    PlayCircleIcon
} from "@heroicons/react/24/outline";

const CustomAudioPlayer = ({ file, showVolume = true }) => {

    // Create a reference to the audio player file
    const audioRef = useRef();

    // Player controls
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // Play/pause the video on click
    const togglePlayPause = () => {
        const audio = audioRef.current;

        if (isPlaying) {
            audio.pause();
        } else {
            console.log(audio, audio.duration);
            setDuration(audio.duration);
            audio.play();
        }

        setIsPlaying(!isPlaying);
    };

    // Volume slider for the player
    const handleVolumeChange = (e) => {
        const volume = e.target.value;
        audioRef.current.volume = volume;
        setVolume(volume);
    };

    // Handler for updating the current time and remaining time
    const handleTimeUpdate = (e) => {
        const audio = audioRef.current;
        setDuration(audio.duration);
        setCurrentTime(e.target.currentTime);
    };

    // Handler for audio metadata
    const handleLoadedMetadata = (e) => {
        setDuration(e.target.duration);
    };

    // Seek bar for the player
    const handleSeekChange = (e) => {
        const time = e.target.value;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    return (
        <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-slate-200">
            <audio 
                ref={audioRef}
                src={file.url}
                controls
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="hidden"
            />
            <button onClick={togglePlayPause}>
                {isPlaying && (
                    <PauseCircleIcon className="w-6 text-gray-600"/>
                )}
                {!isPlaying && (
                    <PlayCircleIcon className="w-6 text-gray-600"/>
                )}
            </button>

            {/* Show volume slider if showVolume is enabled */}
            {showVolume && (
                <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            )}
            <input 
                type="range"
                min="0"
                max={duration}
                step="0.01"
                value={currentTime}
                onChange={handleSeekChange}
                className="flex-1 range range-xs"
            />
        </div>
    );
};

export default CustomAudioPlayer;