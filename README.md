<p align="center">
  <a href="https://github.com/shuizhongyueming/monads">
    <img src="https://raw.githubusercontent.com/shuizhongyueming/monads/main/.github/assets/monads-cover.png" alt="Monads Logo" />
  </a>
</p>

<p align="right">
  <i>If you use this repo, star it ✨</i>
</p>

---

> [!NOTE]
> Most of the code in this repository is forked from [slavovojacek/monads](https://github.com/slavovojacek/monads).

<h2 align="center">Option and Result types for JavaScript</h2>

<p align="center">
  🦀 Inspired by <a href="https://doc.rust-lang.org/stable/std/option/" target="_blank">Rust</a>
</p>

<p align="center">
  <b>Zero dependencies</b> • <b>Lightweight</b> • <b>Functional</b>
</p>

---

## Install

```sh
# deno
deno add @shuizhongyueming/monads
# npm
npx jsr add @shuizhongyueming/monads
# pnpm
pnpm i jsr:@shuizhongyueming/monads
```

## Getting started

### The `Option<T>` type

Option represents an optional value: every Option is either Some and contains a value, or None, and does not.

> [!NOTE]
> Full documentation here: [Option](https://jsr.io/@shuizhongyueming/monads/0.2.0/src/option/README.md)

```ts
import { Option, Some, None } from 'jsr:@shuizhongyueming/monads';

const divide = (numerator: number, denominator: number): Option<number> => {
  if (denominator === 0) {
    return None;
  } else {
    return Some(numerator / denominator);
  }
};

// The return value of the function is an option
const result = divide(2.0, 3.0);

// Pattern match to retrieve the value
const message = result.match({
  some: (res) => `Result: ${res}`,
  none: 'Cannot divide by 0',
});

console.log(message); // "Result: 0.6666666666666666"
```

### The `Result<T, E>` type

Result represents a value that is either a success (Ok) or a failure (Err).

> [!NOTE]
> Full documentation here: [Result](https://jsr.io/@shuizhongyueming/monads/0.2.0/src/result/README.md)

```ts
import { Result, Ok, Err } from 'jsr:@shuizhongyueming/monads';

const getIndex = (values: string[], value: string): Result<number, string> => {
  const index = values.indexOf(value);

  switch (index) {
    case -1:
      return Err('Value not found');
    default:
      return Ok(index);
  }
};

const values = ['a', 'b', 'c'];

getIndex(values, 'b'); // Ok(1)
getIndex(values, 'z'); // Err("Value not found")
```
