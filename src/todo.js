const TASK_KEY = "task";

class MyTodo {
  init() { }

  _requireOwnerAuth() {
    const contractOwner = blockchain.contractOwner();
    if (!blockchain.requireAuth(contractOwner, "active")) {
      throw new Error("contract owner permission denied");
    }
  }

  /**
   * 
   * @param {string} data 
   * @returns {boolean}
   */
  can_update(data) {
    this._requireOwnerAuth();
    return true;
  }

  /**
   * 
   * @param {string} id task id
   * @param {string} info task info
   */
  add(id, info) {
    this._requireOwnerAuth();
    if (255 < storage.mapKeys(TASK_KEY).length) {
      throw new Error("Too Many Task");
    }
    if (storage.mapHas(TASK_KEY, id)) {
      throw new Error("Task Already Exists");
    }
    storage.mapPut(TASK_KEY, id, info);
  }

  /**
   * 
   * @param {string} id task id
   */
  remove(id) {
    this._requireOwnerAuth();
    if (!storage.mapHas(TASK_KEY, id)) {
      throw new Error("Task Not Found");
    }
    storage.mapDel(TASK_KEY, id);
  }

  /**
   * 
   * @returns {{ [id: string]: string }}
   */
  getAllTasks() {
    const tasks = {};
    storage.mapKeys(TASK_KEY).forEach((id) => {
      tasks[id] = storage.mapGet(TASK_KEY, id);
    });
    return tasks;
  }
}

module.exports = MyTodo;
