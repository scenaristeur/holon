import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import * as auth from 'solid-auth-client';


class SolidWriteElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      ttl: {type: Object},
      fileUrl : {type: String}
    };
  }

  constructor() {
    super();
    this.something = "Solid Write Element"
    this.ttl = {}
    this.fileClient  = new SolidFileClient(auth)
    this.fileUrl = ""
  }

  render(){
    return html`
    <h4>${this.something}</h4>
    <a href="${this.fileUrl}" target="_blank">${this.fileUrl}</a> :
    <pre>${this.ttl.content}</pre>
    <p>
    ${Object.keys(this.ttl).map(item =>
      html`<span>
      ${item}: ${this.ttl[item]}&nbsp;<br>

      </span>`)}
      </p>
       see <a href="https://github.com/scenaristeur/holon">https://github.com/scenaristeur/holon</a>

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
      this.makeFile()
    }

    webIdChanged(webId){
      this.webId = webId
      if (webId != null){
        //  this.updateProfile();
      }else{

      }
    }

    makeFile(){
      let app = this
      console.log("TODO get footprint")
      /*var footprint = this.ttl.footprint

      var root = footprint["https://footprint.solid.community/public/root"].value || "https://holacratie.solid.community/public/";
      var path = footprint["https://footprint.solid.community/public/path"].value ||  this.localName(this.ttl.shape.url)
      console.log("PATH",path)


      var url = root+path+"/"+this.ttl.filename;*/
      var fileUrl = this.ttl.shape.url+"/"+this.ttl.filename
      console.log(fileUrl)
      console.log(this.fileClient)
      console.log("WebId",this.webId)
      this.fileClient.createFile(fileUrl, this.ttl.content, "text/turtle").then( fileCreated => {
        /*  result.status = "created"
        result.file = fileCreated
        updateResult(result)*/
        console.log(fileCreated)
        console.log(`Created file ${fileCreated}.`);
        alert(fileCreated.url +" "+fileCreated.statusText)
        app.fileUrl = fileCreated.url
        //  log (fileCreated, "Created file")
      },
      err => {
        //  result.status = "erreur"
        //  updateResult(result)
        console.log(err);
        alert(err)
        //  alert("erreur ")
        //  log(err, "ERROR : file create")
      }
    );
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

customElements.define('solid-write-element', SolidWriteElement);
