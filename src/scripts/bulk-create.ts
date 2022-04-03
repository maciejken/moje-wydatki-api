import { bulkCreateExpenses } from "../services/expenses";
import getLogger from "../lib/getLogger";
import { DB_HOST, DB_NAME, PWD } from "../config";
import fs from "fs";

const logger = getLogger("bulk create expenses");

logger.info(`DB_HOST: ${DB_HOST}`);
logger.info(`DB_NAME: ${DB_NAME}`);
logger.info(`PWD: ${PWD}`);

const [, , filename] = process.argv;
const jsonString = fs.readFileSync(`${PWD}/data/${filename}.json`, {
  encoding: "utf8",
  flag: "r",
});
const jsonData = JSON.parse(jsonString);
const dataToInsert = jsonData.map((d: any) => ({
  // do not insert id as it will cause validation error at some point
  // in database fed with data from backup
  title: d.title,
  amount: d.amount,
  date: d.date,
  categoryId: d.categoryId,
  userId: d.userId,
  isPrivate: d.isPrivate,
  createdAt: d.createdAt,
  updatedAt: d.updatedAt,
}));

bulkCreateExpenses(dataToInsert)
  .then((res) => {
    logger.info(`${res.length} items created.`);
  })
  .catch((err) => {
    logger.error(err);
  })
  .finally(() => {
    process.exit(0);
  });
