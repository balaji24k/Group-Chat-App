import { Row, Col, Button, Container } from "react-bootstrap";
import classes from "./Header.module.css";
import { useContext } from "react";
import AuthContext from "../../store/AuthContext";

const Header = (props) => {
	const {userName,logout} = useContext(AuthContext);

  return (
    <Container fluid>
      <Row className= "bg-primary p-1">
        <Col className="col-5">
          <h3 className={classes.text} >User: {userName}</h3>
        </Col>
        <Col className="col-6">
          <h2 className={classes.text}>Chat App</h2>
        </Col>
        <Col className="col-1">
          <Button
            variant="danger"
            onClick={logout}
          >
            Logout
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
