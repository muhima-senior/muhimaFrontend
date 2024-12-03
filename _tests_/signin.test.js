import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import SignInScreen from '../app/signinscreen';
import { useGlobalStore } from '../app/store/GlobalStore';

jest.mock('axios');
jest.mock('../app/store/GlobalStore');

describe('SignInScreen', () => {
  beforeEach(() => {
    useGlobalStore.mockReturnValue({
      user: '',
      setUser: jest.fn(),
      userType: 'Freelancer',
      setUserId: jest.fn(),
      userId: '',
    });
  });

  it('should display error message for invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    const emailInput = getByPlaceholderText('Email Address');
    fireEvent.changeText(emailInput, 'invalidEmail');
    fireEvent.press(getByText('Sign In'));
    await waitFor(() => expect(getByText('Invalid email')).toBeTruthy());
  });

  it('should display error message for invalid password', async () => {
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    const emailInput = getByPlaceholderText('Email Address');
    const passwordInput = getByPlaceholderText('Password');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'invalidPassword');
    fireEvent.press(getByText('Sign In'));
    await waitFor(() => expect(getByText('Password must be at least 6 characters')).toBeTruthy());
  });

  it('should call the sign-in endpoint and navigate to the correct screen', async () => {
    const mockResponse = { status: 200, data: { username: 'testuser', userId: '1234' } };
    axios.post.mockResolvedValue(mockResponse);

    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    const emailInput = getByPlaceholderText('Email Address');
    const passwordInput = getByPlaceholderText('Password');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'validPassword');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/users/signin', {
        email: 'ali12@gmail.com',
        password: 'Alanoud1',
        userType: 'Freelancer',
      });
      expect(useGlobalStore().setUser).toHaveBeenCalledWith('testuser');
      expect(useGlobalStore().setUserId).toHaveBeenCalledWith('1234');
    });
  });
});