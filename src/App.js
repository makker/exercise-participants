import React, { Component } from 'react';
// import logo from './logo.svg';
import ParticipantForm from './ParticipantForm.jsx'
import Chance from 'chance';
import _ from 'lodash';
import './styles/App.css';
import logo from './assets/logo.png';
import iconOrder from './assets/arrow_down.png';

const chance = new Chance();

class App extends Component {
  constructor() {
    super();

    this.state = {
      participants : [],
      nameLabelClass: "",
      emailLabelClass: "",
      phoneLabelClass: ""
    }
    for (var i = 1; i <= 20; i++) {
      var firstName = chance.first();
      var lastName = chance.last();
      var participant = {};
      participant.id = chance.guid();
      participant.name = firstName +" "+ lastName;
      participant.email = firstName.toLowerCase() +"."+ lastName.toLowerCase() +"@"+ chance.domain();
      participant.phone = chance.phone({mobile: true});

      this.state.participants.push(participant);
    }
  }
  updateParticipant(participant) {
    this.setState(function(prevState, props) {
      if (participant.id === undefined) {
        // Adding new, create a unike key for each new participant item
        participant.id = chance.guid();
        prevState.participants.push(participant);
      } else {
        // updating
        prevState.participants[_.findIndex(prevState.participants, { id: participant.id })] = participant;
      }
      return { participants: prevState.participants };
    });
  }
  deleteParticipant(guid) {
    this.setState(function(prevState, props) {
      var participants = _.reject(prevState.participants, { id: guid });
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
