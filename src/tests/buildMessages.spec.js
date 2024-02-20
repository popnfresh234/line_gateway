import * as chai from "chai";
import { describe, it } from "mocha";
import MessageUtils from "../utils//MessageUtils.js";
import TextUtils from "../utils/TextUtils.js";
let expect = chai.expect;

describe("buildMessage()", () => {
  let alertname = "Test Alert";
  let status = "Firing";
  let severity = "critical";
  let unknownSeverity = "unknownSeverity";
  let summary = "Test Summary";
  let description = "Test Description";

  describe("Build messages from null array", () => {
    it("Should return an empty message", () => {
      expect(MessageUtils.buildMessages(null)).deep.to.equal([]);
    });
  });

  describe("Build message array with empty lables and empty annotations", () => {
    it("Should return an array with one empty message", () => {
      let sampleAlert = { labels: {}, annotations: {} };
      expect(MessageUtils.buildMessages([sampleAlert])).deep.to.equal([]);
    });
  });

  describe("Build message array with one message and alert name only", () => {
    it("Should return an array with one message with only an alert name", () => {
      let sampleAlert = { labels: { alertname } };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([
        "\nAlert Name: " + alertname,
      ]);
    });
  });

  describe("Build message array with one message and status only", () => {
    it("Should return an array with one message with a status", () => {
      let sampleAlert = { status };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([
        "\nStatus: " + status,
      ]);
    });
  });

  describe("Build message array with one message with severity level only", () => {
    it("Should return an array with one message with a severity level", () => {
      let sampleAlert = { labels: { severity } };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([
        "\nSeverity: " +
          TextUtils.severityColorLookup(severity) +
          ` ${severity}`,
      ]);
    });
  });

  describe("Build message array with one message with unknown severity level only", () => {
    it("Should return an array with one message with default severity level", () => {
      const severityEmoji = TextUtils.severityColorLookup(unknownSeverity);
      let sampleAlert = { labels: { severity: unknownSeverity } };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([
        "\nSeverity: " + severityEmoji + ` ${unknownSeverity}`,
      ]);
    });
  });

  describe("Build message array with one message with summary only", () => {
    it("Should return an array of messages with one message with a summary", () => {
      let sampleAlert = { annotations: { summary } };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([
        "\nSummary: " + summary,
      ]);
    });
  });

  describe("Build an array of messages with one message with description only", () => {
    it("Should return an array of messages with one message with a description", () => {
      let sampleAlert = { annotations: { description } };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([
        "\nDescription: " + description,
      ]);
    });
  });

  describe("Build message array with one message with undefined fields", () => {
    it("Should return a message with an empty message", () => {
      let sampleAlert = {
        labels: {
          alertname: undefined,
          severity: undefined,
        },
        annotations: {
          summary: undefined,
          description: undefined,
        },
        status: undefined,
      };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([]);
    });
  });

  describe("Build message array with one message with all fields", () => {
    it("Should return an array of messages with one properly built message", () => {
      let sampleAlert = {
        status,
        labels: { alertname, severity },
        annotations: { summary, description },
      };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([
        "\nAlert Name: " +
          alertname +
          "\nStatus: " +
          status +
          "\n" +
          "Severity: " +
          TextUtils.severityColorLookup(severity) +
          ` ${severity}` +
          "\n" +
          "Summary: " +
          summary +
          "\n" +
          "Description: " +
          description,
      ]);
    });
  });

  describe("Build message array with two messages with all fields", () => {
    it("Should return an array of messages with two properly built message", () => {
      let sampleAlert = {
        status,
        labels: { alertname, severity },
        annotations: { summary, description },
      };

      expect(
        MessageUtils.buildMessages([sampleAlert, sampleAlert])
      ).to.deep.equal([
        "\nAlert Name: " +
          alertname +
          "\nStatus: " +
          status +
          "\n" +
          "Severity: " +
          TextUtils.severityColorLookup(severity) +
          ` ${severity}` +
          "\n" +
          "Summary: " +
          summary +
          "\n" +
          "Description: " +
          description,
        "\nAlert Name: " +
          alertname +
          "\nStatus: " +
          status +
          "\n" +
          "Severity: " +
          TextUtils.severityColorLookup(severity) +
          ` ${severity}` +
          "\n" +
          "Summary: " +
          summary +
          "\n" +
          "Description: " +
          description,
      ]);
    });
  });

  describe("Build message array with one message with all fields and one message with empty fields", () => {
    it("Should return an array of messages with one properly built message", () => {
      let sampleAlert = {
        status,
        labels: { alertname, severity },
        annotations: { summary, description },
      };

      let badAlert = {
        labels: {
          alertname: undefined,
          severity: undefined,
        },
        annotations: {
          summary: undefined,
          description: undefined,
        },
        status: undefined,
      };

      expect(MessageUtils.buildMessages([sampleAlert, badAlert])).to.deep.equal(
        [
          "\nAlert Name: " +
            alertname +
            "\nStatus: " +
            status +
            "\n" +
            "Severity: " +
            TextUtils.severityColorLookup(severity) +
            ` ${severity}` +
            "\n" +
            "Summary: " +
            summary +
            "\n" +
            "Description: " +
            description,
        ]
      );
    });
  });
});
