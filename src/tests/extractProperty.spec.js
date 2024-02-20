import * as chai from "chai";
import { describe, it } from "mocha";
import MessageUtils from "../utils/MessageUtils.js";
let expect = chai.expect;

describe("extractCommonLabelsFromReq()", () => {
  describe("Try to extract labels from undefined body", () => {
    it("Should return null", () => {
      expect(MessageUtils.extractProperty(undefined), "commonLabels").to.equal(
        null
      );
    });
  });

  describe("Try to extract labels from request with empty body", () => {
    it("Should return null", () => {
      expect(MessageUtils.extractProperty({}), "commonLabels").to.deep.equal(
        null
      );
    });
  });

  describe("Try to extract labels from request with no common labels", () => {
    it("Should return null", () => {
      expect(
        MessageUtils.extractProperty({ commonLabels: {} }),
        "commonLabels"
      ).to.deep.equal(null);
    });
  });

  describe("Try to extract labels from request with common labels", () => {
    it("Should return common labels object", () => {
      expect(
        MessageUtils.extractProperty(
          { commonLabels: { label1: "test", label2: "test2" } },
          "commonLabels"
        )
      ).to.deep.equal({ label1: "test", label2: "test2" });
    });
  });

  describe("Try to extract nonexistant property from request", () => {
    it("Should return null", () => {
      expect(
        MessageUtils.extractProperty(
          { commonLabels: { label1: "test", label2: "test2" } },

          "nonexistantProperty"
        )
      ).to.deep.equal(null);
    });
  });
});
