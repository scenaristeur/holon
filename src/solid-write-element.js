import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';

class SolidWriteElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      ttl: {type: Object}
    };
  }

  constructor() {
    super();
    this.something = "Solid Write Element"
    this.ttl = {}
  }

  render(){
    return html`
    <h4>${this.something}</h4>
    ${this.ttl.filename} :
    ${this.ttl.content}
    to do, need help, see <a href="https://github.com/scenaristeur/holon">https://github.com/scenaristeur/holon</a>

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
          case "ttlChanged":
          app.ttlChanged(message.ttl)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

  ttlChanged(ttl){
    this.ttl = ttl
    console.log(this.ttl)
  }

  webIdChanged(webId){
    this.webId = webId
    if (webId != null){
      //  this.updateProfile();
    }else{

    }
  }

}

customElements.define('solid-write-element', SolidWriteElement);
