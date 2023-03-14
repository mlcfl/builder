# Builder

An entry point to the entire MLCFL infrastructure.

## How to use?

First of all you need an installed the next programms:
- [Node.js](https://nodejs.org) (Node.js version 18.13.0+, npm version 7.5.6+).
- [pnpm](https://pnpm.io) (version 7.28.0+)

Create a directory `mlcfl` on your PC. Then download (clone) this repository into it and call sequentially in the console
```
pnpm i
pnpm build:builder
pnpm run install
pnpm run build
pnpm start
```

Explanation of steps:
1. install all dependencies;
1. compile builder from source code;
1. create a project structure, clone all needed repositories and install their dependencies;
1. compile the project;
1. run the project.

Follow the instructions to install, build and run the application. If successful, the application will be available at the address specified in the console.

<hr>

All available commands and their description can be seen in the console after calling
```
pnpm run help
```

## License
[CC BY-NC-ND 4.0](LICENSE)
