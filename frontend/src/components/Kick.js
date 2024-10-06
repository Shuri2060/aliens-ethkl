import React from "react"

export function Kick({ _kick }) {
    return (
        <div>
            <h4>Kick</h4>
            <form
                onSubmit={(event) => {
                    _kick()
                }}
            >
                <div className="form-group">
                    <input className="btn btn-primary" type="submit" value="KICK" />
                </div>
            </form>
        </div >
    )
}