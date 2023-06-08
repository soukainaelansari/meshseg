import { Container, Row, Col } from "react-bootstrap";
import logo from "../assets/img/651e97a4e2054db98dfc87c71e02084e__2_-removebg-preview.png";
import SmartFactory from "../assets/img/image_2023-06-07_141530104-removebg-preview.png";


export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <Col size={15} sm={6}>
            <img src={logo} alt="Logo" />
            <img src={SmartFactory} alt="{https://3dsmartfactory.csit.ma/" />
          </Col>
          <Col size={12} sm={6} className="text-center text-sm-end">
            <p>Copyright 2023. All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
