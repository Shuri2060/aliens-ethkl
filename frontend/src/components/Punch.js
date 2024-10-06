import React from "react"

export function Punch({ _punch }) {
    return (
        <div>
            <h4>Punch</h4>
            <form
                onSubmit={(event) => {
                    _punch()
                }}
            >
                <div className="form-group">
                    <input className="btn btn-primary" type="submit" value="PUNCH" />
                </div>
            </form>
        </div >
    )
}