import React from "react"

export function Ready({ }) {
    return (
        <div>
            <h4>Ready</h4>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    const formData = new FormData(event.target)
                    const opponent = formData.get('Opponent')

                    if (opponent) {
                        this._ready(opponent)
                    }
                }}
            >
                <div className="form-group">
                    <label>Opponent address</label>
                    <input className="form-control" type="text" name="Opponent" required />
                </div>
                <div className="form-group">
                    <input className="btn btn-primary" type="submit" value="READY" />
                </div>
            </form>
        </div >
    )
}