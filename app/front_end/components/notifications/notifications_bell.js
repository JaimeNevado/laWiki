import { useNotifications } from './useNotifications';

let refreshNotifications = () => {}; // Global refresh function

function NotificationBell({user_id}) {
    const { count, loading, refresh } = useNotifications(user_id);
    // console.log("From NotificationBell -> user_id: ", user_id, " count: ", count);
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