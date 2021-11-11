import React from 'react'
import './Rectangle.css'
import Dropdown from 'react-bootstrap/Dropdown'
const Rectangle = () => {
    return (
        <div className='rectangle-container' >
            <div className='dropdown-button'>
                <Dropdown>
                    <Dropdown.Toggle variant='secondary'/>
                </Dropdown>
            </div>
        </div>
    );
}

export default Rectangle;