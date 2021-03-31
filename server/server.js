const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
const port = 3001;
app.use(cors());

const polls = [
    {
        id: 1,
        title: 'What is your favourite drink?',
        options:[
            {id:0, title:'Tea', votes:0},
            {id:1, title:'Coffee', votes:0},
            {id:2, title:'Cola', votes:0},
            {id:3, title:'Beer', votes:0},
        ]
    },
    {
        id:2,
        title: 'Is this cool huh?',
        options:[
            {id:0, title:'Yes sir', votes:0},
            {id:1, title:'Naah', votes:0},
            {id:2, title:'Maybe', votes:0},
        ]
    }
];

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//Kaikki olemassa olevat kyselyt
app.get("/polls", (req, res) => {
    res.json(polls)
})

//Äänestyksen lisäys
app.post('/polls/:id/vote/:option', (req, res) => {
    var poll = polls[req.params.id-1];
    poll.options[req.params.option].votes++;
    res.json(poll);
});

//Hae tietty kysely id:n perusteella
app.get('/polls/:id', (req, res) => {
    const id = Number(req.params.id)
    const poll = polls.find(poll => poll.id === id)
    
    if (poll) {
      res.json(poll)
    } else {
        res.status(404).end()
    }    
})

//alkuperäinen pollin lisäys
app.post('/polls/add', (req, res) => {
    var poll = {
      id:(polls.length + 1),
      title: req.body.title,
      options: []
    } 
  
    req.body.options.forEach(opt => {
      poll.options.push({id: poll.options.length, title: opt, votes:0});
    });
  
    polls.push(poll);
    res.json(poll);
  });

app.listen(port, () => {
  console.log(`Servu on pystyssä ja toimii portissa ${port}`);
});