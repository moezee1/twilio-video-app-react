import React from 'react';
import LoginPage from './LoginPage';
import { render } from '@testing-library/react';
import { useAppState } from '../../state';
import { useLocation, useHistory } from 'react-router-dom';

jest.mock('react-router-dom', () => {
  return {
    useLocation: jest.fn(),
    useHistory: jest.fn(),
  };
});
jest.mock('../../state');
jest.mock('./google-logo.svg', () => ({ ReactComponent: () => null }));
jest.mock('./twilio-logo.svg', () => ({ ReactComponent: () => null }));
jest.mock('./video-logo.png', () => ({ ReactComponent: () => null }));

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseLocation = useLocation as jest.Mock<any>;
const mockUseHistory = useHistory as jest.Mock<any>;

const mockReplace = jest.fn();
mockUseHistory.mockImplementation(() => ({ replace: mockReplace }));

describe('the LoginPage component', () => {
  beforeEach(jest.clearAllMocks);

  describe('with auth enabled', () => {
    it('should redirect to "/" when there is a user ', () => {
      process.env.REACT_APP_USE_FIREBASE_AUTH = 'true';
      mockUseAppState.mockImplementation(() => ({ user: {}, signIn: () => Promise.resolve(), isAuthReady: true }));
      render(<LoginPage />);
      expect(mockReplace).toHaveBeenCalledWith('/');
    });

    it('should render the login page when there is no user', () => {
      process.env.REACT_APP_USE_FIREBASE_AUTH = 'true';
      mockUseAppState.mockImplementation(() => ({ user: null, signIn: () => Promise.resolve(), isAuthReady: true }));
      const { getByText } = render(<LoginPage />);
      expect(mockReplace).not.toHaveBeenCalled();
      expect(getByText('Sign in with Google')).toBeTruthy();
    });

    it('should redirect the user to "/" after signIn when there is no previous location', done => {
      process.env.REACT_APP_USE_FIREBASE_AUTH = 'true';
      mockUseAppState.mockImplementation(() => ({ user: null, signIn: () => Promise.resolve(), isAuthReady: true }));
      const { getByText } = render(<LoginPage />);
      getByText('Sign in with Google').click();
      setImmediate(() => {
        expect(mockReplace).toHaveBeenCalledWith({ pathname: '/' });
        done();
      });
    });

    it('should redirect the user to their previous location after signIn', done => {
      process.env.REACT_APP_USE_FIREBASE_AUTH = 'true';
      mockUseLocation.mockImplementation(() => ({ state: { from: { pathname: '/room/test' } } }));
      mockUseAppState.mockImplementation(() => ({ user: null, signIn: () => Promise.resolve(), isAuthReady: true }));
      const { getByText } = render(<LoginPage />);
      getByText('Sign in with Google').click();
      setImmediate(() => {
        expect(mockReplace).toHaveBeenCalledWith({ pathname: '/room/test' });
        done();
      });
    });

    it('should not render anything when isAuthReady is false', () => {
      process.env.REACT_APP_USE_FIREBASE_AUTH = 'true';
      mockUseAppState.mockImplementation(() => ({ user: null, signIn: () => Promise.resolve(), isAuthReady: false }));
      const { container } = render(<LoginPage />);
      expect(mockReplace).not.toHaveBeenCalled();
      expect(container.children[0]).toBe(undefined);
    });
  });

  it('should redirect to "/" when auth is disabled', () => {
    process.env.REACT_APP_USE_FIREBASE_AUTH = 'false';
    mockUseAppState.mockImplementation(() => ({ user: null, signIn: () => Promise.resolve(), isAuthReady: true }));
    render(<LoginPage />);
    expect(mockReplace).toHaveBeenCalledWith('/');
  });
});