#!/usr/bin/env node

import { Command } from "commander";
import {
    add,
    categories,
    listCategories,
    listCategoryItems,
    update,
} from "../src/actions.js";
import {
    promptAddOrder,
    promptListIds,
    promptUpdate,
    promptCommand
} from "../src/prompts.js";
import { displayInfo, displayText, error, log } from "../src/utils.js";

// Create a new Command Program
const program = new Command();

program
    .name("server-cli")
    .description("Back office for websocket app")
    .version("1.0.0")
    .option("-i, --interactive", "Run App in interactive mode")
    .action(() => {
        // NO-op
    });

// Crea un comando para listar categorías por IDs
program
    // Establece el nombre del comando
    .command("add")
    // Establece la descripción del comando
    .description("Agregar producto por ID a una categoría")
    .option("-i, --interactive", "Run Update Command in interactive mode")
    // Establece la categoría como obligatoria
    .argument("<CATEGORY>", "Product Category")
    // Establece el argumento ID como obligatorio
    .argument("<ID>", "Product ID")
    // Establece el argumento NAME como obligatorio
    .argument("<NAME>", "Product Name")
    // Establece el argumento AMOUNT como obligatorio
    .argument("<AMOUNT>", "Product RRP")
    // Establece el argumento INFO como opcional
    .argument("[INFO...]", "Product Info")
    // Establece la acción que se ejecutará cuando se ejecute el comando
    .action(
        async (category, id, name, amount, info) =>
            await add(category, id, name, amount, info)
    );

// Create a command for listing categories
program
    // Set the command name
    .command("list")
    // Set the command description
    .description("List categories")
    .option("-i, --interactive", "Run Update Command in interactive mode")
    // Set the option to list all categories
    .option("-a, --all", "List all categories")
    // Set the category to be optional
    .argument("[CATEGORY]", "Category to list IDs for")
    // Set the action to be executed when the command is run
    .action(async (args, opts) => {
        if (args && opts.all)
            throw new Error("Cannot specify both category and 'all'");
        if (opts.all || args === "all") {
            listCategories();
        } else if (args === "confectionery" || args === "electronics") {
            await listCategoryItems(args);
        } else {
            throw new Error("Invalid category specified");
        }
    });

program
    .command("update")
    .description("Update an order")
    .option("-i, --interactive", "Run Update Command in interactive mode")
    .argument("<ID>", "Order ID")
    .argument("<Amount>", "Order Amount")
    .action(async (id, amount) => await update(id, amount))

program.parse();

const commandActions = async (name) => {
    const actionsNotAllowed = ["help", "exit"];
    const actions = {
        "add": async () => {
            log(displayInfo(`Add Order`));
            await promptAddOrder();
        },
        "update": async () => {
            log(displayInfo(`Update Order`));
            await promptUpdate();
        },
        "list": () => {
            log(displayInfo(`List Categories`));
            listCategories();
        },
        "list by ID's": async () => {
            log(displayInfo(`List Category Items`));
            await promptListIds();
        },
        "help": () => program.help(),
        "exit": () => process.exit(0)
    }

    await actions?.[name]?.();
    return (!actionsNotAllowed.includes(name)) ? interactiveApp() : null;
}


export const interactiveApp = async (cmd) => {
    log(displayText(`Back office for My App`));
    log(displayInfo(`Interactive Mode`));
    try {
        const command = cmd ?? await promptCommand();
        commandActions(command);
    } catch (err) {
        error(err);
        process.exit(1);
    }
};

// Main function to run the program
async function main(program) {
    // Get the command, process.args and options
    const command = program?.args.at(0) || "";
    const cliArgs = program?.args.slice(1) || [];
    const options = program?.opts() || {};

    // Guard clauses
    if (!command && !options.interactive) {
        // Display the help
        program.help();
    }
    if (!command && options.interactive) {
        // Run the interactive app
        return interactiveApp();
    }
    if (command && options.interactive) {
        // Run the interactive app with the command
        return interactiveApp(command);
    }
    if (options.interactive && cliArgs.length > 0) {
        throw new Error("Cannot specify both interactive and command");
    }
    // Execute the command
    switch (command) {
        case "add": {
            const [category, id, name, amount, info] = cliArgs;
            if (
                !categories.includes(category) ||
                !category ||
                !id ||
                !name ||
                !amount
            ) {
                throw new Error("Invalid arguments specified");
            }
            await add(category, id, name, amount, info);
            break;
        }
        case "update": {
            const [id, amount] = cliArgs;
            if (!id && !amount) {
                throw new Error("Invalid arguments specified");
            }
            await update(id, amount);
            break;
        }
        case "list": {
            const { all } = options;
            const [category] = cliArgs;
            if (category && all)
                throw new Error("Cannot specify both category and 'all'");
            if (all || category === "all") {
                listCategories();
            } else if (categories.includes(category)) {
                await listCategoryItems(category);
            } else {
                throw new Error("Invalid category specified");
            }
            break;
        }
        default:
            await interactiveApp();
    }
}
// Run the main function
main(program);