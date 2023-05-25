## Description

This project is an example of how to create a JWT-based authentication system with NestJS.

## Installation

```bash
$ yarn install
```

### Setting up your .env fie

You need to create a `.env` file in the root of your project and add the following variables:

```
DATABASE_URL="{DATABASE_URL}"
JWT_SECRET="{STRONG_RANDOM_STRING}"
STARTON_SECRET="{STARTON_SECRET_TO_VERIFY_STARTONS_SIGNATURES}"
STARTON_API_KEY="{STARTON_API_KEY}"
EMAIL_USER="{SMTP_SERVER_EMAIL_ADDRESS}"
EMAIL_PASS="{SMTP_SERVER_EMAIL_PASSWORD}"
EMAIL_HOST="smtp.elasticemail.com" # or any other SMTP server/relay you want to use
EMAIL_PORT="2525" # choose the port that your SMTP server/relay uses
```

`DATABASE_URL` specifies the connection URL to connect to the database, and `JWT_SECRET` is the secret used to sign the JWTs. You can generate a strong secret by running the following command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```

You can find your `STARTON_SECRET` on your Starton dashboard under _Your project_ > _Developer_ > _Webhook_.

You can find your `STARTON_API_KEY` on your Starton dashboard under _Your Project_ > _Developer_ > _API keys_.

To configure EMAIL\_.\* variables, you can create an account on [Elastic Email](https://elasticemail.com/) and use these credentials.

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Usage

1. Start the server: `npm start` or `yarn start`
2. Use a REST client like Postman or Insomnia to send requests to the server. You can find the documentation at http://localhost:3000/docs

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

At Starton, our goal is to provide you with excellent support. If you have any concerns or questions regarding this project or any other project, please reach out to us for assistance. Our team of experts is available to help you with any questions or issues you may encounter. We're committed to providing timely and effective support to ensure your success with our products and services.

To contact us, send an email to [support@starton.com](mailto:hello@starton.com) to submit a support request. We'll respond to your inquiry as soon as possible.

Thank you for choosing Starton as your trusted partner for your software development needs.

## Stay in touch

- Author - [Alexandre Schaffner](https://github.com/delicious-mango)
- Website - [Starton](https://starton.com/)
- Twitter - [@starton_com](https://twitter.com/starton_com)
