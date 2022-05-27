import { Component, ComponentChild, createRef, h, RefObject } from "preact";


function secondsComponentToString(seconds: number): string {
    var roundedSeconds = Math.round(seconds);
    
    var asStr = roundedSeconds.toString();
    
    // not the most efficient or idiot proof way but it works
    
    if (asStr.length < 2) {
        asStr = "0" + asStr;
    }
    
    return asStr;
}

function timeSecondsToString(seconds: number): string {
    var minutes = Math.floor(seconds / 60);
    
    var remainder = seconds - (minutes * 60);
    
    return minutes.toString() + ":" + secondsComponentToString(remainder);
}


interface AudioPlayerProps {
    file_url: string
}

interface AudioPlayerState {
    playing: boolean
}


export class AudioPlayer extends Component<AudioPlayerProps> {
    state: AudioPlayerState;
    
    audioRef: RefObject<HTMLAudioElement>;
    inputRef: RefObject<HTMLInputElement>;
    
    currentTimeRef: RefObject<HTMLParagraphElement>;
    endTimeRef: RefObject<HTMLParagraphElement>;
    
    endTime: number;
    
    constructor() {
        super();
        
        this.state = {
            playing: false
        };
        
        this.audioRef = createRef();
        this.inputRef = createRef();
        this.currentTimeRef = createRef();
        this.endTimeRef = createRef();
        
        this.endTime = 1;
        
        setInterval(this.updateTimeDisplay, 200);
    }
    
    updateTimeDisplay = () => {
        var currentTime = 0;
        
        if (this.audioRef.current) {
            currentTime = Math.floor(this.audioRef.current.currentTime);
        }
        
        if (currentTime > this.endTime) {
            currentTime = this.endTime;
        }
        
        if (this.currentTimeRef.current) {
            this.currentTimeRef.current.textContent = timeSecondsToString(currentTime);
        }
        
        if (this.inputRef.current) {
            this.inputRef.current.value = (currentTime * (1000.0 / this.endTime)).toString();
        }
    }
    
    audioLoaded = () => {
        if (this.audioRef.current) {
            
            if (this.endTimeRef.current) {
                this.endTime = this.audioRef.current.duration;
                
                this.endTimeRef.current.textContent = timeSecondsToString(this.endTime);
            }
            
        }
    }
    
    sliderChanged = () => {
        if (this.inputRef.current) {
            var valueAsTime = parseInt(this.inputRef.current.value) * (this.endTime / 1000);
            
            if (this.currentTimeRef.current) {
                this.currentTimeRef.current.textContent = timeSecondsToString(valueAsTime);
            }
            
            if (this.audioRef.current) {
                this.audioRef.current.currentTime = valueAsTime;
            }
        }
    }
    
    onPlay = () => {
        if (this.audioRef.current) {
            this.audioRef.current.play();
            
            this.setState({
                playing: true
            });
        }
    }
    
    onPause = () => {
        if (this.audioRef.current) {
            this.audioRef.current.pause();
            
            this.setState({
                playing: false
            });
        }
    }
    
    render(props: AudioPlayerProps, state: any, context: any): ComponentChild {
        return <span>
            <audio ref={this.audioRef} onLoadedData={this.audioLoaded}>
                <source src={props.file_url} type="audio/mpeg"></source>
            </audio>
            
            <div class="audio-controls">
                <div class="audio-control-buttons">
                    <a onClick={this.onPlay} class="audio-control-button" style={this.state.playing ? "display: none" : "display: block"}>
                        <img src="./static/play.png" alt="Play" width="56" height="56" />
                    </a>
                    <a onClick={this.onPause} class="audio-control-button" style={this.state.playing ? "display: block" : "display: none"}>
                        <img src="./static/pause.png" alt="Pause" width="56" height="56" />
                    </a>
                </div>
                
                <div class="audio-controls-right-side">
                    <div class="audio-slider-container">
                        <input ref={this.inputRef} onInput={this.sliderChanged} type="range" min="0" max="1000" class="audio-slider"></input>
                    </div>
                    
                    <div class="audio-controls-time-markers">
                        <p ref={this.currentTimeRef}></p>
                        
                        <p ref={this.endTimeRef}></p>
                    </div>
                </div>
            </div>
        </span>;
    }
}
