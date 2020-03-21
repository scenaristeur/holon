import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';

import './shexy-constraint.js'

class ShexyForm extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      shape: {type: Object}
    };
  }

  constructor() {
    super();
    this.something = "ShexyForm"
    this.shape = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet" >

    !! ShexyForm !!
    <h3>${this.localName(this.shape.url)}</h3>
    <h5>${this.shape.url}</h5>


    <div class="container">
    <form  id ="${this.shape.url+'_Form'}">
    <legend> <h2> ${this.localName(this.shape.url)} </h2></legend>
    <shexy-constraint .constraint=${this.shape.constraint}></shexy-constraint>

    <!-- bottom buttons -->
    ${this.shape.style == "regular" ?
    html `<button type="button" class="btn btn-primary" @click="${(e) =>this.submitForm()}">
    <i class="far fa-save"></i> Save ${this.localName(this.shape.url)}
    </button>`
    : html `<br>
    <button type="button" class="btn btn-primary" @click="${(e) =>this.displayForm(this.shape.url.replace('_Footprint', ''))}">
    <i class="fas fa-backward"></i> Back to ${this.localName(this.shape.url.replace('_Footprint', ''))} Form
    </button>`}
    </form>
    </div>




    !! ShexyForm End !!
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

  submitForm(){
    var id = this.currentShape.url
    var formData =   this.jsonFromForm(id)
    console.log("fdata",formData)
    var id_footprint = id+"_Footprint"
    console.log("idfootprint",id_footprint)
    var footprintData = this.jsonFromForm(id_footprint)
    console.log("fpdata",footprintData)
    this.data = {}
    var data = {}
    data[id] = {}
    data[id].form = formData
    data[id].footprint = footprintData
    this.data = data
    console.log(this.data)
  }


  webIdChanged(webId){
    this.webId = webId
    if (webId != null){
      //this.updateProfile();
    }else{

    }
  }

  localName(uri){
    var ln = uri;
    if (uri.lastIndexOf("#") != -1) {
      ln = uri.substr(uri.lastIndexOf("#")).substr(1)
    }else{
      ln = uri.substr(uri.lastIndexOf("/")).substr(1)
    }
    return ln
  }

}

customElements.define('shexy-form', ShexyForm);
