# Web Service CLI

A command-line interface (CLI) tool for managing actions on our static web application. This CLI allows users to perform operations such as adding, updating, listing items, and more.

## Features

- **Add**: Add new items to the static web application.
- **Update**: Update existing items.
- **List**: Display all items.
- **List by ID**: Display details of a specific item by its ID.
- **Help**: Show available commands and usage instructions.
- **Exit**: Exit the CLI.

## Requirements

- Node.js (>= 20.x)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MichaelAuditore/web-server-cli.git
   cd web-service-cli
   ```
2. Install dependencies:
    ```bash
    npm install
    ```

## Usage

First at all, we need to link our package to our [web static app](https://github.com/MichaelAuditore/static-web-app.git).

Note: It is important to run our fastify server, to succesfully execute commands of our cli tool

So:

1. Link package to our local project
 * Run this command on this repo that allows you to symlink a local package into your global node_modules directory and use it in other local projects without publishing it to the npm registry.
    
    ```bash
    npm link
    ```
* Now we are going to execute this command to use our package into the [web static app](https://github.com/MichaelAuditore/static-web-app.git) local project.

    ```
    npm link server-cli
    ```

### Instructions
Usage: server-cli [options] [command]

Back office for websocket app

Options:
  -V, --version                                            output the version number
  -i, --interactive                                        Run App in interactive mode
  -h, --help                                               display help for command

Commands:
  add [options] <CATEGORY> <ID> <NAME> <AMOUNT> [INFO...]  Agregar producto por ID a una categoría
  list [options] [CATEGORY]                                List categories
  update [options] <ID> <Amount>                           Update an order