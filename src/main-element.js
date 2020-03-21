import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import './shex-form-element.js'

class MainElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      panel: {type: String}
    };
  }

  constructor() {
    super();
    this.something = "Main Element"
    this.panel = ""
  }

  render(){
    return html`
    <shex-form-element name="ShexForm">Loading...</shex-form-element>
    <br>
    <br>
    <br>
    <br>
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
          case "menuChanged":
          app.menuChanged(message.menu)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

  menuChanged(menu){
    this.panel = menu
    this.shape_url = "https://holacratie.solid.community/public/Schema/"+menu+".shex"
    this.agent.send("ShexForm", {action: "shapeUrlChanged", shape_url: this.shape_url})
  }

  webIdChanged(webId){
    this.webId = webId
    if (webId != null){
    //  this.updateProfile();
    }else{

    }
  }



}

customElements.define('main-element', MainElement);
