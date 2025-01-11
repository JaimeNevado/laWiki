import Link from "next/link";

function LinkButton({ btn_type, button_text, state, link, func }) {
    let class_custom = "btn";
    class_custom = `${class_custom} ${btn_type}`;
    class_custom = `${class_custom} ${state}`;

    return (
        <>
            {func ? (
                <Link href={link}>
                    <button className={class_custom} onClick={func} role="button" aria-disabled={state === "disabled"}>
                        {button_text}
                    </button>        
                </Link>
            ) : (
                <Link href={link}>
                    <button className={class_custom} role="button" aria-disabled={state === "disabled"}>
                        {button_text}
                    </button>
                </Link>
            )}
        </>
    );
}

export default LinkButton;