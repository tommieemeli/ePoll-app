import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

const url = 'http://localhost:3001'
// muuttuja joka kerää kyselyn kysymyksen (title)
const Header = (props) => (
  <h2 id="poll-tyyli">{props.title}</h2>
)

// muuttuja joka kerää kysymyksen vaihtoehdot
const Options = (props) => (
  <ul id="poll-lista">
    {props.options.map((option) => 
    <OptionContent key={option.id} options={option} pollid={props.pollid} setPoll={props.setPoll}/>
    )}
  </ul>
)

//äänestä tiettyä vastaus vaihtoehtoa
const vote = async (id, pollid, setPoll) => {

  // päivitä muuttunut poll backendiin
  await axios.post(`${url}/polls/${pollid}/vote/${id}`);

  // lataa päivitetyt pollit backendista
  const pollResponse = await axios.get(`${url}/polls`); 
  setPoll(pollResponse.data)
}

// muuttuja joka kerää vaihtoehtojen tiedot yhteen
const OptionContent = (props) => (
  <ul id="poll-lista">
    <p id="poll-tyyli"><b> {props.options.title}</b> votes: <b>{props.options.votes}</b><button 
    onClick={() => vote(props.options.id, props.pollid, props.setPoll)} id="nappula">VOTE</button></p>
  </ul>
)

//muuttuja joka kerää pollien nimet(title) ja yhdistää kaiken yhteen listaan
const PollList = ({pollData, setPoll}) => (
  <li id="poll-lista">
    {pollData.map((pollit) => 
      <Pollit key={pollit.id} pollit={pollit} setPoll={setPoll} />
    )}
  </li>
)

//muuttuja joka kerää kaiken yhteen muuttujaan
const Pollit = ({pollit, setPoll}) => {
  return(
    <ul id="kokonaisuus">
      <Header title={pollit.title}/>
      <Options options={pollit.options} pollid={pollit.id} setPoll={setPoll}/>
    </ul>
  )
}


const App = () => {  
  const [pollData, setPolls] = useState([]);
  const [title, newTitles] = useState('');
  const [newOptions, setOptions] = useState([]);
  const newOptionField = useRef(null);

  const addPoll = async () => {
    if (title === '') {
      alert("Otsikko puuttuu !")
    }

    else if (newOptions.length <= 0) {
      alert("Vaihtoehto/vaihtoehtoja puuttuu!")
    }
    else {
    await axios.post(`${url}/polls/add`, 
    {title: title, options: newOptions});

    const pollResponse = await axios.get(`${url}/polls`);
    setPolls(pollResponse.data)
    }
  }

  const handleTitleChange = (event) => {
    newTitles(event.target.value)
  }

  const handleAddOption = (event) => {
    setOptions(newOptions.concat(newOptionField.current.value));
    newOptionField.current.value = '';
  }

  useEffect(() => {
    const fetchPolls = async () => {
      const response = await axios.get(`${url}/polls`)
      setPolls(response.data)
    }
    fetchPolls();
  }, [])

  return (
    <div className="App">
      <div className="Header">
        <h1>ePoll Application</h1>        
        <div>
          <PollList pollData={pollData} setPoll={setPolls} />
        </div>
        <div className="formi">
        <form onSubmit={addPoll}>
          <h2>Title for new poll</h2><br></br>
          <input value={title} onChange={handleTitleChange} placeholder="Title.."></input>
          <h2 id="formi-otsikot">Options</h2>
          <h3 id="formi-otikot">Vaihtoehdot:</h3>
          <ul id="option-lista">
          {newOptions.map(((optionTitle, idx) => ( <li id="option-lista" key={idx}><b>{optionTitle}</b></li>)))}
          </ul><br />
          <input ref={newOptionField} placeholder="Option.."></input><br />
          <button type="button" id="formi-nappula" onClick={handleAddOption}>Add option</button>
          <input type="submit" value="submit" id="formi-nappula"></input>
        </form>
        </div>
      </div>
    </div>
  )
}

export default App;
