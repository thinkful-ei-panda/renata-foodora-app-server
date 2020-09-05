# Foodora - An app for dietary restrictions. 
By Renata D.

## Summary:
_Foodora_ was created to make the user's life easier since it searches for healthy dishes within restaurants. It has 17 tags users can use to refine their search. Those tags varies from dietary restrictions and/or food allergies. It also allows to search for dishes using a price range or by typing the name. You can choose between the three ways of search. It filters your criteria, returning just the dishes selected according to your choice. It also shows other tags related to that dish.

As a user, you don't need to have an account in order to use _Foodora_. Only restaurants can register an account, so they can add new dishes. From the restaurant's perspective, a restaurant landing page was created so they can see everything at once! 

## Links:

* Live: [Foodora]()
* Heroku: [API]()
* Server: [Github - Foodora](https://github.com/thinkful-ei-panda/renata-foodora-app-server)
* Gist: [Gist](https://gist.github.com/Seraphyne/6cddaba85a34a6df5a964c7efb6cf3d2)


## Technologies used:

Front-End: _React | CSS | React Router_

Back-End: _Node.JS | Express_

Deployment: _Heroku | Netlify_

DevTools: _Chai | Nodemon | SuperTest | Mocha | Enzyme_


## API Documentation:

| Method | Path               | Purpose                                                        |
| ------ | ------------------ | -------------------------------------------------------------- |
| POST   | /dish              | Adds a new dish according to that Restaurant ID                |
| GET    | /dish/:id          | Get a dish with an specific ID                                 |
| GET    | /dishSearchResults | Get all dishes and display according to search criteria        |
| GET    | /tag               | Get all tags from the database                                 |
| POST   | /register          | Registers a new Restaurant                                     |
| PATCH  | /restaurant        | Updates Restaurant's Name and Phone                            |
| GET    | /restaurant-dish   | Get dishes from Restaurant's specific ID                       |
|        | -list/:id          |                                                                |
| DELETE | /restaurant-dish   | Deletes a dish from a specific Restaurant ID                   |
|        | -list/:id          |                                                                |

## Screenshots:

![Landing Page](/src/Images/main.jpg "Main page")
![Login](/src/Images/login.jpg "Login Page")
![Register](/src/Images/register.jpg "Register Page")
![Search Results](/src/Images/search-results.jpg "Search Results")
![Restaurant Dishes](/src/Images/rest-dishes.jpg "Restaurant Landing page displaying the dishes list")
![Add a Dish](/src/Images/rest-add-dish.jpg "Restaurant Add a Dish")

## Contact:
LinkedIn: [Contact](https://www.linkedin.com/in/renatafd/?locale=en_US)