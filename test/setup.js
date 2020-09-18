require('dotenv').config();
const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;

process.env.NODE_ENV || 'test',
process.env.JWT_SECRET || 'foodora-super-secret',
process.env.JWT_EXPIRY || '2h',
process.env.API_TOKEN,

process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 
    'postgresql://dunder_mifflin:2@localhost/foodora-test';

