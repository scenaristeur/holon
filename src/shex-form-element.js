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
      today: {type: String},
      selectFolder: {type: Object},
      formHistory: {type: Array}
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
    this.selectFolder = {}
    this.formHistory = []
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

    <legend> <h2> ${this.localName(shape.url)} </h2></legend>

    ${getConstraint(shape.constraint)}

    ${shape.style == "regular" ?
    html `<br><button
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
      html`<h4
      title="${this.toText(constraint)}"
      name="${this.setUuid()}"
      >${this.setLastPredicate(constraint.predicate)}</h4>`
      : html``
    }
    ${constraint.valueExpr ?
      html`${getConstraint(constraint.valueExpr)}`
      : html``
    }
    ${constraint.datatype ?
      html ` <input type="${this.inputType(constraint.datatype)}"
      class="form-control"
      title="${constraint.datatype}"
      name="${this.getLastPredicate()}"
      valueof="${this.getUuid()}"
      placeholder="${this.localName(constraint.datatype)}"
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
          : html `<div class="form-check">
          <input class="form-check-input"
          type="radio"
          name="${this.getLastPredicate()}"
          id="${this.setUuid()}"
          format="${key}"
          title="${shapeExp}"
          checked>
          <label class="form-check-label" for="${this.getUuid()}">
          ${key}
          </label>
          ${getConstraint(shapeExp)}
          </div>
          `}`
        )
      }
      `)}
      </fieldset>`
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
      placeholder="${this.localName(constraint.nodeKind)}"
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
      <select
    class="custom-select"
    url="${constraint.reference}"
    name="${this.getLastPredicate()}"
    valueof="${this.getUuid()}"
    @click="${this.changeRadio}"
    placeholder="${this.localName(constraint.reference)}"
    title="${constraint.reference}"
    label="${constraint.reference}"
    >
    </select>

    <br>
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
      html`<a href="${this.shape_url}" target="_blank">Shape url</a> |
      <a href="${this.currentShape.url}" target="_blank">Footprint</a> |
      ${this.webId != null ?
        html`<a href="${this.webId}" target="_blank">WebId</a>`
        :html``
      }

      <div class="section" id="forms_section">

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
    <div id="currentShapeDiv"></div>
    </div>
    ${this.shapes.map(shape => html`
      ${getShape(shape)}
      `)}

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
        title="${i.url}"
        @click="${(e) =>this.panelClicked(i)}"> ${this.localName(i.url)}</button>`
        : html ``
      }`
    )}
    </div>
    </div>
    </div>
    `
    :html`
    <ul>
    <li>
    Hello, here you can use some Linked Forms dealing with Holacracy on "Solid Project" platform, prepared just form you, just click on one bottom menu button.
    </li>
    <li>
    You can also use your own shape url to build a form adding
    "?shape_url=url_to_form" as parameter in the address bar like
    <a href="${window.location}?shape_url=https://holacratie.solid.community/public/Schema/todo.shex" target="_blank">
    todo.shex
    </a>
    </li>
    <li>
    Find <a href="https://holacratie.solid.community/public/Schema/" target="_blank">some more cool examples here</a>
    </li>
    </ul>

    `}

    <shexy-formatter
    name="ShexyFormatter"
    .shape="${this.currentShape}"
    .data="${this.data}"
    ></shexy-formatter>
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
          case "fileWriten":
          app.fileWriten()
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

  fileWriten(){
    let currentShapeUrl = this.currentShape.url
    delete(this.selectFolder[currentShapeUrl])
    if (this.formHistory.length > 0){
      let precedentShape = this.formHistory.pop()
      this.currentShape = precedentShape
      this.focus("top_Form")
    }


    let selects = this.shadowRoot.querySelectorAll("select")
    //console.log(selects)
    for (var select of selects) {
      let url = select.getAttribute("url")

      if (url == currentShapeUrl){
        console.log("clear select with ",currentShapeUrl)
        var i, L = select.options.length - 1;
        for(i = L; i >= 0; i--) {
          select.remove(i);
        }
      }}
      this.updateSelects()


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

async parseSchema(schema){
  var app = this;
  //  var schema = JSON.parse(this.schema)
  //  console.log(schema)
  //  console.log(schema.start)
  //console.log(schema.shapes)
  this.shapes = []
  this.counter = 0;
  this.footprint_shapes = []
  //console.log(this.shapes)

  for (let [url, constraint] of Object.entries(schema.shapes)) {
    //console.log(url)
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
  await   this.requestUpdate()
  console.log("updated")
  await this.updateSelects()
  this.focus("currentShapeDiv")
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

jsonFromForm(id){
  //  console.log(id)
  if (this.shadowRoot.getElementById(id) != null){
    var currentFormFields = this.shadowRoot.getElementById(id).elements
    //  console.log(currentFormFields)
    var currentFormLength = this.shadowRoot.getElementById(id).elements.length;
    //  console.log( "Found " + currentFormFields.length + " elements in the form "+id);
    var params = {};
    let lastField = {}
    for( var i=0; i<currentFormFields.length; i++ ){
      var field = currentFormFields[i]
      if  ((field.nodeName != "FIELDSET") && (field.nodeName != "BUTTON")){
        // console.log("\n----------------")
        // console.log("lastfield",lastField.type, lastField.checked);
        let selected =  (lastField.type != "radio"  || lastField.checked == true) && (field.type != "radio")
        if(selected){
          //  console.log(selected,field.type, field.nodeName, field.name, field.id, field.value, field.slotvalue, field)
          var fieldData = {}
          fieldData.value =  field.value.trim()
          fieldData.type = field.type || "unknown";
          fieldData.format = field.placeholder || "unknown";
          //  console.log(fieldData)
          params[field.name] = fieldData;
        }
        lastField = field
      }
    }
    //console.log(params)
    return params
  }
}

updated(props){
  console.log("LITHTML UPDATED")
  /*let selects = this.shadowRoot.querySelectorAll("select")
  if (selects.length > 0){
  this.updateSelects()
}*/
// todo select first of each radio group by default let radios =
}

async updateSelects(){
  let selects = this.shadowRoot.querySelectorAll("select")
  //console.log(selects)
  for (var select of selects) {
    let url = select.getAttribute("url")

    if (select.options.length == 0 && url != null){
      //  console.log("SELECT" , select)
      console.log("select sans options", url)
      let folder = this.selectFolder[url]
      //  console.log("FOLDER",folder)
      if (folder == undefined) {
        folder  = await this.getFilesFrom(url)
        //  console.log("##FILES", folder)
        this.selectFolder[url] = folder

      }
      /*  else{
      console.log("I KNOW ", url)
    }*/
    var option = document.createElement("option");
    option.text = "Choose one "+this.localName(url);
    option.value = undefined
    select.add(option);
    folder.folders.forEach((f, i) => {
      var option = document.createElement("option");
      option.text = f.name;
      option.value = f.url
      select.add(option);
    });


  }
}
}


async getFilesFrom(url){
  //console.log("@@@@@@@@@@@",url)
  return this.fileClient.readFolder(url).then(folder => {
    return  folder
  },
  err => { console.log(err) })
}
/*
test query ldflex
async getFilesFrom1(url){
console.log("@@@@@@@@@@@",url)
let files = []
for await (const file of data[url].subjects){
console.log("file", `${file}` );
files = [...files, `${file}`]
}
console.log(files)
return files
}*/



webIdChanged(webId){
  this.webId = webId
}

inputType(datatype){
  //  console.log("datatype",datatype)
  switch (datatype) {
    case "http://www.w3.org/2001/XMLSchema#date":
    return 'date'
    break;
    case "http://www.w3.org/2001/XMLSchema#decimal":
    return 'number'
    break;
    default:
    return 'text'
  }
}


setUuid(){
  this.uuid =  '_' + Math.random().toString(36).substr(2, 9);
  return this.uuid
}

getUuid(){
  return this.uuid
}

selectorChange(e) {
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
  return shape.url != this.currentShape.url
}

toText(json){
  if (json != undefined){
    return JSON.stringify(json, null, 2)
  }
  else {
    console.log("json undefined");
    return undefined}
  }

  displayForm(id){
    console.log("displayForm",id)
    this.formHistory = [...this.formHistory, this.currentShape]
    console.log("form history", this.formHistory)
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

}

customElements.define('shex-form-element', ShexFormElement);
