import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import './shexy-formatter.js'
import * as auth from 'solid-auth-client';

class ShexFormElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      shape_url: {type: String},
      shapes: {type:Array},
      footprint_shapes: { type: Array},
      currentShape: {type: Object},
      counter: {type: Number},
      lastPredicate: {type: String},
      data :{type : Object},
      webId: {type: String},
      today: {type: String}
    };
  }

  constructor() {
    super();
    this.shape_url = ""
    this.shapes = []
    this.currentShape = {};
    this.footprint_shapes = [];
    this.counter = 0;
    this.lastPredicate = "unknown";
    this.data = {}
    this.shex = ShEx;
    this.fileClient = new SolidFileClient(auth)
    let d = new Date();
    this.today = d.toISOString().substr(0, 10);
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

    <form  id ="${shape.url}" ?hidden=${this.isHidden(shape.url)}>
    WebId : ${this.webId}
    <legend> <h2> ${this.localName(shape.url)} </h2></legend>

    ${getConstraint(shape.constraint)}

    ${shape.style == "regular" ?
    html `<button
    type="button"
    class="btn btn-success"
    @click="${(e) =>this.submitForm()}">
    <i class="far fa-save"></i>
    Save ${this.localName(shape.url)}
    </button>`
    : html `<br>
    <button
    type="button"
    class="btn btn-primary btn-sm"
    @click="${(e) =>this.displayForm(shape.url.replace('_Footprint', ''))}">
    <i class="fas fa-backward"></i>
    Back to ${this.localName(shape.url.replace('_Footprint', ''))} Form
    </button>
    `}
    </form>
    </div>
    `

    const getConstraint = (constraint) => html`
    ${constraint.type ?
      html ``
      :html`type non défini : ${this.toText(constraint)}`
    }
    ${this.isFieldset(constraint.type) ?
      html `<fieldset>
      <legend><span title="${this.toText(constraint)}">${constraint.type}</span></legend>
      `
      :html ``
    }
    ${constraint.expression ?
      html`${getConstraint(constraint.expression)}`
      : html``
    }
    ${constraint.expressions ?
      html`${constraint.expressions.map(i => html`${getConstraint(i)}`)}`
      : html``
    }
    ${constraint.predicate ?
      html`<label  title="${this.toText(constraint)}">${this.setLastPredicate(constraint.predicate)}</label>`
      : html``
    }
    ${constraint.valueExpr ?
      html`${getConstraint(constraint.valueExpr)}`
      : html``
    }
    ${constraint.datatype ?
      html ` <input type="${constraint.datatype.endsWith('date') ? 'date' : 'text'}"
      class="form-control"
      title="${constraint.datatype}"
      name="${this.getLastPredicate()}"
      valueof="${this.getUuid()}"
      placeholder="${constraint.datatype}"
      @click="${this.changeRadio}"
      value= "${constraint.datatype.endsWith('date') ? this.today : constraint.datatype == 'http://www.w3.org/ns/solid/terms#webid' ? this.webId : ""}">
      </input>`
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
          ? html ``
          : html `
          <div class="form-check">
          <input class="form-check-input"
          type="radio"
          name="${this.getLastPredicate()}"
          id="${this.setUuid()}"
          format="${key}"
          value="option1"
          title="${shapeExp}"
          checked>
          <label class="form-check-label" for="${this.getUuid()}">
          ${key}
          </label>
          ${getConstraint(shapeExp)}
          </div>
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
  : html``}
  ${constraint.nodeKind ?
    html`${constraint.nodeKind == "literal"?
    html`
    <div class="form-group">
<!--    <label for="exampleFormControlTextarea1">Example textarea</label>-->
    <textarea
    class="form-control"
    id="exampleFormControlTextarea1"
    title="${constraint.nodeKind}"
    placeholder="${constraint.nodeKind}"
    name="${this.getLastPredicate()}"
    valueof="${this.getUuid()}"
    @click="${this.changeRadio}"
    rows="3"></textarea>
    ${getMinMax(constraint)}
    </div>
    `
    : html`<input
    type="text" class="form-control"
    title="${constraint.nodeKind}"
    placeholder="${constraint.nodeKind}"
    name="${this.getLastPredicate()}"
    valueof="${this.getUuid()}"
    @click="${this.changeRadio}"
    value = "${this.getLastPredicate() == 'http://www.w3.org/ns/solid/terms#webid' ? this.webId : ''}"
    ></input>${getMinMax(constraint)}`
  }`
  : html``
}
${constraint.reference
  ? html`
  <!--
  <input type="text" class="validate teal lighten-5"
  placeholder="${constraint.reference}"
  title="${constraint.reference}"
  label="${constraint.reference}"
  value="${constraint.reference}"
  name="${this.getLastPredicate()}"
  valueof="${this.getUuid()}"
  @click="${this.changeRadio}"
  ></input>
  -->
  <select
  class="custom-select"
  url="${constraint.reference}"
  name="${this.getLastPredicate()}"
  valueof="${this.getUuid()}"
  @click="${this.changeRadio}"
  placeholder="${constraint.reference}"
  title="${constraint.reference}"
  label="${constraint.reference}"
  >

  </select>

  <br>
  <!--  <solid-folders
  url="${constraint.reference}"
  @change="${this.selectorChange}"
  id="${this.setUuid()}"
  @select-event="${(e) => { this.changeValue(e, this.getUuid()) }}"
  >
  <select slot="mySelect"
  class="custom-select"
  id="${this.getUuid()}"
  name="${this.getLastPredicate()}"
  @change=${this.selectorChange}>
  </select>
  </solid-folders>-->
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
    <option value="${i.value||i}"  >${i.value || i}</option>
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
      <button type="button" class="btn btn-info btn-sm" @click="${(e) =>this.panelClicked(i)}">
      ${this.localName(i.url)}
      </button>`
      :html ``
    }`
  )}
  </div>
  </div>

  <div class="divider" id="top_Form"></div>
  <div >
  <button type="button" class="btn btn-outline-info btn-sm" @click="${(e) =>this.focus("forms_section")}">Forms</button>
  <button type="button" class="btn btn-outline-info btn-sm" @click="${(e) =>this.focus("footprints_section")}" >Footprints</button>
  <div class="divider"></div>
  <div id="currentShapeDiv">
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
      class="btn btn-outline-primary btn-sm"
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

async getFilesFrom(url){
  console.log("@@@@@@@@@@@",url)
  let f
  return this.fileClient.readFolder(url).then(folder => {
    console.log(folder)
    return  folder

    //  return  html`NAME : ${folder.name}`
  },
  err =>
  {
    console.log(err)
    //alert("error")
  })

}

async getFilesFrom1(url){
  console.log("@@@@@@@@@@@",url)
  let files = []
  for await (const file of data[url].subjects){
    console.log("file", `${file}` );
    files = [...files, `${file}`]
  }
  console.log(files)
  return files
}

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
    // TODO FOOTPRINTS
    //  console.log("idfootprint",id_footprint)
    //  var footprintData = this.jsonFromForm(id_footprint)
    //  console.log("fpdata",footprintData)
    this.data = {}
    var data = {}
    data[id] = {}
    data[id].form = formData
    //  data[id].footprint = footprintData
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

  //  console.log(id)
  if (this.shadowRoot.getElementById(id) != null){
    var currentFormFields = this.shadowRoot.getElementById(id).elements
    //  console.log(currentFormFields)
    var currentFormLength = this.shadowRoot.getElementById(id).elements.length;
    //  console.log( "Found " + currentFormFields.length + " elements in the form "+id);


    var params = {};
    let lastField = {}
    for( var i=0; i<currentFormFields.length; i++ )
    {
      var field = currentFormFields[i]
      if  ((field.nodeName != "FIELDSET") && (field.nodeName != "BUTTON")){
        console.log("\n----------------")
        field.valid = true;

        // first check if radio is checked
        switch (field.type) {
          case "radio":
          //  console.log(field.type, field.checked, field.nodeName, field.name, field.id,field)


          break;
          default:
          //  console.log("lastfield",lastField.type, lastField.checked);
          let selected = lastField.type != "radio"  || lastField.checked == true
          if(selected){
            console.log(selected,field.type, field.nodeName, field.name, field.id, field.value, field.slotvalue, field)
            let value = field.value.trim()
            switch (field.nodeName) {
              case "SELECT":
              field.value === "" ? value = field.slotvalue : ""
              break;
              default:
              //  console.log("NOT IMPLEMENTED",field.name, field.nodeName, field.type, "----------------",field)
            }
            console.log(field.name, value)
            var fieldData = {}
            //  var fieldName = field.name || "unknown";
            fieldData.value =  value;
            fieldData.type = field.type || "unknown";
            fieldData.format = field.placeholder || "unknown";
            console.log(fieldData)
            params[field.name] = fieldData;

          }
          //  console.log("NOT IMPLEMENTED",field.name, field.nodeName, field.type, "----------------",field)
        }
        lastField = field

      }
    }
    console.log(params)
    return params
  }
}

changeValue(e, destination){
  console.log(e)
  console.log(e.target)
  console.log(e.detail.value)
  console.log(destination)
  this.shadowRoot.getElementById(destination).slotvalue = e.detail.value
  //  this.shadowRoot.getElementById(destination).value = e.detail.value
  console.log(this.shadowRoot.getElementById(destination))

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

updated(props){
  let selects = this.shadowRoot.querySelectorAll("select")
  if (selects.length > 0){
    this.updateSelects(selects)
  }
  // tot select first of each radio group by default let radios =
}

async updateSelects(selects){
  for (var select of selects) {
    let url = select.getAttribute("url")
    if (select.options.length == 0 && url != null){
      let folder  = await this.getFilesFrom(url)
      console.log("##FILES", folder)
      folder.files.forEach((f, i) => {
        var option = document.createElement("option");
        option.text = f.label || f.name;
        option.value = f.url
        select.add(option);
      });
    }
  }
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
}

}

customElements.define('shex-form-element', ShexFormElement);