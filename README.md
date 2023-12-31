
# POS Backend

Express.js-based web application for managing products, product categories, and unit of measures. Provides CRUD operations for each of them.
It also contains an authentication for users and requesting for auth before allowing them to do any of the CRUD operations.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Socials](#socials)

# Prerequisites

Before running this project, make sure you have the following installed:

- Node.js
- npm


## Technologies

<p align="center">
<img alt="NodeJS" src="https://github.com/Aamer-Qanadilo/POS-Backend/assets/104656644/99a1401d-8cdf-42fc-992a-db4e4899e3f3" height="60" width="60" />
<img src="https://github.com/Aamer-Qanadilo/POS-Backend/assets/104656644/eb8ab953-5dac-4c87-b6b6-07bb5110fd01" alt="express js" height="60" width="90" />
<img src="https://github.com/Aamer-Qanadilo/POS-Backend/assets/104656644/ca075311-dd26-4db7-8b33-bb3b3de6af6c" alt="mongoDB" height="60" width="60" />   
<img src="https://github.com/Aamer-Qanadilo/POS-Backend/assets/104656644/b6231545-d2bd-4db0-978d-62d2f0b9a09c" alt="nodemailer" height="60"  width="60" />
<img src="https://github.com/Aamer-Qanadilo/POS-Backend/assets/104656644/ec6191b1-9bc3-4032-a81c-cc2680f43c6f" alt="dotenv" height="60" width="60" />   

</p>

- [NodeJS](https://nodejs.org/en): an open-source, cross-platform JavaScript runtime environment.
- [ExpressJS](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js
- [MongoDB](https://www.mongodb.com/): Multi-cloud developer data platform. An integrated suite of cloud database services that allow you to address a wide variety of use cases.
- [Nodemailer](https://nodemailer.com/about/): is a module for Node.js applications to allow easy as cake email sending.
- [dotenv](https://www.dotenv.org/docs/): Sync your .env files with a single command, deploy them with an encrypted .env.vault file, and say goodbye to scattered secrets across multiple platforms and tools.
  

# Installation

### Step 1: Clone the repository

Clone the repository to your local machine
<pre><code>git clone https://github.com/Aamer-Qanadilo/POS-Backend.git </code></pre>


### Step 2: Install Dependencies

Navigate to the project directory and run 
    <pre><code>npm install</code></pre>


### Step 3: Start the App

Start the application by running
    <pre><code>nodemon index.js</code></pre>
The app will be running at http://localhost:3000.

# Usage

Access the application by visiting http://localhost:3000/api/v1 and then the endpoint that you want.
You can use the provided API endpoints to manage products, product categories, and unit of measures.

### API Specifications

You can visit this documentation over here to have a better understanding.
https://documenter.getpostman.com/view/23159659/2s946bDFV1

NOTE: Keep in mind that requesting any data from the backend requires the user to be logged in and the token to be correctly passed.

NOTE 2: All the endpoints returns a message with the word "success" inside if everything succeeded with no errors.

## Products

> #### Retrieve all products
>
> - Endpoint: `/product`
> - Method: GET
> - Description: Retrieves all products.
> - Response: Returns an array of products, a message that says "success" if data was retrived flawlessly and the productsImageBaseUrl which gives us the base url that we need to access the products images.

> #### Retrieve a specific product
>
> - Endpoint: `/product/:productId`
> - Method: GET
> - Description: Retrieves a specific product based on the provided productId.
> - Parameters:
>   - `productId` (number) - The ID of the product.
> - Response: Returns the product object if found, or an error message if not found.

> #### Create a new product
>
> - Endpoint: `/product`
> - Method: POST
> - Description: Creates a new product.
> - Request Body:
>   - `name` (string) - The name of the product.
>   - `code` (string) - The code of the product.
>   - `image` (string) - The image URL of the product.
>   - `price` (number) - The price of the product.
>   - `category` (string) - The ID of the product category.
>   - `unitOfMeasure` (string) - The ID of the unit of measure.
> - Response: Returns the created product object if successful, or an error message if unsuccessful.

> #### Update a specific product
>
> - Endpoint: `/product/:productId`
> - Method: PATCH
> - Description: Updates a specific product based on the provided productId.
> - Parameters:
>   - `productId` (number) - The ID of the product.
> - Request Body:
>   - `name` (string) - The name of the product.
>   - `code` (string) - The code of the product.
>   - `image` (optional, string) - The image URL of the product.
>   - `price` (number) - The price of the product.
>   - `category` (string) - The ID of the product category.
>   - `unitOfMeasure` (string) - The ID of the unit of measure.
> - Response: Returns the updated product object if successful, or an error message if unsuccessful.

> #### Delete a specific product
>
> - Endpoint: `/product/:productId`
> - Method: DELETE
> - Description: Deletes a specific product based on the provided productId.
> - Parameters:
>   - `productId` (number) - The ID of the product.
> - Response: Returns a success message if the product is deleted successfully, or an error message if not found.

## Categories

> #### Retrieve all categories
>
> - Endpoint: `/category`
> - Method: GET
> - Description: Retrieves all categories.
> - Response: Returns an array of categories, a message that says "success" if data was retrived flawlessly and the productsImageBaseUrl which gives us the base url that we need to access the products images.

> #### Retrieve a specific category
>
> - Endpoint: `/category/:categoryId`
> - Method: GET
> - Description: Retrieves a specific category based on the provided categoryId.
> - Parameters:
>   - `categoryId` (number) - The ID of the category.
> - Response: Returns the category object if found, or an error message if not found.

> #### Create a new category
>
> - Endpoint: `/category`
> - Method: POST
> - Description: Creates a new category.
> - Request Body:
>   - `name` (string) - The name of the category.
>   - `image` (string) - The image URL of the category.
> - Response: Returns the created category object if successful, or an error message if unsuccessful.

> #### Update a specific category
>
> - Endpoint: `/category/:categoryId`
> - Method: PATCH
> - Description: Updates a specific category based on the provided categoryId.
> - Parameters:
>   - `categoryId` (number) - The ID of the category.
> - Request Body:
>   - `name` (string) - The updated name of the category.
>   - `image` (optional, string) - The image URL of the category.
> - Response: Returns the updated category object if successful, or an error message if unsuccessful.

> #### Delete a specific category
>
> - Endpoint: `/category/:categoryId`
> - Method: DELETE
> - Description: Deletes a specific category based on the provided categoryId.
> - Parameters:
>   - `categoryId` (number) - The ID of the category.
> - Response: Returns a success message if the category is deleted successfully, or an error message if not found.

## Unit of Measures

> #### Retrieve all unit of measures
>
> - Endpoint: `/units`
> - Method: GET
> - Description: Retrieves all unit of measures.
> - Response: Returns an array of unit of measure objects, a message that says "success" if data was retrived flawlessly and the productsImageBaseUrl which gives us the base url that we need to access the products images.

> #### Retrieve a specific unit of measure
>
> - Endpoint: `/units/:unitId`
> - Method: GET
> - Description: Retrieves a specific unit of measure based on the provided unitId.
> - Parameters:
>   - `unitId` (number) - The ID of the unit of measure.
> - Response: Returns the unit of measure object if found, or an error message if not found "unit not found".

> #### Create a new unit of measure
>
> - Endpoint: `/units`
> - Method: POST
> - Description: Creates a new unit of measure.
> - Request Body:
>   - `name` (string) - The name of the unit of measure.
>   - `baseUnit` (string) - The base unit of measure.
>   - `conversionFactor` (number) - The conversion factor of the unit of measure.
> - Response: Returns the created unit of measure object if successful, or an error message if unsuccessful.

> #### Update a specific unit of measure
>
> - Endpoint: `/units`
> - Method: PATCH
> - Description: Updates a specific unit of measure based on the provided unitId.
> - Parameters:
> - Request Body:
>   - `id` (number) - The ID of the unit of measure.
>   - `conversionFactor` (number) - The updated conversion factor of the unit of measure.
> - Response: Returns the updated unit of measure object if successful, or an error message if unsuccessful.

> #### Delete a specific unit of measure
>
> - Endpoint: `/units/:unitId`
> - Method: DELETE
> - Description: Deletes a specific unit of measure based on the provided unitId.
> - Parameters:
>   - `unitId` (number) - The ID of the unit of measure.
> - Response: Returns a success message if the unit of measure is deleted successfully, or an error message if not found.

<br><br>
Thank you for using my React project! I hope it was useful and easy to use! <br />
If you have any questions or issues, please contact me. <br />

<p align="center">
    <img src="https://github.com/Aamer-Qanadilo/POS-Frontend/assets/104656644/d8d9aa92-e560-4090-887a-855afeee344b" alt="lodash" height="40" width="40" />   
    <img src="https://github.com/Aamer-Qanadilo/POS-Frontend/assets/104656644/c204ca3b-8196-48c2-8763-b8d0737870ca" alt="lodash" height="40" width="40" />   
    <img src="https://github.com/Aamer-Qanadilo/POS-Frontend/assets/104656644/95ecdf67-cd73-4fb5-8f51-ec3853a0c515" alt="lodash" height="40" width="40" />     
    <img src="https://github.com/Aamer-Qanadilo/POS-Frontend/assets/104656644/ee5806fb-1546-4068-aeba-c1d3cc8f4e12" alt="lodash" height="40" width="40" />   
</p>

# Socials

- [UpWork - Aamer Qanadilo](https://www.upwork.com/freelancers/~01bcc6b1c8eef0f266)
- [Instagram - aamer_qanadilo](https://www.instagram.com/aamer_qanadilo/)
- [LinkedIn - aamer-qanadilo](https://www.linkedin.com/in/amer-qanadilo/)
- [Youtube - Aamer Qanadilo](https://www.youtube.com/@amerqanadilo5648)


 <h2>Notes</h2>
 <p> This project is a part of the <a href="https://www.foothillsolutions.com/">Foothill Solutions<a/>  internship program.<p>
