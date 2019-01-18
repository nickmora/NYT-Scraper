const express = require ("express");
const logger = require("morgan");
const mongoose =require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");
const PORT = 3000;

