const express = require('express')
const router = express.Router();
const UserModel = require('../models/user')

let Users = UserModel.User