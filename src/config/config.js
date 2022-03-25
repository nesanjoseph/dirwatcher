const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
process.NODE_ENV = 'local';
dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('local', 'production', 'development', 'test').required(),
    PORT: Joi.number().default(3001).optional(),
    MONGODB_URL: Joi.string().required().description('Mongo DB url').optional()
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

console.log({"config_env" : JSON.stringify(process.env)});
console.log({"config_envVars" : JSON.stringify(envVars)});
module.exports = {
  env: 'development',
  port: 3001,
  mongoose: {
    url: process.env.mongo_connection_string,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  }
};
