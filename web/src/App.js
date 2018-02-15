import React, { Component } from 'react';
// import logo from './logo.svg';
import ParticipantForm from './ParticipantForm.jsx'
import Chance from 'chance';
import _ from 'lodash';
import './styles/App.css';
import logo from './assets/logo.png';
import iconOrder from './assets/arrow_down.png';

const chance = new Chance();
const apiUrl = "/api/participants/";

class App extends Component {
  constructor() {
    super();

    this.state = {
      participants : [],
      nameLabelClass: "",
      emailLabelClass: "",
      phoneLabelClass: ""
    }
    for (var i = 1; i <= 0; i++) {
      var firstName = chance.first();
      var lastName = chance.last();
      var participant = {};
      participant._id = chance.guid();
      participant.name = firstName +" "+ lastName;
      participant.email = firstName.toLowerCase() +"."+ lastName.toLowerCase() +"@"+ chance.domain();
      participant.phone = chance.phone({mobile: true});

      this.state.participants.push(participant);
    }
  }
  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
  }
  componentDidMount() {
    fetch(apiUrl, {
      accept: "application/json"
    }) 
      .then(this.checkStatus)
      .then(result => result.json())
      .then(arr => {
        this.setState((prev) => { 
          return { participants: prev.participants.concat(arr) } 
        });
      });
  }
  updateParticipant(participant) {
    if (participant._id === undefined) {
      fetch(apiUrl, {
        method: "POST",
        accept: "application/json",
        body: JSON.stringify(participant),
        headers: {
          'content-type': 'application/json'
        },
        cache: 'no-cache',
        credentials: 'same-origin',
        mode: 'cors',
      })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => { 
          this.setState(function(prevState, props) {
            console.log('Success:', response, prevState);
            prevState.participants.push(response);
            return { participants: prevState.participants };
          });
        });
    } else {
      // updating

      this.setState(function(prevState, props) {
        console.log("update participant: ", participant);
        prevState.participants[_.findIndex(prevState.participants, { _id: participant._id })] = participant;

        return { participants: prevState.participants };
      });
        
      fetch(apiUrl + participant._id, {
        method: "PUT",
        accept: "application/json",
        body: JSON.stringify(participant),
        headers: {
          'content-type': 'application/json'
        },
        cache: 'no-cache',
        credentials: 'same-origin',
        mode: 'cors',
      })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
    }
  }
  deleteParticipant(guid) {
    this.setState(function(prevState, props) {
      var participants = _.reject(prevState.participants, { _id: guid });

      fetch(apiUrl + guid, {
        method: "DELETE",
        accept: "application/json",
        headers: {
          'content-type': 'application/json'
        },
        cache: 'no-cache',
        credentials: 'same-origin',
        mode: 'cors',
      })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));

      return {participants: participants };
   });
  }
  orderBy(byVal){
    if (byVal === "name" || byVal === "email" || byVal === "phone") {
      this.setState(function(prevState, props) {
        var participants = _.orderBy(prevState.participants, [ byVal ]);
        return { participants: participants };
      });
    }
    if (byVal === "name") {
      this.setState({ nameLabelClass: "orderBy" });
      this.setState({ emailLabelClass: "" });
      this.setState({ phoneLabelClass: "" });
    } else if (byVal === "email") {
      this.setState({ nameLabelClass: "" });
      this.setState({ emailLabelClass: "orderBy" });
      this.setState({ phoneLabelClass: "" });
    } else if (byVal === "phone") {
      this.setState({ nameLabelClass: "" });
      this.setState({ emailLabelClass: "" });
      this.setState({ phoneLabelClass: "orderBy" });
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={ logo } className="App-logo" alt="logo" /> <h1 className="App-company">Nord Software</h1>
        </div>
        <h1 className="App-title">List of participants</h1>
        <div className="component-wrapper">
          <ParticipantForm  updateParticipant={this.updateParticipant.bind(this)} add={ true } />
          <table className="form-table">
            <tbody>
              <tr>
                <th className={ this.state.nameLabelClass }>
                  <button type="button" id="orderName" onClick={ () => { this.orderBy("name") }} className="orderButton">
                    Name <img alt="order" className="iconOrder" src={ iconOrder } />
                  </button>
                </th>
                <th className={ this.state.emailLabelClass }>
                  <button type="button" id="orderEmail" onClick={ () => { this.orderBy("email") }} className="orderButton">
                    E-mail address <img alt="order" className="iconOrder" src={ iconOrder } />
                  </button>
                </th>
                <th className={ this.state.phoneLabelClass }>
                  <button type="button" id="orderPhone" onClick={ () => { this.orderBy("phone") }} className="orderButton">
                    Phone number <img alt="order" className="iconOrder" src={ iconOrder } />
                  </button>
                </th>
                <th></th>
              </tr>
            </tbody>
          </table>
          { this.state.participants.map( (participant, i) => {
              return (
                <ParticipantForm participant={ participant } key={ i } add={ false } updateParticipant={ this.updateParticipant.bind(this) } deleteParticipant={ this.deleteParticipant.bind(this) } />
              )
            })
          }
        </div>
      </div>
    );
  }
}


export default App;
