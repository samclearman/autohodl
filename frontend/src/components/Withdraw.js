import React from "react";

export function Withdraw({ withdrawTokens, disabled }) {
  return (
    <div>
      Use this button to withdraw your eth (once the lock has expired)
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
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
