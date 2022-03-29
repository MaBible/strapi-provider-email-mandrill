'use strict'

const mailchimpClient = require('@mailchimp/mailchimp_transactional')(
  process.env.MANDRILL_API_KEY
)

module.exports = {
  init(providerOptions = {}, settings = {}) {
    return {
      send: async (options) => {
        let { from, to, cc, bcc, replyTo, subject, text, html, ...rest } =
          options

        to = Array.isArray(to) ? to : [{ email: to }]

        let message = {
          from_email: settings.defaultFrom,
          to,
          cc,
          bcc_address: bcc,
          replyTo: replyTo || settings.defaultReplyTo,
          subject,
          text,
          html,
          ...rest,
        }

        const response = await mailchimpClient.messages.send({ message })

        return response
      },
    }
  },
}
