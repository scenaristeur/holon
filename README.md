# holon
- vocabs https://lod-cloud.net/


# Install
```
npm install
```
# Dev
```
npm run start
```
# Build
```
npm run build
```
# Gh-pages

git add dist -f && git commit -m "Initial dist subtree commit"
```
git subtree push --prefix dist origin gh-pages
```

# todo
bootstrap auto complete https://bootstrap-autocomplete.readthedocs.io/en/latest/

# see similar project
https://github.com/inrupt/solid-sdk-forms

https://github.com/ericprud/shex-form/blob/master/index.js#L152

https://solid.github.io/form-playground/playground.html?uri=https%3A%2F%2Fwww.w3.org%2FPeople%2FBerners-Lee%2Fcard%23i&subject=https%3A%2F%2Fwww.w3.org%2FPeople%2FBerners-Lee%2Fcard%23i&form=https%3A%2F%2Ftimbl.com%2Ftimbl%2FPublic%2FTest%2FForms%2FindividualForm.ttl%23individualForm-byId

https://github.com/inrupt/solid-react-components

https://www.w3.org/ns/ui#

https://forum.solidproject.org/t/im-really-too-shexy-for-my-pod/2755/3

https://github.com/inrupt/generator-solid-react

https://github.com/inrupt/generator-solid-react#forms-and-form-models

https://github.com/inrupt/solid-react-components#formmodel

https://ericprud.github.io/shex-form/?manifestURL=examples/manifest.json

https://timbl.com/timbl/Public/

https://www.janeirodigital.com/web-decentralization/

${(this.shape_url != undefined && this.shape_url.length > 0) ?
  html`Form : ${this.shape_url}`
  :html`You can use your own Form ading "?shape_url=url_to_form" in the address bar<br>
  example :
  https://scenaristeur.github.io/holon/?shape_url=https://holacratie.solid.community/public/Schema/post_simple.shex
  `}

  http://localhost:9001/?shape_url=https://holacratie.solid.community/public/Schema/todo.shex


# ecolocracy
https://theecologist.org/2019/feb/15/why-we-need-ecolocracy

https://www.process.st/organizational-structure/

https://www.holacracy.org/glossary

https://www.cmswire.com/social-business/checking-in-on-holacracy/









```
npm init -y
npm install --save-dev webpack webpack-cli webpack-dev-server solid-auth-client solid-file-client lit-element scenaristeur/evejs shex
```
