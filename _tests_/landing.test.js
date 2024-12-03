import React from 'react';
import { render } from '@testing-library/react-native';
import MuhimaSignInScreen from '../app/landingpage';

// Mock `expo-router` and `useGlobalStore` hooks
jest.mock('expo-router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: jest.fn().mockReturnValue({
    Navigator: ({ children }) => <>{children}</>, // Mock Navigator to just render its children
    Screen: jest.fn(), // Mock Screen component
  }),
}));

jest.mock('../app/store/GlobalStore', () => ({
  useGlobalStore: jest.fn().mockReturnValue({
    userType: 'Homeowner',
    setUserType: jest.fn(),
  }),
}));

describe('MuhimaSignInScreen', () => {
  it('renders the screen elements correctly', () => {
    const { getByText } = render(<MuhimaSignInScreen />);
    
    // Check if title, subtitle, and buttons are rendered
    expect(getByText('Welcome to Muhima')).toBeTruthy();
    expect(getByText('Connecting Freelancers with Opportunities')).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
  });

  it('calls HandleSignIn when "Get Started" button is pressed', () => {
    const { getByText } = render(<MuhimaSignInScreen />);
    const button = getByText('Get Started');
    button.props.onPress(); // Simulate button press
    expect(useNavigation().navigate).toHaveBeenCalledWith('SomeRoute'); // Adjust based on your navigation logic
  });

  it('calls HandleFreelancerSignIn when "Sign in as Freelancer" link is pressed', () => {
    const { getByText } = render(<MuhimaSignInScreen />);
    const link = getByText('Sign in as Freelancer');
    link.props.onPress(); // Simulate link press
    expect(useNavigation().navigate).toHaveBeenCalledWith('FreelancerRoute'); // Adjust as necessary
  });
});