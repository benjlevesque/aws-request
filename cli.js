#!/usr/bin/env node

"use strict";

require("babel-polyfill");

require("babel-register")({
  presets: ["env"]
});

require(".")(process.argv.slice(2));
