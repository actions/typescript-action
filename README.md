# Node 12 Template Action

To get started, click the `Use this template` button on this repository [which will create a new repository based on this template](https://github.blog/2019-06-06-generate-new-repositories-with-repository-templates/).

After your new repository is created, check it out, hack on the source files, and then build it with:
```
npm install @types/node --save-dev
npm install @actions/core
npm run-script build
npm prune --production
git add -f node_modules/*
git commit -am "My first action is ready!"
git push
```

Then you are ready to author a worfklow using this repo!
