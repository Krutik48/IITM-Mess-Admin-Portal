import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Card, Table, Spinner } from 'reactstrap';
import axios from 'axios';
import trash3fill from "../assets/trash3fill.svg";
import './mess.css'

export const Mess = (props) => {
    const [mess, setMess] = useState([])
    const [loading, setLoading] = useState(true);
    const [newMess, setNewMess] = useState({
        messName: '',
    });

    useEffect(() => {
        const fetchMess = async () => {
            try {
                props.setLink('/mess');
                const response = await axios.get('https://sport-mess-admin-backend.onrender.com/api/mess/getAllMess').finally(() => setLoading(false));
                setMess(response.data);
            } catch (error) {
                console.error('Error fetching mess:', error);
            }
        };

        fetchMess();
    }, []);

    const handleAddMess = async () => {
        try {
            await axios.post('https://sport-mess-admin-backend.onrender.com/api/mess/addMess', newMess);
            const response = await axios.get('https://sport-mess-admin-backend.onrender.com/api/mess/getAllMess');
            setMess(response.data);
            setNewMess({
                messName: '',
            });
        } catch (error) {
            console.error('Error adding mess:', error);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMess({ ...newMess, [name]: value });
    };

    const handleDeleteMess = async (id) => {
        try {
            await axios.delete(`https://sport-mess-admin-backend.onrender.com/api/mess/deleteMess/${id}`);
            const response = await axios.get('https://sport-mess-admin-backend.onrender.com/api/mess/getAllMess');
            setMess(response.data);
        } catch (error) {
            console.error('Error deleting mess:', error);
        }
    };

    return (
        <div className='m-3'>
            <Row className="d-flex flex-row justify-content-center">
                <Col md={6}>
                    <Card body className="mb-3 custom-card" style={{background:"#FFFBEB",border:"0px"}}>
                        <h4>Add Mess</h4>
                        <Input
                            type="text"
                            name="messName"
                            value={newMess.messName}
                            placeholder="Enter mess name"
                            onChange={handleInputChange}
                        />
                        <Button color="warning" className="mt-2" onClick={handleAddMess}>Add</Button>
                    </Card>
                </Col>
            </Row>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <h4>Mess List</h4>
                {/* loading till  */}
                {loading ? <Spinner color="warning" className='my-5' /> : 
                    <Table bordered style={{maxWidth:"50vmax"}}>
                        <thead>
                            <tr>
                                <th c>#</th>
                                <th>Mess Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mess.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.messName}</td>
                                    <td>
                                        <img src={trash3fill } title={"Delete " + item.messName + " Mess"} alt="delete" onClick={() => handleDeleteMess(item._id)} style={{ cursor: 'pointer' }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                }
            </div>
        </div>
    );
}