import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import {
  isNone,
  isSome,
  None,
  type Option,
  OptionType,
  Some,
} from "./option.ts";
import type { Equals, Expect } from "../test_utils.ts/test_utils.ts";

describe("Option", () => {
  describe("Some", () => {
    const value = "test";
    const someOption: Option<string> = Some(value);

    it("type should return Some", () => {
      expect(someOption.type).toBe(OptionType.Some);
    });

    it("isSome should return true", () => {
      expect(someOption.isSome()).toBe(true);
    });

    it("isNone should return false", () => {
      expect(someOption.isNone()).toBe(false);
    });

    it("match should execute some branch", () => {
      const result = someOption.match({
        some: (val) => `Some ${val}`,
        none: "None",
      });
      expect(result).toBe(`Some ${value}`);
    });

    it("map should apply function and wrap result in Some", () => {
      const mapped = someOption.map((val) => val.length);
      expect(mapped.unwrap()).toBe(value.length);
    });

    it("andThen should apply function returning Option", () => {
      const andThenResult = someOption.andThen((val) => Some(val.length));
      expect(andThenResult.unwrap()).toBe(value.length);
    });

    it("or should return original Some if not None", () => {
      const orResult = someOption.or(Some("other"));
      expect(orResult.unwrap()).toBe(value);
    });

    it("and should return passed Option if original is Some", () => {
      const andResult = someOption.and(Some("other"));
      expect(andResult.unwrap()).toBe("other");
    });

    it("unwrapOr should return value", () => {
      expect(someOption.unwrapOr("default")).toBe(value);
    });

    it("unwrap should return value", () => {
      expect(someOption.unwrap()).toBe(value);
    });

    it("inspect should execute function and return original Some", () => {
      let inspected = "";
      const result = someOption.inspect((val) => {
        inspected = val;
      });
      expect(inspected).toBe(value);
      expect(result.unwrap()).toBe(value);
    });
  });

  describe("None", () => {
    it("type should return None", () => {
      expect(None.type).toBe(OptionType.None);
    });

    it("isSome should return false", () => {
      expect(None.isSome()).toBe(false);
    });

    it("isNone should return true", () => {
      expect(None.isNone()).toBe(true);
    });

    it("match should execute none branch", () => {
      const result = None.match({
        some: (val) => `Some ${val}`,
        none: () => "None",
      });
      expect(result).toBe("None");
    });

    it("map should not apply function and return None", () => {
      const mapped = None.map((val: string) => val.length);
      expect(mapped).toStrictEqual(None);
    });

    it("andThen should not apply function and return None", () => {
      const andThenResult = None.andThen((val: string) => Some(val.length));
      expect(andThenResult).toStrictEqual(None);
    });

    it("or should return passed Option if original is None", () => {
      const orResult = None.or(Some("other"));
      expect(orResult.unwrap()).toBe("other");
    });

    it("and should return None if original is None", () => {
      const andResult = None.and(Some("other"));
      expect(andResult).toStrictEqual(None);
    });

    it("unwrapOr should return default value", () => {
      expect(None.unwrapOr("default")).toBe("default");
    });

    it("unwrap should throw", () => {
      expect(() => None.unwrap()).toThrow();
    });

    it("inspect should not execute function and return None", () => {
      let inspected = false;
      const result = None.inspect(() => {
        inspected = true;
      });
      expect(inspected).toBe(false);
      expect(result).toStrictEqual(None);
    });
  });

  describe("isSome", () => {
    const some = Some("test");
    const none = None;

    it("should return true for Some", () => {
      expect(isSome(some)).toBe(true);
    });

    it("should return false for None", () => {
      expect(isSome(none)).toBe(false);
    });
  });

  describe("isNone", () => {
    const some = Some("test");
    const none = None;

    it("should return false for Some", () => {
      expect(isNone(some)).toBe(false);
    });

    it("should return true for None", () => {
      expect(isNone(none)).toBe(true);
    });
  });

  describe("typeguards", () => {
    const some = Some("foo");
    const none = None;

    it("isSome", () => {
      if (some.isSome()) {
        type someReturn = ReturnType<typeof some.unwrap>;
        type unwrapRes = Equals<"foo", someReturn>;
        type _unwrapRes = Expect<unwrapRes>;

        const mappedSome = some.map((val) => val.length);
        type mappedUnwrapRes = Equals<
          number,
          ReturnType<typeof mappedSome.unwrap>
        >;
        type _mappedUnwrapRes = Expect<mappedUnwrapRes>;
      }
    });

    it("isNone", () => {
      if (none.isNone()) {
        type unwrapRes = Equals<never, ReturnType<typeof none.unwrap>>;
        type _unwrapRes = Expect<unwrapRes>;

        const mappedNone = none.map((val) => val.length);
        type mappedUnwrapRes = Equals<
          never,
          ReturnType<typeof mappedNone.unwrap>
        >;
        type _mappedUnwrapRes = Expect<mappedUnwrapRes>;
      }
    });
  });
});
