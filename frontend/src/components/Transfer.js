import React from "react";

export function Transfer({ lockTokens }) {
  return (
    <div>
      <h4>Hodl</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const amount = parseFloat(formData.get("amount"));
          const lockSeconds = parseFloat(formData.get("lockDays")) * 60 * 60 * 24;
          if (amount && lockSeconds) {
            lockTokens(amount, lockSeconds);
          }
        }}
      >
        <div className="form-group">
          <label>Amount of eth</label>
          <input
            className="form-control"
            type="number"
            step="1"
            name="amount"
            placeholder="420.69"
            step="any"
            required
          />
        </div>
        <div className="form-group">
          <label>Days to lock for</label>
          <input className="form-control" type="number" name="lockDays" placeholder="1" required />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Hodl" />
        </div>
      </form>
    </div>
  );
}
