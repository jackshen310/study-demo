const BaseDao = require("./base_dao");

const tableName = "posts";
class PostsDao extends BaseDao {
  constructor() {
    super(...arguments);
    this.db = this.lowdb.get(tableName);
    if (!this.lowdb.has(tableName).value()) {
      this.lowdb.set(tableName, []).write();
    }
  }
  getById(id) {
    const data = this.db.find({ id }).value();
    return Promise.resolve(data);
  }

  save(data) {
    this.db.push(data).write();
    return Promise.resolve(data.code);
  }

  del(id) {
    this.db.remove({ id }).write();
    return Promise.resolve();
  }

  update(data) {
    this.db.find({ id: data.id }).assign(data).write();
    return Promise.resolve();
  }

  query(params) {
    const data = this.db.filter(this.sampleFilter(params)).value();
    return Promise.resolve(data);
  }
}
module.exports = PostsDao;
