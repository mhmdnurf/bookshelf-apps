document.addEventListener("DOMContentLoaded", () => {
  getBooksFromLocalStorage();
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBooks();
  });
});

const searchBooks = () => {
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const searchResults = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );

  renderBooks(searchResults);
};

const renderBooks = (bookList) => {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completedBookList = document.getElementById("completeBookshelfList");

  uncompletedBookList.innerHTML = "";
  completedBookList.innerHTML = "";

  for (const bookItem of bookList) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBookList.appendChild(bookElement);
    } else {
      completedBookList.appendChild(bookElement);
    }
  }
};

const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOK_APPS";

const addBookDataToLocalStorage = () => {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
  document.dispatchEvent(new Event(SAVED_EVENT));
};

const getBooksFromLocalStorage = () => {
  const savedBooks = localStorage.getItem(STORAGE_KEY);
  let bookData = JSON.parse(savedBooks);
  if (bookData !== null) {
    for (const book of bookData) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const removeBookFromLocalStorage = (bookId) => {
  const updatedBooks = books.filter((book) => book.id !== bookId);
  localStorage.setItem("books", JSON.stringify(updatedBooks));
};

const generateId = () => {
  return `365 ${new Date()}`;
};

const addBook = () => {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const bookIsCompleted = document.getElementById(
    "inputBookIsComplete"
  ).checked;
  const generatedID = generateId();

  const bookObject = generatedBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    bookIsCompleted
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  addBookDataToLocalStorage();
};

const generatedBookObject = (id, title, author, year, isCompleted) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};

const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener(RENDER_EVENT, () => {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completeBookshelfList");
  completedBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
});

const makeBook = (bookObject) => {
  const article = document.createElement("article");
  article.classList.add("book_item");

  const title = document.createElement("h3");
  title.textContent = bookObject.title;

  const author = document.createElement("p");
  author.textContent = `Penulis: ${bookObject.author}`;

  const year = document.createElement("p");
  year.textContent = `Tahun: ${bookObject.year}`;

  const action = document.createElement("div");
  action.classList.add("action");

  const isReadButton = document.createElement("button");
  isReadButton.classList.add("green");
  isReadButton.textContent = bookObject.isCompleted
    ? "Belum selesai di Baca"
    : "Selesai dibaca";

  isReadButton.addEventListener("click", () => {
    bookObject.isCompleted = !bookObject.isCompleted;
    isReadButton.textContent = bookObject.isCompleted
      ? "Belum selesai di Baca"
      : "Selesai dibaca";
    document.dispatchEvent(new Event(RENDER_EVENT));
    addBookDataToLocalStorage();
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("red");
  deleteButton.textContent = "Hapus buku";

  deleteButton.addEventListener("click", () => {
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus buku ini?"
    );
    if (isConfirmed) {
      const bookIndex = books.findIndex((book) => book.id === bookObject.id);
      if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        addBookDataToLocalStorage();
      }
    }
  });

  action.appendChild(isReadButton);
  action.appendChild(deleteButton);

  article.appendChild(title);
  article.appendChild(author);
  article.appendChild(year);
  article.appendChild(action);

  return article;
};
