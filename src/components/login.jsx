import React, {useState, useEffect} from "react";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Spinner  } from "reactstrap";
import axios from "axios";

export const Login = (prop) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.post("https://sport-mess-admin-backend.onrender.com/api/user/verify",null,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            .then((response) => {
                console.log("response:", response);
                prop.setIsAuthenticated(true);
            })
            .catch((error) => {
                console.error("Error verifying token:", error);
            });
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post("https://sport-mess-admin-backend.onrender.com/api/user/login", {
            email: email,
            password: password,
            })
            .then((response) => {
                console.log("response:", response);
                // set the token in local storage
                localStorage.setItem("token", response.data.token);
                prop.setIsAuthenticated(true);
            })
            .catch((error) => {
                console.error("Error logging in:", error);
                alert("Invalid email or password");
            })
            .finally(() => {
                setLoading(false);
            });

    };
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="text-center mb-5">Login to IITM Mess Admin Portal</h2>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <Button color="warning" block disabled={loading}>
                            {loading ? <Spinner size="sm" color="light" /> : "Login"}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}