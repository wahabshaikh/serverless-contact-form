import React, { useReducer } from "react";
import "./form.css";

const INITIAL_STATE = {
  name: "",
  email: "",
  subject: "",
  body: "",
  status: "IDLE",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "updateFieldValue":
      return { ...state, [action.field]: action.value };

    case "updateStatus":
      return { ...state, status: action.status };

    case "reset":
    default:
      return INITIAL_STATE;
  }
};

export default function Form() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const setStatus = (status) =>
    dispatch({
      type: "updateStatus",
      status,
    });

  const updateFieldValue = (field) => (event) => {
    dispatch({
      type: "updateFieldValue",
      field,
      value: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("PENDING");

    fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(state),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setStatus("SUCCESS");
      })
      .catch((error) => {
        console.error(error);
        setStatus("ERROR");
      });
  };

  if (state.status === "SUCCESS") {
    return (
      <div className="success">
        Message Sent!
        <button
          className="button centered"
          type="reset"
          onClick={() => dispatch({ type: "reset" })}
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <>
      {state.status === "ERROR" && (
        <div className="error">Something went wrong. Please try again.</div>
      )}

      <form
        className={`form ${state.status === "PENDING" && "pending"}`}
        onSubmit={handleSubmit}
      >
        <label className="label">
          Name
          <input
            type="text"
            className="input"
            name="name"
            value={state.name}
            onChange={updateFieldValue("name")}
          />
        </label>

        <label className="label">
          Email
          <input
            type="email"
            className="input"
            name="email"
            value={state.email}
            onChange={updateFieldValue("email")}
          />
        </label>
        <label className="label">
          Subject
          <input
            type="text"
            className="input"
            name="subject"
            value={state.subject}
            onChange={updateFieldValue("subject")}
          />
        </label>
        <label className="label">
          Body
          <textarea
            className="input"
            name="body"
            value={state.body}
            onChange={updateFieldValue("body")}
          />
        </label>
        <button className="button">Send</button>
      </form>
    </>
  );
}
