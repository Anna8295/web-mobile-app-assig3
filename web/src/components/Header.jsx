import React from 'react';
import { Container, Navbar, Nav} from 'react-bootstrap'; 

const Header = () => {
    return (
        <Navbar bg="light" expand="sm">
            <Container fluid>
                <Navbar.Brand href="#">Web Application</Navbar.Brand>
                <Nav className="justify-content-end" activeKey="/home">
                    <Nav.Item>
                        <Nav.Link href="/place">Place</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/dashboard">Profile</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;