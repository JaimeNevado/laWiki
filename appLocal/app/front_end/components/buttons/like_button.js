// 'use client';
import { useState } from 'react';
import styles from '../../css/Button.module.css';

export default function LikeButton() {
    const [likes, setLikes] = useState(0);
    function handleClick() {
        setLikes(likes + 1);
    }
    return <button className={styles.button} onClick={handleClick}>Like ({likes})</button>
}