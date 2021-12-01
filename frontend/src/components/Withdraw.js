import React from "react";

export function Withdraw({ withdrawTokens, disabled }) {
  return (
    <div>
      <h6>Use this button to withdraw your eth (once the lock has expired)</h6>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          withdrawTokens();
        }}
      >
        <div className="form-group">
          <input
            className="btn btn-primary"
            type="submit"
            value="Withdraw"
            disabled={disabled}
          />
        </div>
      </form>
    </div>
  );
}
