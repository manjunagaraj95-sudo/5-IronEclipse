
import React, { useState, useEffect, createContext, useContext } from 'react';
import {
    FaUser, FaCog, FaSignOutAlt, FaSun, FaMoon, FaBars, FaTimes, FaHome, FaClipboardList,
    FaShippingFast, FaChartLine, FaEnvelopeOpenText, FaTasks, FaBell, FaCheckCircle,
    FaExclamationTriangle, FaTimesCircle, FaInfoCircle, FaArrowLeft, FaHistory, FaFileAlt, FaFileUpload, FaMapMarkedAlt
} from 'react-icons/fa';

// Global Context for Theme (Dark Mode)
const ThemeContext = createContext();

// Helper to get status color based on project requirements
const getStatusColor = (status) => {
    switch (status) {
        case 'Approved':
        case 'Completed':
        case 'Closed':
        case 'Ready':
        case 'Delivered':
        case 'Picked':
            return 'status-green';
        case 'In Progress':
        case 'Assigned':
        case 'Accepted':
        case 'Created':
            return 'status-blue';
        case 'Pending':
        case 'Action Required':
        case 'Ironing':
            return 'status-orange';
        case 'Rejected':
        case 'SLA Breach':
        case 'Blocked':
            return 'status-red';
        case 'Exception':
        case 'Escalation':
            return 'status-purple';
        case 'Draft':
        case 'Archived':
        case 'New':
        default:
            return 'status-grey';
    }
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// DUMMY DATA (Mandatory, comprehensive, role-aware)
const DUMMY_DATA = {
    users: [
        { id: 'usr-001', name: 'Alice Admin', email: 'admin@iron.com', role: 'Admin' },
        { id: 'usr-002', name: 'Bob Customer', email: 'customer@iron.com', role: 'Customer' },
        { id: 'usr-003', name: 'Charlie Provider', email: 'provider@iron.com', role: 'Service Provider' },
    ],
    partners: [
        { id: 'par-001', name: 'Sparkle Ironing', contact: 'sparkle@iron.com', phone: '555-0101', status: 'Active', rating: 4.8 },
        { id: 'par-002', name: 'Crisp & Clean', contact: 'crisp@iron.com', phone: '555-0102', status: 'Active', rating: 4.5 },
        { id: 'par-003', name: 'Iron Genie', contact: 'genie@iron.com', phone: '555-0103', status: 'Pending Approval', rating: null },
    ],
    orders: [
        {
            id: 'ORD-001', customerId: 'usr-002', customerName: 'Bob Customer', providerId: 'par-001', providerName: 'Sparkle Ironing',
            items: [{ type: 'Shirt', qty: 5, pricePer: 2.50 }, { type: 'Pants', qty: 2, pricePer: 3.00 }],
            totalPrice: 18.50,
            status: 'Delivered', createdDate: '2023-10-20T10:00:00Z', updatedDate: '2023-10-22T15:30:00Z',
            deliveryOption: 'Doorstep', deliveryAddress: '123 Main St', pickupDate: '2023-10-20T11:00:00Z', deliverDate: '2023-10-22T15:30:00Z',
            workflow: [
                { stage: 'Created', by: 'Bob Customer', date: '2023-10-20T10:00:00Z', sla: '2023-10-20T10:30:00Z', status: 'Completed' },
                { stage: 'Accepted', by: 'Sparkle Ironing', date: '2023-10-20T10:15:00Z', sla: '2023-10-20T12:00:00Z', status: 'Completed' },
                { stage: 'Ironing', by: 'Sparkle Ironing', date: '2023-10-20T10:30:00Z', sla: '2023-10-21T10:30:00Z', status: 'Completed' },
                { stage: 'Ready', by: 'Sparkle Ironing', date: '2023-10-21T09:00:00Z', sla: '2023-10-21T11:00:00Z', status: 'Completed' },
                { stage: 'Delivered', by: 'Sparkle Ironing', date: '2023-10-22T15:30:00Z', sla: '2023-10-22T17:00:00Z', status: 'Completed' },
            ],
            documents: [{ name: 'DeliveryReceipt_ORD001.pdf', url: '#', type: 'delivery', uploadedBy: 'par-001' }]
        },
        {
            id: 'ORD-002', customerId: 'usr-002', customerName: 'Bob Customer', providerId: 'par-001', providerName: 'Sparkle Ironing',
            items: [{ type: 'Shirt', qty: 3, pricePer: 2.50 }, { type: 'Blouse', qty: 4, pricePer: 3.50 }],
            totalPrice: 21.50,
            status: 'Ready', createdDate: '2023-10-23T09:00:00Z', updatedDate: '2023-10-24T14:00:00Z',
            deliveryOption: 'Customer Pickup', pickupLocation: 'Sparkle Ironing HQ', pickupDate: '2023-10-24T15:00:00Z',
            workflow: [
                { stage: 'Created', by: 'Bob Customer', date: '2023-10-23T09:00:00Z', sla: '2023-10-23T09:30:00Z', status: 'Completed' },
                { stage: 'Accepted', by: 'Sparkle Ironing', date: '2023-10-23T09:10:00Z', sla: '2023-10-23T11:00:00Z', status: 'Completed' },
                { stage: 'Ironing', by: 'Sparkle Ironing', date: '2023-10-23T09:45:00Z', sla: '2023-10-24T09:45:00Z', status: 'Completed' },
                { stage: 'Ready', by: 'Sparkle Ironing', date: '2023-10-24T14:00:00Z', sla: '2023-10-24T16:00:00Z', status: 'Current' },
                { stage: 'Customer Picked', by: null, date: null, sla: '2023-10-24T17:00:00Z', status: 'Pending' },
            ]
        },
        {
            id: 'ORD-003', customerId: 'usr-002', customerName: 'Bob Customer', providerId: 'par-002', providerName: 'Crisp & Clean',
            items: [{ type: 'Suit Jacket', qty: 1, pricePer: 7.00 }, { type: 'Dress', qty: 1, pricePer: 6.00 }],
            totalPrice: 13.00,
            status: 'Ironing', createdDate: '2023-10-24T11:00:00Z', updatedDate: '2023-10-24T12:00:00Z',
            deliveryOption: 'Doorstep', deliveryAddress: '123 Main St', pickupDate: '2023-10-24T11:30:00Z',
            workflow: [
                { stage: 'Created', by: 'Bob Customer', date: '2023-10-24T11:00:00Z', sla: '2023-10-24T11:30:00Z', status: 'Completed' },
                { stage: 'Accepted', by: 'Crisp & Clean', date: '2023-10-24T11:15:00Z', sla: '2023-10-24T13:00:00Z', status: 'Completed' },
                { stage: 'Ironing', by: 'Crisp & Clean', date: '2023-10-24T12:00:00Z', sla: '2023-10-25T12:00:00Z', status: 'Current' },
                { stage: 'Ready', by: null, date: null, sla: '2023-10-25T14:00:00Z', status: 'Pending' },
                { stage: 'Delivered', by: null, date: null, sla: '2023-10-25T17:00:00Z', status: 'Pending' },
            ]
        },
        {
            id: 'ORD-004', customerId: 'usr-002', customerName: 'Bob Customer', providerId: 'par-001', providerName: 'Sparkle Ironing',
            items: [{ type: 'T-Shirt', qty: 10, pricePer: 2.00 }],
            totalPrice: 20.00,
            status: 'Accepted', createdDate: '2023-10-25T08:00:00Z', updatedDate: '2023-10-25T08:30:00Z',
            deliveryOption: 'Doorstep', deliveryAddress: '123 Main St', pickupDate: '2023-10-25T08:30:00Z',
            workflow: [
                { stage: 'Created', by: 'Bob Customer', date: '2023-10-25T08:00:00Z', sla: '2023-10-25T08:30:00Z', status: 'Completed' },
                { stage: 'Accepted', by: 'Sparkle Ironing', date: '2023-10-25T08:30:00Z', sla: '2023-10-25T10:00:00Z', status: 'Current' },
                { stage: 'Ironing', by: null, date: null, sla: '2023-10-26T08:30:00Z', status: 'Pending' },
                { stage: 'Ready', by: null, date: null, sla: '2023-10-26T10:30:00Z', status: 'Pending' },
                { stage: 'Delivered', by: null, date: null, sla: '2023-10-26T13:30:00Z', status: 'Pending' },
            ]
        },
        {
            id: 'ORD-005', customerId: 'usr-002', customerName: 'Bob Customer', providerId: 'par-002', providerName: 'Crisp & Clean',
            items: [{ type: 'Curtains', qty: 2, pricePer: 15.00 }],
            totalPrice: 30.00,
            status: 'Created', createdDate: '2023-10-26T10:00:00Z', updatedDate: '2023-10-26T10:00:00Z',
            deliveryOption: 'Customer Pickup', pickupLocation: 'Crisp & Clean Store', pickupDate: '2023-10-26T11:00:00Z',
            workflow: [
                { stage: 'Created', by: 'Bob Customer', date: '2023-10-26T10:00:00Z', sla: '2023-10-26T10:30:00Z', status: 'Current' },
                { stage: 'Accepted', by: null, date: null, sla: '2023-10-26T12:00:00Z', status: 'Pending' },
                { stage: 'Ironing', by: null, date: null, sla: '2023-10-27T10:30:00Z', status: 'Pending' },
                { stage: 'Ready', by: null, date: null, sla: '2023-10-27T12:30:00Z', status: 'Pending' },
                { stage: 'Customer Picked', by: null, date: null, sla: '2023-10-27T14:00:00Z', status: 'Pending' },
            ]
        },
        {
            id: 'ORD-006', customerId: 'usr-002', customerName: 'Bob Customer', providerId: 'par-001', providerName: 'Sparkle Ironing',
            items: [{ type: 'Shirt', qty: 7, pricePer: 2.50 }],
            totalPrice: 17.50,
            status: 'Accepted', createdDate: '2023-10-27T09:00:00Z', updatedDate: '2023-10-27T09:10:00Z',
            deliveryOption: 'Doorstep', deliveryAddress: '123 Main St', pickupDate: '2023-10-27T09:30:00Z',
            workflow: [
                { stage: 'Created', by: 'Bob Customer', date: '2023-10-27T09:00:00Z', sla: '2023-10-27T09:30:00Z', status: 'Completed' },
                { stage: 'Accepted', by: 'Sparkle Ironing', date: '2023-10-27T09:10:00Z', sla: '2023-10-27T11:00:00Z', status: 'Current' },
                { stage: 'Ironing', by: null, date: null, sla: '2023-10-28T09:10:00Z', status: 'Pending' },
                { stage: 'Ready', by: null, date: null, sla: '2023-10-28T11:10:00Z', status: 'Pending' },
                { stage: 'Delivered', by: null, date: null, sla: '2023-10-28T14:10:00Z', status: 'Pending' },
            ]
        },
        {
            id: 'ORD-007', customerId: 'usr-002', customerName: 'Bob Customer', providerId: 'par-002', providerName: 'Crisp & Clean',
            items: [{ type: 'Tablecloth', qty: 1, pricePer: 8.00 }],
            totalPrice: 8.00,
            status: 'Ready', createdDate: '2023-10-28T13:00:00Z', updatedDate: '2023-10-29T11:00:00Z',
            deliveryOption: 'Customer Pickup', pickupLocation: 'Crisp & Clean Store', pickupDate: '2023-10-29T14:00:00Z',
            workflow: [
                { stage: 'Created', by: 'Bob Customer', date: '2023-10-28T13:00:00Z', sla: '2023-10-28T13:30:00Z', status: 'Completed' },
                { stage: 'Accepted', by: 'Crisp & Clean', date: '2023-10-28T13:15:00Z', sla: '2023-10-28T15:00:00Z', status: 'Completed' },
                { stage: 'Ironing', by: 'Crisp & Clean', date: '2023-10-28T14:00:00Z', sla: '2023-10-29T14:00:00Z', status: 'Completed' },
                { stage: 'Ready', by: 'Crisp & Clean', date: '2023-10-29T11:00:00Z', sla: '2023-10-29T13:00:00Z', status: 'Current' },
                { stage: 'Customer Picked', by: null, date: null, sla: '2023-10-29T16:00:00Z', status: 'Pending' },
            ]
        },
        {
            id: 'ORD-008', customerId: 'usr-002', customerName: 'Bob Customer', providerId: 'par-001', providerName: 'Sparkle Ironing',
            items: [{ type: 'Shirt', qty: 2, pricePer: 2.50 }, { type: 'Pants', qty: 1, pricePer: 3.00 }],
            totalPrice: 8.00,
            status: 'Created', createdDate: '2023-10-29T16:00:00Z', updatedDate: '2023-10-29T16:00:00Z',
            deliveryOption: 'Doorstep', deliveryAddress: '123 Main St', pickupDate: '2023-10-29T17:00:00Z',
            workflow: [
                { stage: 'Created', by: 'Bob Customer', date: '2023-10-29T16:00:00Z', sla: '2023-10-29T16:30:00Z', status: 'Current' },
                { stage: 'Accepted', by: null, date: null, sla: '2023-10-29T18:00:00Z', status: 'Pending' },
                { stage: 'Ironing', by: null, date: null, sla: '2023-10-30T16:30:00Z', status: 'Pending' },
                { stage: 'Ready', by: null, date: null, sla: '2023-10-30T18:30:00Z', status: 'Pending' },
                { stage: 'Delivered', by: null, date: null, sla: '2023-10-30T21:30:00Z', status: 'Pending' },
            ]
        },
    ],
    pricing: [
        { type: 'Shirt', price: 2.50 },
        { type: 'Pants', price: 3.00 },
        { type: 'Blouse', price: 3.50 },
        { type: 'Suit Jacket', price: 7.00 },
        { type: 'Dress', price: 6.00 },
        { type: 'T-Shirt', price: 2.00 },
        { type: 'Curtains', price: 15.00 },
        { type: 'Tablecloth', price: 8.00 },
    ],
    auditLogs: [
        { id: 'log-001', entity: 'Order', entityId: 'ORD-001', action: 'Status Change', detail: 'Status changed from Ready to Delivered', by: 'par-001', timestamp: '2023-10-22T15:30:00Z' },
        { id: 'log-002', entity: 'Order', entityId: 'ORD-002', action: 'Status Change', detail: 'Status changed from Ironing to Ready', by: 'par-001', timestamp: '2023-10-24T14:00:00Z' },
        { id: 'log-003', entity: 'Order', entityId: 'ORD-003', action: 'Status Change', detail: 'Status changed from Accepted to Ironing', by: 'par-002', timestamp: '2023-10-24T12:00:00Z' },
        { id: 'log-004', entity: 'Order', entityId: 'ORD-004', action: 'Status Change', detail: 'Status changed from Created to Accepted', by: 'par-001', timestamp: '2023-10-25T08:30:00Z' },
        { id: 'log-005', entity: 'Partner', entityId: 'par-003', action: 'Partner Setup', detail: 'New partner Iron Genie created', by: 'usr-001', timestamp: '2023-10-25T10:00:00Z' },
        { id: 'log-006', entity: 'Pricing', entityId: 'Shirt', action: 'Pricing Change', detail: 'Price for Shirt updated from 2.00 to 2.50', by: 'usr-001', timestamp: '2023-10-19T09:00:00Z' },
        { id: 'log-007', entity: 'Order', entityId: 'ORD-006', action: 'Delivery Option', detail: 'Delivery option set to Doorstep', by: 'usr-002', timestamp: '2023-10-27T09:00:00Z' },
    ],
    notifications: [
        { id: 'not-001', userId: 'usr-002', message: 'Order ORD-002 is Ready for Pickup!', type: 'success', timestamp: '2023-10-24T14:00:00Z', read: false },
        { id: 'not-002', userId: 'usr-003', message: 'New Order ORD-004 assigned!', type: 'info', timestamp: '2023-10-25T08:30:00Z', read: false },
        { id: 'not-003', userId: 'usr-001', message: 'Partner Iron Genie needs approval.', type: 'warning', timestamp: '2023-10-25T10:00:00Z', read: false },
        { id: 'not-004', userId: 'usr-002', message: 'Order ORD-001 Delivered!', type: 'success', timestamp: '2023-10-22T15:30:00Z', read: true },
        { id: 'not-005', userId: 'usr-003', message: 'Order ORD-003 SLA approaching for Ironing stage.', type: 'warning', timestamp: '2023-10-24T18:00:00Z', read: false },
    ],
    reports: {
        admin: {
            revenueTrend: [
                { month: 'Jan', value: 1200 }, { month: 'Feb', value: 1500 }, { month: 'Mar', value: 1300 },
                { month: 'Apr', value: 1700 }, { month: 'May', value: 2000 }, { month: 'Jun', value: 1800 }
            ],
            tatGauge: 24, // Avg turnaround time in hours
            deliveryVsPickup: { delivery: 60, pickup: 40 } // percentage
        },
        serviceProvider: {
            ordersByStatus: { Accepted: 2, Ironing: 1, Ready: 1, Delivered: 2 },
            dailyVolumeTrend: [
                { day: 'Mon', count: 10 }, { day: 'Tue', count: 12 }, { day: 'Wed', count: 8 },
                { day: 'Thu', count: 15 }, { day: 'Fri', count: 11 }
            ],
            deliveryVsPickup: { delivery: 70, pickup: 30 } // percentage
        },
        customer: {
            orderStatusDistribution: { Created: 1, Accepted: 2, Ironing: 1, Ready: 2, Delivered: 1, Picked: 1 }
        }
    }
};

// Mock Auth Context (for demo RBAC)
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null); // 'Admin', 'Customer', 'Service Provider', or null
    const [currentUser, setCurrentUser] = useState(null);

    const login = (role) => {
        setUserRole(role);
        setCurrentUser(DUMMY_DATA.users.find(u => u.role === role)); // Simplified: pick the first user for the role
    };

    const logout = () => {
        setUserRole(null);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ userRole, currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);
const useTheme = () => useContext(ThemeContext);


// --- UI Components ---

const KPICard = ({ title, value, icon, statusBadge, footerText, colorClass }) => {
    return (
        <div className="kpi-card">
            <div className="kpi-card-header">
                {icon && <span className="icon">{icon}</span>}
                <h3>{title}</h3>
            </div>
            <div className="kpi-value">
                {value}
                {statusBadge && <span className={`kpi-status-badge ${colorClass}`}>{statusBadge}</span>}
            </div>
            {footerText && <div className="kpi-card-footer">{footerText}</div>}
        </div>
    );
};

const Chart = ({ title, type, data, isRealtime }) => {
    return (
        <div className="chart-card">
            <h3>{title}</h3>
            <div className={`chart-placeholder ${isRealtime ? 'real-time' : ''}`}>
                Visualizing {type} for {title}
                {/* In a real app, this would be a charting library component like Recharts/Chart.js */}
            </div>
        </div>
    );
};

const RecentActivities = ({ activities, role }) => {
    const filteredActivities = activities.filter(activity => {
        if (role === 'Admin') return true;
        if (role === 'Customer' && activity.userId === 'usr-002') return ['Order Placed', 'Order Ready', 'Delivery Scheduled'].some(status => activity.message.includes(status));
        if (role === 'Service Provider' && activity.userId === 'usr-003') return ['Order Accepted', 'Order Completed', 'Delivery Completed'].some(status => activity.message.includes(status));
        return false;
    });

    return (
        <div className="widget-card">
            <h3>Recent Activities</h3>
            {filteredActivities.length > 0 ? (
                <div>
                    {filteredActivities.slice(0, 5).map(activity => (
                        <div key={activity.id} className="activity-item">
                            <span className="activity-icon"><FaEnvelopeOpenText /></span>
                            <span className="activity-text">{activity.message}</span>
                            <span className="activity-timestamp">{formatDate(activity.timestamp)}</span>
                        </div>
                    ))}
                </div>
            ) : <p>No recent activities.</p>}
        </div>
    );
};

const WorkQueue = ({ tasks, onAction }) => {
    return (
        <div className="widget-card">
            <h3>Work Queue (Upcoming Deadlines)</h3>
            {tasks.length > 0 ? (
                <ul className="work-queue-list">
                    {tasks.slice(0, 5).map(task => (
                        <li key={task.id} className="work-queue-item">
                            <span>{task.title}</span>
                            <span className={`card-badge ${getStatusColor(task.status)}`}>{task.status}</span>
                            <span>Due: {formatDate(task.dueDate)}</span>
                            {/* Example action button for work queue */}
                            <button className="button button-primary" onClick={() => onAction(task.id)}>View</button>
                        </li>
                    ))}
                </ul>
            ) : <p>No pending tasks.</p>}
        </div>
    );
};

const NotificationToast = ({ message, type, id, onDismiss }) => {
    const icon = {
        success: <FaCheckCircle />,
        warning: <FaExclamationTriangle />,
        error: <FaTimesCircle />,
        info: <FaInfoCircle />
    }[type];

    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(id);
        }, 5000); // Auto-dismiss after 5 seconds
        return () => clearTimeout(timer);
    }, [id, onDismiss]);

    return (
        <div className={`notification-toast ${type}`}>
            <span className="notification-icon">{icon}</span>
            <span>{message}</span>
            <button onClick={() => onDismiss(id)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: 'auto' }}>&times;</button>
        </div>
    );
};

const WorkflowStepper = ({ workflowStages }) => {
    return (
        <div className="workflow-stepper">
            {workflowStages.map((step, index) => (
                <div key={index} className={`workflow-step ${step.status === 'Completed' ? 'completed' : ''} ${step.status === 'Current' ? 'current' : ''}`}>
                    <span className="workflow-step-icon">
                        {step.status === 'Completed' ? <FaCheckCircle /> : (step.status === 'Current' ? <FaBell /> : index + 1)}
                    </span>
                    <div className="workflow-step-content">
                        <h4>{step.stage}</h4>
                        <p>
                            {step.status === 'Completed' ? `Completed by ${step.by} on ${formatDate(step.date)}` : `Pending since ${formatDate(step.date || new Date().toISOString())}`}
                            {new Date(step.sla) < new Date() && step.status !== 'Completed' && <span className="sla-badge">SLA BREACH</span>}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const AuditLog = ({ logs }) => {
    if (!logs || logs.length === 0) return <p>No audit trail available.</p>;

    return (
        <div className="audit-log">
            <table className="audit-log-table">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Action</th>
                        <th>Details</th>
                        <th>By</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td>{formatDate(log.timestamp)}</td>
                            <td>{log.action}</td>
                            <td>{log.detail}</td>
                            <td>{log.by}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const GenericCard = ({ record, role, onClick }) => {
    const { id, customerName, providerName, status, totalPrice, createdDate, deliveryOption, name, contact, rating } = record;
    const statusClass = getStatusColor(status || 'New');
    const isOrder = id.startsWith('ORD');

    let title, description1, description2, footerLeft, footerRight;

    if (isOrder) {
        title = `Order #${id}`;
        description1 = `Customer: ${customerName}`;
        description2 = `Provider: ${providerName || 'N/A'}`;
        footerLeft = `Total: $${totalPrice.toFixed(2)}`;
        footerRight = `${deliveryOption} - ${formatDate(createdDate)}`;
    } else { // Partner Card
        title = name;
        description1 = `Contact: ${contact}`;
        description2 = `Rating: ${rating ? `${rating}/5` : 'N/A'}`;
        footerLeft = `Status: ${status}`;
        footerRight = `ID: ${id}`;
    }

    return (
        <div className={`card ${statusClass} card-status-accent`} onClick={() => onClick(record)}>
            <div className={`card-header-colorful`}>
                <span>{title}</span>
                <span className="card-badge">{status || 'New'}</span>
            </div>
            <div className="card-body">
                <h3>{isOrder ? 'Ironing Service Order' : 'Ironing Partner'}</h3>
                <p>{description1}</p>
                <p>{description2}</p>
            </div>
            <div className="card-footer">
                <span>{footerLeft}</span>
                <span>{footerRight}</span>
            </div>
        </div>
    );
};

const Dashboard = ({ userRole, navigateTo, showToastNotification }) => {
    const { currentUser } = useAuth();

    if (!currentUser) return <p>Please log in.</p>;

    let kpis = [];
    let charts = [];
    let workQueueTasks = [];

    const allOrders = DUMMY_DATA.orders;
    const userOrders = allOrders.filter(order => order.customerId === currentUser.id);
    const providerOrders = allOrders.filter(order => order.providerId === currentUser.id);

    // KPI & Chart Logic based on Role
    if (userRole === 'Customer') {
        const ordersPlaced = userOrders.length;
        const ordersReady = userOrders.filter(order => order.status === 'Ready' || order.status === 'Picked' || order.status === 'Delivered').length;

        kpis = [
            { title: 'Orders Placed', value: ordersPlaced, icon: <FaClipboardList /> },
            { title: 'Orders Ready', value: ordersReady, icon: <FaCheckCircle />, statusBadge: `${ordersReady} Ready`, colorClass: 'status-green' },
        ];
        charts = [
            { title: 'Your Order Status', type: 'Pie Chart', data: DUMMY_DATA.reports.customer.orderStatusDistribution, isRealtime: true },
        ];
    } else if (userRole === 'Service Provider') {
        const ordersReceived = providerOrders.length;
        const ordersInProgress = providerOrders.filter(order => ['Accepted', 'Ironing'].includes(order.status)).length;
        const ordersCompleted = providerOrders.filter(order => ['Ready', 'Delivered', 'Picked'].includes(order.status)).length;
        const deliveriesScheduled = providerOrders.filter(order => order.deliveryOption === 'Doorstep' && order.status === 'Ready').length;

        kpis = [
            { title: 'Orders Received', value: ordersReceived, icon: <FaClipboardList /> },
            { title: 'Orders In Progress', value: ordersInProgress, icon: <FaTasks />, statusBadge: `${ordersInProgress} Active`, colorClass: 'status-blue' },
            { title: 'Orders Completed', value: ordersCompleted, icon: <FaCheckCircle />, statusBadge: `${ordersCompleted} Done`, colorClass: 'status-green' },
            { title: 'Deliveries Scheduled', value: deliveriesScheduled, icon: <FaShippingFast />, statusBadge: `${deliveriesScheduled} Upcoming`, colorClass: 'status-orange' },
        ];
        charts = [
            { title: 'Orders by Status', type: 'Bar Chart', data: DUMMY_DATA.reports.serviceProvider.ordersByStatus, isRealtime: true },
            { title: 'Daily Volume Trend', type: 'Line Chart', data: DUMMY_DATA.reports.serviceProvider.dailyVolumeTrend, isRealtime: false },
            { title: 'Delivery vs Pickup', type: 'Doughnut Chart', data: DUMMY_DATA.reports.serviceProvider.deliveryVsPickup, isRealtime: false },
        ];
        workQueueTasks = providerOrders.filter(order => ['Accepted', 'Ironing', 'Ready'].includes(order.status)).map(order => ({
            id: order.id,
            title: `Process Order #${order.id}`,
            status: order.status,
            dueDate: order.workflow.find(s => s.status === 'Current')?.sla || new Date(new Date().getTime() + 86400000).toISOString() // Tomorrow
        }));
    } else if (userRole === 'Admin') {
        const totalOrders = allOrders.length;
        const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const avgTurnaroundTime = DUMMY_DATA.reports.admin.tatGauge; // In hours
        const deliveryCount = allOrders.filter(order => order.deliveryOption === 'Doorstep').length;
        const pickupCount = allOrders.filter(order => order.deliveryOption === 'Customer Pickup').length;

        kpis = [
            { title: 'Total Orders', value: totalOrders, icon: <FaClipboardList /> },
            { title: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: <FaChartLine /> },
            { title: 'Avg Turnaround Time', value: `${avgTurnaroundTime} hrs`, icon: <FaHistory /> },
            { title: 'Delivery vs Pickup', value: `${deliveryCount} / ${pickupCount}`, icon: <FaShippingFast /> },
        ];
        charts = [
            { title: 'Revenue Trend', type: 'Line Chart', data: DUMMY_DATA.reports.admin.revenueTrend, isRealtime: true },
            { title: 'Avg TAT Gauge', type: 'Gauge Chart', data: DUMMY_DATA.reports.admin.tatGauge, isRealtime: true },
            { title: 'Delivery vs Pickup Volume', type: 'Bar Chart', data: DUMMY_DATA.reports.admin.deliveryVsPickup, isRealtime: false },
        ];
        workQueueTasks = DUMMY_DATA.partners.filter(p => p.status === 'Pending Approval').map(p => ({
            id: p.id,
            title: `Approve Partner: ${p.name}`,
            status: p.status,
            dueDate: new Date(new Date().getTime() + 86400000 * 2).toISOString() // 2 days from now
        }));
    }

    const handleWorkQueueAction = (id) => {
        const record = DUMMY_DATA.orders.find(o => o.id === id) || DUMMY_DATA.partners.find(p => p.id === id);
        if (record) navigateTo('DetailView', record);
    };

    return (
        <div>
            <h2>{userRole} Dashboard</h2>

            <div className="kpi-cards-grid">
                {kpis.map((kpi, index) => (
                    <KPICard key={index} {...kpi} />
                ))}
            </div>

            <div className="dashboard-charts">
                {charts.map((chart, index) => (
                    <Chart key={index} {...chart} />
                ))}
            </div>

            <div className="dashboard-widgets">
                <RecentActivities activities={DUMMY_DATA.notifications} role={userRole} />
                <WorkQueue tasks={workQueueTasks} onAction={handleWorkQueueAction} />
            </div>
            {userRole === 'Admin' && (
                 <div className="dashboard-widgets" style={{marginTop: 'var(--spacing-lg)'}}>
                    <div className="widget-card">
                        <h3>Upcoming Deadlines</h3>
                        <p>No deadlines set beyond work queue. This would pull from tasks with explicit deadlines.</p>
                    </div>
                 </div>
            )}
        </div>
    );
};

const OrderList = ({ orders, role, handleCardClick, showToastNotification }) => {
    // Filter orders based on role if necessary for this view
    let displayOrders = orders;
    if (role === 'Customer') {
        displayOrders = orders.filter(o => o.customerId === 'usr-002');
    } else if (role === 'Service Provider') {
        displayOrders = orders.filter(o => o.providerId === 'par-001'); // Assuming SP Charlie is 'par-001'
    }

    if (displayOrders.length === 0) {
        return <p>No orders to display.</p>;
    }

    return (
        <div>
            <h2>{role === 'Service Provider' ? 'Orders Queue' : 'Orders'}</h2>
            <div className="card-grid">
                {displayOrders.map(order => (
                    <GenericCard key={order.id} record={order} role={role} onClick={handleCardClick} />
                ))}
            </div>
        </div>
    );
};

const PartnerList = ({ partners, handleCardClick }) => {
    return (
        <div>
            <h2>Partners</h2>
            <div className="card-grid">
                {partners.map(partner => (
                    <GenericCard key={partner.id} record={partner} role="Admin" onClick={handleCardClick} />
                ))}
            </div>
        </div>
    );
};

const OrderDetail = ({ order, onBack, userRole, showToastNotification }) => {
    if (!order) return null;

    const currentWorkflowStage = order.workflow.find(s => s.status === 'Current');
    const hasSLA = currentWorkflowStage && new Date(currentWorkflowStage.sla) < new Date();

    const handleAction = (actionType) => {
        showToastNotification(`Action: ${actionType} for Order ${order.id} initiated.`, 'info');
        // In a real app, this would trigger a state update for the order,
        // potentially advancing its workflow.
        // For prototype, we just simulate the toast.
        onBack(); // Go back after action
    };

    const allowAccept = userRole === 'Service Provider' && order.status === 'Created';
    const allowMarkReady = userRole === 'Service Provider' && order.status === 'Ironing';
    const allowMarkDeliveredPicked = userRole === 'Service Provider' && order.status === 'Ready';

    return (
        <div className="full-screen-page">
            <div className="full-screen-header">
                <button onClick={onBack} className="back-button"><FaArrowLeft /></button>
                <h2>Order Details: {order.id}</h2>
                {(userRole === 'Service Provider' && order.status !== 'Delivered' && order.status !== 'Picked') && (
                    <button className="button button-primary" onClick={() => showToastNotification(`Opening Order ${order.id} Update Form.`, 'info')}>
                        Edit Order
                    </button>
                )}
            </div>

            <div className="detail-content">
                <div className="detail-main">
                    <div className="detail-section">
                        <h3>Order Information</h3>
                        <p><strong>Customer:</strong> {order.customerName}</p>
                        <p><strong>Provider:</strong> {order.providerName || 'Unassigned'}</p>
                        <p><strong>Current Status:</strong> <span className={`card-badge ${getStatusColor(order.status)}`}>{order.status}</span></p>
                        <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
                        <p><strong>Delivery Option:</strong> {order.deliveryOption} {order.deliveryOption === 'Doorstep' ? `to ${order.deliveryAddress}` : `from ${order.pickupLocation}`}</p>
                        <p><strong>Pickup Date:</strong> {formatDate(order.pickupDate)}</p>
                        {order.deliveryOption === 'Doorstep' && order.deliverDate && <p><strong>Delivery Date:</strong> {formatDate(order.deliverDate)}</p>}
                    </div>

                    <div className="detail-section">
                        <h3>Items</h3>
                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index}>{item.qty} x {item.type} @ ${item.pricePer.toFixed(2)} each</li>
                            ))}
                        </ul>
                    </div>

                    {order.documents && order.documents.length > 0 && (
                        <div className="detail-section">
                            <h3>Documents</h3>
                            <ul>
                                {order.documents.map((doc, index) => (
                                    <li key={index}><a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a> (Uploaded by {doc.uploadedBy})</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="detail-sidebar">
                    <div className="detail-section">
                        <h3>Workflow Timeline</h3>
                        <WorkflowStepper workflowStages={order.workflow} />
                        {hasSLA && <p style={{ color: 'var(--status-red)', marginTop: 'var(--spacing-md)' }}>SLA Breach: Action required!</p>}
                    </div>

                    {(userRole === 'Admin' || userRole === 'Service Provider') && (
                        <div className="detail-section">
                            <h3>Audit Log</h3>
                            <AuditLog logs={DUMMY_DATA.auditLogs.filter(log => log.entityId === order.id)} />
                        </div>
                    )}

                    <div className="detail-actions">
                        {allowAccept && <button className="button button-primary" onClick={() => handleAction('Accept Order')}>Accept Order</button>}
                        {allowMarkReady && <button className="button button-secondary" onClick={() => handleAction('Mark Ready')}>Mark Ready</button>}
                        {allowMarkDeliveredPicked && <button className="button button-primary" onClick={() => handleAction(order.deliveryOption === 'Doorstep' ? 'Mark Delivered' : 'Mark Picked')}>
                            {order.deliveryOption === 'Doorstep' ? 'Mark Delivered' : 'Mark Picked'}
                        </button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PartnerDetail = ({ partner, onBack, userRole, showToastNotification }) => {
    if (!partner) return null;

    const handleAction = (actionType) => {
        showToastNotification(`Action: ${actionType} for Partner ${partner.name} initiated.`, 'info');
        onBack();
    };

    const allowApprove = userRole === 'Admin' && partner.status === 'Pending Approval';
    const allowEdit = userRole === 'Admin';

    return (
        <div className="full-screen-page">
            <div className="full-screen-header">
                <button onClick={onBack} className="back-button"><FaArrowLeft /></button>
                <h2>Partner Details: {partner.name}</h2>
                {allowEdit && (
                    <button className="button button-primary" onClick={() => showToastNotification(`Opening Partner ${partner.name} Edit Form.`, 'info')}>
                        Edit Partner
                    </button>
                )}
            </div>

            <div className="detail-content">
                <div className="detail-main">
                    <div className="detail-section">
                        <h3>Partner Information</h3>
                        <p><strong>Partner ID:</strong> {partner.id}</p>
                        <p><strong>Contact Email:</strong> {partner.contact}</p>
                        <p><strong>Phone:</strong> {partner.phone}</p>
                        <p><strong>Status:</strong> <span className={`card-badge ${getStatusColor(partner.status)}`}>{partner.status}</span></p>
                        <p><strong>Rating:</strong> {partner.rating ? `${partner.rating}/5` : 'N/A'}</p>
                    </div>

                    {(userRole === 'Admin') && (
                        <div className="detail-section">
                            <h3>Associated Orders</h3>
                            <p>This section would display a list of orders handled by this partner (as cards).</p>
                            {/* Example of related records visibility */}
                            <div className="card-grid" style={{ gridTemplateColumns: '1fr', gap: 'var(--spacing-md)' }}>
                                {DUMMY_DATA.orders.filter(o => o.providerId === partner.id).slice(0, 3).map(order => (
                                    <GenericCard key={order.id} record={order} role={userRole} onClick={() => showToastNotification(`Navigating to Order ${order.id} details.`, 'info')} />
                                ))}
                                {DUMMY_DATA.orders.filter(o => o.providerId === partner.id).length > 3 && (
                                    <p>... and more orders.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="detail-sidebar">
                    <div className="detail-section">
                        <h3>Actions</h3>
                        {allowApprove && <button className="button button-primary" onClick={() => handleAction('Approve Partner')}>Approve Partner</button>}
                        {/* Other actions based on status */}
                        {userRole === 'Admin' && <button className="button button-secondary" onClick={() => handleAction('Archive Partner')}>Archive Partner</button>}
                    </div>

                    {userRole === 'Admin' && (
                        <div className="detail-section">
                            <h3>Audit Log</h3>
                            <AuditLog logs={DUMMY_DATA.auditLogs.filter(log => log.entityId === partner.id)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Forms
const OrderForm = ({ onSubmit, onCancel, existingOrder = {}, userRole }) => {
    const isCustomer = userRole === 'Customer';
    const [formData, setFormData] = useState({
        customerId: existingOrder.customerId || 'usr-002', // Default to Bob Customer
        customerName: existingOrder.customerName || 'Bob Customer',
        deliveryOption: existingOrder.deliveryOption || 'Doorstep',
        deliveryAddress: existingOrder.deliveryAddress || '',
        pickupLocation: existingOrder.pickupLocation || '',
        items: existingOrder.items || [{ type: '', qty: 1 }],
        errors: {},
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [name]: value };
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({ ...prev, items: [...prev.items, { type: '', qty: 1 }] }));
    };

    const removeItem = (index) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.deliveryOption) newErrors.deliveryOption = 'Delivery option is required.';
        if (formData.deliveryOption === 'Doorstep' && !formData.deliveryAddress) newErrors.deliveryAddress = 'Delivery address is required.';
        if (formData.deliveryOption === 'Customer Pickup' && !formData.pickupLocation) newErrors.pickupLocation = 'Pickup location is required.';
        if (formData.items.some(item => !item.type || item.qty <= 0)) newErrors.items = 'All items must have a type and quantity greater than 0.';
        setFormData(prev => ({ ...prev, errors: newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="form-container">
            <h2>{existingOrder.id ? `Update Order ${existingOrder.id}` : 'Create New Ironing Order'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="accordion-panel">
                    <div className="accordion-header">Order Details</div>
                    <div className="accordion-content">
                        <div className="form-group">
                            <label htmlFor="customerName">Customer Name</label>
                            <input type="text" id="customerName" name="customerName" value={formData.customerName} readOnly={!isCustomer} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="deliveryOption">Delivery Option</label>
                            <select id="deliveryOption" name="deliveryOption" value={formData.deliveryOption} onChange={handleChange} className={formData.errors.deliveryOption ? 'error' : ''}>
                                <option value="">Select option</option>
                                <option value="Doorstep">Doorstep Delivery</option>
                                <option value="Customer Pickup">Customer Pickup</option>
                            </select>
                            {formData.errors.deliveryOption && <p className="error-message">{formData.errors.deliveryOption}</p>}
                        </div>
                        {formData.deliveryOption === 'Doorstep' && (
                            <div className="form-group">
                                <label htmlFor="deliveryAddress">Delivery Address</label>
                                <input type="text" id="deliveryAddress" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} className={formData.errors.deliveryAddress ? 'error' : ''} />
                                {formData.errors.deliveryAddress && <p className="error-message">{formData.errors.deliveryAddress}</p>}
                            </div>
                        )}
                        {formData.deliveryOption === 'Customer Pickup' && (
                            <div className="form-group">
                                <label htmlFor="pickupLocation">Pickup Location</label>
                                <select id="pickupLocation" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} className={formData.errors.pickupLocation ? 'error' : ''}>
                                    <option value="">Select location</option>
                                    <option value="Sparkle Ironing HQ">Sparkle Ironing HQ</option>
                                    <option value="Crisp & Clean Store">Crisp & Clean Store</option>
                                </select>
                                {formData.errors.pickupLocation && <p className="error-message">{formData.errors.pickupLocation}</p>}
                            </div>
                        )}
                    </div>
                </div>

                <div className="accordion-panel">
                    <div className="accordion-header">Items to Iron</div>
                    <div className="accordion-content">
                        {formData.items.map((item, index) => (
                            <div key={index} className="form-group" style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                                <select name="type" value={item.type} onChange={(e) => handleItemChange(index, e)} style={{ flex: 3 }} className={formData.errors.items ? 'error' : ''}>
                                    <option value="">Select type</option>
                                    {DUMMY_DATA.pricing.map(p => <option key={p.type} value={p.type}>{p.type}</option>)}
                                </select>
                                <input type="number" name="qty" value={item.qty} onChange={(e) => handleItemChange(index, e)} min="1" style={{ flex: 1 }} className={formData.errors.items ? 'error' : ''} />
                                <button type="button" onClick={() => removeItem(index)} className="button button-outline" style={{ flex: 0, padding: 'var(--spacing-xs) var(--spacing-sm)' }}>Remove</button>
                            </div>
                        ))}
                        {formData.errors.items && <p className="error-message">{formData.errors.items}</p>}
                        <button type="button" onClick={addItem} className="button button-secondary" style={{ marginTop: 'var(--spacing-md)' }}>Add Item</button>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="button button-secondary">Cancel</button>
                    <button type="submit" className="button button-primary">{existingOrder.id ? 'Update Order' : 'Place Order'}</button>
                </div>
            </form>
        </div>
    );
};

const OrderUpdateForm = ({ onSubmit, onCancel, order, userRole, showToastNotification }) => {
    // This form is only for Service Providers to update status, track progress, maybe upload proof
    if (userRole !== 'Service Provider') return <p>Access Denied: You do not have permission to view this form.</p>;
    if (!order) return <p>No order selected for update.</p>;

    const [status, setStatus] = useState(order.status);
    const [proofFile, setProofFile] = useState(null);
    const [errors, setErrors] = useState({});

    const handleFileChange = (e) => {
        setProofFile(e.target.files[0]);
    };

    const validateForm = () => {
        let newErrors = {};
        if (!status) newErrors.status = 'Status is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Simulate API call for updating order
            showToastNotification(`Order ${order.id} updated to ${status}.`, 'success');
            if (proofFile) {
                showToastNotification(`Proof file ${proofFile.name} uploaded for Order ${order.id}.`, 'success');
            }
            onSubmit({ ...order, status, proofFile });
        }
    };

    return (
        <div className="form-container">
            <h2>Update Order #{order.id}</h2>
            <form onSubmit={handleSubmit}>
                <div className="accordion-panel">
                    <div className="accordion-header">Order Status & Progress</div>
                    <div className="accordion-content">
                        <div className="form-group">
                            <label htmlFor="status">New Status</label>
                            <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} className={errors.status ? 'error' : ''}>
                                <option value="">Select new status</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Ironing">Ironing</option>
                                <option value="Ready">Ready</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Picked">Customer Picked</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            {errors.status && <p className="error-message">{errors.status}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="proofFile">Upload Proof (Optional)</label>
                            <input type="file" id="proofFile" name="proofFile" onChange={handleFileChange} />
                            {proofFile && <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>Selected: {proofFile.name}</p>}
                        </div>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="button button-secondary">Cancel</button>
                    <button type="submit" className="button button-primary">Update Order</button>
                </div>
            </form>
        </div>
    );
};

const RateSetupForm = ({ onSubmit, onCancel, existingRate = {}, userRole }) => {
    if (userRole !== 'Admin') return <p>Access Denied: Only Admins can set rates.</p>;

    const [formData, setFormData] = useState({
        type: existingRate.type || '',
        price: existingRate.price || 0,
        errors: {}
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.type) newErrors.type = 'Cloth type is required.';
        if (formData.price <= 0) newErrors.price = 'Price must be greater than 0.';
        setFormData(prev => ({ ...prev, errors: newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="form-container">
            <h2>{existingRate.type ? `Update Rate for ${existingRate.type}` : 'Setup New Rate'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="accordion-panel">
                    <div className="accordion-header">Rate Details</div>
                    <div className="accordion-content">
                        <div className="form-group">
                            <label htmlFor="type">Cloth Type</label>
                            <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} className={formData.errors.type ? 'error' : ''} readOnly={!!existingRate.type} />
                            {formData.errors.type && <p className="error-message">{formData.errors.type}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Price (per item)</label>
                            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} step="0.01" className={formData.errors.price ? 'error' : ''} />
                            {formData.errors.price && <p className="error-message">{formData.errors.price}</p>}
                        </div>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="button button-secondary">Cancel</button>
                    <button type="submit" className="button button-primary">{existingRate.type ? 'Update Rate' : 'Add Rate'}</button>
                </div>
            </form>
        </div>
    );
};

const PartnerSetupForm = ({ onSubmit, onCancel, existingPartner = {}, userRole }) => {
    if (userRole !== 'Admin') return <p>Access Denied: Only Admins can manage partners.</p>;

    const [formData, setFormData] = useState({
        name: existingPartner.name || '',
        contact: existingPartner.contact || '',
        phone: existingPartner.phone || '',
        status: existingPartner.status || 'Pending Approval',
        errors: {}
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = 'Partner name is required.';
        if (!formData.contact) newErrors.contact = 'Contact email is required.';
        if (!formData.phone) newErrors.phone = 'Phone number is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="form-container">
            <h2>{existingPartner.id ? `Update Partner ${existingPartner.name}` : 'Setup New Partner'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="accordion-panel">
                    <div className="accordion-header">Partner Details</div>
                    <div className="accordion-content">
                        <div className="form-group">
                            <label htmlFor="name">Partner Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={formData.errors.name ? 'error' : ''} />
                            {formData.errors.name && <p className="error-message">{formData.errors.name}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact">Contact Email</label>
                            <input type="email" id="contact" name="contact" value={formData.contact} onChange={handleChange} className={formData.errors.contact ? 'error' : ''} />
                            {formData.errors.contact && <p className="error-message">{formData.errors.contact}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={formData.errors.phone ? 'error' : ''} />
                            {formData.errors.phone && <p className="error-message">{formData.errors.phone}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} className={formData.errors.status ? 'error' : ''}>
                                <option value="Active">Active</option>
                                <option value="Pending Approval">Pending Approval</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            {formData.errors.status && <p className="error-message">{formData.errors.status}</p>}
                        </div>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="button button-secondary">Cancel</button>
                    <button type="submit" className="button button-primary">{existingPartner.id ? 'Update Partner' : 'Add Partner'}</button>
                </div>
            </form>
        </div>
    );
};


const LoginScreen = () => {
    const { login } = useAuth();
    const [selectedRole, setSelectedRole] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (selectedRole) {
            login(selectedRole);
        } else {
            alert('Please select a role to log in.');
        }
    };

    return (
        <div className="login-screen">
            <div className="login-card">
                <h2>Welcome to IronEclipse</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="role-select">Select Your Role</label>
                        <select id="role-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                            <option value="">-- Choose Role --</option>
                            <option value="Admin">Admin</option>
                            <option value="Customer">Customer</option>
                            <option value="Service Provider">Service Provider</option>
                        </select>
                    </div>
                    <button type="submit" className="button button-primary">Login</button>
                </form>
            </div>
        </div>
    );
};

const App = () => {
    const { userRole, currentUser, logout } = useAuth();
    const [currentPage, setCurrentPage] = useState('Dashboard'); // 'Dashboard', 'Orders', 'Partners', 'Form:Order', 'Form:Rate', 'Form:Partner', 'DetailView'
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false); // For mobile menu toggle
    const [notifications, setNotifications] = useState(DUMMY_DATA.notifications.filter(n => !n.read));
    const [toastQueue, setToastQueue] = useState([]); // Queue for multiple toasts
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    const navigateTo = (page, record = null) => {
        setCurrentPage(page);
        setSelectedRecord(record);
        setShowSidebar(false); // Close sidebar on navigation
    };

    const handleCardClick = (record) => {
        setSelectedRecord(record);
        if (record.id.startsWith('ORD')) {
            setCurrentPage('OrderDetail');
        } else if (record.id.startsWith('par')) {
            setCurrentPage('PartnerDetail');
        }
    };

    const showToastNotification = (message, type = 'info') => {
        const id = Date.now();
        setToastQueue(prev => [...prev, { id, message, type }]);
    };

    const dismissToast = (id) => {
        setToastQueue(prev => prev.filter(toast => toast.id !== id));
    };

    const handleFormSubmit = (data, formType) => {
        // Here you would typically send data to a backend
        console.log(`Submitting ${formType} data:`, data);
        showToastNotification(`${formType} submitted successfully!`, 'success');
        navigateTo('Dashboard'); // Go back to dashboard after submission
    };

    if (!userRole) {
        return (
            <AuthProvider>
                <LoginScreen />
            </AuthProvider>
        );
    }

    const renderContent = () => {
        switch (currentPage) {
            case 'Dashboard':
                return <Dashboard userRole={userRole} navigateTo={navigateTo} showToastNotification={showToastNotification} />;
            case 'Orders':
                return <OrderList orders={DUMMY_DATA.orders} role={userRole} handleCardClick={handleCardClick} showToastNotification={showToastNotification} />;
            case 'Partners':
                return userRole === 'Admin' ? <PartnerList partners={DUMMY_DATA.partners} handleCardClick={handleCardClick} /> : <p>Access Denied: Only Admins can view partners.</p>;
            case 'Form:Order':
                return userRole === 'Customer' ? <OrderForm onSubmit={(data) => handleFormSubmit(data, 'Order')} onCancel={() => navigateTo('Dashboard')} userRole={userRole} /> : <p>Access Denied: Only Customers can create orders.</p>;
            case 'Form:OrderUpdate':
                return userRole === 'Service Provider' ? <OrderUpdateForm order={selectedRecord} onSubmit={(data) => handleFormSubmit(data, 'Order Update')} onCancel={() => navigateTo('Dashboard')} userRole={userRole} showToastNotification={showToastNotification} /> : <p>Access Denied: Only Service Providers can update orders.</p>;
            case 'Form:RateSetup':
                return userRole === 'Admin' ? <RateSetupForm onSubmit={(data) => handleFormSubmit(data, 'Rate Setup')} onCancel={() => navigateTo('Dashboard')} userRole={userRole} /> : <p>Access Denied: Only Admins can set rates.</p>;
            case 'Form:PartnerSetup':
                return userRole === 'Admin' ? <PartnerSetupForm onSubmit={(data) => handleFormSubmit(data, 'Partner Setup')} onCancel={() => navigateTo('Dashboard')} userRole={userRole} /> : <p>Access Denied: Only Admins can setup partners.</p>;
            case 'OrderDetail':
                return selectedRecord && <OrderDetail order={selectedRecord} onBack={() => navigateTo('Orders')} userRole={userRole} showToastNotification={showToastNotification} />;
            case 'PartnerDetail':
                return selectedRecord && <PartnerDetail partner={selectedRecord} onBack={() => navigateTo('Partners')} userRole={userRole} showToastNotification={showToastNotification} />;
            default:
                return <p>Page Not Found</p>;
        }
    };

    const getNavItems = (role) => {
        const baseItems = [
            { id: 'dashboard', label: 'Dashboard', page: 'Dashboard', icon: <FaHome />, roles: ['Admin', 'Customer', 'Service Provider'] },
            { id: 'orders', label: 'Orders', page: 'Orders', icon: <FaClipboardList />, roles: ['Admin', 'Customer', 'Service Provider'] },
        ];

        if (role === 'Customer') {
            baseItems.push({ id: 'new-order', label: 'New Order', page: 'Form:Order', icon: <FaFileUpload />, roles: ['Customer'] });
        } else if (role === 'Admin') {
            baseItems.push(
                { id: 'partners', label: 'Partners', page: 'Partners', icon: <FaUser />, roles: ['Admin'] },
                { id: 'rate-setup', label: 'Rate Setup', page: 'Form:RateSetup', icon: <FaCog />, roles: ['Admin'] },
                { id: 'partner-setup', label: 'Partner Setup', page: 'Form:PartnerSetup', icon: <FaUser />, roles: ['Admin'] },
            );
        }
        return baseItems;
    };

    const navItems = getNavItems(userRole);

    return (
        <AuthProvider>
            <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
                <div className="app-container">
                    <header className="app-header">
                        <h1>IronEclipse</h1>
                        <nav className={showSidebar ? 'show' : ''}>
                            <ul>
                                {navItems.filter(item => item.roles.includes(userRole)).map(item => (
                                    <li key={item.id}>
                                        <a href="#" onClick={() => navigateTo(item.page)} className={currentPage === item.page ? 'active' : ''}>
                                            {item.icon} {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="header-actions">
                            <div className="global-search-container">
                                <input type="text" placeholder="Search..." className="global-search-input" />
                            </div>
                            <button onClick={toggleDarkMode}>
                                {isDarkMode ? <FaSun title="Light Mode" /> : <FaMoon title="Dark Mode" />}
                            </button>
                            <span>{currentUser?.name} ({userRole})</span>
                            <button onClick={logout} title="Logout"><FaSignOutAlt /></button>
                        </div>
                    </header>
                    <main className="main-content">
                        {renderContent()}
                    </main>

                    <div className="notification-toast-container">
                        {toastQueue.map(toast => (
                            <NotificationToast key={toast.id} {...toast} onDismiss={dismissToast} />
                        ))}
                    </div>
                </div>
            </ThemeContext.Provider>
        </AuthProvider>
    );
};

export default App;