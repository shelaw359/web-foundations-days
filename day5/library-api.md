# Library Books REST API

This document describes a REST API for managing books in a library.

## 1. List all books

- **Method:** GET
- **Path:** `/books`
- **Description:** Returns all books in the library.
- **Success status:** 200 OK

## 2. Get one book

- **Method:** GET
- **Path:** `/books/42`
- **Description:** Returns the book with ID 42.
- **Success status:** 200 OK

## 3. Create a book

- **Method:** POST
- **Path:** `/books`
- **Description:** Adds a new book to the library.
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publishedYear": 1958
}
```

- **Success status:** 201 Created

## 4. Update a book

- **Method:** PATCH
- **Path:** `/books/42`
- **Description:** Updates details of book 42.
- **Example request body:**

```json
{
  "title": "Updated Book Title"
}
```

- **Success status:** 200 OK

## 5. Delete a book

- **Method:** DELETE
- **Path:** `/books/42`
- **Description:** Deletes book 42 from the library.
- **Success status:** 204 No Content

## 6. List books by author

- **Method:** GET
- **Path:** `/books?author=Chinua%20Achebe`
- **Description:** Returns books written by Chinua Achebe.
- **Success status:** 200 OK

## Error Responses

### 400 Bad Request

- **Meaning:** The request contains invalid data.
- **Example:** Creating a book without a title or with an invalid publication year.

### 404 Not Found

- **Meaning:** The requested resource does not exist.
- **Example:** Requesting `GET /books/9999` when no book with that ID exists.