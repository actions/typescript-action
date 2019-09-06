# JavaScript Action Template

This template offers an easy way to get started writing a JavaScript action with TypeScript compile time support, unit testing with Jest and using the GitHub Actions Toolkit.

## Getting Started

See the walkthrough located [here](https://github.com/actions/toolkit/blob/master/docs/javascript-action.md).

In addition to walking your through how to create an action, it also provides strategies for versioning, releasing and referencing your actions.

### Alternative checkout strategy

The published branches just need a few files, so a full branch from
the master is not actually needed. In order to create a release, issue
these orders (after `main.js` has been generated).

```
git checkout --orphan releases/v1 # Creates an empty branch
git rm --cached -r .              # Removes non-followed files
git checkout master lib/main.js package*.json README.md LICENSE action.yml
rm -rf node_modules
npm install --production
git add node_modules
git push -u origin releases/v1
```

