import { useNotifications } from './useNotifications';

let refreshNotifications = () => {}; // Global refresh function

function NotificationBell() {
    const { count, loading, refresh } = useNotifications();
    
    // Store refresh function in global variable
    refreshNotifications = refresh;

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

export { refreshNotifications };
export default NotificationBell;