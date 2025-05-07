import axios from 'axios';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users database
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    password: 'password',
    role: 'user'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'staff@example.com',
    password: 'password',
    role: 'staff'
  }
];

// Generate JWT token (mock implementation)
const generateToken = (user: any) => {
  // Create a mock header that mimics a real JWT header
  const header = btoa(JSON.stringify({
    alg: 'HS256',
    typ: 'JWT'
  }));

  // Create the payload with user data
  const payload = btoa(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours expiry
  }));

  // Create a mock signature (in real JWT this would be cryptographically signed)
  const signature = btoa('mocksignature');

  // Return properly formatted JWT string
  return `${header}.${payload}.${signature}`;
};

export const authService = {
  async login(email: string, password: string) {
    // Simulate API call
    await delay(800);
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return {
      token: generateToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  },
  
  async googleLogin(token: string) {
    // In a real implementation, you would verify the Google token
    // For mock, we'll just create a user based on the token
    await delay(800);
    
    // Simulating a successful Google login
    const mockUser = {
      id: '3',
      name: 'Google User',
      email: 'google@example.com',
      role: 'user'
    };
    
    return {
      token: generateToken(mockUser),
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role
      }
    };
  },
  
  async storeLogin(email: string, password: string) {
    // Simulate API call
    await delay(800);
    
    const user = users.find(u => u.email === email && u.password === password && u.role === 'staff');
    
    if (!user) {
      throw new Error('Invalid staff credentials');
    }
    
    return {
      token: generateToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  },
  
  async register(name: string, email: string, password: string) {
    // Simulate API call
    await delay(800);
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      password,
      role: 'user' as const
    };
    
    // In a real app, we would save the user to the database
    users.push(newUser);
    
    return {
      token: generateToken(newUser),
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    };
  }
};