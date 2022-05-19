
# Simple URL poller

Polls given URL until expected value is received.

## Parameters
`url` the expected url
`attempts` how often should we try
`interval` how much time betweeen attempts (note used for both request timeout and pause time)
`expectedContent` the string we expect to receive

# Usage

```
- "name": "Poll endpoint for expected content"
  "uses": "genisd/wait-for-http-content:v1"
  "with":
    "url": "https://example.com/test.txt"
    "attempts": "100"
    "interval": "1000"
    "expectedContent": 12e8fc27b66c703df2ef6fa2b617636596e70bff"
```


# Code in Main

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies
```bash
$ yarn install
```

Build the typescript and package it for distribution
```bash
$ yarn run build && yarn run package
```

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder.

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ yarn run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```