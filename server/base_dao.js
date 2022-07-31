const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const fs = require("fs");

if (!fs.existsSync("tmp")) {
  fs.mkdirSync("tmp");
}
const adapter = new FileSync("tmp/sample_db.json");
const db = low(adapter);

db.defaults({
  users: [],
}).write();

class BaseDao {
  constructor() {
    this.lowdb = db;
  }

  sampleFilter(params) {
    const includes = (v1, v2) => {
      if (typeof v1 === "string") {
        return v1.includes(v2);
      }
      return v1.toString().includes(v2);
    };
    return (item) => {
      for (const p in params) {
        if (params[p] && item[p] && !includes(item[p], params[p])) {
          return false;
        }
      }
      return true;
    };
  }
}
module.exports = BaseDao;
