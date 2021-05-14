import React, { useState } from "react";
import { ApiService } from "../api";
import { defer } from "rxjs";
import { Config } from "./Config";
import { Spinner } from "react-bootstrap";
import RetryComponent from "./RetryComponent";

interface AppProps {
  apiService: ApiService;
  addTicket: () => void;
  loading: boolean;
}

function AddTicket({ apiService, addTicket, loading }: AppProps) {
  const [description, setDescription] = useState({ description: " " });
  const [saving, setSaving] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    let value = { description: e.currentTarget.value };
    setDescription(value);
  };

  const handleOnClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSaving(true);
    setAlert(false);

    const result = defer(() => apiService.newTicket(description)).subscribe(
      (result) => {
        setSaving(false);
        setAlert(false);
        addTicket();
      }
    );
    setTimeout(function () {
      if (!result.closed) {
        setAlert(true);
      }
      result.unsubscribe();
      setSaving(false);
    }, Config.timeout);
  };
  const handleRetryClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAlert(false);
    handleOnClick(e);
  };
  return (
    <div>
      <form>
        <input  onChange={handleOnChange} type="text" required/>
        <button disabled={saving || loading} onClick={handleOnClick}>
          Save
        </button>
        {saving ? (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          ""
        )}
      </form>
      {alert ? (
        <RetryComponent loading={saving} handleRetryClick={handleRetryClick} />
      ) : (
        ""
      )}
    </div>
  );
}

export default AddTicket;
