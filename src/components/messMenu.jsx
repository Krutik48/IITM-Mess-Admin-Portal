import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Card, Table } from 'reactstrap';
import axios from 'axios';
import "./messMenu.css";
import x from "../assets/x.svg";
export const MessMenu = (props) => {

    const [menu, setMenu] = useState([]);
    const [selectedMess, setSelectedMess] = useState();
    const [selectedWeek, setSelectedWeek] = useState("Odd"); // like odd week, even week 
    const [selectedDay, setSelectedDay] = useState("Sunday"); // like sunday, monday, tuesday, wednesday, thursday, friday, saturday
    const [selectedMenu, setSelectedMenu] = useState([]);
    const [selectBreakfast, setSelectBreakfast] = useState();
    const [selectLunch, setSelectLunch] = useState();
    const [selectDinner, setSelectDinner] = useState();
    const [breakfast, setBreakfast] = useState([]);
    const [lunch, setLunch] = useState([]);
    const [dinner, setDinner] = useState([]);
    const [mess, setMess] = useState([]); 
    const [foodItems, setFoodItems] = useState([]); // like idli, dosa, chapati, rice, etc
    const [foodNameMap,setFooNameMap] = useState(new Map()); // map of food items with their id as key and name as value
 
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                props.setLink('/');
                const menuResponse = await axios.get('https://sport-mess-admin-backend.onrender.com/api/menu/getAllMenu');
                setMenu(menuResponse.data);
                const itemResponse = await axios.get('https://sport-mess-admin-backend.onrender.com/api/item/getAllItem');
                setFoodItems(itemResponse.data);
                const messResponse = await axios.get('https://sport-mess-admin-backend.onrender.com/api/mess/getAllMess');
                setMess(messResponse.data);
                if (messResponse.data.length > 0) {
                    setSelectedMess(messResponse.data[0]._id);
                } 
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        };
        fetchMenu();
    }, []);

    useEffect(() => {
        setFoodItems(foodItems.sort((a, b) => a.foodName.localeCompare(b.foodName)));
        foodItems.forEach((item) => {
            foodNameMap.set(item._id, item.foodName);
        });
    }, [foodItems]);

    useEffect(() => {   
        console.log('selectedMess:', selectedMess,menu);
        console.log('selectedWeek:', selectedWeek);
        console.log('selectedDay:', selectedDay);
        if (selectedMess && selectedWeek && selectedDay) {
            const selectedMenu = menu.filter((m) => m.mess === selectedMess && m.week === selectedWeek && m.day === selectedDay);
            setSelectedMenu(selectedMenu);
            console.log('selectedMenu:', selectedMenu);
        }
    },[menu,selectedMess,selectedWeek,selectedDay]);

    useEffect(() => {
        console.log('hi',selectedMenu);
        const breakfast = selectedMenu.filter((m) => m.time === "Breakfast");
        const lunch = selectedMenu.filter((m) => m.time === "Lunch");
        const dinner = selectedMenu.filter((m) => m.time === "Dinner");
        setBreakfast(breakfast);
        setLunch(lunch);
        setDinner(dinner);
    }, [selectedMenu]);

    const onChangeSelectFood = (e, foodType) => {
        const value = e.target.value;
        if (foodType === "Breakfast") {
            if (breakfast.length!=0  && breakfast[0].items.includes(value)) {
                setSelectBreakfast("");
                alert('Food item already exists in breakfast');
            }
            else {
                setSelectBreakfast(value);
            }
        } else if (foodType === "Lunch") {
            if (lunch.length!=0 && lunch[0].items.includes(value)) {
                setSelectLunch("");
                alert('Food item already exists in lunch');
            }
            else {
                setSelectLunch(value);
            }
        } else if (foodType === "Dinner") {
            if (dinner.length!=0 && dinner[0].items.includes(value)) {
                setSelectDinner("");
                alert('Food item already exists in dinner');
            }
            else {
                setSelectDinner(value);
            }
        }
    }
    const addMenu= async (m,newItem,time="") => {
        try {
            if(m.length === 0) {
                const newMenu = {
                    mess: selectedMess,
                    week: selectedWeek,
                    day: selectedDay,
                    time: time,
                    items: [newItem],
                };
                await axios.post('https://sport-mess-admin-backend.onrender.com/api/menu/addMenu', newMenu);
            }
            else{ 
                const newMenu = {
                    items: [...m[0].items, newItem],
                };
                await axios.put(`https://sport-mess-admin-backend.onrender.com/api/menu/updateMenu/${m[0]._id}`, newMenu);
            }
            setSelectBreakfast("");
            setSelectLunch("");
            setSelectDinner("");
            const menuResponse = await axios.get('https://sport-mess-admin-backend.onrender.com/api/menu/getAllMenu');
            setMenu(menuResponse.data);
        } catch (error) {
            console.error('Error adding breakfast:', error);
        }
    }

    const deleteMenu = async (m, item) => {
        try {
            const newItems = m[0].items.filter((i) => i !== item);
            const newMenu = {
                items: newItems,
            };
            await axios.put(`https://sport-mess-admin-backend.onrender.com/api/menu/updateMenu/${m[0]._id}`, newMenu);
            const menuResponse = await axios.get('https://sport-mess-admin-backend.onrender.com/api/menu/getAllMenu');
            setMenu(menuResponse.data);
        } catch (error) {
            console.error('Error deleting menu:', error);
        }
    }
    
    return (
        // first take select input in one row for mess, week, day and then give 3 cards for breakfast, lunch and dinner with list of food items in each card and a button to add the food item to the menu
        <>
            <Row className="d-flex flex-row justify-content-center">
                <Col md={6}>
                    <Card body className="mb-3 custom-card" style={{background:"#FFFBEB", border:"0px"}}>
                        <h4>Mess Menu</h4>
                        <Row>
                            <Col md={4}>
                                <Input className='my-1' type="select" name="mess" id="mess" value={selectedMess} onChange={(e) => setSelectedMess(e.target.value)}>
                                    <option value="">Select Mess</option>
                                    {mess.map((mess) => (
                                        <option key={mess._id} value={mess._id}>{mess.messName}</option>
                                    ))}
                                </Input>
                            </Col>
                            <Col className='my-1' md={4}>
                                <Input type="select" name="week" id="week" value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
                                    <option value="Odd">Odd Week</option>
                                    <option value="Even">Even Week</option>
                                </Input>
                            </Col>
                            <Col  md={4}>
                                <Input className='my-1' type="select" name="days" id="days" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                                    <option value="Sunday">Sunday</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                </Input>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Row className="d-flex flex-row justify-content-center mx-2">
                <Col sm = "12" md={6} lg = "4">
                    <Card body className="mb-3 custom-card">
                        <h4>Breakfast</h4>
                        <ul className="menu-list">
                            {breakfast.map((b_menu) => (
                                b_menu.items.map((item) => (
                                    <li key={item}>
                                        <span className="card-text">
                                            {foodNameMap.get(item)} 
                                            <img src={x} alt="delete" title='Delete' className="delete-icon" onClick={() => {deleteMenu(breakfast,item)}}/>
                                        </span>
                                    </li>
                                ))
                            ))}
                        </ul>
                        <Row>
                            <Col xs={9} >
                                <Input className='my-1' type = 'select' name='breakfast' id='breakfast' value={selectBreakfast} onChange= {(e) =>onChangeSelectFood(e, "Breakfast")} > 
                                    <option value="">Select Food Item</option>
                                    {foodItems.map((item) => (
                                        <option key={item._id} value={item._id}>{item.foodName}</option>
                                    ))}
                                </Input>
                            </Col>
                            <Col xs={2} >
                                <Button className='my-1' color="warning" title='Add Breakfast' onClick={() => addMenu(breakfast,selectBreakfast,"Breakfast")}>Add</Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col sm="12" md={6} lg = "4">
                    <Card body className="mb-3 custom-card">
                        <h4>Lunch</h4>
                        <ul className="menu-list">
                            {lunch.map((l_menu) => (
                                l_menu.items.map((item) => (
                                    <li key={item}>
                                        <span className="card-text">
                                            {foodNameMap.get(item)} 
                                            <img src={x} alt="delete" title='Delete' className="delete-icon" onClick={() => {deleteMenu(lunch,item)}}/>
                                        </span>
                                    </li>
                                ))
                            ))}
                        </ul>
                        <Row>
                            <Col xs={9}>
                                <Input type = 'select' name='lunch' id='lunch' value={selectLunch} onChange= {(e) =>onChangeSelectFood(e, "Lunch")} > 
                                    <option value="">Select Food Item</option>
                                    {foodItems.map((item) => (
                                        <option key={item._id} value={item._id}>{item.foodName}</option>
                                    ))}
                                </Input>
                            </Col>
                            <Col xs={2}>
                                <Button color="warning" onClick={() => addMenu(lunch,selectLunch,"Lunch")}>Add</Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col sm="12" md={6} lg = "4">
                    <Card body className="mb-3 custom-card">
                        <h4>Dinner</h4>
                        <ul className="menu-list" >
                            {dinner.map((d_menu) => (
                                d_menu.items.map((item) => (
                                    <li key={item}>
                                        <span className="card-text">
                                            {foodNameMap.get(item)} 
                                            <img src={x} alt="delete" title='Delete' className="delete-icon" onClick={() => {deleteMenu(dinner,item)}}/>
                                        </span>
                                    </li>
                                ))
                            ))}
                        </ul>
                        <Row>
                            <Col xs={9}>
                                <Input type = 'select' name='dinner' id='dinner' value={selectDinner} onChange= {(e) =>onChangeSelectFood(e, "Dinner")} > 
                                    <option value="">Select Food Item</option>
                                    {foodItems.map((item) => (
                                        <option key={item._id} value={item._id}>{item.foodName}</option>
                                    ))}
                                </Input>
                            </Col>
                            <Col xs={1}>
                                <Button color="warning" onClick={() => addMenu(dinner,selectDinner,"Dinner") }>Add</Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
           
        </>
    );
}