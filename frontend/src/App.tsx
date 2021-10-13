import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import Modal from "./components/CustomModal";
import { createFalse } from "typescript";

export interface Item {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const App = () => {
  let defaultItem: Item = {
    id: 1,
    title: "",
    description: "",
    completed: false,
  };

  const [activeItem, setActiveItem] = useState(defaultItem);
  const [viewCompleted, setViewCompleted] = useState(false);
  const [todoList, setTodoList] = useState<Item[]>([]);
  const [modal, setModal] = useState(false);

  const componentDidMount = () => {
    refreshList();
  }

  const refreshList = () => {
    axios
      .get<Item[]>("http://localhost:8000/api/qsync/")
      .then((res) => setTodoList(res.data))
      .catch((err) => console.log(err));
  };

  const displayCompleted = (status: boolean) => {
    setViewCompleted(status);
  };

  const renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => displayCompleted(true)}
          className={viewCompleted ? "active" : ""}
        >
          complete
        </span>
        <span
          onClick={() => displayCompleted(false)}
          className={viewCompleted ? "" : "active"}
        >
          Incomplete
        </span>
      </div>
    );
  };

  const renderItems = () => {
    const newItems = todoList.filter(
      (item) => item.completed === viewCompleted
    );
    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${viewCompleted ? "completed-todo" : ""}`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            onClick={() => editItem(item)}
            className="btn btn-secondary mr-2"
          >
            {" "}
            Edit{" "}
          </button>
          <button onClick={() => handleDelete(item)} className="btn btn-danger">
            Delete{" "}
          </button>
        </span>
      </li>
    ));
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleSubmit = (item_data: Item) => {
    toggle();
    const item = {
      title: "sanchit",//item_data.title,
      description: "sanchit desc",//item_data.description,
      completed: true,//item_data.completed
    }
    if (item_data.id) {
      axios
        .put(`http://localhost:8000/api/qsync/${item_data.id}/`, item)
        .then((res) => refreshList());
      return;
    }
    axios
      .post("http://localhost:8000/api/qsync/", item)
      .then((res) => refreshList());
  };

  const handleDelete = (item: Item) => {
    axios
      .delete(`http://localhost:8000/api/qsync/${item.id}`)
      .then((res) => refreshList());
  };

  const createItem = () => {
    const item: Item = { title: "", description: "", completed: false, id: 0 };
    setActiveItem(item);
    toggle();
  };

  const editItem = (item: Item) => {
    setActiveItem(item);
    toggle();
  };

  return (
    <main className="content">
      <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
      <div className="row ">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="">
              <button onClick={createItem} className="btn btn-primary">
                Add task
              </button>
            </div>
            {renderTabList()}
            <ul className="list-group list-group-flush">{renderItems()}</ul>
          </div>
        </div>
      </div>
      {modal ? (
        <Modal activeItem={activeItem} toggle={toggle} onSave={handleSubmit} />
      ) : null}
    </main>
  );
};

export default App;
