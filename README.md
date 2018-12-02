# GrenouilleWeb

This deposit is now deprecated. 
The new StreamProxy deposit is now a modular service with a [backend](https://github.com/FroggedTV/StreamProxyBackend) and a [frontend](https://github.com/FroggedTV/StreamProxyFrontend) exclusivly designed for the stream proxy. Other services specificaly designed for Dota 2 and the FroggedTV will be created in a new deposit.

Project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Prod

Prod runs into a `nginx` docker image. Start it with `make prod-start` and stop it with `make prod-stop`. This will build the project, build the image, and start it.

