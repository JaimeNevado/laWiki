import React from "react";
import LinkButton from '../components/buttons/button_with_link';
import Image from "next/image";
import style from "../css/Wikis.module.css";

const WikiList = ({ wikis }) => {
  return (
    <div className="row">
      {wikis.map((wiki) => (
        <div key={wiki._id} className="col">
          <div className={`card mb-3 ${style.cardWidth}`}>
            <div className={`${style.imageStyle}`}>
              <Image
                src={wiki.logo || null}
                className="card-img-top"
                width={0}
                height={0}
                sizes="25vw"
                alt="wiki.name"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div className="card-body text-center">
              <h5 className="card-title">{wiki.name}</h5>
              <LinkButton
                btn_type={"btn-primary"}
                button_text="View Wiki"
                state="enabled"
                link={`/wiki/${wiki._id}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WikiList;