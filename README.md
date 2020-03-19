# holon



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

# see similar project
https://github.com/inrupt/solid-sdk-forms


${(this.shape_url != undefined && this.shape_url.length > 0) ?
  html`Form : ${this.shape_url}`
  :html`You can use your own Form ading "?shape_url=url_to_form" in the address bar<br>
  example :
  https://scenaristeur.github.io/holon/?shape_url=https://holacratie.solid.community/public/Schema/post_simple.shex
  `}

  http://localhost:9001/?shape_url=https://holacratie.solid.community/public/Schema/todo.shex












```
npm init -y
npm install --save-dev webpack webpack-cli webpack-dev-server solid-auth-client solid-file-client lit-element scenaristeur/evejs shex
```
