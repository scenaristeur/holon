import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';

class ShexConstraintElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      constraint: {type: Object}
    };
  }

  constructor() {
    super();
    this.something = "ShexConstraintElement"
    this.constraint = {}
  }

  render(){
    return html`
    <h4>${this.something}</h4>
    <pre>
      ${JSON.stringify(this.constraint, null, 2)}
      </pre>

      <br>
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

customElements.define('shex-constraint-element', ShexConstraintElement);
