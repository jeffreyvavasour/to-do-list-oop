const form = document.querySelector("form");
const formActivity = document.querySelector("#activity");
const activitiesContainer = document.querySelector(".activities");

class Activity {
  constructor(activity, id) {
    this.activity = activity;
    this.id = id;
  }
}

class ToDo {
  #activities = this._getLocalStorage() || [];
  toEdit;

  constructor() {
    this._setUI(this.#activities);
    this.edit = false;
    form.addEventListener("submit", this._doSomething.bind(this));
  }

  _getActivities() {
    return this.#activities;
  }

  _setActivities(act) {
    this.#activities.push(act);
  }

  _getLocalStorage() {
    return JSON.parse(localStorage.getItem("activities"));
  }

  _setLocalStorage() {
    localStorage.setItem("activities", JSON.stringify(this.#activities));
  }

  _setUI(array) {
    activitiesContainer.innerHTML = "";
    array.forEach((obj) => {
      const activityHtml = `<div class="activity">
  <p>${obj.activity}</p>
  <div class="btns-action" id="${obj.id}">
    <button class="btn-edit">
      <i class="fas fa-thin fa-pen-to-square"></i>
    </button>
    <button class="btn-delete">
      <i class="fas fa-thin fa-trash"></i>
    </button>
  </div>
</div>`;
      activitiesContainer.innerHTML += activityHtml;
    });

    const deleteBtns = document.querySelectorAll(".btn-delete");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", this._deleteActivity.bind(this));
    });
    const editBtns = document.querySelectorAll(".btn-edit");
    editBtns.forEach((btn) => {
      btn.addEventListener("click", this._editActivity.bind(this));
    });
  }

  _deleteActivity(e) {
    this._getLocalStorage().forEach((obj) => {
      if (obj.id == e.target.closest(".btns-action").id) {
        this.#activities = this.#activities.filter((x) => x.id !== +obj.id);
      }
    });

    this._setLocalStorage();
    this._setUI(this.#activities);
  }

  _editActivity(e) {
    this.edit = true;
    formActivity.focus();
    this._getLocalStorage().forEach((obj) => {
      if (obj.id == e.target.closest(".btns-action").id) {
        this.toEdit = obj;
      }
    });
  }

  _doSomething(e) {
    if (!this.edit) {
      e.preventDefault();
      const id = Date.now();
      const activity = formActivity.value;
      const act = new Activity(activity, id);
      this._setActivities(act);
      this._setLocalStorage();
      const arr = this._getLocalStorage();
      this._setUI(arr);
    }

    if (this.edit) {
      e.preventDefault();
      const id = Date.now();
      const activity = formActivity.value;
      let index;
      this.#activities.forEach((obj) => {
        if (obj.id === this.toEdit.id) {
          index = this.#activities.indexOf(obj);
        }
      });
      this.#activities[index] = new Activity(activity, id);
      this._setLocalStorage();
      const arr = this._getLocalStorage();
      this._setUI(arr);
    }

    formActivity.value = "";
    this.edit = false;
  }
}

const todo = new ToDo();
