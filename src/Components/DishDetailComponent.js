import React, {Component} from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, BreadcrumbItem, Breadcrumb, Button, Label, Col, Row, ModalHeader, Modal, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent'
 

    function RenderDish({dish}) {
        return(
            <div className="col-md-5 m-1"> 
                <Card>
                    <CardImg top src={dish.image} alt={dish.name} />
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                                <CardText>{dish.description}</CardText>
                         </CardBody>
                </Card>
            </div>   
        ); 
    }

     function RenderComments({comments, addComment, dishId}) {
        if (comments != null)    
            return (
                <div className="col-md-5 m-1">
                    <h4>Comments</h4>
                    <ul className="list-unstyled">
                        {comments.map(comment => {
                            return (
                                <li key={comment.id}>
                                <p>{comment.rating} <span className="fa-star fa"></span></p>
                                <p>{comment.comment}</p>
                                <p>--{comment.author} , {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: '2-digit'}).format(new Date (Date.parse(comment.date)))} </p>
                                </li>
                            );
                        })}
                    </ul>
                    <CommentForm dishId={dishId} addComment={addComment}></CommentForm>
                </div>
            );
        else
            return(
                <div>
                    <p>NO COMMENTS HERE </p>
                </div>
            );
    }
                        
    const DishDetail = (props) => {
        if(props.isLoading) {
            return(
                <div className="container">
                    <div className="row">
                        <Loading></Loading>
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (props.dish!=null)
            return(
                <div class="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                    <div className="row">
                        <RenderDish dish={props.dish}/>
                        <RenderComments comments={props.comments}
                            addComment={props.addComment}
                            dishId={props.dish.id}
                            rating={props.rating}/>
                    </div>
                </div>
            );
        else 
            return (
                <div></div>
            );
    }

    const required = (val) => val && val.length;
    const maxLength = (len) => (val) => !(val) || (val.length <= len)
    const minLength = (len) => (val => (val) && (val.length >= len))
    class CommentForm extends Component {
        constructor(props) {
            super(props);
        this.state = {
            isModalOpen: false
        };
        //this points to method so in code you can just specify this.toggle nav rather than the function inside the code
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        };
    
        handleSubmit(values) {
            this.toggleModal();
            this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
        };
        toggleModal() {
            this.setState({
                isModalOpen: !this.state.isModalOpen
            })
        }

        render() {
            return(
                <React.Fragment>
                <Button outline onClick={this.toggleModal}>
                            <span className="fa fa-pencil fa-lg"></span> Submit Comment
                        </Button>
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                            <ModalBody>
                                <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                    <Row className="form-group">
                                        <Label htmlFor="rating" md={2}>Rating</Label>
                                        <Col md={10}>
                                            <Control.select model=".rating" id="rating" name="rating"
                                            className="form-control">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </Control.select>
                                        </Col>
                                    </Row>
                                     <Row className="form-group">
                                        <Label htmlFor="author" md={2}>Your Name</Label>
                                            <Col md={10}>
                                                <Control.text model=".author" id="author" name="author" placeholder="author" 
                                                className="form-control"validators={{required, minLength: minLength(3), maxLength: maxLength(15)}}></Control.text>
                                                <Errors className="text-danger" model=".author" show="touched" 
                                                messages = {{
                                                    required: 'Required! ',
                                                    minLength: 'Must be greater than 2 characters! ',
                                                    maxLength: 'Must be less than 15 characters! '
                                                }}>
                                    
                                                </Errors>
                                            </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" md={2}>Comment</Label>
                                <Col md={10}>
                                    <Control.textarea model=".comment" id="comment" className="form-control" name="comment" rows="16"></Control.textarea>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={{size:10, offset:2}}>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
           </ModalBody>
       </Modal>
       </React.Fragment>
            )
        }

    }


    export default DishDetail;