import React from 'react'
import './Rectangle.css'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
const Rectangle = () => {
    return (
        <div className='rectangle-container' >
            <div className='dropdown-button'>
            <Dropdown >
                <Dropdown.Toggle variant="primary" className='dropdown'/>
                <Dropdown.Menu className='dropdown-menu'>
                    <Dropdown.Item href="#">Hello world!</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            </div>
        </div>
    );
}

export default Rectangle;