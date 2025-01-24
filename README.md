# Nx Cloud Skipper

[![GitHub Super-Linter](https://github.com/actions/robsonos/nx-cloud-skipper-action/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/robsonos/nx-cloud-skipper-action/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/robsonos/nx-cloud-skipper-action/workflows/check-dist.yml/badge.svg)](https://github.com/actions/robsonos/nx-cloud-skipper-action/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/robsonos/nx-cloud-skipper-action/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/robsonos/nx-cloud-skipper-action/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This action runs `npx nx` commands with automatic fallback to `--no-cloud` if
they fail.

## Basic usage

```yml
jobs:
  job_id:
    steps:
      - name: Check out Git repository
          uses: actions/checkout@v4

      - name: Setup NodeJS
        uses: actions/setup-node@v4

      - name: Install dependencies
        run: npm ci

    ...

      - name: Run CI on affected projects
        uses: robsonos/nx-cloud-skipper-action
        with:
          command: 'affected -t lint test build'
```

The above will run `npx nx affected -t lint test build` and if the default
`errorMessages` are found in the log it will run
`npx nx affected -t lint test build --no-cloud`

## Inputs

| Name            | Description                                                         | Required | Default                                                             |
| --------------- | ------------------------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| `command`       | Arguments to pass to `npx nx` (e.g., `affected -t lint test build`) | true     |                                                                     |
| `errorMessages` | Set the NX_BASE environment variable (optional)                     | false    | `Workspace is unable to be authorized`<br>`exceeding the FREE plan` |

## Outputs

| Name     | Description                            |
| -------- | -------------------------------------- |
| `status` | Status of the action (success/failure) |
