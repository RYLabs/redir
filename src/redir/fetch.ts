import * as _ from "lodash";
import * as querystring from "querystring";
import * as _fetch from "node-fetch";
import * as log from "debug";

const debug = log("redir:fetch");

function base64Encode(str) {
  return Buffer.from(str).toString("base64");
}

function addAuthentication(request, auth) {
  const { basic } = auth;

  if (basic) {
    const { login, password } = basic;
    if (!("headers" in request)) {
      request.headers = {};
    }
    const authString = base64Encode([login, password].join(":"));
    request.headers["Authorization"] = `Basic ${authString}`;
  }
}

export default async function fetch(options) {
  const { url, method, query, auth } = options,
    request = { url, method };

  if (query) {
    delete options.query;
    const qs = querystring.stringify(query);
    if (url.indexOf("?") >= 0) {
      request.url = `${url}&${qs}`;
    } else {
      request.url = `${url}?${qs}`;
    }
  }

  if (auth) {
    addAuthentication(request, auth);
  }

  debug("running fetch:", request);
  const _url = request.url;
  delete request.url;
  const response = await _fetch(_url, request);
  return response.text();
}
