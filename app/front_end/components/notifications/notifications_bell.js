import { useNotifications } from './useNotifications';

let refreshNotifications = () => {}; // Global refresh function

function NotificationBell({user_id}) {
    const { count, loading, refresh } = useNotifications(user_id);
    checklogin();
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

function checklogin() {
    const user = localStorage.getItem("user");
    if (user){
        const user_d = JSON.parse(user);
        if (new Date().getTime() > (user_d.exp * 1000)) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("userDB");
            alert("Session is expired! Please login again.");
            window.location.reload();
        }
    }
}

export { refreshNotifications };
export default NotificationBell;