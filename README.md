# strapi-provider-email-mandrill

## Installation

```bash
# using yarn
yarn add https://github.com/MaBible/strapi-provider-email-mandrill

# using npm
npm install https://github.com/MaBible/strapi-provider-email-mandrill --save
```

## Dependencies

We are using `@mailchimp/mailchimp_transactional` package. 

So for all send message we'll use this post: https://mailchimp.com/developer/transactional/api/messages/

## Add Plugin

Add on config/plugin.ts file the configuration bellow

```
  email: {
    config: {
      provider: "strapi-provider-plugin-mandrill",
      providerOptions: {
        apiKey: process.env.MANDRILL_API_KEY,
      },
     settings: {
        defaultFrom: "contact@email.com",
        defaultName: 'Test',
        defaultReplyTo: 'test@email.com',
        defaultHtml: 'Test',
        defaultText: 'Test',
      },
    },
  }
```


## Call Strapi email Plugin

If we want to send an e-mail with a mailchimp template accordingly with the <a href="https://mailchimp.com/developer/transactional/api/messages/send-using-message-template/">Documentation</a>, use the configuration bellow

```
  await strapi.plugins["email"].services.email.send({
      to: email,
      name: name || "Test name",
      subject: "Your subject",
      merge_language: "handlebars",
      global_merge_vars: [
        {
          name: "user_name",
          content: "Default test name",
        },
      ],
      merge_vars: [
        {
          rcpt: email,
          vars: [
            {
              name: "user_name",
              content: name || "Test name",
            },
          ],
        },
      ],
      metadata :{
        template_name: "template-slug",
        template_content: []
      }
      
    })
```