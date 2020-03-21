import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';

class ShexyConstraint extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      constraint: {type: Object}
    };
  }

  constructor() {
    super();
    this.something = "ShexyConstraint"
    this.constraint = {}
  }

  render(){

    const getMinMax = (constraint) => html `
    <label><small>
    ${constraint.min
      ? html `min: ${constraint.min},`
      : html ``
    }
    ${constraint.max
      ? html ` max: ${constraint.max}`
      : html ``
    }
    </small></label><br>`

    const getConstraint = (constraint) => html`
    ${constraint.type ?
      html ``
      :html`type non défini : ${this.toText(constraint)}`
    }
    ${this.isFieldset(constraint.type)
      ? html `
      <div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title" title="${this.toText(constraint)}">${constraint.type}</h5>
    <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
    <p class="card-text">
      `
      :html ``
    }
    ${constraint.expression
      ? html`
      <!--  <small><span title="Expression ${this.toText(constraint.expression)}">Expression</span></small> -->
      ${getConstraint(constraint.expression)}
      `
      : html``
    }
    ${constraint.expressions
      ? html` <!--<small><span title="Expressions ${this.toText(constraint.expressions)}">Expressions</span></small>-->
      ${constraint.expressions.map(i => html`${getConstraint(i)}`)}`
      : html``
    }
    ${constraint.predicate
      ? html`
      <label  title="${this.toText(constraint)}">
      ${this.setLastPredicate(constraint.predicate)}</label>`
      : html``
    }
    ${constraint.valueExpr
      ? html`${getConstraint(constraint.valueExpr)}`
      : html``
    }
    ${constraint.datatype
      ? html`${constraint.datatype.endsWith("date")
      ? html `<!--<small>${constraint.datatype}</small><br>-->
      <input type="date" class="form-control"
      title="${constraint.datatype}"
      name="${this.getLastPredicate()}"
      valueof="${this.getUuid()}"
      @click="${this.changeRadio}"
      ></input>`
      : html `
      <!--<small>${constraint.datatype}</small><br>-->
      <input type="text" class="form-control"
      title="${constraint.datatype}"
      label="${constraint.datatype}"
      name="${this.getLastPredicate()}"
      valueof="${this.getUuid()}"
      @click="${this.changeRadio}"
      ></input>
      `
    }`
    : html``
  }
  ${constraint.shapeExprs
    ? html`<div title="${this.toText(constraint)}">
    ${constraint.type == "ShapeOr"
    ?html `<fieldset class="teal lighten-4"><legend class="teal lighten-4"><h6> Choose one of</h6></legend>
    ${constraint.shapeExprs.map(
      shapeExp => html`
      ${Object.keys(shapeExp).map(key =>
        html`${key == "type"
        ? html `<!--<span>${key}: ${shapeExp[key]}<br></span>-->`
        : html `<p>
        <label class="flow-text">
        <input class="form-control"
        id="${this.setUuid()}"
        title="${shapeExp}"
        name="${this.getLastPredicate()}"
        format="${key}"
        type="radio"
        checked />
        <span class="flow-text teal lighten-5 darken-3-text">${key}</span>
        ${getConstraint(shapeExp)}
        </label>
        </p>
        `
      }
      `
    )}
    `
  )}
  </fieldset>
  `
  : html `${constraint.shapeExprs.map(
    shapeExp => html`${getConstraint(shapeExp)}`
  )}
  `
}
</div>`
: html``
}
${constraint.nodeKind
  ? html`<input
  type="text" class="form-control"
  title="${constraint.nodeKind}"
  placeholder="${constraint.nodeKind}"
  name="${this.getLastPredicate()}"
  valueof="${this.getUuid()}"
  @click="${this.changeRadio}"
  ></input>${getMinMax(constraint)}`
  : html``
}
${constraint.reference
  ? html`
  <!--1  <input type="text" class="validate teal lighten-5"
  placeholder="${constraint.reference}"
  title="${constraint.reference}"
  label="${constraint.reference}"
  name="${this.getLastPredicate()}"
  valueof="${this.getUuid()}"
  @click="${this.changeRadio}"
  ></input>
  2-->
  <solid-folders
  url="${constraint.reference}"
  @change=${this.selectorChange}
  @select-event="${(e) => { this.changeValue(e, "mySelect") }}" >
  <select id="mySelect" slot="mySelect"
  class="custom-select"
  name="${this.getLastPredicate()}"
  @change=${this.selectorChange}>
  </select>
  </solid-folders>
  <a href="${constraint.reference}"
  title="See existing ${this.localName(constraint.reference)} at ${constraint.reference}"
  target="blank">
  <i class="far fa-eye"></i> View
  </a>
  <a href="#"
  title="Create a ${constraint.reference}"
  @click="${(e) =>this.displayForm(constraint.reference)}">
  <i class="fas fa-plus-circle"></i> Create
  </a>
  <br>  `
  : html``
}
${constraint.values
  ? html`<select class="custom-select"
  @change="${this.selectorChange}"
  valueof="${this.getUuid()}"
  title="${this.toText(constraint)}"
  name="${this.getLastPredicate()}"
  placeholder = "value">
  ${constraint.values.map(i => html`
    <option value="${i.value}"  >${i.value || i}</option>
    `)}
    </select>${getMinMax(constraint)}
    `
    : html``
  }
  ${this.isFieldset(constraint.type)
    ? html `</p>
     <a href="#" class="card-link">Card link</a>
        <a href="#" class="card-link">Another link</a>
      </div>
    </div>`
    :html ``
  }
  `



  return html`
  <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet" >

  <h4>${this.something}</h4>
  ${getConstraint(this.constraint)}

  `;
}

isFieldset(shapeType){
  return shapeType != "Shape" && shapeType != "TripleConstraint" && shapeType != "OneOf" && shapeType != "NodeConstraint" && shapeType != "EachOf" && shapeType != "ShapeRef" && shapeType != "ShapeOr"
}

toText(json){
  if (json != undefined){
    //  console.log("ANALYSE DE TYPE ", json.type, "url :",json.url, "DATA :",json)
    return JSON.stringify(json, null, 2)
  }
  else {
    console.log("json undefined");
    return undefined}
  }

  setLastPredicate(p){
    this.lastPredicate = p;
    return this.localName(p)
  }

  getLastPredicate(){
    return this.lastPredicate
  }

  setUuid(){
    this.uuid =  '_' + Math.random().toString(36).substr(2, 9);
    return this.uuid
  }

  getUuid(){
    //  console.log(this.uuid)
    return this.uuid
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

  changeValue(e, destination){
    console.log(e)
    console.log(e.target)
    console.log(e.detail.value)
    this.shadowRoot.getElementById(destination).slotvalue = e.detail.value
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

customElements.define('shexy-constraint', ShexyConstraint);
