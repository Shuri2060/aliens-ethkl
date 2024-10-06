import React from "react"

export function Punch({ }) {
    return (
        <div>
            <h4>Punch</h4>
            <form
                onSubmit={(event) => {
                    this._punch()
                }}
            >
                <div className="form-group">
                    <input className="btn btn-primary" type="submit" value="PUNCH" />
                </div>
            </form>
        </div >
    )
}