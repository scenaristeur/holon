import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import './main-element.js'
import './nav-element.js'

class AppElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
    };
  }

  constructor() {
    super();
    this.something = "App Element"
  }

  render(){
    return html`
    <h4>${this.something}</h4>
    <main-element name="Main">Loading...</main-element>
    <nav-element name="Nav" destinataire="Main">Loading...</nav-element>

    `;
  }

  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    console.log(this.agent)
    this.agent.receive = function(from, message) {
      //  console.log("messah",message)
      if (message.hasOwnProperty("action")){
        //  console.log(message)
        switch(message.action) {
          case "webIdChanged":
          app.webIdChanged(message.webId)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

  webIdChanged(webId){
    this.webId = webId
    if (webId != null){
      this.updateProfile();
    }else{

    }
  }

}

customElements.define('app-element', AppElement);
