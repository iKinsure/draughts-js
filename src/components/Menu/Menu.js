import React from 'react';
import './Menu.css';

/**
 * Floating menu
 */
class Menu extends React.Component {
    render() {
        return (
            <div className="menu" style={{ display: this.props.isWinner ? 'block' : 'none' }}>
                <div className="menu-message">{this.props.msg}</div>
                <div className="menu-item" onClick={() => this.props.onClick.againstPlayer() }>
                    Play against player
                </div>
                <div className="menu-item" onClick={() => this.props.onClick.againstAI(true)} >
                    Play against AI as white
                </div>
                <div className="menu-item" onClick={() => this.props.onClick.againstAI(false)}>
                    Play against AI as black
                </div>
            </div>
        );
    }
}

export default Menu;