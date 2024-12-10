import { useContext, useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Profile() {
    const { user } = useContext(UserContext);  
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);  // Loading state

    useEffect(() => {
        console.log('User data:', user);
    }, [user]);

    const updatePassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            Swal.fire('Error', 'Passwords do not match', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:4000/users/update/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ newPassword: password }),
            });

            const data = await response.json();
            if (data.code === 'USER-PASSWORD-SUCCESSFULLY-UPDATED') {
                Swal.fire('Success', data.message, 'success');
                setPassword('');
                setConfirmPassword('');
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to update password. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/users/updateEmail/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ newEmail: email }),
            });

            const data = await response.json();
            if (data.code === 'USER-EMAIL-SUCCESSFULLY-UPDATED') {
                Swal.fire('Success', data.message, 'success');
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to update email. Please try again.', 'error');
        }
    };

    if (!user || !user.firstName) {
        return (
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} className="text-center mt-5">
                        <h2>Profile</h2>
                        <p>Loading user data...</p>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container fluid className="bg-light py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-lg rounded-lg border-0">
                        <Card.Body className="p-5">
                            {/* Welcome Header Inside Card */}
                            <header className="text-center mb-5">
                                <h1 className="display-4 fw-bold text-dark mb-3">Welcome to Your Profile</h1>
                                <p className="text-muted fs-6">
                                    Here, you can update your account information and manage your security settings.
                                </p>
                            </header>

                            <Row>
                                {/* LEFT COLUMN - Profile Info */}
                                <Col md={5} className="border-end">
                                    <div className="text-center mb-4">
                                        <img
                                            src={user.profilePicture || 'https://scontent.fmnl25-6.fna.fbcdn.net/v/t39.30808-1/440233826_3610259385905161_3698015648048059644_n.jpg?stp=dst-jpg_s160x160_tt6&_nc_cat=102&ccb=1-7&_nc_sid=6738e8&_nc_ohc=jlclol-fFPAQ7kNvgHd-LIC&_nc_zt=24&_nc_ht=scontent.fmnl25-6.fna&_nc_gid=AiOpfKgfBzRrIR7eRxYo1ih&oh=00_AYDsD_yyDsAhAOWygM_A-SWZhNw9tsorUWp0chA-OEPG1g&oe=675DF729'}
                                            alt="Profile"
                                            className="rounded-circle border border-3 border-secondary shadow-sm mb-4"
                                            width="180"
                                            height="180"
                                        />
                                    </div>

                                    <h4 className="text-center text-dark">User Information</h4>
                                    <div className="text-center mb-3">
                                        <p><strong>First Name:</strong> {user.firstName}</p>
                                        {user.middleName && <p><strong>Middle Name:</strong> {user.middleName}</p>}
                                        <p><strong>Last Name:</strong> {user.lastName}</p>
                                        <p><strong>Contact Number:</strong> {user.contactNumber || 'Not Provided'}</p>
                                        <p><strong>Email:</strong> {user.email}</p>
                                    </div>
                                </Col>

                                {/* RIGHT COLUMN - Update Email & Password */}
                                <Col md={7}>
                                    {/* Update Email */}
                                    <section className="mb-5">
                                        <h4 className="text-center text-dark">Update Email</h4>
                                        <Form onSubmit={updateEmail}>
                                            <Form.Group controlId="email" className="mb-4">
                                                <Form.Label>New Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Enter new email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    className="rounded-pill shadow-sm"
                                                />
                                            </Form.Group>
                                            <Button variant="success" type="submit" className="w-100 py-2 rounded-pill shadow-lg">
                                                Update Email
                                            </Button>
                                        </Form>
                                    </section>

                                    <h4 className="mt-4">Change Password</h4>
                                    <Form onSubmit={updatePassword}>
                                        <Form.Group className="mb-3" controlId="password">
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control 
                                                type="password" 
                                                placeholder="Enter new password" 
                                                value={password} 
                                                onChange={e => setPassword(e.target.value)} 
                                                required 
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="confirmPassword">
                                            <Form.Label>Confirm New Password</Form.Label>
                                            <Form.Control 
                                                type="password" 
                                                placeholder="Confirm new password" 
                                                value={confirmPassword} 
                                                onChange={e => setConfirmPassword(e.target.value)} 
                                                required 
                                            />
                                        </Form.Group>
                                        <Button variant="primary" type="submit" className="w-100 py-2 rounded-pill shadow-lg" disabled={loading}>
                                            {loading ? 'Updating...' : 'Update Password'}
                                        </Button>
                                    </Form>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
