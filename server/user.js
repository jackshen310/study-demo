const BaseDao = require('./base_dao');

const tableName = 'users';
class UserDao extends BaseDao {
  constructor() {
    super(...arguments);
    this.db = this.lowdb.get(tableName);
    if (!this.lowdb.has(tableName).value()) {
      this.lowdb.set(tableName, []).write();
    }
  }
  getByCode(code) {
    const data = this.db.find({ code }).value();
    return Promise.resolve(data);
  }

  save(data) {
    this.db.push(data).write();
    return Promise.resolve(data.code);
  }

  del(code) {
    this.db.remove({ code }).write();
    return Promise.resolve();
  }

  update(data) {
    this.db
      .find({ code: data.code })
      .assign(data)
      .write();
    return Promise.resolve();
  }

  query(params) {
    const data = this.db.filter(this.sampleFilter(params)).value();
    return Promise.resolve(data);
  }
}
module.exports = UserDao;
