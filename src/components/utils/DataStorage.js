class IdGenerator {
  constructor() {
    this.count = 0;
  }

  getNextId() {
    return this.count++;
  }

  reset() {
    this.count = 0;
  }
}

class Category {
  constructor(title="Buy chicken", id) {
    this.id = id;
    this.title = title;
    this.nested = [];
    this.tasks = [];
  }

  changeTitle(title=this.title) {
    this.title = title;
  }
}

class Task {
  constructor(title="Find girlfriend", id) {
    this.id = id
    this.title = title;
    this.isDone = false;
    this.description = "";
  }

  changeTitle(title=this.title) {
    this.title = title;
  }

  toggleDone() {
    this.isDone = !this.isDone;
  }
}

class ProgressBar {
  constructor() {
    this.done = 0;
    this.total = 0;
  }

  increaseTotal() {
    this.total += 1;
  }

  increaseDone() {
    this.done += 1;
  }

  resetData() {
    this.done = 0;
    this.total = 0;
  }

  getProgress() {
    if (this.total === 0) return;
    const progress = (this.done / this.total) * 100;
    return `${Math.round(progress)}%`;
  }
}

const categoryIdGenerator = new IdGenerator();
const taskIdGenerator = new IdGenerator();

export default class DataStorage {
  constructor() {
    this.storage = [];
    this.progress = new ProgressBar();
  }

  static of() {
    return new DataStorage();
  }

  _countDone(storage=this.storage) {
    console.log(storage);
    storage.forEach((category) => {
      category.tasks.forEach((task) => {
        this.progress.increaseTotal();
        if (task.isDone) this.progress.increaseDone();
      })

      if (category.nested.length > 0) this.countDone(category.nested);
    })
  }

  getProgress() {
    this.progress.resetData();
    this._countDone();
    console.log(this.progress.done, this.progress.total);
    return this.progress.getProgress();
  }

  findTarget(target, storage=this.storage) {
    for (var i = 0; i < storage.length; i++) {
      const storageElem = storage[i];
      if (storageElem.id === +target) {
        const returningValue = {
          category: storageElem,
          storage,
          index: i
        }
        return returningValue;
      }
      else if (storageElem.nested.length > 0) {
        return this.findTarget(target, storageElem.nested);
      }
    }

    return {};
  }

  editCategory(target) {
    const { category } = this.findTarget(target);
    const newTitle = prompt("Enter new title", category.title);
    if (!newTitle) return;

    category.changeTitle(newTitle);
  }

  addNewCategory(title, storage=this.storage) {
    if (this.storage.length === 0) categoryIdGenerator.reset();
    const id = categoryIdGenerator.getNextId();
    storage.unshift(new Category(title, id));
  }

  deleteCategory(target) {
    if (!confirm("Are you sure about this?")) return;

    const { storage, index } = this.findTarget(target);
    storage.splice(index, 1);
  }

  addNestedCategory(target) {
    const title = prompt("Enter title");
    if (!title) return;

    const { category } = this.findTarget(target);
    this.addNewCategory(title, category.nested);
  }

  addTask(target, title) {
    const id = taskIdGenerator.getNextId();
    const { category } = this.findTarget(target);
    if (!category) {
      alert("Choose category");
      return;
    }

    category.tasks.unshift(new Task(title, id));
  }

  getTasks(target) {
    const { category } = this.findTarget(target);
    if (!category) return;
    return category.tasks;
  }
}