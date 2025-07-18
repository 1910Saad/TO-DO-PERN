import React, { Fragment, useState } from "react";

const EditTodo = ({ todo }) => {
  const [description, setDescription] = useState(todo.description);
  const [showModal, setShowModal] = useState(false);

  //edit description function
  const updateDescription = async e => {
    e.preventDefault();
    try {
      const body = { description };
      await fetch(
        `http://localhost:5000/todos/${todo.todo_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      setShowModal(false);
      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  const openModal = () => {
    setDescription(todo.description);
    setShowModal(true);
  };

  const closeModal = () => {
    setDescription(todo.description);
    setShowModal(false);
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-warning"
        onClick={openModal}
      >
        Edit
      </button>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Todo</h4>
                <button
                  type="button"
                  className="close"
                  onClick={closeModal}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={updateDescription}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default EditTodo;