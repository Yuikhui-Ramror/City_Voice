export type IssueStatus = 'Submitted' | 'Acknowledged' | 'In Progress' | 'Resolved';

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  tokens: number;
};

export type Issue = {
  id: string;
  userId: string;
  category: string;
  location: string;
  text: string;
  imageUrl: string;
  imageHint: string;
  timestamp: Date;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  status: IssueStatus;
  priority: number;
  department?: string;
  verified?: boolean;
};

export const mockUsers: Record<string, User> = {
    'ananya': { id: 'ananya', name: 'Ananya Sharma', avatarUrl: 'https://i.pravatar.cc/150?u=ananya', tokens: 5 },
    'rohan': { id: 'rohan', name: 'Rohan Verma', avatarUrl: 'https://i.pravatar.cc/150?u=rohan', tokens: 2 },
    'priya': { id: 'priya', name: 'Priya Patel', avatarUrl: 'https://i.pravatar.cc/150?u=priya', tokens: 10 },
    'vikram': { id: 'vikram', name: 'Vikram Singh', avatarUrl: 'https://i.pravatar.cc/150?u=vikram', tokens: 0 },
    'sunita': { id: 'sunita', name: 'Sunita Reddy', avatarUrl: 'https://i.pravatar.cc/150?u=sunita', tokens: 8 },
    'a042581f4e29026704d': { id: 'a042581f4e29026704d', name: 'Citizen Jane', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', tokens: 12 },
};


const now = new Date();

export const mockIssues: Issue[] = [
  {
    id: 'IS-001',
    userId: 'ananya',
    category: 'Pothole',
    location: 'Koramangala, Bangalore',
    text: 'Large pothole on 5th Cross Road, causing traffic issues and potential accidents. Needs urgent repair.',
    imageUrl: 'https://picsum.photos/seed/pothole1/600/400',
    imageHint: 'pothole road',
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    engagement: { likes: 125, comments: 23, shares: 15 },
    status: 'Acknowledged',
    priority: 95,
    department: 'Public Works',
    verified: true,
  },
  {
    id: 'IS-002',
    userId: 'rohan',
    category: 'Waste Management',
    location: 'Indiranagar, Bangalore',
    text: 'Garbage bins are overflowing near the metro station. The area smells terrible and it\'s unhygienic.',
    imageUrl: 'https://picsum.photos/seed/waste1/600/400',
    imageHint: 'garbage trash',
    timestamp: new Date(now.getTime() - 22 * 60 * 60 * 1000), // 22 hours ago
    engagement: { likes: 88, comments: 12, shares: 5 },
    status: 'In Progress',
    priority: 80,
    department: 'Sanitation',
    verified: true,
  },
  {
    id: 'IS-003',
    userId: 'priya',
    category: 'Streetlight Outage',
    location: 'Jayanagar, Bangalore',
    text: 'The streetlight on our block has been out for three days. It feels very unsafe to walk here at night.',
    imageUrl: 'https://picsum.photos/seed/light1/600/400',
    imageHint: 'dark street',
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    engagement: { likes: 210, comments: 45, shares: 30 },
    status: 'Resolved',
    priority: 90,
    department: 'Electrical',
    verified: true,
  },
  {
    id: 'IS-004',
    userId: 'vikram',
    category: 'Broken Pavement',
    location: 'HSR Layout, Bangalore',
    text: 'The sidewalk is cracked and uneven, making it difficult for elderly people and children to walk.',
    imageUrl: 'https://picsum.photos/seed/pavement1/600/400',
    imageHint: 'broken sidewalk',
    timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    engagement: { likes: 50, comments: 8, shares: 2 },
    status: 'Submitted',
    priority: 60,
    verified: undefined,
  },
  {
    id: 'IS-005',
    userId: 'sunita',
    category: 'Water Logging',
    location: 'Marathahalli, Bangalore',
    text: 'After just a little rain, this whole intersection gets flooded. The drainage system is clearly blocked.',
    imageUrl: 'https://picsum.photos/seed/water1/600/400',
    imageHint: 'flooded street',
    timestamp: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    engagement: { likes: 300, comments: 80, shares: 55 },
    status: 'Acknowledged',
    priority: 98,
    department: 'Drainage & Sewage',
    verified: true,
  },
  {
    id: 'IS-006',
    userId: 'ananya',
    category: 'Illegal Parking',
    location: 'Koramangala, Bangalore',
    text: 'This car has been parked on the sidewalk for 2 days now, blocking pedestrian movement completely.',
    imageUrl: 'https://picsum.photos/seed/parking1/600/400',
    imageHint: 'car sidewalk',
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    engagement: { likes: 40, comments: 15, shares: 3 },
    status: 'Submitted',
    priority: 50,
    verified: false,
  }
];

export const issueCategories = [
  'Pothole',
  'Waste Management',
  'Streetlight Outage',
  'Broken Pavement',
  'Water Logging',
  'Illegal Parking',
  'Damaged Signage',
];

export const departments = [
  'Public Works',
  'Sanitation',
  'Electrical',
  'Traffic Police',
  'Drainage & Sewage',
  'Horticulture',
];
