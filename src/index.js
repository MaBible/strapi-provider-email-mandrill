/* eslint-disable no-unused-vars */
module.exports = {
  provider: "mandrill",
  name: "Mandrill",
  init: (providerOptions = { apiKey: "" }, settings) => {
    const mandrill = require("@mailchimp/mailchimp_transactional")(
      providerOptions.apiKey
    );

    return {
      send: async (options) => {
        try {
          options = typeof options === "object" ? options : {};
          options.from_name = options.from_name || settings.defaultName;
          options.from_email = options.from_email || settings.defaultFrom;
          options.replyTo = options.replyTo || settings.defaultReplyTo;
          options.text = options.text || settings.defaultText || "";
          options.html = options.html || settings.defaultHtml || "";

          let metadata = {};
          if (options.metadata && typeof options.metadata === "object") {
            metadata = options.metadata;
            delete options.metadata;
          }

          const msg = {
            ...options,
            subject: options.subject,
            from_email: options.from_email,
            from_name: options.from_name,
            to: [
              {
                email: options.to,
                name: options.name,
                type: "to",
              },
            ],
            reply_to: options.replyTo,
            text: options.text,
            html: options.html,
          };

          const sentObject = {
            message: msg,
            send_at: new Date(),
          };

          let sentEmail = null;
          if (Object.keys(metadata).length > 0 && metadata.template_name) {
            sentEmail = await mandrill.messages.sendTemplate({
              ...metadata,
              ...sentObject,
            });
          } else {
            sentEmail = await mandrill.messages.send(sentObject);
          }

          if (sentEmail[0]?.status === "rejected") {
            throw new Error(
              JSON.stringify({
                messages: [{ id: "Auth.form.error.email.invalid" }],
              })
            );
          }
        } catch (e) {
          console.error(e);
          throw new Error(
            JSON.stringify({
              messages: [{ id: "Auth.form.error.email.invalid" }],
            })
          );
        }
      },
    };
  },
};
