import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';

class NavElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      menu: {type: String},
      destinataire: {type: String}
    };
  }

  constructor() {
    super();
    this.something = "Nav Element"
    this.menu = ""
    this.destinataire = ""
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet" >
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <style>
    .navbar {
      overflow: hidden;
      background-color: #333;
      position: fixed;
      bottom: 0;
      width: 100%;
    }

    .navbar a {
      float: left;
      display: block;
      color: #f2f2f2;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
      font-size: 17px;
    }

    .navbar a:hover {
      background: #f1f1f1;
      color: black;
    }

    .navbar a.active {
      background-color: #4CAF50;
      color: white;
    }
    </style>
    <h4>${this.something}</h4>
    <div class="navbar">
    <button type="button" class="btn btn-primary" name="role" @click="${this.menuChanged}">Role <i name="role" class="fas fa-users"></i></button>
        <button type="button" class="btn btn-primary" name="circle" @click=${this.menuChanged}>Cercle <i name="circle" class="fas fa-map-marked-alt"></i></button>
        <button type="button" class="btn btn-primary" name="governance" @click="${this.menuChanged}">Gouvernance <i name="governance" class="fas fa-users"></i></button>
        <button type="button" class="btn btn-primary" name="operationnel" disabled @click="${this.menuChanged}">Operationnel<i name="operationnel" class="fas fa-users"></i></button>
        <a href="https://igipartners.com/constitution-holacracy" target="_blank"  class="btn btn-sm btn-primary" name="operationnel" @click="${this.menuChanged}">Constitution</a>


    </div>
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
  //  this.agent.send(this.destinataire, {action:"menuChanged", menu: "role"});
  }

  menuChanged(e){
    var app = this
      console.log(e.target.name)
    this.menu=e.target.name
    let menus = this.shadowRoot.querySelectorAll(".navbar a")
    menus.forEach((m, i) => {
      m.name == app.menu ? m.classList.add("active") : m.classList.remove("active")
    });
    //  console.log(this.destinataire)
    this.agent.send(this.destinataire, {action:"menuChanged", menu: e.target.name});
  }

  webIdChanged(webId){
    this.webId = webId
    if (webId != null){
      this.updateProfile();
    }else{

    }
  }

}

customElements.define('nav-element', NavElement);