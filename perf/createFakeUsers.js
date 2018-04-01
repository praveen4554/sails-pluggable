'use strict';

module.exports = {
  generateRandomData
};

// Make sure to "npm install faker" first.
const Faker = require('faker');

function generateRandomData(userContext, events, done) {
  // generate data with Faker:
  const name = `${Faker.name.firstName()} ${Faker.name.lastName()}`;
  const email = Faker.internet.exampleEmail();
  const password = Faker.internet.password();
  // add variables to virtual user's context:
  userContext.vars.name = name;
  userContext.vars.email = email;
  userContext.vars.password = password;
  // continue with executing the scenario:
  return done();
}