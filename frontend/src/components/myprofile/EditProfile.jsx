import React, { useState, useEffect } from 'react';
import './editProfile.css';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useRecoilState } from 'recoil';
import { userState } from '../../recoil/userAtom';
import axios from 'axios';
import { handleApiError, showSuccessNotification } from '../../reactToastify';
import baseUrl from '../../baseUrl';

const EditProfile = () => {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [user, setUser] = useRecoilState(userState);
    const userToken = localStorage.getItem('userToken');

    const handleEditClick = () => {
        setOpen(true);
    };

    
    const handleSave = async () => {
        try {
            const response = await axios.put(`${baseUrl}/user/update/${user._id}`, {
                username,
                email
            }, {
                headers: {
                    Authorization: userToken,
                }
            });

            if (response.data.token) {
                localStorage.setItem('userToken', response.data.token);
            }
            showSuccessNotification('Values Updated Successfully')
            setOpen(false);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handlePasswordSave = async () => {
        try {
            const response = await axios.put(`${baseUrl}/user/updatepassword/${user._id}`, {
                oldPassword,
                newPassword
            }, {
                headers: {
                    Authorization: userToken,
                }
            });

            if (response.status === 200) {
                // Password updated successfully, you can show a success message
                showSuccessNotification('Password updated successfully')
                setOldPassword('')
                setNewPassword('')
            } else {
                // Handle password update error
                console.error('Failed to update password');
            }
            setOpen(false);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [user]);

    if (!user) {
        // Handle the case where user data is not available yet
        return null;
    }

    return (
        <section className="edit-profile" style={{ color: 'black', background: 'white', minHeight: '100vh', paddingBottom: '0', paddingTop: '2rem' }}>
            <div className="profile-info">
                <div className="profile-field">
                    <span>Profile Name:</span>
                    <p>{username}</p>
                    <EditIcon onClick={handleEditClick} />
                </div>
                <div className="profile-field">
                    <span>Email:</span>
                    <p>{email}</p>
                    <EditIcon onClick={handleEditClick} />
                </div>
                <div className="profile-field">
                    <div>Old Password:</div>
                    <TextField
                        type="password"
                        variant="outlined"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                </div>
                <div className="profile-field">
                    <div>New Password:</div>
                    <TextField
                        type="password"
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                </div>
                <Button onClick={handlePasswordSave} color="primary" style={{ background: 'black', color: 'white', maxWidth: '225px' }} className='globalbtn'>
                    Change Password
                </Button>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Profile Name"
                        fullWidth
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginBottom: '1rem', marginTop: '1rem' }}
                    />
                    <TextField
                        label="New Email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save Profile
                    </Button>
                </DialogActions>
            </Dialog>
        </section>
    );
};

export default EditProfile;