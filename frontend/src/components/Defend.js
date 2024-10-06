import React from "react"

export function Defend({ _defend }) {
    return (
        <div>
            <h4>Defend</h4>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    _defend()
                }}
            >
                <div className="form-group">
                    <input className="btn btn-primary" type="submit" value="DEFEND" />
                </div>
            </form>
        </div >
    )
}