import { LitElement, html } from 'lit-element';
import * as auth from 'solid-auth-client';

//import { HelloAgent } from './agents/hello-agent.js';

class ShexySolid extends LitElement {
  static get properties() {
    return { name: { type: String },
    ttl: { type: Object} };
  }

  constructor() {
    super();
    this.name = 'World';
    this.fileClient = SolidFileClient;
  }

  render() {
    return html`
    <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>

    <p>Hello, ${this.name}!</p>
    <p>Shape : ${this.ttl.shape.url}</p>
    <p>Data:
    ${Object.keys(this.ttl).map(item =>
      html`<span>
      ${item}: ${this.ttl[item]}&nbsp;<br>

      </span>`)}
      </p>
      <div class="card-panel teal lighten-2">shexy solid</div>
      `;
    }




    shouldUpdate(changedProperties) {
      changedProperties.forEach((oldValue, propName) => {
        console.log(`${propName} changed. oldValue: ${oldValue}`);
      });
      if (changedProperties.has('ttl')){
        this.processsTtl()
      }
      return changedProperties.has('schema') || changedProperties.has('currentShape') || changedProperties.has('ttl') || changedProperties.has('formData') || changedProperties.has('prop4')  || changedProperties.has('prop5');
    }

    processsTtl(){
      console.log("TTL",this.ttl)
      this.solidCheckSession()
    }


    solidCheckSession(){
      // todo move display of elements in ui.js !!
      //    var not_loggedElements = document.querySelectorAll(".not_logged")
      //    var loggedElements =  document.querySelectorAll(".logged")
      //    var sessionDiv =  document.getElementById("solid-session")

      this.fileClient.checkSession().then(
        session => {
          console.log("Logged in as "+session.webId)
          /*  var logged = "Logged in as "+session.webId
          log(logged)
          //  console.log(loginElements)
          not_loggedElements.forEach(function(e){
          e.style.display = "none"
        })
        loggedElements.forEach(function(e){
        e.style.display = "block"
      })
      sessionDiv.innerHTML = session.webId*/
      this.makeFile()
    },
    err => {
      //  console.log(err)
      console.log( "Aucune session Solid")
      /*  not_loggedElements.forEach(function(e){
      e.style.display = "block"
    })
    loggedElements.forEach(function(e){
    e.style.display = "none"
  })
  sessionDiv.innerHTML = "Login to send data to a Solid POD"*/
  //  alert("")
  this.login();
  return false;
}
);
}


login(){
  this.fileClient.popupLogin().then( webId => {
    console.log( `Logged in as ${webId}.`)
    this.makeFile()
  }, err => {
    console.log(err)
    alert("erreur : ",err)
  }
);
}

logout(){
  this.fileClient.logout().then( out =>
    {
      console.log("OUT",out)
      console.log( `Bye now!` )

    }
  );
}



makeFile(){
  console.log("TODO get footprint")
  /*var footprint = this.ttl.footprint

  var root = footprint["https://footprint.solid.community/public/root"].value || "https://holacratie.solid.community/public/";
  var path = footprint["https://footprint.solid.community/public/path"].value ||  this.localName(this.ttl.shape.url)
  console.log("PATH",path)


  var url = root+path+"/"+this.ttl.filename;*/
  var fileUrl = this.ttl.shape.url+"/"+this.ttl.filename
  console.log(fileUrl)

  this.fileClient.createFile(fileUrl, this.ttl.content, "text/turtle").then( fileCreated => {
    /*  result.status = "created"
    result.file = fileCreated
    updateResult(result)*/
    console.log(`Created file ${fileCreated}.`);
    alert(`Created file ${fileCreated}.`)
    //  log (fileCreated, "Created file")
  },
  err => {
    //  result.status = "erreur"
    //  updateResult(result)
    console.log(err);
    alert("ERREUR",err)
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

customElements.define('shexy-solid', ShexySolid);





/////////////
class SolidFolders extends LitElement {
  static get properties() {
    return {
      url: { type: String },
      folder: {type: Object}

    };
  }

  constructor() {
    super();
    this.url = 'World';
    this.fileClient  = new SolidFileClient(auth)
    this.folder = {}
    this.folder.name = "test folder name"
  }

  render() {
    return html`
    <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>
    <style>
    select {
      display: block; # obligé car materializecss n'arrive pas à initilaiser les selects
    }
    /* Style Placeholders */
    ::-webkit-input-placeholder {
      color: #2e7582;
      opacity: 1; /* Firefox */
      text-align: right;
    }
    ::-moz-placeholder {
      color: #2e7582;
      text-align: right;
    }
    :-ms-input-placeholder {
      color: #2e7582;
      text-align: right;
    }
    ::-ms-input-placeholder {
      color: #2e7582;
      text-align: right;
    }
    ::placeholder {
      color: #2e7582;
      text-align: right;
    }
    </style>


    <select class="teal lighten-4"
    title="${this.url}"
    @change=${this.selectorChange}>
    <slot name="mySelect">

    <option value="" disabled selected>${this.localName(this.url)}</option>
    <option value="" ></option>
    ${this.folder.files.map(i => html`
      <option value="${i.url}"  >${i.label || i.name}</option>
      `)}
      </slot>
      </select>
      `;
    }


    selectorChange(e) {

      console.log(e);

      console.log(e.bubbles);
      let   selectedEvent = new CustomEvent('select-event', {
        detail: {
          value: e.currentTarget.value
        }
      });
      this.dispatchEvent(selectedEvent);
      console.log("event",selectedEvent)
    }

    shouldUpdate(changedProperties) {
      changedProperties.forEach((oldValue, propName) => {
        console.log(`${propName} changed. oldValue: ${oldValue}`);
      });
      if (changedProperties.has('url')){
        //this.processsTtl()
        this.populateSelectWithFolder(this.url)
      }
      return changedProperties.has('url') || changedProperties.has('folder');
    }



    populateSelectWithFolder(url){
      console.log(url)

      var result =  {}
      this.folder = {}

      this.fileClient.readFolder(url).then(folder => {
        console.log(folder)
        this.folder = folder
        //  return  html`NAME : ${folder.name}`
      },
      err =>
      {
        console.log(err)
        if (err.startsWith("404 (Not Found)")){
          console.log("creation du dossier ",url)
          this.fileClient.createFolder(url).then(success => {
            console.log(`Created folder ${url}.`);
          }, err => console.log(err) );
        }
        //alert("error")
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

customElements.define('solid-folders', SolidFolders);



/////////////
class SolidLogin extends LitElement {
  static get properties() {
    return {
      fileClient: {type: Object},
      logged : {type: String},
      webId: { type: String}
    };
  }

  constructor() {
    super();
    this.fileClient = SolidFileClient;
    this.logged = false;
    this.webId = ""
  }

  render() {
    return html`
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>
    <div class="right">
    <a href="#" title="LOGIN" @click="${(e) =>this.solidCheckSession()}">
    ${this.webId.length> 0
      ? html `
      <span class=" new badge">${this.webId}       <i class="material-icons medium right teal-text text-darken-4" alt="Logout_icon">highlight_off</i></span>

      <!--      <div class="teal-text text-darken-4 right">${this.webId}</div>-->
      `
      : html `
      <span class="new badge " data-badge-caption="not logged"><i class="material-icons medium right teal-text text-darken-4" alt="Login_icon">person</i></span>

      <!--  <div class="teal-text text-darken-4 right">Not logged</div>-->

      `

    }
    </a>
    </div>
    `;
  }


  solidCheckSession(){
    this.fileClient.checkSession().then(
      session => {
        console.log("Logged in as "+session.webId)
        this.logout()
      },
      err => {
        //  console.log(err)
        console.log( "Aucune session Solid")
        this.login();
        return false;
      }
    );
  }


  login(){
    this.fileClient.popupLogin().then( webId => {
      console.log( `Logged in as ${webId}.`)
      //  alert("Logged in as ", webId)
      this.webId = webId
    }, err => {
      console.log(err)
      alert("erreur : ",err)
    }
  );
}

logout(){
  this.fileClient.logout().then( out =>
    {
      this.webId = ""
      console.log("OUT",out)
      console.log( `Bye now!` )
      //  alert("BYE")
    }
  );
}

shouldUpdate(changedProperties) {
  changedProperties.forEach((oldValue, propName) => {
    console.log(`${propName} changed. oldValue: ${oldValue}`);
  });
  if (changedProperties.has('fileClient')){
    this.firstUpdated()
  }
  return changedProperties.has('fileClient') || changedProperties.has('webId') ;
}

firstUpdated(){

  this.fileClient.checkSession().then(
    session => {
      console.log("Logged in as "+session.webId)
      this.webId = session.webId

    },
    err => {
      //  console.log(err)
      console.log( "Aucune session Solid")
      return false;
      this.webId = ""
    }
  );

}


}

customElements.define('solid-login', SolidLogin);
