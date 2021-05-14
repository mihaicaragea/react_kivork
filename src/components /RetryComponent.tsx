import React from "react";
interface RetryProps {
  loading: boolean;
  handleRetryClick: (e: React.FormEvent<HTMLButtonElement>) => void;
}

function RetryComponent({ loading, handleRetryClick }: RetryProps) {
  return (
    <div>
      <h3>Error on loading data please try again</h3>
      <button disabled={loading} onClick={handleRetryClick}>
        Retry
      </button>
    </div>
  );
}

export default RetryComponent;
