import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import './shexy-solid.js'
import './solid-write-element.js'

class ShexyFormatter extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      shape: {type: Object} ,
      data: {type: Object},
      ttl: { type: Object}
    }
  }

  constructor() {
    super();
    this.ttl = {}
  }

  render() {
    return html`
    <solid-write-element name="SolidWrite" .ttl="${this.ttl}">
    Solid</solid-write-element>
    <!--<shexy-solid name="ShexySolid" .ttl="${this.ttl}">
    Solid</shexy-solid>-->

    `;
  }


  shouldUpdate(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`${propName} changed. oldValue: ${oldValue}`);
    });
    if (changedProperties.has('data')){
      if(Object.keys(this.data).length > 0){
        this.processData()
      }
    }
    return  changedProperties.has('data') || changedProperties.has('ttl');
  }

  processData(){
    console.log(this.data)
    var ttlFile  = {}
    var ttlString = "@prefix : <#>.\n"
  //  +  "@prefix : <https://holacratie.solid.community/public/> .\n"
    +  "@prefix owl: <http://www.w3.org/2002/07/owl#> .\n"
    +  "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n"
    +  "@prefix xml: <http://www.w3.org/XML/1998/namespace> .\n"
    +  "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n"
    +  "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n"
    +  "@prefix purl: <http://purl.org/dc/elements/1.1/>.\n"
    +  "@base <"+this.shape.url+"> .\n\n\n";


    for (let [shape, data] of Object.entries(this.data)) {
      console.log(shape, data);

      //  console.log(this.formData)
      //  console.log("id" , this.shape.url)
      var id = shape
      /*  this.formData[id].forEach(function(enreg){
      if (enreg.submitted == undefined) {*/
      console.log("newfile ttl")
      var randomName = '_' + Math.random().toString(36).substr(2, 9);
      var filename = randomName
      //  var ttlString = app.ttlBase

      for (let [predicate, object] of Object.entries(data.form)) {
        console.log(predicate, object)
        if( object.value.length > 0){
          if ((predicate == "https://schema.org/name") &&  (object.value.length > 0)){
            var underName  = object.value.split(' ').join('_');
            filename = underName;
            ttlString += ':this  rdfs:label  "'+object.value+'".\n'
            ttlString += ':this  purl:title  "'+object.value+'".\n'
          }
          console.log(predicate, object);
          let objectValue = object.value.startsWith("http") ? '<'+object.value+'>': '"'+object.value+'"';
          ttlString += ':this  <'+predicate+'>  '+objectValue+'.  # Format :'+object.type+ " "+object.format+ "\n";
        }
      }
      ttlString += ':this  rdf:type  <'+this.shape.url+'>.'

      const d = new Date();
      var now = d.toUTCString()+"\n";
      ttlString  += "\n\n# shexy made with "+id+"\n";
      ttlString  += "# from "+location.protocol + '//' + location.host + location.pathname+"\n";
      ttlString += "# at "+now

      /*if (app.anonyme == false){
      ttlString  += "# by "+this.shadowRoot.getElementById("solid-session").textContent+"\n";
    }*/
    console.log(ttlString)
    filename = filename+'.ttl'

    /* commenter POUR DEBUG */
    ttlFile = { filename: filename , content: ttlString, footprint: data.footprint, shape: this.shape}

    console.log("TTLFILE",ttlFile)
    console.log("TODO : Process footprint")
    this.ttl=ttlFile
    console.log(this.ttl)

  }

  this.agent.send("SolidWrite", {action: "ttlChanged", ttl: this.ttl})

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

customElements.define('shexy-formatter', ShexyFormatter);
