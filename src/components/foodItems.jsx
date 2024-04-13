import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Card, Table, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import axios from 'axios';
import trash3fill from "../assets/trash3fill.svg";
import edit from "../assets/edit.svg";
import './foodItems.css';

export const FoodItems = (props) => {
    const [loading, setLoading] = useState(true);
    const [foodItems, setFoodItems] = useState([])
    const [modalOpen, setModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        foodName: '',
        amount: '',
        quantity: '',
        protein: '',
        calories: ''
    });

    const [editItem, setEditItem] = useState({
        foodName: '',
        amount: '',
        quantity: '',
        protein: '',
        calories: ''
    });

    const handleAddItem = async () => {
        try {
            // Post new item to the API
            if (!newItem.foodName || !newItem.protein || !newItem.calories) {
                alert('Please fill all the required fields');
                if (!newItem.foodName)
                    document.getElementsByName('foodName')[0].focus();
                else if (!newItem.protein)
                    document.getElementsByName('protein')[0].focus();
                else if (!newItem.calories)
                    document.getElementsByName('calories')[0].focus();
                return;
            }

            await axios.post('https://sport-mess-admin-backend.onrender.com/api/item/addItem', newItem);

            // Fetch all items from the API again
            const response = await axios.get('https://sport-mess-admin-backend.onrender.com/api/item/getAllItem');
            setFoodItems(response.data);

            // Clear newItem state
            setNewItem({
                foodName: '',
                amount: '',
                quantity: '',
                protein: '',
                calories: ''
            });
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`https://sport-mess-admin-backend.onrender.com/api/item/deleteItem/${id}`);
            const response = await axios.get('https://sport-mess-admin-backend.onrender.com/api/item/getAllItem');
            setFoodItems(response.data);

        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleEditItem = async (id) => {
        try {
            const item = foodItems.find(item => item._id === id);
            setEditItem(item);
            setModalOpen(true);
        } catch (error) {
            console.error('Error editing item:', error);
        }
    };
    const handleCancelEdit = () => {
        setModalOpen(false); // Close the modal without saving
    };
    const handleSaveEdit = async () => {
        try{
            await axios.put(`https://sport-mess-admin-backend.onrender.com/api/item/updateItem/${editItem._id}`, editItem);
            const response = await axios.get('https://sport-mess-admin-backend.onrender.com/api/item/getAllItem');
            setFoodItems(response.data);
            setModalOpen(false); 
        }
        catch (error) {
            console.error('Error editing item:', error);
        }
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                props.setLink('/foodItems');
                const response = await axios.get('https://sport-mess-admin-backend.onrender.com/api/item/getAllItem').finally(() => setLoading(false));
                setFoodItems(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, []);


    return (
        <>
            <div className="container mt-4">
                <Card className="p-3 custom-card" style={{background:"#FFFBEB", border: "0px"}}>
                    <Row >
                        <Col xl="7" xs="12" className='mb-1'>
                            <Input
                                name="foodName"
                                placeholder="Food Name"
                                value={newItem.foodName}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                        <Col xl="1" xs="6" className='my-1' >
                            <Input
                                name="amount"
                                placeholder="Amt"
                                value={newItem.amount}
                                onChange={handleInputChange}
                            />
                        </Col>
                        <Col xl="1" xs="6" className='my-1'>
                            <Input
                                name="quantity"
                                placeholder="Qnt"
                                value={newItem.quantity}
                                onChange={handleInputChange}
                            />
                        </Col>
                        <Col xl="1" xs="6" className='my-1'>
                            <Input
                                name="protein"
                                placeholder="Protein"
                                value={newItem.protein}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                        <Col xl="1" xs="6" className='my-1' >
                            <Input
                                name="calories"
                                placeholder="Calorie"
                                value={newItem.calories}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                        <Col xl="1" xs="12" className='my-1'>
                            <Button
                                color="warning"
                                block
                                onClick={handleAddItem}
                            >
                                Add
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </div>

            {/* make table and show all items in foodItems */}
            <div className="d-flex flex-row justify-content-center align-items-center">
                {loading ? <Spinner color="warning" className='my-5 mx-auto' /> : 
                    <Table bordered responsive style={{ width: "85vw", margin:"30px" }}>
                        <thead>
                            <tr>
                                <th className="col-xl-1 col-1" >#</th>
                                <th className="col-xl-6 col-5">Food Name</th>
                                <th className="col-xl-1 col-1">Amount</th>
                                <th className="col-xl-1 col-1">Quantity</th>
                                <th className="col-xl-1 col-1">Protein</th>
                                <th className="col-xl-1 col-1">Calorie</th>
                                <th className="col-xl-1 col-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foodItems.map((item, index) => (
                                <tr key={index}>
                                    <td scope="row">{index + 1}</td>
                                    <td>{item.foodName || '-'}</td>
                                    <td>{item.amount || '-'}</td>
                                    <td>{item.quantity || '-'}</td>
                                    <td>{item.protein || '-'}</td>
                                    <td>{item.calories || '-'}</td>
                                    <td>
                                        <span>
                                            <img className='m-1' src={edit} alt="edit" style={{ cursor: "pointer" }} onClick={() => handleEditItem(item._id)} />
                                            <img className='m-1' src={trash3fill} alt="delete" style={{ cursor: "pointer" }} onClick={() => handleDeleteItem(item._id)} />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                }
                <Modal isOpen={modalOpen} toggle={handleCancelEdit}>
                    <ModalHeader toggle={handleCancelEdit}>Edit Item</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col lg="12" xs="12" className="mb-2">
                                <label htmlFor="foodName" className="form-label">Food Name</label>
                                <Input
                                    name="foodName"
                                    placeholder="Food Name"
                                    value={editItem.foodName}
                                    onChange = {(e) => setEditItem({...editItem, foodName: e.target.value})}
                                    required
                                />
                            </Col>
                            <Col lg="6" xs="6" className="mb-2">
                                <label htmlFor="amount" className="form-label">Amount</label>
                                <Input
                                    name="amount"
                                    placeholder="Amt"
                                    value={editItem.amount}
                                    onChange= {(e) => setEditItem({...editItem, amount: e.target.value})}
                                />
                            </Col>
                            <Col lg="6" xs="6" className="mb-2">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <Input
                                    name="quantity"
                                    placeholder="Qnt"
                                    value={editItem.quantity}
                                    onChange= {(e) => setEditItem({...editItem, quantity: e.target.value})}
                                />
                            </Col>
                            <Col lg="6" xs="6" className="mb-2">
                                <label htmlFor="protein" className="form-label">Protein</label>
                                <Input
                                    name="protein"
                                    placeholder="Protein"
                                    value={editItem.protein}
                                    onChange= {(e) => setEditItem({...editItem, protein: e.target.value})}
                                    required
                                />
                            </Col>
                            <Col lg="6" xs="6" className="mb-2">
                                <label htmlFor="calories" className="form-label">Calorie</label>
                                <Input
                                    name="calories"
                                    placeholder="Calorie"
                                    value={editItem.calories}
                                    onChange={(e) => setEditItem({...editItem, calories: e.target.value})}
                                    required
                                />
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={()=>handleSaveEdit(editItem._id)}>Save</Button> 
                        <Button color="secondary" onClick={handleCancelEdit}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    );
}


