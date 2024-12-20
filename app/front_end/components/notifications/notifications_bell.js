import { useNotifications } from './useNotifications';

function NotificationBell() {
    const { count, loading } = useNotifications();

    return (
        <button className="btn nav-link position-relative">
            <span style={{ fontSize: '1.2rem' }}>🔔</span>
            {!loading && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {count}
                </span>
            )}
        </button>
    );
}

export default NotificationBell;