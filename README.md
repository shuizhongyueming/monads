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

Type `Option<T>` represents an optional value: every `Option` is either `Some` and contains a value, or `None`, and does not.

You could consider using `Option` for:

- Nullable pointers (`undefined` in JavaScript)
- Return value for otherwise reporting simple errors, where None is returned on error
- Default values and/or properties
- Nested optional object properties

`Option`s are commonly paired with pattern matching to query the presence of a value and take action, always accounting for the `None` case.

```typescript
import { Option, Some, None } from 'jsr:@shuizhongyueming/monads';

function divide(numerator: number, denominator: number): Option<number> {
  if (denominator === 0) {
    return None;
  } else {
    return Some(numerator / denominator);
  }
}

// The return value of the function is an option
const result = divide(2.0, 3.0);

// Pattern match to retrieve the value
const message = result.match({
  some: (res) => `Result: ${res}`,
  none: 'Cannot divide by 0',
});

console.log(message); // "Result: 0.6666666666666666"
```

Original implementation: <https://doc.rust-lang.org/std/option/enum.Option.html>


### The `Result<T, E>` type

`Result<T, E>` is the type used for returning and propagating errors. The variants are `Ok(T)`, representing success and containing a value, and `Err(E)`, representing error and containing an error value.

You could consider using `Result` for:

- Return value whenever errors are expected and recoverable

```typescript
import { Result, Ok, Err } from 'jsr:@shuizhongyueming/monads';

function getIndex(values: string[], value: string): Result<number, string> {
  const index = values.indexOf(value);

  switch (index) {
    case -1:
      return Err('Value not found');
    default:
      return Ok(index);
  }
}

console.log(getIndex(['a', 'b', 'c'], 'b')); // Ok(1)
console.log(getIndex(['a', 'b', 'c'], 'z')); // Err("Value not found")
```

Original implementation: <https://doc.rust-lang.org/std/result/enum.Result.html>
