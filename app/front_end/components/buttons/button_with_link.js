import Link from "next/link";

function LinkButton({button_text, state, link}){
    let ar_disabled = "false";
    let class_custom = "btn btn-primary enabled"

    if (state == "disabled"){
        ar_disabled = "true";
        class_custom = "btn btn-primary disabled"
    }
    console.log("text: ", button_text);
    console.log("state: ", state);
    console.log("link: ", link);

    return (
        <Link href={link} className={class_custom} role="button" aria-disabled={ar_disabled}>{button_text}</Link>
    );

}

export default LinkButton;