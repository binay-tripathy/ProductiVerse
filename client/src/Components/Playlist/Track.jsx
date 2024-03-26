import React from "react";
// import "./Track.css";

export default class Track extends React.Component { 
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
    }

    addTrack() {
        const { track } = this.props;
        const { onAdd } = this.props;
        if (onAdd) {
            onAdd(track);
}
    }

    renderAction() {
        if (this.props.isRemoval) {
            return <button className="Track-action">-</button>
        } else {
            return <button className="Track-action" onClick={this.addTrack}>+</button>
        }
    }

    render() {
        const { track } = this.props;
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{track.name}</h3>
                    <p>{track.artist} | {track.album}</p>
                </div>
                <div className="Track-actions">
                    {this.renderAction()}
                </div>
            </div>
        );
    }
}