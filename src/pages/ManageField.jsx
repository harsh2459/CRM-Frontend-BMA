import React from 'react'
import { Link } from 'react-router-dom'

const ManageField = () => {
    return (
        <div className='task-container'>
            <div className="notes-header">
                <h3>Manage Field</h3>
                <Link to='/create-template'><button className='btn btn-primary'>Create Template</button></Link>
            </div>

        </div>
    )
}

export default ManageField
