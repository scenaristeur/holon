import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import { fetchDocument } from 'tripledoc';
import { foaf, rdfs } from 'rdf-namespaces';

class ItemElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      item: {type: Object},
      triples : {type: Array},
    };
  }

  constructor() {
    super();
    this.item = {}
    this.triples = []
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet" >
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="container-fluid">
    <table class="table table-dark table-striped">
    <thead>
    <tr>
    <th colspan="2" scope="col"><h4>${decodeURI(this.item.name)}</h4>
     <a href="${this.item.url+"index.ttl"}" class="text-secondary" target="_blank"><small>${this.item.url+"index.ttl"}</small></a></th>
    </tr>
    </thead>
    <tbody>
    ${this.triples.map(t => html`
      <tr>
      <th scope="row">${this.formatter(t.predicate.id)}</th>
      <td>${this.formatter(t.object.id)}</td>
      </tr>
      `)}
      </tbody>
      </table></div>
      `;
    }

    formatter(text){
      if(text.startsWith('http')){
        if (text.endsWith('#meA')){
          return html`
          <a href="${text}" class="text-info" target="_blank">${text}</a>
          `
        }else{
          return html`
          <a href="${text}"  class="text-info" target="_blank">${this.localName(text)}</a>
          `
        }

      }else{
        return html`${text}`
      }
    }


    localName(uri){

      if(uri.endsWith("/")){
        uri = uri.slice(0, -1);}
        var ln = uri;
        if (uri.lastIndexOf("#") != -1) {
          ln = uri.substr(uri.lastIndexOf("#")).substr(1)
        }else{
          ln = uri.substr(uri.lastIndexOf("/")).substr(1)
        }
        return ln
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
        this.dataItem()
      }

      async dataItem(){
        let url = this.item.url+"index.ttl"//#this"
        const doc = await fetchDocument(url);
        console.log(doc)
        let sts = await doc.getStatements()
        console.log("sta",sts)
        let triples = await doc.getTriples()
        console.log("triples",triples)
        this.triples = triples
        //const profile = webIdDoc.getSubject('https://www.w3.org/People/Berners-Lee/card#i');
      }



      async dataItem1(){
        let url = this.item.url+"index.ttl#this"
        console.log("URL index",url)
        //  let predicates = []
        let dateCreated = await data[url]['https://schema.org/dateCreated']
        this.dateCreated = `${dateCreated}`
        /*  for await (const property of data[url].properties){
        //let val = await data[url][`${property}`]
        //console.log(`${property}`)
        https://schema.org/name item-element.js:65
        https://schema.org/dateCreated item-element.js:65
        https://schema.org/creator item-element.js:65
        https://schema.org/purpose_raison_d_etre item-element.js:65
        http://www.w3.org/1999/02/22-rdf-syntax-ns#type item-element.js:65
        http://www.w3.org/2000/01/rdf-schema#label item-element.js:65
        http://purl.org/dc/elements/1.1/title
      }

      /*    var prop = await `${property}`
      predicates[prop] = []
      let val = await data[url][`${property}`]
      console.log(`${val}`)
      //  let value = `${val}`
      predicates[prop] = [... predicates[prop], val]
      this.test = val
      this.predicates = predicates
      console.log("PREDSSSSS 11",this.predicates)
      this.requestUpdate()*/
      //  this.predicates = predicates
      //  console.log("PREDSSSSS",this.predicates)
      //  this.requestUpdate()

      /*
      for await (const val of data[url][`${prop}`]){
      let val = `${val}`
      console.log("val",val);
      //  app.predicates[predicate] = [... app.predicates, val]
      //  console.log(app.predicates)
    }*/


    /*
    for await (const val of data[url].properties){
    console.log("val",`${val}`)
  }*/
  //}



}

webIdChanged(webId){
  this.webId = webId
  if (webId != null){
    this.updateProfile();
  }else{

  }
}

}

customElements.define('item-element', ItemElement);
