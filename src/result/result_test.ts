import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { Err, isErr, isOk, Ok, type Result, ResultType } from "./result.ts";
import type { Equals, Expect } from "../test_utils.ts/test_utils.ts";

describe("Result", () => {
  describe("Ok", () => {
    const value = "success";
    const okResult: Result<string, string> = Ok(value);

    it("type should return Ok", () => {
      expect(okResult.type).toBe(ResultType.Ok);
    });

    it("isOk should return true", () => {
      expect(okResult.isOk()).toBe(true);
    });

    it("isErr should return false", () => {
      expect(okResult.isErr()).toBe(false);
    });

    it("ok should return a Some with the value", () => {
      expect(okResult.ok().unwrap()).toBe(value);
    });

    it("err should return None", () => {
      expect(okResult.err().isNone()).toBe(true);
    });

    it("unwrap should return the value", () => {
      expect(okResult.unwrap()).toBe(value);
    });

    it("unwrapErr should throw", () => {
      expect(() => okResult.unwrapErr()).toThrow();
    });

    it("unwrapOr should return the value", () => {
      expect(okResult.unwrapOr("default")).toBe(value);
    });

    it("match should execute ok branch", () => {
      const result = okResult.match({
        ok: (val) => `Ok ${val}`,
        err: (val) => `Err ${val}`,
      });
      expect(result).toBe(`Ok ${value}`);
    });

    it("map should apply function and wrap result in Ok", () => {
      const mapped = okResult.map((val) => val.length);
      expect(mapped.unwrap()).toBe(value.length);
    });

    it("mapErr should not apply function and return Ok", () => {
      const mappedErr = okResult.mapErr((err) => `Error: ${err}`);
      expect(mappedErr.unwrap()).toBe(value);
    });

    it("andThen should apply function returning Result", () => {
      const andThenResult = okResult.andThen((val) => Ok(val.length));
      expect(andThenResult.unwrap()).toBe(value.length);
    });

    it("orElse should not apply function and return Ok", () => {
      const orElseResult = okResult.orElse((err) => Err(`Error: ${err}`));
      expect(orElseResult.unwrap()).toBe(value);
    });

    it("inspect should execute function and return original Ok", () => {
      let inspected = "";
      const result = okResult.inspect((val) => {
        inspected = val;
      });
      expect(inspected).toBe(value);
      expect(result.unwrap()).toBe(value);
    });

    it("inspectErr should not execute function and return Ok", () => {
      let inspected = false;
      const result = okResult.inspectErr(() => {
        inspected = true;
      });
      expect(inspected).toBe(false);
      expect(result.unwrap()).toBe(value);
    });

    it("expect should return the value", () => {
      expect(okResult.expect("Expected a value")).toBe(value);
    });
  });

  describe("Err", () => {
    const error = "error";
    const errResult: Result<string, string> = Err(error);

    it("type should return Err", () => {
      expect(errResult.type).toBe(ResultType.Err);
    });

    it("isOk should return false", () => {
      expect(errResult.isOk()).toBe(false);
    });

    it("isErr should return true", () => {
      expect(errResult.isErr()).toBe(true);
    });

    it("ok should return None", () => {
      expect(errResult.ok().isNone()).toBe(true);
    });

    it("err should return a Some with the error", () => {
      expect(errResult.err().unwrap()).toBe(error);
    });

    it("unwrap should throw", () => {
      expect(() => errResult.unwrap()).toThrow();
    });

    it("unwrapErr should return the error", () => {
      expect(errResult.unwrapErr()).toBe(error);
    });

    it("unwrapOr should return the default value", () => {
      expect(errResult.unwrapOr("default")).toBe("default");
    });

    it("match should execute err branch", () => {
      const result = errResult.match({
        ok: (val) => `Ok ${val}`,
        err: (val) => `Err ${val}`,
      });
      expect(result).toBe(`Err ${error}`);
    });

    it("map should not apply function and return Err", () => {
      const mapped = errResult.map((val) => val.length);
      expect(() => mapped.unwrap()).toThrow();
    });

    it("mapErr should apply function and wrap result in Err", () => {
      const mappedErr = errResult.mapErr((err) => `Error: ${err}`);
      expect(mappedErr.unwrapErr()).toBe(`Error: ${error}`);
    });

    it("andThen should not apply function and return Err", () => {
      const andThenResult = errResult.andThen((val) => Ok(val.length));
      expect(() => andThenResult.unwrap()).toThrow();
    });

    it("orElse should apply function returning Result", () => {
      const orElseResult = errResult.orElse((err) =>
        Ok(`Recovered from ${err}`)
      );
      expect(orElseResult.unwrap()).toBe(`Recovered from ${error}`);
    });

    it("inspect should not execute function and return Err", () => {
      let inspected = false;
      const result = errResult.inspect(() => {
        inspected = true;
      });
      expect(inspected).toBe(false);
      expect(result.unwrapErr()).toBe(error);
    });

    it("inspectErr should execute function and return original Err", () => {
      let inspected = "";
      const result = errResult.inspectErr((err) => {
        inspected = err;
      });
      expect(inspected).toBe(error);
      expect(result.unwrapErr()).toBe(error);
    });

    it("expect should throw with message", () => {
      expect(() => errResult.expect("Expected a value")).toThrow(
        "Expected a value: error",
      );
    });
  });

  describe("isOk", () => {
    const ok = Ok("success");
    const err = Err("error");

    it("should return true for Ok", () => {
      expect(isOk(ok)).toBe(true);
    });

    it("should return false for Err", () => {
      expect(isOk(err)).toBe(false);
    });
  });

  describe("isErr", () => {
    const ok = Ok("success");
    const err = Err("error");

    it("should return false for Ok", () => {
      expect(isErr(ok)).toBe(false);
    });

    it("should return true for Err", () => {
      expect(isErr(err)).toBe(true);
    });
  });

  describe("typeguards", () => {
    const ok = Ok("success");
    const err = Err("error");

    it("isOk", () => {
      if (ok.isOk()) {
        type unwrapRes = Equals<"success", ReturnType<typeof ok.unwrap>>;
        type _unwrapRes = Expect<unwrapRes>;

        type unwrapErrRes = Equals<never, ReturnType<typeof ok.unwrapErr>>;
        type _unwrapErrRes = Expect<unwrapErrRes>;

        const mappedOk = ok.map((val) => val.length);
        type mappedUnwrapOkRes = Equals<
          number,
          ReturnType<typeof mappedOk.unwrap>
        >;
        type _mappedUnwrapOkRes = Expect<mappedUnwrapOkRes>;
      }
    });

    it("isErr", () => {
      if (err.isErr()) {
        type unwrapRes = Equals<"error", ReturnType<typeof err.unwrapErr>>;
        type _unwrapRes = Expect<unwrapRes>;

        type unwrapErrRes = Equals<never, ReturnType<typeof err.unwrap>>;
        type _unwrapErrRes = Expect<unwrapErrRes>;

        const mappedErr = err.mapErr((val) => val.length);
        type mappedUnwrapErrRes = Equals<
          number,
          ReturnType<typeof mappedErr.unwrapErr>
        >;
        type _mappedUnwrapErrRes = Expect<mappedUnwrapErrRes>;
      }
    });
  });
});
