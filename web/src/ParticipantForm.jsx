import React, { Component } from 'react';
import FormErrors from './FormErrors.jsx';
import './styles/ParticipantForm.css';
import GLibPN from 'google-libphonenumber';
import imgEdit from './assets/edit.png'
import imgDel from './assets/delete.png'

class ParticipantForm extends Component {
  constructor() {
    super();

    this.state = {
      form: false,
      add: false,
      deleting: false,
      formErrors: {name: '', email: '', phone: ''},
      nameValid: false,
      emailValid: false,
      phoneValid: false,
      formValid: true
    }
  }
  componentWillMount() {
    var add = this.props.add;
    this.setState({ form: add, add: add, nameValid: !add, emailValid: !add, phoneValid: !add, formValid: !add });
  }
  edit = (e) => {
    this.setState({
      form: true
    })
  }
  delete = (e) => {
    this.setState({
      deleting: true
    })
    this.props.deleteParticipant(this.props.participant._id);
  }
  cancelEdit = (e) => {
    this.setState({
      form: false
    })
  }
  handleUserInput (e) {
    const name = e.target.id;
    const value = e.target.value;
    this.setState({[name]: value});
    this.validateField(name, value);
  }
  validateField (fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let nameValid = this.state.nameValid;
    let emailValid = this.state.emailValid;
    let phoneValid = this.state.phoneValid;
  
    switch(fieldName) {
      case 'name':
        nameValid = value.length >= 2;
        fieldValidationErrors.name = nameValid ? '' : ' is too short';
        break;

      case 'email':
        emailValid = (value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) !== null);
        fieldValidationErrors.email = emailValid ? '' : ' is invalid';
        break;

      case 'phone':
        const phoneUtil = new GLibPN.PhoneNumberUtil();
        phoneValid = false;

        try {
          phoneValid = (phoneUtil.isValidNumber(phoneUtil.parse(value, "FI"), "FI") ||
                        phoneUtil.isValidNumber(phoneUtil.parse(value, "US"), "US"));
        } catch(err) {}

        fieldValidationErrors.phone = phoneValid ? '': ' is invalid US or FI phone number';
        break;

      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,
                    nameValid: nameValid,
                    emailValid: emailValid,
                    phoneValid: phoneValid
                  }, this.validateForm);
  }
  
  validateForm() {
    this.setState({ formValid: this.state.nameValid && this.state.emailValid && this.state.phoneValid });
  }
  submit (e) {
    e.preventDefault();

    var participant = { 
      _id: (this.state.add) ? undefined : this.props.participant._id,
      name: this.inputName.value, 
      email: this.inputEmail.value, 
      phone: this.inputPhone.value 
    };

    if (this.state.add) {
      this.participantForm.reset();
      this.setState({
        nameValid: false, emailValid: false, phoneValid: false, formValid: false
      });

    } else {
      this.setState({
        form: false
      });
    }
    this.props.updateParticipant( participant );
  }
  render() {
    var participant = this.props.participant;
    let content = null;
    if ( this.state.form ) {
      let buttons = null;
      let input1 = null;
      let input2 = null;
      let input3 = null;
      let tableClasses = "form-table";
      if (this.state.add ) {
        tableClasses += " add-table";
        buttons = <td><button type="submit" className="btn" disabled={ !this.state.formValid } >Add new</button></td>
        input1 = <td>
                    <input type="text" id="name" className="${this.errorClass(this.state.formErrors.name)" placeholder="Full name" ref={ (input) => { this.inputName = input; }} onChange={ (e) => { this.handleUserInput(e) }} />
                  </td>;
        input2 = <td>
                    <input type="text" id="email" className="${this.errorClass(this.state.formErrors.email)" placeholder="E-mail address" ref={ (input) => { this.inputEmail = input; }} onChange={ (e) => { this.handleUserInput(e) }} />
                  </td>;
        input3 = <td>
                    <input type="text" id="phone" className="${this.errorClass(this.state.formErrors.phone)" placeholder="Phone number" ref={ (input) => { this.inputPhone = input; }} onChange={ (e) => { this.handleUserInput(e) }} />
                  </td>;
      } else {
        buttons = <td>
                    <button type="button" className="btn cancelBtn" onClick={ this.cancelEdit } >Cancel</button>
                    <button type="submit" className="btn" disabled={ !this.state.formValid } >Save</button>
                  </td>
        input1 = <td>
                    <input type="text" id="name" className="${this.errorClass(this.state.formErrors.name)" defaultValue={ participant.name } ref={ (input) => { this.inputName = input; }} onChange={ (e) => { this.handleUserInput(e) }} />
                  </td>;
        input2 = <td>
                    <input type="text" id="email" className="${this.errorClass(this.state.formErrors.email)" defaultValue={ participant.email } ref={ (input) => { this.inputEmail = input; }} onChange={ (e) => { this.handleUserInput(e) }} />
                  </td>;
        input3 = <td>
                    <input type="text" id="phone" className="${this.errorClass(this.state.formErrors.phone)" defaultValue={ participant.phone } ref={ (input) => { this.inputPhone = input; }} onChange={ (e) => { this.handleUserInput(e) }} />
                  </td>;
      }
      content = <form className="form-inline" ref={ (input) => { this.participantForm = input }} onSubmit={ this.submit.bind(this) }>
                  <table className={ tableClasses }>
                    <tbody>
                      <tr>
                          { input1 }
                          { input2 }
                          { input3 }
                          { buttons }
                      </tr>
                      <FormErrors formErrors={ this.state.formErrors }/>
                    </tbody>
                  </table>
                </form>
    } else {
      let tableClasses = "list-table";
      if ( this.state.deleting ) tableClasses += " deleting";
      let row;
      if ( this.props.participant.deleteAnim ) {
        tableClasses += " anim-out";

        row = <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>;
      } else {
        row = <tr>
                <td>{ participant.name }</td>
                <td>{ participant.email }</td>
                <td>{ participant.phone }</td>
                <td>
                  <button type="button" id="edit" className="btn" onClick={ this.edit }>
                    <img alt="Edit" src={ imgEdit } className="imageBtn" />
                  </button>
                  <button type="button" id="delete" className="btn" onClick={ this.delete }>
                    <img alt="Edit" src={ imgDel } className="imageBtn" />
                  </button>
                </td>
              </tr>;
      }

      content = <table className={ tableClasses }>
                  <tbody>
                    { row }
                  </tbody>
                </table>;
    }
    return ( content );
  }
}


export default ParticipantForm;