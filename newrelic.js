"use strict";

exports.config = {
  app_name: ["Tritan Bot"],
  license_key: "36215b4daf2bac6e414dd717762611588af3NRAL",
  distributed_tracing: {
    enabled: true
  },
  logging: {
    level: "trace"
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      "request.headers.cookie",
      "request.headers.authorization",
      "request.headers.proxyAuthorization",
      "request.headers.setCookie*",
      "request.headers.x*",
      "response.headers.cookie",
      "response.headers.authorization",
      "response.headers.proxyAuthorization",
      "response.headers.setCookie*",
      "response.headers.x*"
    ]
  }
};
