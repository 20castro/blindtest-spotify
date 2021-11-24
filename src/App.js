/* global swal */

import React from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-solid-svg-icons'
import swal from 'sweetalert';

// A regénérer sur https://developer.spotify.com/console/get-current-user-saved-tracks/
const apiToken = 'BQAeJDjX076ZzTvxQ_xKhLWp2Jk3T23ZWbMWrR2vPFoNF_YyS7F50Uc5Wd9vWcTV5yEFzXPlXFDivIiLSzbpJM0-jcSmWoMAaea0kYw3b-XiuV_t_QZRxORkKJHSEa89dtpcE6ereIlHw9KCmNd4ur9LGSCHFRCIK-TKoUC8t5DbvD-T';

function getRandomNumber(x) {
  /* Return a random number between 0 included and x excluded */
  return Math.floor(Math.random() * x);
}

function shuffleArray(array) {

  for (let counter = array.length; counter > 0; counter--){
    let index = getRandomNumber(counter);
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
};

const AlbumCover = ({ currentTrack }) => {
  const src = currentTrack.track.album.images[0].url;
  return (
      <img src={src} style={{ width: 400, height: 400 }} />
  )
};

const Launcher = ({ play, set }) => {
  const icon = play ? faPlayCircle : faPauseCircle 
  return (
    <Button onClick={() => { set(!play) }}><FontAwesomeIcon icon={ icon } /></Button>
  )
};

const Audio = ({ play, set, tracks }) => {
  if (play){
    return (
      <Sound
        url={ tracks[0].track.preview_url }
        playStatus={ Sound.status.PLAYING }
        onFinishedPlaying={() => { set(false) }}
      />
    )
  }
  else{
    return null
  }
}

const App = () => {

  const [text, setText] = useState(''); // text initialisé à '' et modifiable avec setText(...)
  const [tracks, setTracks] = useState([]);
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [track1, setTrack1] = useState({});
  const [track2, setTrack2] = useState({});
  const [track3, setTrack3] = useState({});
  const [current, setCurrent] = useState('');

  const checkAnswer = (id) => {
    if (current == id){
      console.log('Right answer');
      swal('Bravo', "C'est le bon morceau", 'success');
    }
    else{
      console.log('Wrong answer');
      console.log('Current : ', current);
      console.log('Selected : ', id);
    }
  }

  useEffect(() => {
    fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
      Authorization: 'Bearer ' + apiToken,
      },
    })
      .then(response => response.json())
      .then((data) => {
        setTracks(data.items);
        setCurrent(data.items[0].track.id);
        setTrack1(data.items[0]);
        setTrack2(data.items[1]);
        setTrack3(data.items[2]);
        setSongsLoaded(true);
      })
  }, []);

  if (songsLoaded){

    console.log('Titres likés trouvés : ', tracks);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Bienvenue sur le Blindtest</h1>
        </header>
        <div className="App-images">
          <Launcher play={ launched } set={ setLaunched }/>
          <p>{ tracks.length } items found</p>
          <p>First item : { tracks[0].track.name }</p>
          <AlbumCover currentTrack={ tracks[0] } />
          <Audio play={ launched } set={ setLaunched } tracks={ tracks }/>
        </div>
        <div className="App-buttons">
          <Button onClick={ () => { checkAnswer(track1.track.id) } }>{ track1.track.name }</Button>
          <Button onClick={ () => { checkAnswer(track2.track.id) } }>{ track2.track.name }</Button>
          <Button onClick={ () => { checkAnswer(track3.track.id) } }>{ track3.track.name }</Button>
        </div>
      </div>
    );
    
  }
  else {
    return (
      <div className="App">
        <header className="App-header">
          <img src={loading} className="App-logo" alt="logo"/>
        </header>
      </div>
    );
  }
}

export default App;
