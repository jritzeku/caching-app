const { createLogger, transports, format } = require('winston')

const appLogger = createLogger({
  transports: [
    new transports.File({
      filename: 'errors.log',
      dirname: './logs',
      level: 'error',
      colorize: true,
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
})

module.exports = { appLogger }
