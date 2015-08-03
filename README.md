# Node project starter
I made this because I don't particularly like copying out project structure from each of my projects, constantly forgetting to steal certain pieces, or bring in more than is necessary.
This isn't really something that should be cloned for anything, but rather downloaded and used as a first commit, or even the beginning of a first commit.

You can use this as an npm package starter as is, or you can add a `start` script to `package.json` to use it as a node application.

This is what this project skeleton includes:
1. Docs dependency
2. Tests dependency
3. Linter dependency
4. Code coverage dependency

## Docs
```
npm run docs
```
Generates documentation nice and pretty. Only recurses through the `lib` directory, because most things worthy of documenting should be in there anyways.

## Tests
```
npm test
```
Runs the tests. In the `tests` folder. 

## Linter
```
npm run lint
```
Runs the linter on everything other than the output folders for `docs` and `coverage`. 

## Code coverage
```
npm run coverage
```
Runs the tests, and outputs the coverage report to a folder called `coverage`.