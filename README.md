# crossmint-megaverse-challenge

This project is designed to demonstrate an implementation for the Crossmint coding challenge. The main goal is to create a system that interacts with a fictional API for managing a "megaverse," which consists of various astral objects.

This challenge serves to showcase the ability to structure code, use advanced TypeScript features, and ensure code quality through testing and validation.

## Getting Started

Follow these steps to get the project up and running on your local machine for development and testing purposes.

1. **Setup the Environment**: An example environment file is provided in `example.env`. My challenge ID is included, so if you want to run the code with it, simply execute:

```sh
cp example.env .env
```

2. **Install Dependencies**: You can use Yarn 🧶 to install the dependencies. This project is developed with Node.js `20.8.1`.

```sh
yarn
```

3. **Execute the Main Script**:

```sh
yarn start
```

4. You can enable or disable debug logs in the `.env` file. The `example.env` file provided has them enabled.

## Design Decisions

- Although it might be overkill, I've decided to follow a structured approach with **services, utils, and models**.
- The Services are exposed as a **singleton**. This, along with the way I mock `HttpService`, are remnants of being accustomed to using frameworks with **dependency injection** like Nest.
- A **generic model** `AstralObject` is extended by others (`Polyanet`, `Soloon`, and `Cometh`). This showcases **class and interface extension** examples.
- I'm only validating data in the `MapGoalResponse` model since it contains the only information coming from outside the application. For the rest, we rely on TypeScript types.
- For validation, I'm using **decorators** in `MapGoalResponse`. Although there are other ways to perform validation, I wanted to demonstrate their usage and how to write a custom one.
- We've also a more classic validation in the `ConfigService`.
- I have omitted validations/assertions that could be quick wins (like preventing negative values in a `setTimeout`) to reduce code complexity. But expect these checkes in any production code coming from my hands.
- In `HttpService`, I'm using the `fetch` method, which is included in the latest versions of Node. A common choice might have been to use `axios` for built-in functionalities like retry or enhanced error handling, but I wanted to show how these cases can be managed without depending on a library.
- The `rawMapToGoalMap` method in `MegaverseService` could potentially be turned into an AstralObjectFactory. However, I didn't want to introduce design patterns unless strictly necessary.
- The `HttpServide` has implemented a `remove` method. This calls internally to the `delete` endpoints, but it is not used in the code.
- There is util called `randomverse` that allows us to create random goal maps to test the megaverse handling logic.
- `MegaverseService` has **mutant tests**, so we check each method several times with multiple random configurations provided by the `randomverse` util.
- Only `429` status code (Too Many Requests) is retried. Other kind of errors or HTTP Statuses are propagated up. The `index.ts` file will just print the error and end the execution is something fails`.
- I am not checking if the provided maps in a `MapGoalResponse` or in `randomverse` have all their Soloons adjacent to a Polyanet. I think this is out of the scope of the challenge but a potential check in other scenarios.
- Fun fact 😎: the `index.ts` was executed only once for the Phase 2. TDD rocks! 🚀

## Tests
Tests are run with Jest, and the output follows the usual Jest format. We have 7 suites and 55 tests in total. Execute them with:

```sh
yarn test
```

### Coverage
The project has 100% coverage. You can verify this with:

```sh
yarn test:cov
```

```
--------------------------|---------|----------|---------|---------|-------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------------|---------|----------|---------|---------|-------------------
All files                 |     100 |      100 |     100 |     100 |                   
 src                      |     100 |      100 |     100 |     100 |                   
  types.ts                |     100 |      100 |     100 |     100 |                   
 src/decorators           |     100 |      100 |     100 |     100 |                   
  index.ts                |     100 |      100 |     100 |     100 |                   
  is-raw-map.validator.ts |     100 |      100 |     100 |     100 |                   
 src/models               |     100 |      100 |     100 |     100 |                   
  astral-object.ts        |     100 |      100 |     100 |     100 |                   
  cometh.ts               |     100 |      100 |     100 |     100 |                   
  index.ts                |     100 |      100 |     100 |     100 |                   
  map-goal-response.ts    |     100 |      100 |     100 |     100 |                   
  polyanet.ts             |     100 |      100 |     100 |     100 |                   
  soloon.ts               |     100 |      100 |     100 |     100 |                   
 src/services             |     100 |      100 |     100 |     100 |                   
  config.service.ts       |     100 |      100 |     100 |     100 |                   
  http.service.ts         |     100 |      100 |     100 |     100 |                   
  index.ts                |     100 |      100 |     100 |     100 |                   
  logger.service.ts       |     100 |      100 |     100 |     100 |                   
  megaverse.service.ts    |     100 |      100 |     100 |     100 |                   
 src/utils                |     100 |      100 |     100 |     100 |                   
  index.ts                |     100 |      100 |     100 |     100 |                   
  randomverse.util.ts     |     100 |      100 |     100 |     100 |                   
  retry.util.ts           |     100 |      100 |     100 |     100 |                   
  sleep.util.ts           |     100 |      100 |     100 |     100 |                   
--------------------------|---------|----------|---------|---------|-------------------
```

## Lint
I'm using a combination of ESLint (Standard rules) with Prettier and a few minimal personal preference changes. You can run it with:

```sh
yarn lint
```