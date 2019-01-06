// @flow
import assert from "assert";
import { getMessage } from "./_utils";

describe("getMessage", () => {
  it("welcomes the user", () => {
    const message = getMessage();
    assert.equal(message, "Welcome to <%= appname %>");
  });
});
