import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import './shexy-formatter.js'

class ShexFormElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      shape_url: {type: String},
      shapes: {type:Array},
      footprint_shapes: { type: Array},
      currentShape: {type: Object},
      counter: {type: Number},
      lastPredicate: {type: String},
      data :{type : Object}
    };
  }

  constructor() {
    super();
    this.something = "ShexFormElement"
    this.shape_url = ""
    this.shex = ShEx;
    this.shapes = []
    console.log(this.shex)
    this.currentShape = {};
    this.footprint_shapes = [];
    this.counter = 0;
    this.lastPredicate = "unknown";
    this.data = {}
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


    const getShape = (shape) => html `
    <div class="container">
    <form  id ="${shape.url}" class="flow-text" ?hidden=${this.isHidden(shape.url)}>
    <legend> <h2> ${this.localName(shape.url)} </h2></legend>
    ${this.shapeDisplay(shape)}
    <br>
    ${shape.style == "regular" ?
    html `<button type="button" class="btn btn-primary" @click="${(e) =>this.submitForm()}">
    <i class="far fa-save"></i> Save ${this.localName(shape.url)}
    </button>`
    : html `<br>
    <button type="button" class="btn btn-primary" @click="${(e) =>this.displayForm(shape.url.replace('_Footprint', ''))}">
    <i class="fas fa-backward"></i> Back to ${this.localName(shape.url.replace('_Footprint', ''))} Form
    </button>`}
    </form>
    </div>
    `


    const getConstraint1 = (constraint) => html`
    ${constraint.type ?
      html ``
      :html`type non défini : ${this.toText(constraint)}`
    }
    ${this.isFieldset(constraint.type)
      ? html `<fieldset>
      <legend><span title="${this.toText(constraint)}">${constraint.type}</span></legend>
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
    ? html `</fieldset>`
    :html ``
  }
  `

  return html`
  <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet" >
  <link href="css/fontawesome/css/all.css" rel="stylesheet">
  <div class="container">



  ${this.shape_url != undefined && this.shape_url.length > 0 ?
    html`Form : ${this.shape_url}`
    :html`You can use your own shape url to build a form adding
    "?shape_url=url_to_form" as parameter in the address bar<br>
    example :
    <a href="${window.location}?shape_url=https://holacratie.solid.community/public/Schema/todo.shex" target="_blank">
    ${window.location}?shape_url=https://holacratie.solid.community/public/Schema/todo.shex
    </a>
    <br>
    Find some examples here <a href="https://holacratie.solid.community/public/Schema/"
    `}

    <div class="section" id="forms_section">
    <h5>Forms</h5>
    <div  class="row">
    ${this.shapes.map(i => html`
      ${i.style == "regular"
      ? html `
      <button type="button" class="btn btn-primary" @click="${(e) =>this.panelClicked(i)}">
      ${this.localName(i.url)}
      </button>`
      :html ``
    }`
  )}
  </div>
  </div>

  <div class="divider" id="top_Form"></div>
  <div >
  <button type="button" class="btn btn-primary" @click="${(e) =>this.focus("forms_section")}">Forms</button>
  <button type="button" class="btn btn-primary" @click="${(e) =>this.focus("footprints_section")}" >Footprints</button>
  <div class="divider"></div>
  <div id="currentShapeDiv" class="teal-text text-darken-2">
  ${this.currentShape.url}
  </div>
  </div>
  ${this.shapes.map(shape => html`
    ${getShape(shape)}
    `)}
    <shexy-formatter
    name="ShexyFormatter"
    .shape="${this.currentShape}"
    .data="${this.data}"
    ></shexy-formatter>
    <div class="divider"></div>
    <div class="section" id="footprints_section">
    <h5>Footprints</h5>
    <p>To change the storage location of this data, use the "_Footprint" before submitting</p>
    <div class="row center-align">
    ${this.shapes.map(i => html`
      ${i.style == "footprint"
      ? html `
      <button type="button"
      class="btn btn-primary"
      title=${i.url}
      @click="${(e) =>this.panelClicked(i)}"> ${this.localName(i.url)}</button>`
      : html ``
    }`
  )}
  </div>
  </div>
  </div>
  `;
}
/////////////////V2

shapeDisplay(shape){
  console.log(shape.url)
  console.log(shape.style)
  //  console.log(shape.constraint)
  switch (shape.style) {
    case "regular":
    return html `${this.shapeTemplate(shape.constraint)}`
    break;
    case "footprint":
    return html `${this.footprintTemplate(shape.constraint)}`
    break;
    default:
    console.log("Shape Style inconnu", shape.style)

  }
}

shapeTemplate(constraint){
  //console.log(constraint)
  return html`${this.expressionTemplate(constraint.expression)}`
}
footprintTemplate(constraint){
  //  console.log(constraint)
  return html`${this.expressionTemplate(constraint.expression)}`
}
expressionTemplate(expression){
//  console.log(expression)
  let eTemplate = html `Loading`
  switch (expression.type) {
    case "EachOf":
    eTemplate = this.EachOf(expression.expressions)
    break;
    case "OneOf":
    eTemplate = this.OneOf(expression.expressions)
    break;
    case "TripleConstraint":
    eTemplate = this.TripleConstraint(expression)
    break;
    case "NodeConstraint":
    eTemplate = this.NodeConstraint(expression)
    break;
    case "ShapeOr":
    eTemplate = this.ShapeOr(expression)
    break;
    case "ShapeAnd":
    eTemplate = this.ShapeAnd(expression)
    break;
    default:
    eTemplate = html`${expression.type} "INCONNUE"`
  }
  console.log(eTemplate)
  return eTemplate
}

EachOf(expressions){
  console.log("-EACH OF-")
  return expressions.forEach((e, i) => {
    return this.expressionTemplate(e)
  });
}

OneOf(expressions){
  console.log("-1 OF-")
  return expressions.forEach((e, i) => {
    return this.expressionTemplate(e)
  });
}

TripleConstraint(expression){
  console.log("-triple predicate", expression.predicate, "valueExpr", expression.valueExpr)
return this.expressionTemplate(expression.valueExpr)
}

NodeConstraint(expression){
  console.log("NodeConstraint",expression)
  console.log(expression.values || expression.datatype)
  return html `${expression.values || expression.datatype}`
}

ShapeOr(expression){
console.log("-shapeOr",expression)
  return this.expressionTemplate(expression.shapeExprs)
}
ShapeAnd(expression){
  console.log("-shapeAnd", expression)
  return this.expressionTemplate(expression.shapeExprs)
}



////////////////////FIN V2

selectorChange(e) {
  console.log(e);
  console.log(e.bubbles);
  this.changeRadio(e)
}

changeRadio(e){
  //  console.log(e.target.getAttribute("valueof"))
  var valueof = e.target.getAttribute("valueof")
  if (this.shadowRoot.getElementById(valueof)!= undefined){
    this.shadowRoot.getElementById(valueof).checked = true;
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

panelClicked(shape){
  console.log(shape)
  this.currentShape = shape
  this.focus("currentShapeDiv")
}
focus(id){
  var focusDiv = this.shadowRoot.getElementById(id)
  focusDiv.scrollIntoView();
}

isNotCurrent(shape){
  if (shape.url == this.currentShape.url){
    return false
  }else{
    return true
  }
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
  incremente(){
    console.log(this.counter)
    this.counter = this.counter+1

    return this.counter
  }
  displayForm(id){
    console.log("displayForm",id)
    var fictiveShape = {}
    fictiveShape.url = id
    this.currentShape = fictiveShape
    this.focus("top_Form")
  }

  isFieldset(shapeType){

    return shapeType != "Shape" && shapeType != "TripleConstraint" && shapeType != "OneOf" && shapeType != "NodeConstraint" && shapeType != "EachOf" && shapeType != "ShapeRef" && shapeType != "ShapeOr"
  }
  isHidden(url){
    return url != this.currentShape.url
  }

  setLastPredicate(p){
    this.lastPredicate = p;
    return this.localName(p)
  }

  getLastPredicate(){
    return this.lastPredicate
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


  jsonFromFormTEST_NON_CONCLUANT(id){
    console.log(id)
    if (this.shadowRoot.getElementById(id) != null){
      var currentFormFields = this.shadowRoot.getElementById(id).elements
      console.log(currentFormFields)
      var currentFormLength = this.shadowRoot.getElementById(id).elements.length;
      console.log( "Found " + currentFormFields.length + " elements in the form "+id);
      this.params = {};
      for( var i=0; i<currentFormFields.length; i++ ) {
        var f = currentFormFields[i]
        this.processField(f)
      }
      console.log("PARAMS : ", this.params)
    }
  }

  processField(f){
    //console.log("nodename ",f.nodeName, f.tagName)
    //console.log("INPUT, type : "f.type)
    switch(f.nodeName) {
      case "FIELDSET":
      //  console.log("omis", f)
      break;
      case "SELECT":
      this.processSelect(f)
      break;
      case "INPUT":
      this.processInput(f)
      break;
      default:
      console.log("NON TRAITE ", f.nodeName, f)
    }
  }


  processInput(f){
    //  console.log("INPUT type : ",f.type, " Name : ",f.name)
    switch(f.type) {
      case "text":
      case "date":
      this.processInputText(f)
      break;
      case "radio":
      this.processInputRadio(f)
      break;
      /*
      this.processInputDate(f)
      break;*/
      default:
      console.log("NON TRAITE ", f.nodeName, f.type)
    }
  }

  processSelect(f){
    console.log("SELECT type : ",f.type, " Name : ",f.name, " ID : ", f.id, f)
    console.log(f.options)
    if (f.options.length> 0){
      console.log(f.options[ f.selectedIndex ])
      console.log(f.options[ f.selectedIndex ].text)

      var fieldData = {}
      var fieldName = f.name || "unknown";
      fieldData.value =  f.options[ f.selectedIndex ].text || "unknown";
      fieldData.type = f.type || "unknown";
      fieldData.format = f.placeholder || "unknown";
      console.log(fieldData)
      this.params[fieldName] = fieldData;
    }else{
      console.log("pas d'option")
      console.log("SLOT VALUE",f.slotvalue)
      var fieldData = {}
      var fieldName = f.name || "unknown";
      fieldData.value = f.slotvalue || "unknown";
      //  fieldData.type = f.type || "unknown";
      //    fieldData.format = f.placeholder || "unknown";
      console.log(fieldData)
      this.params[fieldName] = fieldData;
      console.log("##############PARAMS:",this.params)
    }
  }


  processInputText(f){
    console.log("INPUT type : ",f.type, " Name : ",f.name, "ValueOf ",f.getAttribute("valueof"), f)
    var valueof = f.getAttribute("valueof");
    if (valueof != "undefined"){
      if (valueof == this.currentRadioId){
        this.processInputTextValue(f)
        console.log("ok si egalite ", valueof,this.currentRadioId)
        this.currentRadioId = undefined
      }{
        console.log("n'est pas selectionné")
      }

    }else{
      this.processInputTextValue(f)
    }

  }

  processInputTextValue(f){
    var fieldData = {}
    var fieldName = f.name;
    fieldData.value = f.value
    fieldData.type = f.type;
    fieldData.format = f.placeholder || "unknown";
    console.log(fieldName, ": ",fieldData)
    this.params[fieldName] = fieldData;
  }

  processInputRadio(f){
    console.log("RADIO type : ",f.type, " Name : ",f.name, "Checked : ",f.checked, "ID :",f.id, f)
    if(f.checked == true){
      this.currentRadioId = f.id;
      //  this.currentFieldName = f.name;
    }
  }
  /*
  processInputDate(f){
  console.log("DATE type : ",f.type, " Name : ",f.name, "ValueOf ",f.getAttribute("valueof"), f)
}*/







jsonFromForm(id){

  console.log(id)
  if (this.shadowRoot.getElementById(id) != null){
    var currentFormFields = this.shadowRoot.getElementById(id).elements
    console.log(currentFormFields)
    var currentFormLength = this.shadowRoot.getElementById(id).elements.length;
    console.log( "Found " + currentFormFields.length + " elements in the form "+id);


    var params = {};
    for( var i=0; i<currentFormFields.length; i++ )
    {
      var field = currentFormFields[i]
      //  console.log(field.name,"----------------",field)
      var valid = true;
      //  console.log("field type",field.type)
      if (field.type == "radio"){
        console.log("############################RADIO")
        console.log(field.checked)
        if (field.checked == false){
          //  console.log("pas coché")
          valid = false
        }
        else{
          console.log("coché",field)
          console.log("Format",field.getAttribute("format"))
          console.log("nextsibling",field.nextElementSibling)
          var span = field.nextElementSibling
          var elem = span.nextElementSibling
          console.log("nextsibling",elem.type, elem)
          if (elem.type == "input"){
            console.log(elem.value)
          }
          field = elem

          console.log("nextsibling",elem.nextElementSibling)
        }
        console.log("FIN ############################RADIO")
      }

      if (
        (field.nodeName == "FIELDSET")  ||
        (field.nodeName == "BUTTON") ||
        ((field.type == "radio") && (field.checked == false))
      )
      {
        valid = false
      }


      if (field.nodeName == "SELECT")
      {
        //  RECUPERATION DE LA VALEUR DU SLOT
        console.log(field)
        console.log(field.options)
        if (field.options.length> 0){
          console.log(field.options[ field.selectedIndex ])
          console.log(field.options[ field.selectedIndex ].text)

          var fieldData = {}
          var fieldName = field.name || "unknown";
          fieldData.value =  field.options[ field.selectedIndex ].text || "unknown";
          fieldData.type = field.type || "unknown";
          fieldData.format = field.placeholder || "unknown";
          console.log(fieldData)
          params[fieldName] = fieldData;
        }else{
          console.log("pas d'option")
          console.log("SLOT VALUE",field.slotvalue)
          var fieldData = {}
          var fieldName = field.name || "unknown";
          fieldData.value = field.slotvalue || "unknown";
          //  fieldData.type = field.type || "unknown";
          //    fieldData.format = field.placeholder || "unknown";
          console.log(fieldData)
          params[fieldName] = fieldData;
          console.log("##############PARAMS:",params)
        }
        //  field.selectedOptions[0].value || field.selectedOptions[0].text ;
      }





      //  console.log(valid)

      if (valid == true ){      //  console.log(field, field.nodeName)
        console.log("88888888888888888 ON TRAITE", field)
        if (field.valueof != undefined){
          console.log("VALUE OF",field.valueof)
          var lab_span = field.previousSibling;
          var selec = lab_span.previousSibling;
          console.log("TEST IF CHECKED",selec)
        }else

        {
          var fieldData = {}
          var fieldName = field.name;
          fieldData.value = field.value
          fieldData.type = field.type;
          fieldData.format = field.placeholder || "unknown";
          console.log(fieldData)
          params[fieldName] = fieldData;}
        }

        /*  var x = document.getElementsByName("solid-folders");
        console.log(x)
        */

      }
      //  console.log("params ",params)
      /*if (!(id in data)){
      data[id] = [];
    }
    data[id].push(params)
    console.log("DATA -------- ",data)*/
    return params
  }else{
    console.log("pas de footprint")
  }

  //  this.shadowRoot.getElementById("jsonBtn").disabled = false;

}

changeValue(e, destination){
  console.log(e)
  console.log(e.target)
  console.log(e.detail.value)
  this.shadowRoot.getElementById(destination).slotvalue = e.detail.value
}

setUuid(){
  this.uuid =  '_' + Math.random().toString(36).substr(2, 9);
  return this.uuid
}

getUuid(){
  //  console.log(this.uuid)
  return this.uuid
}


load_schema(shape_url){
  let app = this
  this.shape_url = shape_url
  console.log(shape_url)

  this.shex.Loader.load([shape_url], [], [], []).then(loaded => {
    if (loaded.schema){
      console.log("LOADED",loaded.schema)
      //  app.schema = JSON.stringify(loaded.schema);
      app.parseSchema(loaded.schema)
      //  console.log(Object.entries(loaded.schema.shapes))
    }
  }, err => {
    //  log(err, "ERROR loadShex")
    console.log("erreur ",err)
    alert(err.message)
  }
);
}

parseSchema(schema){
  var app = this;
  //  var schema = JSON.parse(this.schema)
  console.log(schema)
  console.log(schema.start)
  console.log(schema.shapes)
  this.shapes = []
  this.counter = 0;
  this.footprint_shapes = []
  console.log(this.shapes)

  for (let [url, constraint] of Object.entries(schema.shapes)) {
    console.log(url)
    var shap = {}
    shap.url = url;
    shap.constraint = constraint
    shap.style = "regular"
    if(url.endsWith("_Footprint")){
      shap.style = "footprint"
    }
    app.shapes = [...app.shapes, shap]
    app.currentShape = app.shapes[0]
    //  this.focus();
  }
  console.log("SHSHSHSHS",app.shapes)
  this.requestUpdate()
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
        case "shapeUrlChanged":
        app.load_schema(message.shape_url)
        break;
        default:
        console.log("Unknown action ",message)
      }
    }
  };

  let params = this.recupParams()
  console.log("Params",params)
  if(params.shape_url != undefined && params.shape_url.length > 0){
    this.shape_url = params.shape_url
    this.load_schema(this.shape_url)
  }
}

recupParams(){
  //console.log(window.location)
  var url = window.location.search+window.location.hash;  // pour catcher les /card#me
  var params = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {        var p=a[i].split('=', 2);
    if (p.length == 1)
    b[p[0]] = "";
    else
    b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
  }
  return b;
})(url.substr(1).split('&'));
return params;
}

webIdChanged(webId){
  this.webId = webId
  if (webId != null){
    this.updateProfile();
  }else{

  }
}

}

customElements.define('shex-form-element', ShexFormElement);
