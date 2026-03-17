# Supermarket Stock Management System

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Database Schema](#database-schema)
- [Features](#features)
- [Routes and API Reference](#routes-and-api-reference)
- [Frontend Design](#frontend-design)
- [Testing Strategy](#testing-strategy)
- [Design Decisions](#design-decisions)
- [Challenges and Solutions](#challenges-and-solutions)
- [Future Improvements](#future-improvements)

---

## Project Overview

The Supermarket Stock Management System is a full-stack web application for managing supermarket inventory. It supports five product categories: Clothing, Electronics, Books, Groceries, and Toys — each with category-specific attributes. The application provides complete CRUD (Create, Read, Update, Delete) operations, advanced sorting and filtering, live currency conversion, and a summary dashboard with visual analytics.

The project is built following the MVC (Model-View-Controller) architectural pattern, ensuring a clean separation of concerns between data models, business logic, and presentation.

---

## Technology Stack

| Layer        | Technology                                   |
| ------------ | -------------------------------------------- |
| Runtime      | Node.js                                      |
| Framework    | Express.js 4.18                              |
| ORM          | Sequelize 6.32                               |
| Database     | SQLite (file-based, `database.sqlite`)       |
| View Engine  | Pug 3.0 (template engine)                    |
| Frontend     | Bootstrap 5, Chart.js                        |
| HTTP Client  | Axios (for external currency API calls)      |
| Testing      | Jest 29, Supertest 6                         |
| Dev Tools    | Nodemon (auto-restart on file changes)       |

---

## Project Structure

```
├── app.js                          # Application entry point
├── package.json                    # Dependencies and scripts
├── config/
│   └── database.js                 # Sequelize/SQLite configuration
├── models/
│   ├── index.js                    # Model initialisation and associations
│   ├── product.js                  # Base Product model
│   ├── clothing.js                 # Clothing type model
│   ├── electronic.js               # Electronics type model
│   ├── book.js                     # Book type model
│   ├── grocery.js                  # Grocery type model
│   └── toy.js                      # Toy type model
├── controllers/
│   └── stockController.js          # All route handler logic
├── routes/
│   └── productRoutes.js            # Route definitions
├── views/
│   ├── pageLayout.pug              # Base layout template
│   ├── index.pug                   # Product listing page
│   ├── createPage.pug              # Create product form
│   ├── updateProductDetails.pug    # Update product form
│   ├── details.pug                 # Product detail view
│   └── summary.pug                 # Stock summary dashboard
├── public/
│   ├── styles.css                  # Master stylesheet (imports modules)
│   └── css/
│       ├── main.css                # CSS variables and layout
│       ├── navbar.css              # Navigation bar styles
│       ├── footer.css              # Footer styles
│       ├── table.css               # Table styles
│       ├── forms.css               # Form element styles
│       ├── buttons.css             # Button styles
│       ├── searchBar.css           # Search bar styles
│       ├── cards.css               # Currency card styles
│       └── summary.css             # Summary dashboard styles
├── scripts/
│   ├── databasePrebuild.js         # Seeds database with sample data
│   └── databaseClear.js            # Deletes the database file
├── tests/
│   ├── jestSetup.js                # Global test setup/teardown
│   ├── unit/                       # Unit tests
│   │   ├── createProduct.test.js
│   │   ├── updateProduct.test.js
│   │   ├── deleteProduct.test.js
│   │   ├── sort.test.js
│   │   ├── filter.test.js
│   │   └── convertCurrency.test.js
│   └── integration/                # Integration tests
│       ├── createProduct.test.js
│       ├── updateProduct.test.js
│       ├── deleteProduct.test.js
│       ├── sort.test.js
│       ├── filter.test.js
│       └── convertCurrency.test.js
└── README.md                       # Original assignment brief
```

---

## Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd apa1-26-01-cbd-a2-express-Pooja-G-ada-main
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Seed the database with sample data (optional):**

   ```bash
   npm run database:prebuild
   ```

   This creates a `database.sqlite` file with 13 pre-loaded sample products across all five categories.

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The server starts at **http://localhost:3000**.

### Available Scripts

| Command                     | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `npm run dev`               | Start the server with Nodemon (auto-reload)        |
| `npm start`                 | Start the server without auto-reload               |
| `npm test`                  | Run the full test suite (Jest)                     |
| `npm run database:prebuild` | Seed the database with 13 sample products          |
| `npm run database:clear`    | Delete the database file to start fresh            |

---

## Database Schema

The database follows a **polymorphic association pattern** where a base `Product` table stores common fields, and each product type has its own table linked by a foreign key.

### Product (Base Table)

| Field        | Type    | Constraints           | Description            |
| ------------ | ------- | --------------------- | ---------------------- |
| id           | STRING  | Primary Key           | Unique product ID      |
| name         | STRING  | Not Null              | Product name           |
| pricePerItem | FLOAT   | Not Null              | Price in GBP           |
| quantity     | INTEGER | Not Null              | Stock quantity         |
| type         | STRING  | Not Null              | Product category       |

### Clothing

| Field    | Type   | Description              |
| -------- | ------ | ------------------------ |
| size     | STRING | Size (S, M, L, XL, etc) |
| material | STRING | Fabric material          |
| color    | STRING | Colour of the item       |
| brand    | STRING | Brand name               |
| gender   | STRING | Target gender            |

### Electronic

| Field            | Type   | Description                    |
| ---------------- | ------ | ------------------------------ |
| brand            | STRING | Manufacturer brand             |
| warranty         | STRING | Warranty period                |
| model            | STRING | Model name/number              |
| powerConsumption | FLOAT  | Power consumption in watts     |
| dimensions       | STRING | Physical dimensions            |

### Book

| Field           | Type   | Description              |
| --------------- | ------ | ------------------------ |
| author          | STRING | Author name              |
| isbn            | STRING | ISBN number              |
| genre           | STRING | Book genre               |
| publicationDate | DATE   | Date of publication      |

### Grocery

| Field           | Type    | Description                  |
| --------------- | ------- | ---------------------------- |
| expirationDate  | DATE    | Product expiry date          |
| nutritionalInfo | STRING  | Nutritional information      |
| organic         | BOOLEAN | Whether the product is organic |

### Toy

| Field           | Type    | Constraints | Description                      |
| --------------- | ------- | ----------- | -------------------------------- |
| ageGroup        | STRING  | Not Null    | Recommended age group            |
| material        | STRING  |             | Material of the toy              |
| batteryOperated | BOOLEAN | Not Null    | Whether batteries are required   |

### Entity Relationship

```
Product (1) ──── (0..1) Clothing
Product (1) ──── (0..1) Electronic
Product (1) ──── (0..1) Book
Product (1) ──── (0..1) Grocery
Product (1) ──── (0..1) Toy
```

Each Product has at most one associated type-specific record. The relationship is established via Sequelize's `hasOne` / `belongsTo` associations, with `ProductId` as the foreign key in each type table.

---

## Features

### 1. Product Management (Full CRUD)

- **Create**: Add new products of any type via a dynamic form that shows/hides type-specific fields based on the selected category.
- **Read**: View all products in a tabular listing, or view detailed information for individual products including their category-specific attributes.
- **Update**: Edit any product's base details and type-specific fields through a pre-populated form.
- **Delete**: Remove products and their associated type records from the database.

### 2. Search

Products can be searched by name using a partial match (`LIKE` query). The search bar is accessible from the navigation bar on every page.

### 3. Sorting

Products can be sorted by:
- **Name** (A-Z / Z-A)
- **Price** (Low to High / High to Low)
- **Quantity** (Low to High / High to Low)
- **Type** (A-Z / Z-A)

Sort controls appear directly on the product listing page.

### 4. Filtering

A filter modal on the product listing page allows filtering by:
- **Product type** (Clothing, Electronics, Books, Groceries, Toys)
- **Price range** (minimum and maximum price)
- **Low stock** (products with quantity below 10)

Filters can be combined with sorting and are cleared with a single button.

### 5. Currency Conversion

The product detail page includes a currency conversion card. Users can convert the displayed GBP price to:
- **USD** (US Dollar)
- **EUR** (Euro)
- **AUD** (Australian Dollar)
- **CAD** (Canadian Dollar)
- **JPY** (Japanese Yen)

Conversion rates are fetched in real-time from the [ExchangeRate API](https://www.exchangerate-api.com/) (free tier).

### 6. Summary Dashboard

The `/summary` page provides a visual overview of current stock:

- **Metric Cards**: Total Products, Low Stock Items (quantity 1–9), Out of Stock Items (quantity 0)
- **Bar Chart**: A Chart.js bar chart showing a breakdown by product type with dual Y-axes — total stock value (GBP, left axis) and total quantity (right axis)
- **Low Stock Alerts Table**: Lists products with critically low stock (quantity 1–9)
- **Out of Stock Table**: Lists products with zero quantity

The Low Stock and Out of Stock metric cards are clickable and smooth-scroll to their respective detail tables.

### 7. Database Seeding

The prebuild script (`npm run database:prebuild`) seeds the database with 13 sample products:
- 4 Clothing items (e.g., T-Shirt, Jeans)
- 4 Electronics items (e.g., Smartphone, Laptop)
- 2 Book items (e.g., The Great Gatsby)
- 2 Grocery items (e.g., Organic Bananas)
- 1 Toy item (e.g., Building Blocks)

---

## Routes and API Reference

All routes are mounted at the root (`/`) in `app.js`.

| Method | Path                    | Handler              | Description                              |
| ------ | ----------------------- | -------------------- | ---------------------------------------- |
| GET    | `/`                     | `index`              | List all products                        |
| GET    | `/createPage`           | `createPage`         | Render the create product form           |
| POST   | `/create`               | `create`             | Create a new product                     |
| GET    | `/search`               | `search`             | Search products by name                  |
| GET    | `/sort`                 | `sort`               | Sort products by field and direction     |
| GET    | `/filter`               | `filter`             | Filter products by type, price, stock    |
| GET    | `/details/:id`          | `getDetails`         | View detailed product information        |
| GET    | `/details/:id/convert`  | `convertCurrency`    | Convert product price to another currency|
| POST   | `/delete/:id`           | `delete`             | Delete a product                         |
| GET    | `/update/:id`           | `updatePage`         | Render the update product form           |
| POST   | `/update/:id`           | `update`             | Update an existing product               |
| GET    | `/summary`              | `summary`            | View the stock summary dashboard         |

---

## Frontend Design

### Layout and Navigation

The application uses a **Pug template inheritance** system with `pageLayout.pug` as the base layout. Every page inherits the shared navigation bar, footer, and stylesheets. The navigation provides links to:
- **Home** — Product listing
- **Add Product** — Create form
- **Summary** — Dashboard
- **Search bar** — Available on all pages

### Styling Architecture

CSS is organised in a modular structure. A master `styles.css` file imports nine component-specific stylesheets:

- `main.css` — CSS custom properties (colour variables), base layout
- `navbar.css` — Responsive navigation bar
- `footer.css` — Page footer
- `table.css` — Product tables
- `forms.css` — Form inputs and labels
- `buttons.css` — Button variants
- `searchBar.css` — Search input styling
- `cards.css` — Currency conversion card on details page
- `summary.css` — Dashboard metric cards, chart container, alert tables

The application also leverages **Bootstrap 5** (via CDN) for the grid system, modals (filter modal), and base component styles.

### Interactive Elements

- **Dynamic create form**: JavaScript toggles type-specific field sections when the product category is changed
- **Filter modal**: Bootstrap modal with form inputs for type, price range, and low stock filtering
- **Currency conversion**: Dropdown and convert button on the details page, with results displayed inline
- **Summary chart**: Chart.js bar chart with dual Y-axes and colour-coded bars per product type
- **Clickable metric cards**: Low Stock and Out of Stock cards scroll smoothly to the relevant table section

---

## Testing Strategy

The test suite uses **Jest** as the test runner and **Supertest** for HTTP integration testing. Tests are organised into two categories:

### Unit Tests (`tests/unit/`)

Unit tests validate individual controller functions and their logic in isolation:

| Test File                    | Coverage Area                          | Tests |
| ---------------------------- | -------------------------------------- | ----- |
| `createProduct.test.js`      | Product creation logic                 | 1     |
| `updateProduct.test.js`      | Product update logic                   | 1     |
| `deleteProduct.test.js`      | Product deletion logic                 | 1     |
| `sort.test.js`               | Sorting by all fields and directions   | 7     |
| `filter.test.js`             | Filtering by type, price, low stock    | 16    |
| `convertCurrency.test.js`    | Currency conversion endpoint           | 1     |

### Integration Tests (`tests/integration/`)

Integration tests verify end-to-end request-response cycles through the Express application:

| Test File                    | Coverage Area                          | Tests |
| ---------------------------- | -------------------------------------- | ----- |
| `createProduct.test.js`      | POST /create with valid/invalid data   | 2     |
| `updateProduct.test.js`      | POST /update/:id                       | 2     |
| `deleteProduct.test.js`      | POST /delete/:id                       | 2     |
| `sort.test.js`               | GET /sort with various parameters      | 6     |
| `filter.test.js`             | GET /filter with combined filters      | 16    |
| `convertCurrency.test.js`    | GET /details/:id/convert               | 2     |

### Test Configuration

- **Total active tests**: 55 (27 unit + 28 integration)
- **Test environment**: Node.js
- **Setup**: `jestSetup.js` performs a force-sync of the database before all tests and closes the connection afterwards
- **Execution**: Tests run sequentially (`--runInBand`) to prevent SQLite database conflicts

### Running Tests

```bash
npm test
```

---

## Design Decisions

### 1. Polymorphic Model Architecture

Rather than storing all product attributes in a single table, the application uses a base `Product` model with separate type-specific tables. This design:
- Avoids sparse columns (e.g., a `warranty` column that only applies to electronics)
- Makes it straightforward to add new product types by creating a new model and adding it to the `typeModelMap`
- Maintains referential integrity through Sequelize associations

### 2. Dynamic Type Model Map

The `typeModelMap` object in `stockController.js` maps each product type string to its corresponding Sequelize model and field list. This enables O(1) lookups for CRUD operations without lengthy if-else chains, making the controller scalable as new types are added.

```javascript
const typeModelMap = {
  clothing: { model: clothing, fields: ['size', 'material', 'color', 'brand', 'gender'] },
  electronics: { model: electronic, fields: ['brand', 'warranty', 'model', 'powerConsumption', 'dimensions'] },
  // ...
};
```

### 3. Modular CSS

CSS is split into component-specific files rather than a single monolithic stylesheet. This improves maintainability and makes it easier to locate and modify styles for specific UI elements.

### 4. Server-Side Rendering with Pug

Pug templates handle all HTML rendering on the server side. This simplifies the architecture (no separate frontend build step) and is well-suited for the project scope.

### 5. SQLite for Portability

SQLite was chosen (as per the assignment requirements) for its zero-configuration, file-based nature. The database file (`database.sqlite`) is created automatically and can be easily reset with the provided scripts.

### 6. External Currency API

Live exchange rates are fetched from the ExchangeRate API rather than using hardcoded values. This ensures the conversion is accurate and up to date, though it does require an internet connection.

---

## Challenges and Solutions

### 1. Dual Y-Axis Chart Scaling

**Challenge**: On the summary dashboard, the total stock value (in GBP) and the total quantity have vastly different scales. When plotted on the same axis, quantity bars were invisible next to value bars.

**Solution**: Implemented a dual Y-axis Chart.js configuration — the left axis displays total value (GBP) and the right axis displays quantity. This allows both datasets to be visually comparable.

### 2. Dynamic Type-Specific Forms

**Challenge**: The create and update forms need to show different fields depending on the selected product type, without requiring a page reload.

**Solution**: Client-side JavaScript toggles the visibility of type-specific form sections. On the create page, changing the type dropdown triggers a function that hides all type sections and reveals only the relevant one. On the update page, the current type's fields are pre-populated from the database.

### 3. Filter and Sort Combination

**Challenge**: Users need to be able to filter and sort simultaneously, but these are separate operations.

**Solution**: The filter route handler accepts both filter parameters (type, price range, low stock) and sort parameters (field, direction) in the same request. The query is built dynamically using Sequelize's `where` and `order` options.

### 4. Consistent Layout Across Sort, Filter, and Search

**Challenge**: The product listing controls (sort dropdowns, filter button, clear filters) needed to appear on the same row regardless of the current view state.

**Solution**: A `.controls-row` flex container wraps all controls, with CSS overrides to ensure consistent height and alignment of form elements and buttons.

---

## Future Improvements

- **Pagination**: Implement paginated product listings to handle large inventories efficiently
- **User Authentication**: Add login/registration to restrict stock management to authorised users
- **Responsive Design**: Enhance mobile responsiveness for all views
- **Bulk Operations**: Support bulk import/export of products via CSV or JSON
- **Stock History**: Track stock level changes over time with a history log
- **Input Validation**: Add more robust server-side and client-side validation with user-friendly error messages
- **Accessibility**: Improve WCAG compliance with ARIA labels, keyboard navigation, and screen reader support
- **Caching**: Implement caching for frequently accessed data (e.g., the summary dashboard metrics)