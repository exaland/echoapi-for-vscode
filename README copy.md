# EchoAPI for VS Code

![EchoAPI for VS Code](https://assets.echoapi.com/upload/user/216741487273459712/log/92c325a5-4c8d-4c49-ae33-35bf94b85b26.png "image.png")

EchoAPI for VS Code is a lightweight REST API client extension for Visual Studio Code, designed with a focus on simplicity, clean design, and local storage, and it's **free** to use.

## Why EchoAPI?

EchoAPI has a few standout features:
1. **No login required**: Just install and start using it.
2. **Supports Scratch Pad**: Makes jotting down quick notes and ideas super easy.
3. **Ultra-lightweight**: It’s incredibly fast and doesn’t bloat your system.
4. **100% compatible with Postman script syntax**: You can switch over without having to relearn anything.

## Installing EchoAPI for VS Code
![Installing EchoAPI for VS Code](https://assets.echoapi.com/upload/user/216741487273459712/log/70dfc182-4dc1-4842-abe0-629ef5e944b8.png "Install.png")

Getting started with EchoAPI is a breeze. Just navigate to the VS Code Extensions Marketplace, search for EchoAPI, and hit install. No additional tools or sign-ins are necessary—everything operates straight from your VS Code sidebar.

## API Design (Designing a New Request)

![Designing a New Request](https://assets.echoapi.com/upload/user/216741487273459712/log/0471b5e5-0ec4-48df-b662-667bbc613abf.png "image.png")
In the Design area, simply click on “HTTP/1.2 Request” to quickly generate the API design documentation. It supports real-time editing and instant document updates, ensuring a smooth and efficient design process.

## API Debug (Creating a New Request)

![Creating New Requests](https://assets.echoapi.com/upload/user/216741487273459712/log/b92af081-f89b-44f3-9511-d68712871f95.png "image.png")

To create a new request, start by opening the EchoAPI tab where you’ll see options for recent activities, collections, and environments. It’s pretty intuitive if you’ve used Postman before. Right-click on the collection list to create a New Collection, name it, and then right-click on the collection name to add a new request.

## API Tests (Running a collection)

Just pick the folder you want to run, right-click, and hit "Run All." That’s it!

![Running a collection](https://assets.echoapi.com/upload/user/216741487273459712/log/95c062d8-3336-4a0e-860c-47baebffd145.png "image.png")

## Variables and Environments

![EchoAPI is 100% compatible with Postman script syntax](https://assets.echoapi.com/upload/user/216741487273459712/log/24df826c-9198-40e9-a3a5-0b995913d17d.png "image.png")

Just like in Postman, you can use variables and manage environments in EchoAPI. **EchoAPI is 100% compatible with Postman script syntax.** To activate a specific environment for your tests, just set it as active (indicated by a star next to the environment name). Importing and exporting environments is compatible with Postman 2.1.0 format and .env files.

## System Variables

![System Variables](https://assets.echoapi.com/upload/user/216741487273459712/log/ae0aedfa-9e79-48af-bec9-1b3a7b68da7d.png "image.png")

EchoAPI also has a set of system variables that streamline generating unique data. Prepend $ before the variable name to use them:
- `{{$guid}}` - random UUID number
- `{{$email}}` - random email string

## Script-less Testing

![Testing in EchoAPI is straightforward and script-less](https://assets.echoapi.com/upload/user/216741487273459712/log/d7314e74-9f4f-48f2-97e5-38017bfd63fa.png "image.png")

Testing in EchoAPI is straightforward and script-less. Choose a parameter from the dropdown menu, set your condition and value, and you’re done! There are plenty of parameters and conditions to choose from, like ResponseCode, ResponseBody, or Content-Type. You can even set values from API responses to environment variables or verify specific JSON path values.

## Authentication

![EchoAPI supports various authorization types](https://assets.echoapi.com/upload/user/216741487273459712/log/9c9edfea-bde9-40ba-98f2-843bef9d5150.png "image.png")

EchoAPI supports various authorization types, including None, Inherit, Basic Auth, Bearer, and OAuth 1.0. This is super useful for testing secured APIs that require credentials or tokens.

## Useful Links

EchoAPI is continually growing, and I’ll definitely keep an eye on its progress. Here are some useful links:
- [Website](https://www.echoapi.com/)
- [Documentation](https://www.echoapi.com/wiki/docs/vscode/start)
- [Twitter](https://x.com/EchoApiTeam)
- [Youtube](https://www.youtube.com/@EchoAPI-Team)

Give EchoAPI a try and see how it compares to Postman for your API testing needs!