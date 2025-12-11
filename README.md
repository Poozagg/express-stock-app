# Supermarket Stock Management System

## Project Overview
This project is a stock management system for a supermarket, built with Node.js, Express, and Sequelize ORM.

## Setup Instructions
1. Clone the repository:
   Use the git clone command followed by the repository URL. Then change into the project directory.

2. Install dependencies:
   Run 'npm install' in your terminal to install all necessary dependencies.

3. Set up the database:
   - Ensure SQLite is installed on your system
   - To create a prebuilt database with sample data, run: 'npm run database:prebuild'
   - To clear the database, run: 'npm run database:clear'
   - Alternatively, the database will be automatically created with no data when you start the application for the first time

4. Start the development server:
   Run 'npm run dev' in your terminal to start the server.

5. Open your web browser and navigate to 'http://localhost:3000' to access the application

## Database Management
The project includes scripts to manage the database:

1. To create a prebuilt database with sample data:
   Run 'npm run database:prebuild' in your terminal. This will create a SQLite database file with sample products, including both clothing and electronics items.

2. To clear the database (delete the database file):
   Run 'npm run database:clear' in your terminal. This will remove the existing database file, allowing you to start fresh.

The sample data includes:
- Two clothing items (T-Shirt and Jeans)
- Two electronics items (Smartphone and Laptop)

Each item has associated details in their respective category tables (Clothing or Electronics).

## Running Tests
To run the test suite:
Run 'npm test' in your terminal.

## Database Schema

### Product (Base model)
- id: String (Primary Key)
- name: String
- price: Float
- quantity: Integer
- type: String

### Clothing
- ProductId: String (Foreign Key)
- size: String
- material: String
- color: String
- brand: String
- gender: String

### Electronics
- ProductId: String (Foreign Key)
- brand: String
- warranty: String
- model: String
- powerConsumption: Float
- dimensions: String

### Books (New)
- ProductId: String (Foreign Key)
- author: String
- isbn: String
- genre: String
- publicationDate: Date

### Groceries (New)
- ProductId: String (Foreign Key)
- expirationDate: Date
- nutritionalInfo: String
- organic: Boolean

### Toys (New)
- ProductId: String (Foreign Key)
- ageGroup: String
- material: String
- batteryOperated: Boolean

## Assignment Objectives
1. Extend and enhance the existing web application
2. Apply database and frontend development principles
3. Follow good programming standards
4. Develop and execute robust testing strategies
5. Use GitHub effectively for documentation and tracking progress of work
6. Prepare for a viva to explain project design and code implementation

## TODO
### Extend Functionalities
1. Update the existing Clothing and Electronics models with the additional fields defined in schema above
2. Implement the new models (Books, Groceries, Toys) in their respective files
3. Update the controllers and views to handle the new product types
4. Enhance the frontend to display and manage the new product types
5. Implement advanced sorting and filtering options
6. Implement CRUD operations for all product types
7. Extend currency conversion functionality to support additional currencies such as EUR, JPY, CAD, and AUD
   - Refer to [https://www.exchangerate-api.com/docs/free]
8. Develop a summary page showing the current stock status.

### Good Programming Standards
1. Refactor code for readability and modularity
2. Enhance frontend visuals and interactivity

### Testing
1. Write unit and integration tests for new functionalities
2. Write Edge Case tests and demonstrate wide testing coverage

### Github Practices
1. Use Git and GitHub for version control with a well-documented README
2. Write a well documented README (Replace this README)

## Additional Features (Optional)
1. Ensure responsive design for various screen sizes
2. Implement accessibility features following WCAG guidelines
3. Add user authentication and authorization
4. Consider implementing a caching mechanism for frequently accessed data

## Git Workflow
1. Make small, frequent commits with clear messages
(Optional) 2. Create a new branch for each feature or bug fix.
(Optional) 3. Use GitHub Issues to track tasks and bugs

## Viva Preparation
Be prepared to discuss:
1. The overall architecture of the application
2. Design decisions and their rationales
3. Challenges faced during development and how they were overcome
4. Future improvements and scalability considerations
5. Security measures implemented in the application

Remember to document your progress, challenges, and solutions throughout the development process. This will be valuable for your viva and for maintaining the project in the future.

