'use strict';

// Функція для показу повідомлень
function showNotification(message, isSuccess) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.className = isSuccess ? 'success' : 'error';
  notification.textContent = message;

  document.body.appendChild(notification);
}

// Виконується при лівому кліку
// Відхиляється через 3 секунди, якщо кліку не було
const firstPromise = new Promise((resolve, reject) => {
  const timeout = setTimeout(() => {
    reject(new Error('First promise was rejected in 3 seconds if not clicked'));
  }, 3000);

  const clickHandler = (e) => {
    if (e.button === 0) {
      // Лівий клік
      clearTimeout(timeout);
      document.removeEventListener('click', clickHandler);
      resolve('First promise was resolved');
    }
  };

  document.addEventListener('click', clickHandler);
});

firstPromise
  .then((message) => showNotification(message, true))
  .catch((message) => showNotification(message, false));

// Виконується при лівому або правому кліку
// Ніколи не відхиляється
const secondPromise = new Promise((resolve) => {
  const clickHandler = (e) => {
    if (e.button === 0 || e.button === 2) {
      // Лівий або правий клік
      document.removeEventListener('mousedown', clickHandler);
      resolve('Second promise was resolved');
    }
  };

  document.addEventListener('mousedown', clickHandler);
});

secondPromise.then((message) => {
  showNotification(message, true);
});

// Виконується лише після лівого І правого кліків
const thirdPromise = new Promise((resolve) => {
  let leftClicked = false;
  let rightClicked = false;

  const handler = (e) => {
    if (e.button === 0) {
      // Лівий клік
      leftClicked = true;
    }

    if (e.button === 2) {
      // Правий клік
      rightClicked = true;
    }

    if (leftClicked && rightClicked) {
      document.removeEventListener('mousedown', handler);

      resolve('Third promise was resolved');
    }
  };

  document.addEventListener('mousedown', handler);
});

thirdPromise.then((message) => {
  showNotification(message, true);
});

// Вимикаємо контекстне меню при правому кліку
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
