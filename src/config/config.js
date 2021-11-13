const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
process.NODE_ENV = 'local';
dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('local', 'production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url')
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: 'local',
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  }
};
