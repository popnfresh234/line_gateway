import { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status-codes";
import LineNotifyService from "../service/LineNotifyService.js";
import Config from "../config/Config.js";
import Alert, { isAlert } from "../model/Alert.js";
import TextUtils from "../utils/TextUtils.js";
import MessageUtils from "../utils/MessageUtils.js";
import ServerException from "../model/ServerException.js";
const NO_TOKEN_ERROR = "No token supplied, request not sent";
const NO_ALERTS_ERROR = "No alerts found, request not sent";
const NO_MESSAGES_ERROR = "No messages found, request not sent";

const getToken = (req: Request) => {
  let token: string = null;
  if (req && req.headers) {
    token = MessageUtils.extractTokenFromHeaders(req);
  }
  if (token == null && Config.DEFAULT_LINE_TOKEN) {
    token = Config.DEFAULT_LINE_TOKEN;
  }
  return token;
};

const handleNotify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ********************
  // Log alert received
  // ********************
  const time: Date = new Date();
  console.log(
    TextUtils.buildBoldLog("Alert received at: " + time.toLocaleString())
  );
  console.log(JSON.stringify(req.body, null, 2));

  // ********************
  // Check for token, error if not found
  // ********************
  const token = getToken(req);

  if (!token) {
    next(new ServerException(HttpStatus.UNAUTHORIZED, NO_TOKEN_ERROR));
    return;
  }

  // ********************
  // Build message for LINE server
  // ********************
  const alerts: Array<Alert> = MessageUtils.extractProperty(req.body, "alerts");
  if (
    !alerts ||
    !Array.isArray(alerts) ||
    alerts.some((alert) => !isAlert(alert))
  ) {
    next(new ServerException(HttpStatus.BAD_REQUEST, NO_ALERTS_ERROR));
    return;
  }

  let messages: Array<string> = MessageUtils.buildMessages(alerts);
  if (messages.length <= 0) {
    next(new ServerException(HttpStatus.BAD_REQUEST, NO_MESSAGES_ERROR));
    return;
  }

  // ********************
  // Post and return results from LINE server
  // ********************
  try {
    const results = await LineNotifyService.postToLineServer(messages, token);
    console.log(TextUtils.buildBoldLog("Successful Post Results:"));
    console.log(JSON.stringify(results, null, 2));
    res.send(results);
  } catch (err) {
    next(new ServerException(HttpStatus.INTERNAL_SERVER_ERROR, err, err.stack));
  }
};

export default {
  handleNotify,
  NO_ALERTS_ERROR,
  NO_TOKEN_ERROR,
  NO_MESSAGES_ERROR,
};
