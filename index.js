import { Command } from "commander";
import { listContacts, getContactById, addContact, removeContact } from "./contacts.js";

// Создаём новый экземпляр командного интерфейса
const program = new Command();

// Определяем доступные опции командной строки
program
  .option("-a, --action <type>", "Choose action") // Опция для выбора действия (list, get, add, remove)
  .option("-i, --id <id>", "User ID") // Опция для передачи ID пользователя (используется в get и remove)
  .option("-n, --name <name>", "User name") // Опция для передачи имени (используется в add)
  .option("-e, --email <email>", "User email") // Опция для передачи email (используется в add)
  .option("-p, --phone <phone>", "User phone"); // Опция для передачи телефона (используется в add)

// Разбираем аргументы командной строки
program.parse(process.argv);
// Получаем объект с переданными опциями
const options = program.opts();

/**
 * Функция для выполнения действий в зависимости от переданной команды
 * @param {Object} param0 - объект с параметрами { action, id, name, email, phone }
 */
async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      const contacts = await listContacts();
      console.table(contacts);
      break;

    case "get":
      const contact = await getContactById(id);
      console.table(contact);
      break;

    case "add":
      const newContact = await addContact(name, email, phone);
      console.table(newContact);
      break;

    case "remove":
      const removedContact = await removeContact(id);
      console.log(removedContact);
      break;

    default:
      // Выводит предупреждение при неизвестном действии
      console.warn("\x1B[31m Unknown action type!");
  }
}

// Запускаем выполнение функции с полученными параметрами
invokeAction(options);
