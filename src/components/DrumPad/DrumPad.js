import React, { Component } from 'react';
import './DrumPad.css';

class DrumPad extends Component {
    constructor(props) {
        super(props);

        this.audioHard = React.createRef();
        this.audioSoft = React.createRef();
    }

    componentDidMount() {
        window.focus();
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        this.audioHard.current.volume = this.props.hardVolume;
        this.audioSoft.current.volume = this.props.softVolume;
      }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);        
    }

    componentDidUpdate(prevProps) {
        this.stopOpenHiHat(prevProps.hiHatPosition);
    }
    
    isKeyDown = false;

    handleKeyDown = (e) => {
        if (e.key === this.props.triggerKey) {
            // Prevent key auto-repeat
            if (this.isKeyDown) { return };
            this.isKeyDown = true;

            this.playSound();
        }
    }

    handleKeyUp = (e) => {
        if (e.key === this.props.triggerKey) {
            this.isKeyDown = false;
        }
    }

    stopOpenHiHat = (prevPosition) => {
        if (
            this.props.type === 'Hi-Hat Open' && 
            this.props.hiHatPosition === 'Hi-Hat Closed' &&
            this.props.hiHatPosition !== prevPosition
        ) { 
            this.stopSound(this.audioHard.current, 40);
            this.stopSound(this.audioSoft.current, 40);
        }
    }

    playSound = () => {
        const audioHard = this.audioHard.current;
        const audioSoft = this.audioSoft.current;
        
        if (
            (audioHard.currentTime > 0 && audioHard.currentTime < 0.08)
            || (audioSoft.currentTime > 0 && audioSoft.currentTime < 0.08)
        ) {
            this.stopSound(audioHard, 80);
            audioSoft.currentTime = 0;
            audioSoft.volume = this.props.softVolume;
            audioSoft.play();
        } else {
            this.stopSound(audioSoft, 80);
            audioHard.currentTime = 0;
            audioHard.volume = this.props.hardVolume;
            audioHard.play();
        }

        if (this.props.isHiHat) {
            this.props.setHiHatPosition(this.props.type);
        }


        this.props.setDisplay(this.props.type);
    }

    stopSound = (audioRef, delay = 0) => {
        setTimeout(() => {
            audioRef.volume = 0;
        }, delay);
    }
 
    render() {
        return (
            <button 
                className="drum-pad" 
                id={this.props.type} 
                onClick={this.playSound}
                style={{ 
                    border: `3px solid hsl(${this.props.hue}, 80%, 75%)`,
                    boxShadow: `0px 0px 20px 3px hsla(${this.props.hue}, 95%, 60%, 0.25)`,
                    color: `hsl(${this.props.hue}, 80%, 75%)`

                }}
            >
                {this.props.triggerKey.toUpperCase()}
                <audio 
                    ref={this.audioHard} 
                    id={this.props.triggerKey.toUpperCase()}
                    className="clip"
                    src={this.props.hardSound} 
                    preload="auto" 
                >
                </audio>
                <audio
                    ref={this.audioSoft} 
                    id={this.props.triggerKey.toUpperCase() + '-soft'}
                    src={this.props.softSound}
                    preload="auto" 
                >
                </audio>
            </button>
        );
    }
}

export default DrumPad