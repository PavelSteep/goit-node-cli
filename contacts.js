import fs from "fs/promises";
// Импорт модуля "fs/promises" для работы с файловой системой в асинхронном режиме (использование async/await).
import path from "path";
// Импорт модуля "path" для работы с путями к файлам и директориям (создание, объединение, нормализация путей).
import { existsSync } from "fs";
// Импорт функции existsSync из модуля "fs" для синхронной проверки существования файла или директории.
import { randomUUID } from "crypto";
// Импорт функции randomUUID из модуля "crypto" для генерации уникальных идентификаторов (UUID v4).
import { fileURLToPath } from "url";
// Импорт функции fileURLToPath из модуля "url" для преобразования URL файла (например, import.meta.url) в абсолютный путь.


// Определяем путь к файлу contacts.json
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contactsPath = path.join(__dirname, "contacts.json");

// Функция для проверки наличия файла и создания, если его нет
async function ensureFileExists() {
  if (!existsSync(contactsPath)) {
    await fs.writeFile(contactsPath, "[]", "utf-8");
  }
}

/**
 * Асинхронная функция для получения списка всех контактов
 * Читает файл contacts.json, парсит его содержимое и возвращает массив контактов
 * Если файл отсутствует или ошибка чтения, возвращает пустой массив
 */
async function listContacts() {
  await ensureFileExists();

  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return data.trim() ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Ошибка при чтении файла:", error.message);
    return [];
  }
}

/**
 * Асинхронная функция для получения контакта по ID
 * @param {string} contactId
 * @returns {object|null}
 */
async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId) || null;
}

/**
 * Асинхронная функция для удаления контакта по ID
 * @param {string} contactId
 * @returns {object|null}
 */
async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) return null;

  const [removedContact] = contacts.splice(index, 1);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf-8");

  return removedContact;
}

/**
 * Асинхронная функция для добавления нового контакта
 * @param {string} name
 * @param {string} email
 * @param {string} phone
 * @returns {object}
 */
async function addContact(name, email, phone) {
  const contacts = await listContacts();

  const newContact = {
    id: randomUUID(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf-8");

  return newContact;
}

export { listContacts, getContactById, removeContact, addContact };
