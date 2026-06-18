### Basic auth
Each request carries an Authorization field in the headers with a value of Basic + space + base64 ("username:password").
> you need to save the user's account information locally, such as saving it in localStorage.
### OAuth
Each request carries an Authorization field in the headers with a value of token + space + accessToken.
> you need to save the user's access_token locally, for example, by saving it to localStorage.
You need to register a client app with the server to get client_id and client_secret.
Using the client_id access / authorize interface (you may need to declare scope), the page is redirected and you get access code.
Access the / login/oauth interface using access code, client_id and client_secret to get access_token.