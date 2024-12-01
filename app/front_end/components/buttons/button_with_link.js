import Link from "next/link";

function LinkButton({ button_text, state, link, func }) {
    let class_custom = "btn btn-primary enabled"

    if (state === "disabled") {
        class_custom = "btn btn-primary disabled"
    }
    console.log("text: ", button_text);
    console.log("state: ", state);
    console.log("link: ", link);

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