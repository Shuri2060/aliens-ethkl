import React from "react"

export function Run({ }) {
    return (
        <div>
            <h4>Run</h4>
            <form
                onSubmit={(event) => {
                    this._run()
                }}
            >
                <div className="form-group">
                    <input className="btn btn-primary" type="submit" value="RUN" />
                </div>
            </form>
        </div >
    )
}