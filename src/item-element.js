import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
//import { namedNode } from '@rdfjs/data-model';
import data from "@solid/query-ldflex";

class ItemElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      item: {type: Object},
      predicates: {type: Array},
      test : {type: String},
      dateCreated: {type: String}
    };
  }

  constructor() {
    super();
    this.item = {}
    this.predicates = []
    this.test = "test"
    this.dateCreated = ""
  }

  render(){
    return html`
    <h4>${decodeURI(this.item.name)}</h4>
    ${this.item.url}<br>
    LABEL : ${this.label}<br>
    TEST : ${this.test}<br>
    dateCreated : ${this.dateCreated}
    predicates: ${this.predicates.length} :
    ${this.predicates.map((i, index) => html`
      ${index} : ${i}
      `)}


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
      this.dataItem()
    }

    async dataItem(){
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
